import { ResponseError, ResponseSuccess } from "./models/responseModel";

/**
 * List of the status of a purchase
 */
export const Status = ["Em validação", "Aprovado"];

/**
 * Returns when an error happens
 * @param message 
 * 
 * @returns object
 */
export const responseError = ( message: string ) => {
    const response: ResponseError = {
        success: false,
        error: message
    };

    return response;
} 

/**
 * Returns when a request is successful
 * @param data 
 * @returns object
 */
export const responseSuccess = <T>( data: T ) => {
    const response: ResponseSuccess<T> = {
        success: true,
        data
    }

    return response;
} 

export const unmaskDocument = ( value: string ) => {
    if( !value ) {
        return value;
    }

    return value.replace(/\D+/g,"");
}

export const logger = require("pino")({
    prettyPrint: {
      levelFirst: true
    },
    prettifier: require("pino-pretty")
});

export const validDocument = ( value: string ) => {

    let v1 = 0;
    let v2 = 0;
    let isValid = false;
    value = unmaskDocument(value);
    let document: any = value;

    for( let i = 1; document.length > i; i++ ) {
        if( document[i - 1] !== document[i] ) {
            isValid = true;   
        }
    } 

    if ( isValid === false ) {
        return false; 
    }

    if (value.length === 11) {
       
        for (let i = 0, p = 10; (document.length - 2) > i; i++, p--) {
            v1 += document[i] * p; 
        } 
        
        v1 = ((v1 * 10) % 11);
        
        if (v1 === 10) {
            v1 = 0; 
        }
        
        if (v1 != document[9]) {
            return false; 
        } 
        
        for (let i = 0, p = 11; (document.length - 1) > i; i++, p--) {
            v2 += document[i] * p; 
        } 
        
        v2 = ((v2 * 10) % 11);
        
        if (v2 === 10) {
            v2 = 0; 
        }
        
        if (v2 !== document[10]) {
            return false; 
        } else {   
            return true; 
        }
    } else if ( value.length === 14 ) {
        
        for (let i = 0, p1 = 5, p2 = 13; (document.length - 2) > i; i++, p1--, p2--) {
            if (p1 >= 2) {  
                v1 += document[i] * p1;  
            } else {  
                v1 += document[i] * p2;  
            } 
        } 
        
        v1 = (v1 % 11);
        
        if (v1 < 2) { 
            v1 = 0; 
        } else { 
            v1 = (11 - v1); 
        } 
        
        if (v1 !== document[12]) {  
            return false; 
        } 
        
        for (let i = 0, p1 = 6, p2 = 14; (document.length - 1) > i; i++, p1--, p2--) { 
            if (p1 >= 2) {  
                v2 += document[i] * p1;  
            } else {   
                v2 += document[i] * p2; 
            } 
        }
        
        v2 = (v2 % 11); 
        
        if (v2 < 2) {  
            v2 = 0;
        } else { 
            v2 = (11 - v2); 
        } 
        
        if (v2 !== document[13]) {   
            return false; 
        } else {  
            return true; 
        }
    } else {
        return false;
    }
 }