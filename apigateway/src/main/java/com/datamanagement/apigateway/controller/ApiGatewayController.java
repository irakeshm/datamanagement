package com.datamanagement.apigateway.controller;

import com.datamanagement.apigateway.constant.Constant;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.*;

import java.util.Enumeration;

@RequiredArgsConstructor
@Controller
public class ApiGatewayController {

    private final RestTemplate restTemplate;

    private Environment env;


    // Forward GET request
    @RequestMapping(value = "/api/resource/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getResource(@PathVariable("id") String id) {
        String nodeJsBackendUrl = env.getProperty(Constant.NODE_BACKEND_HOST) + "/api/resource/" + id;
        ResponseEntity<String> response = restTemplate.getForEntity(nodeJsBackendUrl, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @RequestMapping(value = "/api/**", method = { RequestMethod.GET })
    @ResponseBody
    public ResponseEntity<?> forwardRequest(HttpServletRequest request, @RequestBody(required = false) String body) {
        String nodeJsBackendUrl = env.getProperty(Constant.NODE_BACKEND_HOST) + request.getRequestURI();
        HttpMethod httpMethod = HttpMethod.resolve(request.getMethod());

        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            headers.add(headerName, headerValue);
        }

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(nodeJsBackendUrl, httpMethod, entity, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }


    /*
    // Forward POST request
    @RequestMapping(value = "/api/resource", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> createResource(@RequestBody String request) {
        String nodeJsBackendUrl = "http://nodejs-backend-server:3000/api/resource";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(request, headers);
        ResponseEntity<String> response = restTemplate.exchange(nodeJsBackendUrl, HttpMethod.POST, entity, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    // Forward PUT request
    @RequestMapping(value = "/api/resource/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> updateResource(@PathVariable("id") String id, @RequestBody String request) {
        String nodeJsBackendUrl = "http://nodejs-backend-server:3000/api/resource/" + id;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(request, headers);
        ResponseEntity<String> response = restTemplate.exchange(nodeJsBackendUrl, HttpMethod.PUT, entity, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    // Forward DELETE request
    @RequestMapping(value = "/api/resource/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteResource(@PathVariable("id") String id) {
        String nodeJsBackendUrl = "http://nodejs-backend-server:3000/api/resource/" + id;
        ResponseEntity<String> response = restTemplate.exchange(nodeJsBackendUrl, HttpMethod.DELETE, null, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }*/
}
