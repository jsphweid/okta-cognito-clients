## Okta Cognito Apollo Links

Unlinke the other packages in this mono-repo, this does not export a usable client but instead an object containing [Apollo Client Links](https://www.apollographql.com/docs/link/). This gives requires that you instantiate Apollo Client on your own but gives you flexibility to configure it the way you want while still using this lib to reduce some of the auth flow gruntwork.

## Basic Usage

Install:
`npm install --save okta-cognito-apollo-links`

Use:

```javascript
import { oktaCognitoApolloLinksGenerator } from 'okta-cognito-graphql-client'
import fetch from 'isomorphic-fetch' // for example

const { links, setToken } = oktaCognitoApolloLinksGenerator({
	awsConfig: {
		cognitoClientId: '123',
		cognitoClientSecret: 'abc123',
		cognitoBaseUrl: 'https://my-cognito.auth.us-east-1.amazoncognito.com',
		redirectUrl: `https://my-base-app-url.com`
	}
})

const httpLink = new HttpLink({
	fetch,
	uri: 'https://mygraphqlendpoint.com/graphql'
})

const instance = new ApolloClient({
	link: ApolloLink.from([...links, httpLink])
	// ... other apollo config
})
```

Also, at some point during a login flow, you'll get a code in your url that needs to be used to fetch and set real JWTs. You'll notice above that this function is already provided for you.

```javascript
const code = getQueryParamValue('code') // '123-456-etc'
setTokens(code).then(() => console.log('tokens set!'))
```

I'm sure this can be improved but for now this is the way to do it.
