## Okta Cognito Clients

Popular javascript clients extended with functionality to deal with Okta and Cognito auth more easily.

## Basic Usage

[Okta Cognito GraphQL Client](https://github.com/jsphweid/okta-cognito-clients/tree/master/packages/okta-cognito-graphql-client)

[Okta Cognito REST Client](https://github.com/jsphweid/okta-cognito-clients/tree/master/packages/okta-cognito-rest-client)

## What this library does...

The respective packages above both provide a function that generates clients.

With some basic config passed in, these clients can:

- [x] attach idTokens to all requests
- [x] handle the fetching of new idTokens when only a refreshToken is valid
- [ ] handle entire auth flow automatically (but it provides a convenience function for that)
- [ ] handle when idToken and refreshToken are both invalid

## TODO

- write tests?
- maybe consider making this lib more of one that decorates axios or apollo instead of makes new opinionated clients for you...?
- if an token is not valid and refresh token can't retrieve a new idtoken, handle?
- does this really have anything to do with Okta anymore?
