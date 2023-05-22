package com.datamanagement.apigateway.controller;

import com.datamanagement.apigateway.constant.Constant;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.*;

import java.util.Enumeration;

@Controller
public class ApiGatewayController {

    private final RestTemplate restTemplate;
    private final Environment env;

    public ApiGatewayController(RestTemplate restTemplate, Environment env) {
        this.restTemplate = restTemplate;
        this.env = env;
    }

    @RequestMapping(value = "/api/data", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getResource(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String nodeJsBackendUrl = env.getProperty(Constant.DATA_SERVICE_BACKEND_HOST) + ":" + env.getProperty(Constant.DATA_SERVICE_BACKEND_PORT) + "/dataservice/data?isValid=true";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authorizationHeader);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(nodeJsBackendUrl, HttpMethod.GET, entity, String.class);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            return ResponseEntity.status(response.getStatusCode())
                    .headers(responseHeaders)
                    .body(response.getBody());
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = (HttpStatus) e.getStatusCode();
            return ResponseEntity.status(statusCode).body("{\"error\": \"" + statusCode.getReasonPhrase() + "\"}");
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Error connecting to the backend service\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"An unexpected error occurred\"}");
        }
    }

    @RequestMapping(value = "/api/data/{appName}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getSingleRecord(@PathVariable String appName, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String nodeJsBackendUrl = env.getProperty(Constant.DATA_SERVICE_BACKEND_HOST) + ":" + env.getProperty(Constant.DATA_SERVICE_BACKEND_PORT) + "/dataservice/data/" + appName+"?isValid=true";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authorizationHeader);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(nodeJsBackendUrl, HttpMethod.GET, entity, String.class);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.status(HttpStatus.OK).headers(responseHeaders).body(response.getBody());
            } else if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Record not found\"}");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Internal server error\"}");
            }
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = (HttpStatus) e.getStatusCode();
            if (statusCode == HttpStatus.NOT_FOUND) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Record not found\"}");
            } else {
                return ResponseEntity.status(statusCode).body("{\"error\": \"" + statusCode.getReasonPhrase() + "\"}");
            }
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Error connecting to the backend service\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"An unexpected error occurred\"}");
        }
    }

    @RequestMapping(value = "/api/token", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> getAccessToken(@RequestBody String request) {
        try {
            String tokenServiceBackendUrl = env.getProperty(Constant.TOKEN_SERVICE_BACKEND_HOST) + ":" + env.getProperty(Constant.TOKEN_SERVICE_BACKEND_PORT) + "/token/client-token";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(request, headers);
            ResponseEntity<String> response = restTemplate.exchange(tokenServiceBackendUrl, HttpMethod.POST, entity, String.class);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            return ResponseEntity.status(response.getStatusCode())
                    .headers(responseHeaders)
                    .body(response.getBody());
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = (HttpStatus) e.getStatusCode();
            return ResponseEntity.status(statusCode).body("{\"error\": \"" + statusCode.getReasonPhrase() + "\"}");
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Error connecting to the backend service\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"An unexpected error occurred\"}");
        }
    }

}
