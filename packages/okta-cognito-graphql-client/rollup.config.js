import { rollup } from '../../rollup.config'

export default rollup({
	name: 'okta-cognito-graphql-client'
	extraGlobals: {
		axios: 'axios',
		'jwt-decode': 'jwtDecode',
		'okta-cognito-common': 'okta-cognito-common',
		'apollo-cache-inmemory': 'apollo-cache-inmemory',
		'apollo-client': 'apollo-client',
		'apollo-link': 'apollo-link',
		'apollo-link-context': 'apollo-link-context',
		'apollo-link-http': 'apollo-link-http',
		'isomorphic-fetch': 'isomorphic-fetch'
	}
})
