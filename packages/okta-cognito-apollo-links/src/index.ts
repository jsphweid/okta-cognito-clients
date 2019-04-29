import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import {
	generateAndSetAllTokensFromCode,
	getIdToken,
	makeConfigWithDefaults,
	OCCBaseConfig
} from 'okta-cognito-common'

export function oktaCognitoApolloLinksGenerator(_occConfig: OCCBaseConfig) {
	const occConfig = makeConfigWithDefaults(_occConfig)

	const middlewareContext = setContext(async () => {
		const token = await getIdToken(occConfig)
		return { token }
	})

	const middlewareLink = new ApolloLink((operation, forward) => {
		const context = operation.getContext()
		const { token } = context

		operation.setContext({
			headers: {
				authorization: token
			}
		})

		return forward ? forward(operation) : null
	})

	const links = [middlewareContext, middlewareLink]

	const setTokens = (code: string) =>
		generateAndSetAllTokensFromCode(occConfig, code)

	return { links, setTokens }
}
