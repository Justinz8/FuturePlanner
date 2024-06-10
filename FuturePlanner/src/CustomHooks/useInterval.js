import React, { useState, useEffect, useRef } from 'react'; 
  
//Code courtesy of https://overreacted.io/making-setinterval-declarative-with-react-hooks/

// creating the custom useInterval hook  
export function useInterval(callback, delay) { 
    // Creating a ref  
    const savedCallback = useRef(); 
  
    // To remember the latest callback . 
    useEffect(() => { 
        savedCallback.current = callback; 
    }, [callback]); 
  
    // combining the setInterval and  
    //clearInterval methods based on delay. 
    useEffect(() => { 
        function func() { 
            savedCallback.current(); 
        } 
        if (delay !== null) { 
            let id = setInterval(func, delay); 
            return () => clearInterval(id); 
        } 
    }, [delay]); 
}