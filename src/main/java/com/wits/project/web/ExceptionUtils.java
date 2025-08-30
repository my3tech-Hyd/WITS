package com.wits.project.web;

import org.springframework.http.HttpStatus;

/**
 * Utility class for throwing business exceptions with proper HTTP status codes
 */
public class ExceptionUtils {

    /**
     * Throw a business exception with BAD_REQUEST status
     */
    public static void throwBadRequest(String message) {
        throw new GlobalExceptionHandler.BusinessException(message, HttpStatus.BAD_REQUEST);
    }

    /**
     * Throw a business exception with NOT_FOUND status
     */
    public static void throwNotFound(String message) {
        throw new GlobalExceptionHandler.BusinessException(message, HttpStatus.NOT_FOUND);
    }

    /**
     * Throw a business exception with UNAUTHORIZED status
     */
    public static void throwUnauthorized(String message) {
        throw new GlobalExceptionHandler.BusinessException(message, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Throw a business exception with FORBIDDEN status
     */
    public static void throwForbidden(String message) {
        throw new GlobalExceptionHandler.BusinessException(message, HttpStatus.FORBIDDEN);
    }

    /**
     * Throw a business exception with CONFLICT status
     */
    public static void throwConflict(String message) {
        throw new GlobalExceptionHandler.BusinessException(message, HttpStatus.CONFLICT);
    }

    /**
     * Throw a business exception with custom status
     */
    public static void throwBusinessException(String message, HttpStatus status) {
        throw new GlobalExceptionHandler.BusinessException(message, status);
    }

    /**
     * Check if a condition is true, otherwise throw a business exception
     */
    public static void requireTrue(boolean condition, String message) {
        if (!condition) {
            throwBadRequest(message);
        }
    }

    /**
     * Check if a condition is true, otherwise throw a business exception with custom status
     */
    public static void requireTrue(boolean condition, String message, HttpStatus status) {
        if (!condition) {
            throwBusinessException(message, status);
        }
    }

    /**
     * Check if an object is not null, otherwise throw a business exception
     */
    public static void requireNotNull(Object object, String message) {
        if (object == null) {
            throwBadRequest(message);
        }
    }

    /**
     * Check if a string is not null or empty, otherwise throw a business exception
     */
    public static void requireNotEmpty(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throwBadRequest(message);
        }
    }
}

