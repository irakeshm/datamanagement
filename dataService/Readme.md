# DataService

DataService is a Node.js (TypeScript) service that utilizes TokenService as a downstream service. The main functionality of this service is to provide endpoints for performing CRUD operations on a JSON Database.

## Endpoints

The DataService project includes the following endpoints:

1. `/login`: 
   - Method: POST
   - Parameters:
     - `username`: The username of the user.
     - `password`: The password of the user.
   - Description: This endpoint is responsible for authenticating the user. It makes a request to TokenService to generate an authentication code and then calls TokenService again to obtain the access token.
   - Returns: The access token.

2. `/data`: 
   - Method: GET
   - Description: This endpoint retrieves data from the JSON Database.
   - Returns: The retrieved data.

3. `/data/:id`: 
   - Method: GET
   - Parameters:
     - `id`: The ID of the data to retrieve.
   - Description: This endpoint retrieves a specific data item from the JSON Database based on the provided ID.
   - Returns: The retrieved data item.

4. `/data`: 
   - Method: POST
   - Parameters:
     - `data`: The data to be added to the JSON Database.
   - Description: This endpoint adds new data to the JSON Database.
   - Returns: The added data.

5. `/data/:id`: 
   - Method: PUT
   - Parameters:
     - `id`: The ID of the data to update.
     - `data`: The updated data.
   - Description: This endpoint updates a specific data item in the JSON Database based on the provided ID.
   - Returns: The updated data item.

6. `/data/:id`: 
   - Method: DELETE
   - Parameters:
     - `id`: The ID of the data to delete.
   - Description: This endpoint deletes a specific data item from the JSON Database based on the provided ID.
   - Returns: A success message.

## Getting Started

To run the DataService project locally, please follow these steps:

1. Make sure you have [Node.js](https://nodejs.org) installed on your machine.
2. Clone the repository: `git clone git@github.com:irakeshm/datamanagement.git`.
3. Navigate to the project directory: `cd DataService`.
4. Install the dependencies by running: `npm install`.
5. Start the server by running: `npm start`.
6. The server will start running on `http://localhost:3002`.

### Alternatively:

### <ins>This service is Dockerize so you can just run the Dockerfile.</ins>

## Dependencies

The DataService project relies on the following dependencies:

- `express`: A fast and minimalist web framework for Node.js.
- `body-parser`: Middleware for parsing request bodies.
- `axios`: A promise-based HTTP client for making requests to the TokenService API.
- `typescript`: A superset of JavaScript that adds static typing and other features.
- `ts-node`: TypeScript execution and REPL for Node.js.
- `nodemon`: A utility that automatically restarts the server when code changes are detected.

These dependencies are managed through the `package.json` file, and will be installed automatically when running `npm install`.

## Acknowledgements

The DataService project was created by [Your Name](https://github.com/irakeshm/) as a demonstration of Node.js and TypeScript skills. It
