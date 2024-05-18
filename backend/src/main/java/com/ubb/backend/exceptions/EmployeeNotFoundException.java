package com.ubb.backend.exceptions;

public class EmployeeNotFoundException extends Exception {
    public EmployeeNotFoundException(Long id) {
        super("Can't find object");
    }
}
