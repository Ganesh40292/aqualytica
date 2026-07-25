package com.waterquality.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.waterquality.backend.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)

    public ResponseEntity<ApiResponse<String>> handleResourceNotFound(

            ResourceNotFoundException ex) {

        ApiResponse<String> response = ApiResponse.<String>builder()

                .success(false)

                .message(ex.getMessage())

                .data(null)

                .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(Exception.class)

    public ResponseEntity<ApiResponse<String>> handleException(

            Exception ex) {

        ApiResponse<String> response = ApiResponse.<String>builder()

                .success(false)

                .message(ex.getMessage())

                .data(null)

                .build();

        return new ResponseEntity<>(response,

                HttpStatus.INTERNAL_SERVER_ERROR);

    }

}