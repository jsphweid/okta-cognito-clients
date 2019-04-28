import { rollup } from '../../rollup.config'

export default rollup({
	name: 'okta-cognito-rest-client',
	extraGlobals: {
		axios: 'axios',
		'okta-cognito-common': 'okta-cognito-common'
	}
})
