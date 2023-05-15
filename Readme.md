# Data Management

A comprehensive project integrating TokenService, DataService, Web Application, and APIGateway for efficient data management and secure access.

## Description

This project combines multiple components to provide a complete solution for data management and access. It includes TokenService, DataService, Web Application, and APIGateway. The TokenService generates access tokens for secure authentication, while the DataService handles CRUD operations on a JSON database. The Web Application offers a user-friendly interface to interact with the JSON database, allowing users to retrieve, delete, and update records. The APIGateway acts as an intermediary between clients and the DataService, providing a unified and secure API for data retrieval.

## Components

The project consists of the following components:

### TokenService

TokenService is a Node.js (TypeScript) service responsible for generating access tokens. It provides the following endpoints:

1. `/auth-code`: Accepts username and password and returns an auth code.
2. `/access-token`: Accepts auth code, client ID, and client secret to generate an access token.
3. `/validate`: Accepts an access token and returns true or false based on validation.
4. `/client-token`: Accepts client ID and client secret to generate an access token.

### DataService

DataService is a Node.js (TypeScript) service that provides endpoints for CRUD operations on a JSON database. It offers the following endpoints:

1. `/login`: Accepts username and password, calls TokenService to generate an auth code, and retrieves an access token.
2. `/data`: GET endpoint to retrieve all records from the JSON database.
3. `/data/{id}`: GET - Gets the record with the given id from the JSON database.
4. `/data`: POST - Adds a new record to the JSON database.
5. `/data/{id}`: PUT - Updates the record with the given id in the JSON database.
6. `/data/{id}`: DELETE - Deletes the record with the given id from the JSON database.

### Web Application

Web Application is a React.js application that utilizes the DataService to provide a user interface for performing CRUD operations on the JSON database. It includes the following features:

1. Retrieving data from the JSON database based on search criteria.
2. Deleting any record from the JSON database.
3. Updating any record in the JSON database.

### APIGateway

APIGateway is a Java Spring Boot-based API gateway service that acts as an intermediary between clients and the DataService. It uses the TokenService to generate access tokens and provides the following endpoints:

1. `/api/token`: Calls the TokenService with the client ID and client secret to obtain an access token.
2. `/api/data`: Calls the DataService with the access token to retrieve all JSON records.
3. `/api/data/{appName}`: Calls the DataService with the access token to retrieve a specific JSON record based on the provided ID or app name.


### System Architecture
![Alt text](https://whimsical.com/SbEW6e2KYWb6c5yZRSK3gg)

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/project.git`.
2. Navigate to the project directory: `cd project`.

### TokenService

1. Navigate to the `TokenService` directory: `cd tokenservice`.
2. Install dependencies: `npm install`.
3. Start the TokenService: `npm start`.
4. The TokenService will run on `http://localhost:3001`.

### DataService

1. Navigate to the `DataService` directory: `cd dataService`.
2. Install dependencies: `npm install`.
3. Start the DataService: `npm start`.
4. The DataService will run on `http://localhost:3002`.

### Web Application

1. Navigate to the `Client` directory: `cd client`.
2. Install dependencies: `npm install`.
3. Start the Web Application: `npm start`.
4. The Web Application will run on `http://localhost:3000`.

### APIGateway

1. Navigate to the `APIGateway` directory: `cd apigateway`.
2. Build the project: `mvn clean install`.
3. Start the APIGateway service by running: `java -jar target/apigateway.jar`.
4. The APIGateway service will start running on `http://localhost:8080`.
