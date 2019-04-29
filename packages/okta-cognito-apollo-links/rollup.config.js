import { rollup } from '../../rollup.config'

export default rollup({
	name: 'okta-cognito-apollo-links',
	extraGlobals: {
		axios: 'axios',
		'jwt-decode': 'jwtDecode',
		'okta-cognito-common': 'okta-cognito-common',
		'apollo-link': 'apollo-link',
		'apollo-link-context': 'apollo-link-context'
	}
})
