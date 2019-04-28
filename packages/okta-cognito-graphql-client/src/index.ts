import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import {
	getIdToken,
	makeConfigWithDefaults,
	OCCBaseConfig
} from 'okta-cognito-common'

const cache = new InMemoryCache()

interface OCCGraphqlConfig extends OCCBaseConfig {
	graphqlBaseUrl: string
}

export function oktaCognitoGraphqlClientGenerator(
	_occConfig: OCCGraphqlConfig
) {
	const occConfig = makeConfigWithDefaults(_occConfig)

	const middlewareContext = setContext(async () => {
		const token = await getIdToken(occConfig)
		return token
	})

	const middlewareLink = new ApolloLink((operation, forward) => {
		const context = operation.getContext()
		const {
			response: { token }
		} = context

		operation.setContext({
			headers: {
				authorization: token
			}
		})

		return forward ? forward(operation) : null
	})

	const httpLink = new HttpLink({
		fetch,
		uri: occConfig.graphqlBaseUrl
	})

	const links = [middlewareContext, middlewareLink, httpLink]
	const link = ApolloLink.from(links)

	return new ApolloClient({
		link,
		cache
	})
}
