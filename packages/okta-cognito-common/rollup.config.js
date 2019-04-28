import { rollup } from '../../rollup.config'

export default rollup({
	name: 'okta-cognito-common',
	extraGlobals: {
		axios: 'axios'
	}
})
