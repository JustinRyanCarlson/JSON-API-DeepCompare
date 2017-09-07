let request = require('request');
let _ = require('lodash');
const sqlUrl = process.argv[2];
const dynamoUrl = process.argv[3];
let simple_timer = require('simple-timer')
let sqlRes;
let dynamoRes;
let numOfResponse = 0;

setInterval(function(){ 
    if (numOfResponse == 2) {
        if (_.isEqual(sqlRes, dynamoRes)) {
            console.log('\nMatch');
            console.log("SQL query took: " + simple_timer.get('sql').delta + " milliseconds");
            console.log("Dynamo query took: " + simple_timer.get('dynamo').delta + " milliseconds\n");
            process.exit()
        } else {
            console.log('\nNo match');
            console.log("SQL query took: " + simple_timer.get('sql').delta + " milliseconds");
            console.log("Dynamo query took: " + simple_timer.get('dynamo').delta + " milliseconds\n");
            process.exit()
        }
    }
 }, 100);

simple_timer.start('sql');
request(sqlUrl, function (error, response, body) {
    simple_timer.stop('sql');
    sqlRes = body;
    numOfResponse++;
});

simple_timer.start('dynamo');
request(sqlUrl, function (error, response, body) {
    simple_timer.stop('dynamo');
    dynamoRes = body;
    numOfResponse++;
});



