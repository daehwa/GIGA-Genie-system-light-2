var fs = require('fs');
var http = require('http');
var url = require('url');
var express = require('express');
var cors =  require('cors')();
var app = express();
var PythonShell = require('python-shell');
var hashmap = require('hashmap');

const ROOT_DIR = "html/";
const ip = "13.124.195.114";
const port = "3000";
const PATH = "/gw/v1";

//namespace
const ON = "TurnOn";
const OFF = "TurnOff";
const SET_BRI = "SetBrightness";
const IN_BRI = "IncreaseBrightness";
const DE_BRI = "DecreaseBrightness";
const SET_CT =  "SetColortemp";
const IN_CT =  "IncreaseColortemp";
const DE_CT =  "DecreaseColortemp";
var namespaces = [ON,OFF,SET_BRI,IN_BRI,DE_BRI,SET_CT,IN_CT,DE_CT];

//response variables
const CASES = 8;
var action = null;
var name = "";
var value = null;


app.use(cors);
/*app.use(function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
          next();
    });*/

app.all('*', function (req, res, next) {
  var urlObj = url.parse(req.url, true, false);
	var dir = urlObj.pathname.split("/");
	if(dir[1] == "sl2"){
		fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
			if (err) {
				console.log(err);
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
	  });
	}
	else if(urlObj.pathname == "/command-analysis/"){
    body = "";
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    req.on('data',function(data){
      body += data;
    });
    req.on('end',function(){
			var options = {
				args: [body]
			};
			PythonShell.run('./html/sl2/command-analysis.py', options, function (err, results) {
  			if (err) throw err;
				name ="";
				value = null;
				action = null;
				var sen = Array();
  			for(var i=1; i<results.length; i++){
    			var word = results[i].split("(");
    			word = word[1].split(")");
    			console.log(word[0]);
    			word = word[0].split(" ");
    			var hash = new hashmap();
    			hash.set("class",word[0]);
    			for(var j=1;j<word.length;j++){
      			var w = word[j].split("/");
      			hash.set(w[0],w[1]);
    			}
    			sen.push(hash);
  			}
  			comprehendAction(sen);

  			var json = {
      		action: action,
      		value: value,
      		friendlyName: name
    		};
  			console.log(JSON.stringify(json));
				res.end(JSON.stringify(json));
			});
    });
	}
	else{
		body = "";
		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
		req.on('data',function(data){
			body += data;
		});
		req.on('end',function(){
			var method = req.method;
			var json = null;
			if(method != 'GET')
				json = JSON.parse(body.toString());
			gwRequest(urlObj.pathname,method,json,returnResponse,res);
		})
	}
});
function returnResponse(res,response){
  var serverData = '';
  response.on('data',function(chunk){
    serverData += chunk;
  });
  response.on('end',function(){
		try{
			var d = JSON.parse(serverData);
			res.end(serverData);
		}
		catch(e){
			console.log("응답오류: invalid json");
		}
  });
}

app.listen(20398, function () {
  console.log('CORS-enabled web server listening on port 20398');
});

var gwRequest= function(path,m,body,callback,res){
  var options = {
    host: ip,
    port: port,
    path: PATH + path,
    method: m,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if(m == 'GET'){
    http.request(options,function(response){
      returnResponse(res,response);
    }).end();
  }
  else{
    var bodyString = JSON.stringify(body);
    options["headers"] = {
      'Content-Type': 'application/json',
			'Content-Length': bodyString.length
    };
    http.request(options,function(response){
			returnResponse(res,response);
    }).write(bodyString);
  }
};

function comprehendAction(sen){
  var oneHot = [0,0,0,0,0,0,0,0];
  for(i in sen){
    sen[i].forEach(function(value,key){
      if(key != "class"){
        var word_tb = require('./html/sl2/word_list/'+value+'.json');
        var hot = word_tb[key];
        if(hot != undefined){
          for(var h=0;h<hot.length;h++){
            if(hot[h]=="1") oneHot[h]++;
          }
        }
      }
    })
  }

	var MAX_VALUE = Math.max.apply(null, oneHot);
	if(MAX_VALUE == 0){
		action = "error";
	}
	else{
		var index = oneHot.indexOf(MAX_VALUE); // find highest possibility one.
		console.log(oneHot);
		if(index==3 || index==4)
			value = 20;
		else if(index==6 || index==7)
			value = 1000;
		action = namespaces[index];

		for(i in sen){
		  getParam(sen[i].get("class"),sen[i]);
	  }
	}
}

function getParam(word_class,lang){
/*  switch(word_class){
    case "NP":*/
      handleNP(lang);
/*      break;
    case "VP":
      handleVP(lang);
      break;
    case "AP":
      handleAP(lang);
      break;
  }*/
}

function handleNP(lang){
  var k = lang.search("Number");
	if(name==""){
		lang.forEach(function(value,key){
			if(key!="class")
				name += key;
		});
	}
  else if(k!=null){
		value = k;
  }
}
