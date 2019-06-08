const express = require('express');

const path = require('path');
const app = express();
var bodyParser = require('body-parser');
var rows = [];

var Connection = require('tedious').Connection;  
var config = {  
    userName: 'test',  
    password: 'test',  
    server: '127.0.0.1',  
    options: {encrypt: true, database: 'TESTDB'}  
};  
var connection = new Connection(config);  
connection.on('connect', function(err) {  
// If no error, then good to proceed.  
    console.log("Connected");  
    //executeStatement();
}); 

app.listen(8888, function () {
    console.log('server running on port 8888!');
  });
  
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'html')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.post("/add_work", function(request, response){
    EXE_USP_INSERT_OVERTIME_WORK_LOG(request.body.user_id, request.body.fr_dt, request.body.to_dt, request.body.reason);
    response.end('입력이 성공하였습니다');
});

function EXE_USP_INSERT_OVERTIME_WORK_LOG(user_id, fr_dt, to_dt, reason){
    request = new Request("EXEC USP_INSERT_OVERTIME_WORK_LOG @user_id, @fr_dt, @to_dt, @reason", function(err) {  
        if (err) {  
            console.log(err);}  
        });  
    
    request.addParameter('user_id', TYPES.NVarChar,user_id);
    request.addParameter('fr_dt', TYPES.NVarChar,fr_dt);
    request.addParameter('to_dt', TYPES.NVarChar,to_dt);
    request.addParameter('reason', TYPES.NVarChar,reason);
    connection.execSql(request);  
}


app.post("/add_timeoff", function(request, response){
    EXE_USP_INSERT_TIME_OFF_LOG(request.body.user_id, request.body.fr_dt, request.body.to_dt);
    response.end('입력이 성공하였습니다');
  });
  


function EXE_USP_INSERT_TIME_OFF_LOG(user_id, fr_dt, to_dt){
    request = new Request("EXEC USP_INSERT_TIME_OFF_LOG @user_id, @fr_dt, @to_dt", function(err) {  
        if (err) {  
            console.log(err);}  
        });  
    request.addParameter('user_id', TYPES.NVarChar,user_id);
    request.addParameter('fr_dt', TYPES.NVarChar,fr_dt);
    request.addParameter('to_dt', TYPES.NVarChar,to_dt);
    connection.execSql(request);  
}

app.get("/search_work", function(request, response){
  rows = [];
  request = new Request("EXEC USPS_SELECT_OVERTIME_WORK_LOG " + request.param("user_id"), function(err, rowCount) {
        if (err) {
            console.log(err);
        }else{
          response.send(rows);
        } 
    });

    request.on('row', function(columns) {
        var row = {};
        columns.forEach(function(column) {
            row[column.metadata.colName] = column.value;
        });
        rows.push(row);
    });
    
    connection.execSql(request);  
});



app.get("/search_timeoff", function(request, response){
    
    rows = [];
    request = new Request("EXEC USPS_SELECT_TIME_OFF_LOG " + request.param("user_id"), function(err, rowCount) {
        if (err) {
            console.log(err);
        }else{
          response.send(rows);
        } 
    });
    
    request.on('row', function(columns) {
        var row = {};
        columns.forEach(function(column) {
            row[column.metadata.colName] = column.value;
        });
        rows.push(row);
    });

    connection.execSql(request);  
});


app.get("/search_sparetime", function(request, response){
    
    rows = [];
    request = new Request("EXEC USPS_SELECT_SPARE_TIME_OFF " + request.param("user_id"),function(err, rowCount) {
        if (err) {
            console.log(err);
        }else{
          response.send(rows);
        } 
    });

    request.on('row', function(columns) {
        var row = {};
        columns.forEach(function(column) {
            row[column.metadata.colName] = column.value;
        });
        rows.push(row);
    });

    connection.execSql(request);  
});

