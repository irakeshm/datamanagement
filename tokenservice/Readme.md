# TokenService

TokenService is a Node.js project written in TypeScript that provides a set of endpoints for handling authentication and generating access tokens. This service can be used to authenticate users, generate access tokens, validate access tokens, and generate client-specific access tokens.

## Endpoints

The TokenService project includes the following endpoints:

1. `/auth-code`: 
   - Method: POST
   - Parameters:
     - `username`: The username of the user.
     - `password`: The password of the user.
   - Returns: 
     - `authCode`: An authentication code for the user.

2. `/access-token`: 
   - Method: POST
   - Parameters:
     - `authCode`: The authentication code obtained from the `/auth-code` endpoint.
     - `clientId`: The client ID for which the access token is being generated.
     - `clientSecret`: The client secret for the specified client ID.
   - Returns: 
     - `accessToken`: A generated access token.

3. `/validate`: 
   - Method: GET
   - Parameters:
     - `accessToken`: The access token to validate.
   - Returns: 
     - `valid`: `true` if the access token is valid; `false` otherwise.

4. `/client-token`: 
   - Method: POST
   - Parameters:
     - `clientId`: The client ID for which the access token is being generated.
     - `clientSecret`: The client secret for the specified client ID.
   - Returns: 
     - `accessToken`: A generated client-specific access token.

## Getting Started

To run the TokenService project locally, please follow these steps:

1. Make sure you have [Node.js](https://nodejs.org) installed on your machine.
2. Clone the repository: `git clone git@github.com:irakeshm/datamanagement.git`.
3. Navigate to the project directory: `cd TokenService`.
4. Install the dependencies by running: `npm install`.
5. Start the server by running: `npm start`.
6. The server will start running on `http://localhost:3001`.

### Alternatively:

### <ins>This service is Dockerize so you can just run the Dockerfile.</ins>

## Dependencies

The TokenService project relies on the following dependencies:

- `express`: A fast and minimalist web framework for Node.js.
- `body-parser`: Middleware for parsing request bodies.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- `typescript`: A superset of JavaScript that adds static typing and other features.
- `ts-node`: TypeScript execution and REPL for Node.js.
- `nodemon`: A utility that automatically restarts the server when code changes are detected.

These dependencies are managed through the `package.json` file, and will be installed automatically when running `npm install`.


## Acknowledgements

The TokenService project was created by [Rakesh Mishra](https://github.com/irakeshm/) as a demonstration of Node.js and TypeScript skills. It was inspired by the need for a simple token-based authentication service.
