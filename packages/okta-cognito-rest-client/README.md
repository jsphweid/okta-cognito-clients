## Okta Cognito Axios Client

Read more about [what it does here](https://github.com/jsphweid/okta-cognito-clients/).

## Basic Usage

Install:
`npm install --save okta-cognito-rest-client`

Use:

```javascript
import { oktaCognitoRestClientGenerator } from 'okta-cognito-rest-client'

const client = oktaCognitoRestClientGenerator({
	awsConfig: {
		cognitoClientId: '123',
		cognitoBaseUrl: 'https://my-cognito.auth.us-east-1.amazoncognito.com',
		redirectUrl: `https://my-base-app-url.com`
	}
})
```

This gives you a pre-configured [Axios Client](https://github.com/axios/axios). Use it like you would any other Axios Client.

Also, at some point during a login flow, you'll get a code in your url that needs to be used to fetch and set real JWTs. There is already a method on the client to handle this async function:

```javascript
const code = getQueryParamValue('code') // '123-456-etc'
client.setTokens(code).then(() => console.log('tokens set!'))
```

I'm sure this can be improved but for now this is the way to do it.
