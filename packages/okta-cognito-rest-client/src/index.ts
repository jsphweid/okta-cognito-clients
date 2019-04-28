import axios from 'axios'
import {
	generateAndSetAllTokensFromCode,
	getIdToken,
	makeConfigWithDefaults,
	OCCBaseConfig
} from 'okta-cognito-common'

export function oktaCognitoRestClientGenerator(_occConfig: OCCBaseConfig) {
	const occConfig = makeConfigWithDefaults(_occConfig)

	const instance = axios.create()

	instance.interceptors.request.use(
		async config => {
			config.headers.common.Authorization = await getIdToken(occConfig)
			return config
		},
		error => {
			console.log('Error in request interception:', error)
			return Promise.reject(error)
		}
	)

	return {
		...instance,
		setTokens: (code: string) =>
			generateAndSetAllTokensFromCode(occConfig, code)
	}
}
