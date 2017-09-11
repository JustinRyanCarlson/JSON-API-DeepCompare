let request = require('request');
let _ = require('lodash');
var pd = require('pretty-data').pd;
const sqlUrl = process.argv[2];
const dynamoUrl = sqlUrl + "&db=dynamo";
let sqlRes;
let dynamoRes;
let sqlTimer;
let dynamoTimer;
let numOfResponse = 0;

setInterval(function(){ 
    if (numOfResponse == 2) {
        if (_.isEqual(sqlRes, dynamoRes)) {
            console.log("\n SQL Response: \n" + pd.json(sqlRes));
            console.log("\n\n Dynamo Response: \n" + pd.json(dynamoRes));
            console.log('\nMatch\n');
            logResults();
            process.exit()
        } else {
            console.log("\n SQL Response: \n" + pd.json(sqlRes));
            console.log("\n\n Dynamo Response: \n" + pd.json(dynamoRes));
            console.log('\nNo match\n');
            logResults();
            process.exit()
        }
    }
 }, 100);

function logResults() {
    let timeDiff = Math.abs(sqlTimer - dynamoTimer).toFixed(2);

    console.log("SQL endpoint request took: " + sqlTimer + " milliseconds");
    console.log("Dynamo endpoint request took: " + dynamoTimer + " milliseconds");

    if (sqlTimer < dynamoTimer) {
        console.log("The SQL endpoint request was faster by " + timeDiff + " milliseconds\n");
    } else if (sqlTimer > dynamoTimer) {
        console.log("The Dynamo endpoint request was faster by " + timeDiff + " milliseconds\n");
    } else {
        console.log("The Dynamo and SQL were equally as fast\n");
    }
}


request({url: sqlUrl, time:true}, function (error, response, body) {
    sqlTimer = response.timings.end.toFixed(2);
    sqlRes = body;
    numOfResponse++;
});


request({url: dynamoUrl, time:true}, function (error, response, body) {
    dynamoTimer = response.timings.end.toFixed(2);
    dynamoRes = body;
    numOfResponse++;
});



