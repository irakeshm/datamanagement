# Web Application

The Web Application is a React.js application that interacts with the DataService to provide a user interface for performing CRUD operations on a JSON database. The application allows the team to retrieve data from the JSON database, delete records, and update records.

## Features

The Web Application offers the following features:

- Retrieve Data: The application allows users to search and retrieve data from the JSON database based on specific criteria.

- Delete Record: Users can delete any record from the JSON database using the Web Application.

- Update Record: The application provides a user-friendly interface to update the data in the JSON database. Users can edit the fields and save the changes.

## Getting Started

To run the Web Application locally, follow these steps:

1. Make sure you have [Node.js](https://nodejs.org) installed on your machine.
2. Clone the repository: `git clone git@github.com:irakeshm/datamanagement.git`.
3. Navigate to the project directory: `cd client`.
4. Install the dependencies by running: `npm install`.
5. Start the development server: `npm start`.
6. Open the application in your browser at `http://localhost:3000`.

### Alternatively:

### <ins>This service is Dockerize so you can just run the Dockerfile.</ins>

## Dependencies

The Web Application relies on the following dependencies:

- `react`: A JavaScript library for building user interfaces.
- `react-dom`: Provides DOM-specific methods for React.
- `axios`: A promise-based HTTP client for making requests to the DataService API.
- `react-router-dom`: A routing library for React applications.
- `typescript`: A superset of JavaScript that adds static typing and other features.

These dependencies are managed through the `package.json` file and will be installed automatically when running `npm install`.

## Usage

The Web Application provides an intuitive user interface for interacting with the JSON database. Users can search for specific records, delete records, and update existing records.


## Acknowledgements

The Web Application was created by [Rakesh Mishra](https://github.com/irakeshm/) and the development team. It was built using React.js and serves as a user interface for interacting with the JSON database provided by the DataService.
