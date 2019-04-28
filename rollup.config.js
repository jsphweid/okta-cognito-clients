import nodeResolve from 'rollup-plugin-node-resolve'
import typescriptPlugin from 'rollup-plugin-typescript2'
import typescript from 'typescript'
import rolllupJson from 'rollup-plugin-json'
import path from 'path'
import invariantPlugin from 'rollup-plugin-invariant'
import { terser as minify } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'

function onwarn(message) {
	const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED']

	if (!suppressed.find(code => message.code === code)) {
		return console.warn(message.message)
	}
}

const defaultGlobals = {}
// const defaultGlobals = {
// 	'apollo-client': 'apollo.core',
// 	'apollo-cache': 'apolloCache.core',
// 	'apollo-link': 'apolloLink.core',
// 	'apollo-link-dedup': 'apolloLink.dedup',
// 	'apollo-utilities': 'apollo.utilities',
// 	'graphql-anywhere': 'graphqlAnywhere',
// 	'graphql-anywhere/lib/async': 'graphqlAnywhere.async',
// 	'apollo-boost': 'apollo.boost',
// 	tslib: 'tslib',
// 	'ts-invariant': 'invariant'
// }

export function rollup({
	name,
	input = './src/index.ts',
	outputPrefix = 'bundle',
	extraGlobals = {}
}) {
	const projectDir = path.join(__filename, '..')
	console.info(`Building project esm ${projectDir}`)
	const tsconfig = `${projectDir}/tsconfig.json`

	const globals = {
		...defaultGlobals,
		...extraGlobals
	}

	function external(id) {
		return Object.prototype.hasOwnProperty.call(globals, id)
	}

	function outputFile(format) {
		return './lib/' + outputPrefix + '.' + format + '.js'
	}

	function convert(format) {
		return {
			input: outputFile('esm'),
			external,
			output: {
				file: outputFile(format),
				format,
				sourcemap: true,
				name,
				globals
			},
			onwarn
		}
	}

	return [
		{
			input,
			external,
			output: {
				file: outputFile('esm'),
				format: 'esm',
				sourcemap: true
			},
			plugins: [
				commonjs({ include: ['node_modules/**'] }),
				nodeResolve({
					mainFields: ['module', 'main'],
					extensions: ['.ts', '.tsx'],
					preferBuiltins: true,
					browser: true
				}),
				rolllupJson(),
				typescriptPlugin({ typescript, tsconfig }),
				invariantPlugin({ errorCodes: true })
			],
			onwarn
		},
		convert('umd'),
		convert('cjs'),
		{
			input: outputFile('cjs'),
			output: {
				file: outputFile('cjs.min'),
				format: 'cjs'
			},
			plugins: [
				minify({
					mangle: {
						toplevel: true
					},
					compress: {
						global_defs: {
							'@process.env.NODE_ENV': JSON.stringify('production')
						}
					}
				})
			]
		}
	]
}
