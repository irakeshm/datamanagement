# APIGateway

APIGateway is a Java Spring Boot-based API gateway service that acts as an intermediary between clients and the underlying DataService. It utilizes the TokenService to generate access tokens and makes GET requests to the DataService endpoints to retrieve JSON data.

## Endpoints

The APIGateway service provides the following endpoints:

1. `/api/token`:
   - Method: GET
   - Description: This endpoint calls the TokenService and passes the `ClientID` and `ClientSecret` to obtain an access token.
   - Returns: The access token.

2. `/api/data`:
   - Method: GET
   - Description: This endpoint calls the DataService by passing the access token and retrieves all the JSON records.
   - Returns: All JSON records.

3. `/api/data/{appName}`:
   - Method: GET
   - Parameters:
     - `appName`: The ID or app name of the specific JSON record to retrieve.
   - Description: This endpoint calls the DataService by passing the access token and retrieves the JSON record based on the provided ID or app name.
   - Returns: The JSON record.

## Getting Started

To run the APIGateway service locally, follow these steps:

1. Make sure you have Java and Maven installed on your machine.
2. Clone the repository: `git clone git@github.com:irakeshm/datamanagement.git`.
3. Navigate to the project directory: `cd apigateway`.
4. Build the project by running: `mvn clean install`.
5. Start the APIGateway service by running: `java -jar target/apigateway.jar`.
6. The APIGateway service will start running on `http://localhost:8080`.

## Dependencies

The APIGateway service relies on the following dependencies:

- Java Spring Boot: A framework for building Java applications quickly and easily.
- Spring Web: A module that provides support for building web applications.
- Spring Cloud Gateway: A module for creating API gateways with Spring Boot.
- Apache HttpClient: A library for making HTTP requests.
- Jackson JSON: A library for working with JSON data.
- Maven: A build automation tool for Java projects.

These dependencies are managed through the `pom.xml` file and will be downloaded automatically when building the project using Maven.

## Configuration

Before running the APIGateway service, make sure to configure the following properties in the `application.properties` file:

# TokenService URL
tokenservice.url=http://localhost:3001/api/token

# DataService URL
dataservice.url=http://localhost:3002/api/data

Replace the `tokenservice.url` and `dataservice.url` values with the appropriate URLs of your TokenService and DataService.

## Usage

Once the APIGateway service is up and running, you can make HTTP requests to the defined endpoints to interact with the TokenService and DataService through the APIGateway.



## Acknowledgements

The APIGateway service was created by [Your Name](https://github.com/irakeshm/) as a component of the architecture to provide a secure and unified interface for accessing the DataService. It leverages Java Spring Boot and integrates with the TokenService to generate access tokens and the DataService to retrieve JSON data.
