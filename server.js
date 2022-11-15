const express = require('express');
const logger = require('morgan');
const ejs = require('ejs');
const https = require('https');
const api_url = 'https://geo.ipify.org/api/v1?';
const dns = require('dns');

require('dotenv').config();

var port = process.env.PORT || 3000;
const api_key = process.env.API_KEY;

var app = express();

app.set('view engine', 'ejs');

app.use(express.static('views'));
app.set('views',__dirname + '/views')

app.use(logger('dev'));

app.listen(port, () => console.log(`listening to PORT ${port}...`));

app.get('/',(req,res)=>{
	var ip_address = '';
	var url = api_url + 'apiKey=' + api_key + '&ipAddress=' + ip_address;
	getLocation(res,ip_address,url);
})

app.post('/',(req,res)=>{
	var ip_address = req.body.ip_address;
	var numbers = '1234567890';
	if(numbers.indexOf(ip_address[0])==-1){
		getLocationDns(res,ip_address);
	}
	else{
		var url = api_url + 'apiKey=' + api_key + '&ipAddress=' + ip_address;
		getLocation(res,ip_address,url);
	}
})

async function getLocationDns(res,dn){
	var ip_address = '';
	dns.lookup(dn, (err, address, family) => {
  		ip_address = address;
  		console.log('ip:',address);
		var url = api_url + 'apiKey=' + api_key + '&ipAddress=' + ip_address;
		getLocation(res,ip_address,url);
	});
}


async function getLocation(res,ip,url){
	console.log(url);
	https.get(url, function(response) {
	    var str = '';
	    response.on('data', function(chunk) { str += chunk; });
	    response.on('end', function() { 
	    	console.log(str); 
	    	var k = str.split(",");
	    	if(k.length<10){
	    		res.render('index.ejs',{error:'IP Address or Domain Name not found'});
	    	}
	    	else{
				res.render('index.ejs',{str:str});
			}
	    });
	}).end();
}