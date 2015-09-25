/**
 * Created by epalermo on 9/24/15.
 */
"use strict";

/**
 * Adds event handlers to elements.
 */
function attachHandlers(){
    //Handler for the change event on the fibonacci seed input text field
    $('#fibonacci-seed').change(handleFibbonaciChange);
}


/**
 * Function executed when the input text changes. Performs basic validation and then executes AJAX request to calculate
 * the next highest value.
 *
 * @param e {Event} The change event.
 */
function handleFibbonaciChange( e ){
    console.log('Fibonacci seed entered. User entered: ' + e.target.value );

    //Handle blank strings so they are not treated as 0
    if(e.target.value === ''){
        $('#answer').text( '??' );
        return;
    }

    //Try and parse an integer from the users input.
    var val = Number(e.target.value);

    //Warn them if they didn't enter a number & clear the input field
    if(_.isNaN(val) || !_.isNumber(val)){
        console.error('The value entered was not a number.');
        alert('You must enter a number for this super sweet app to work.');
        e.target.value = '';
        $('#answer').text( '??' );
        return;
    }

    calculateFibbonaci(val);
}

/**
 * Calculates the next highest fibonnaci number by making a POST request on the server and then updates the answer
 * field.
 *
 * @param val
 */
function calculateFibbonaci(val){

    /**
     * Success handler for the AJAX request.
     * @param r - The response from the server containing the nextNumber.
     */
    function success(r){
        if(r.success){
            console.log('Got response from server: ' + r.nextNumber);
        }else{
            console.error('Server could not calculate next fib number');
        }

        $('#answer').text( r.nextNumber );

    }

    /**
     * Failure handler for the AJAX request.
     */
    function failure(){
        console.error('Server could not calculate next fib number');
    }

    //Make the AJAX POST request to the /fib URI, passing in the seed value.
    $.ajax({
        type: "POST",
        url: '/fib',
        data: {seed:val},
        success: success,
        failure: failure
    });
}

//Attach handlers when the document is ready.
$(document).ready( function documentReady(){
    console.log('Document is ready. Lets do this!');
    attachHandlers();
});