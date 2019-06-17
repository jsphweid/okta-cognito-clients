import axios from 'axios'
import jwtDecode from 'jwt-decode'

const idTokenCacheKey = 'occ_id_token'
const refreshTokenCacheKey = 'occ_refresh_token'

export interface OCCBaseConfig {
	awsConfig: {
		cognitoClientId: string
		cognitoBaseUrl: string
		redirectUrl: string
	}
	memory?: {
		getRememberedIdToken?: () => string | null
		getRememberedRefreshToken?: () => string | null
		setIdTokenInMemory?: (idToken: string) => void
		setRefreshTokenInMemory?: (refreshToken: string) => void
	}
}

export function makeConfigWithDefaults<T extends OCCBaseConfig>(config: T) {
	const copy = { ...config }
	delete copy.memory
	const memory = config.memory || {}
	return {
		memory: {
			getRememberedIdToken: () => localStorage.getItem(idTokenCacheKey),
			getRememberedRefreshToken: () =>
				localStorage.getItem(refreshTokenCacheKey),
			setIdTokenInMemory: (token: string) =>
				localStorage.setItem(idTokenCacheKey, token),
			setRefreshTokenInMemory: (token: string) =>
				localStorage.setItem(refreshTokenCacheKey, token),
			...memory
		},
		awsConfig: config.awsConfig,
		...copy
	}
}

type FinalOCCBaseConfig = ReturnType<typeof makeConfigWithDefaults>

export async function getIdToken(config: FinalOCCBaseConfig): Promise<string> {
	const { getRememberedIdToken, setIdTokenInMemory } = config.memory
	const idToken = getRememberedIdToken()
	if (!idToken || tokenIsExpired(idToken)) {
		const newIdToken = await fetchNewIdToken(config)
		if (newIdToken) {
			setIdTokenInMemory(newIdToken)
		} else {
			throw new Error('Could not get new id from refresh token.')
		}
		return newIdToken
	} else {
		return idToken
	}
}

export const tokenIsExpired = (idToken: string) =>
	(jwtDecode(idToken) as any).exp * 1000 < new Date().getTime()

function makeCognitoHeaders() {
	return {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}
}

export function fetchNewIdToken(config: FinalOCCBaseConfig): Promise<string> {
	const { cognitoClientId, cognitoBaseUrl, redirectUrl } = config.awsConfig
	const { getRememberedRefreshToken } = config.memory

	return axios
		.post(
			`${cognitoBaseUrl}/oauth2/token?grant_type=refresh_token&client_id=${cognitoClientId}&refresh_token=${getRememberedRefreshToken()}&redirect_uri=${redirectUrl}`,
			{},
			makeCognitoHeaders()
		)
		.then(res => res.data.id_token)
		.catch(err => {
			console.log('Error fetching new id token from refresh token', err)
			;(window as any).location = `${cognitoBaseUrl}/login?response_type=code&client_id=${cognitoClientId}&redirect_uri=${redirectUrl}`
		})
}

export async function generateAndSetAllTokensFromCode(
	config: FinalOCCBaseConfig,
	code: string
): Promise<void> {
	const { cognitoClientId, cognitoBaseUrl, redirectUrl } = config.awsConfig
	return axios
		.post(
			`${cognitoBaseUrl}/oauth2/token?grant_type=authorization_code&client_id=${cognitoClientId}&code=${code}&redirect_uri=${redirectUrl}`,
			{},
			makeCognitoHeaders()
		)
		.then(res => {
			config.memory.setIdTokenInMemory(res.data.id_token)
			config.memory.setRefreshTokenInMemory(res.data.refresh_token)
		})
}
