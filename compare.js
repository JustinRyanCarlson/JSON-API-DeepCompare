let request = require('request');
let _ = require('lodash');
const sqlUrl = process.argv[2];
const dynamoUrl = sqlUrl + "&db=dynamo";
let simple_timer = require('simple-timer')
let sqlRes;
let dynamoRes;
let numOfResponse = 0;

setInterval(function(){ 
    if (numOfResponse == 2) {
        if (_.isEqual(sqlRes, dynamoRes)) {
            console.log('\nMatch\n');
            logResults();
            process.exit()
        } else {
            console.log('\nNo match\n');
            logResults();
            process.exit()
        }
    }
 }, 100);

function logResults() {
    let sqlTimer = simple_timer.get('sql').delta;
    let dynamoTimer = simple_timer.get('dynamo').delta;
    let timeDiff = Math.abs(simple_timer.get('sql').delta - simple_timer.get('dynamo').delta);

    console.log("SQL query took: " + sqlTimer + " milliseconds");
    console.log("Dynamo query took: " + dynamoTimer + " milliseconds");

    if (sqlTimer < dynamoTimer) {
        console.log("The SQL query was faster by " + timeDiff + " milliseconds\n");
    } else if (sqlTimer > dynamoTimer) {
        console.log("The Dynamo query was faster by " + timeDiff + " milliseconds\n");
    } else {
        console.log("The Dynamo and SQL were equally as fast\n");
    }
}

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



