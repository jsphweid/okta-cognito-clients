import { rollup } from '../../rollup.config'

export default rollup({
	name: 'okta-cognito-rest-client',
	extraGlobals: {
		axios: 'axios',
		'jwt-decode': 'jwtDecode'
	}
})
