/**
 * @author Elliott Palermo
 *
 * Simple webserver to use for the configurextest. This webserver is hardcoded to serve up three files - the index.html,
 * the styles.css, and the client.js. It also responds to POST requests to the /fib URI by calculating the next-highest
 * fibonacci number.
 *
 * To use this server you must have installed NodeJs as well as the express and body-parses npm modules.
 */



//Pull in our dependencies
var express = require('express');
var bodyParser = require("body-parser");

//Create a new express application
var app = express();

//User body parser to help pull POST data from requests.
app.use(bodyParser.urlencoded({ extended: false }));


//Memoization table for fibbonaci calculations. We will store the Nth fib number in the Nth position of the array.
var fibMemo = [0,1];

/**
 * Recursive function to calculate fibonacci numbers.
 *
 * @param n {Number} The fibonacci number to be calculated.
 * @returns {Number} The Nth fibonacci number.
 */
function fib(n) {

    if (n === 0) {
        return 0;
    } else if (n === 1) {
        return 1;
    } else {
        return fib(n - 1) + fib(n - 2);
    }
}

/**
 * Given a value, this function will find the next highest number in the fibonacci sequence.
 *
 * @param val {Number} The value to find the next highest fibonacci number from.
 * @returns {Number} The first element from the fibonacci sequence which is higher than the value passed in.
 */
function findNextHighestFib( val ){
    var result;

    //Index of fibonacci numbers. This points to the next number in the fibonacci sequence.
    var fibIndex = 0;

    //Continue to look through the fibonacci sequence until we find a number that is higher than the value passed in.
    while( result === undefined ){

        //See if we've already calculated this fibonacci number before, this saves computation time as we calculate
        //more and more sequences.
        if( fibMemo[fibIndex] === undefined ){
            console.log( 'Unable to find ' + fibIndex + 'th fibonacci number in the memo table. Calculating fibonacci...');

            //If we haven't calculated this number before then calculate and store the result.
            fibMemo[fibIndex] = fib(fibIndex);
        }

        //See if we've found a fibonacci number that is higher than the value that was passed in
        if( fibMemo[fibIndex] > val ){
            result = fibMemo[fibIndex];
            console.log('Found the next highest fibonacci number: ' + result);
        }else{
            //Else increment the index and iterate.
            fibIndex++;
        }
    }

    return result;
}

//Handle get requests to root directory and return the index.html file.
app.get('/', function (req, res) {
   // res.send('Hello World!');
    res.sendFile(__dirname + "/content/index.html");

});


//Handle requests for the stylesheet.
app.get('/styles.css', function(req,res){
    res.sendFile(__dirname + "/content/styles.css");
});

//Handle requests for the client-side js.
app.get('/client.js', function(req,res){
    res.sendFile(__dirname + "/content/client.js");
});

//Handle POST requests to /fib by calculating the next-highest fibonacci number
app.post('/fib', function(req, res){
        var seed=req.body.seed;
        console.log('Server received request to calculate next fibonacci number for seed: ' + seed);

        var seedNum = Number(seed);

        if( seedNum === NaN || seedNum === undefined ){
            console.error('POST to /fib only access a number');
            res.json({nextNumber:undefined, success:false});
        }else{
            var nextNum = findNextHighestFib(seedNum);
            res.json({nextNumber:nextNum, success:true});
        }
});


//Start the server
var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('configurex test server listening at http://%s:%s', host, port);
});