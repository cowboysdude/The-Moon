/* Magic Mirror
 * Module: MMM-NPMWeather
 *
 * By Cowboysdude
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var request = require('request');
var moment = require('moment'); 
var Algorithmia = require("algorithmia");

module.exports = NodeHelper.create({

    start: function() {
        console.log("Getting module: " + this.name); 
		 
    },
	
	socketNotificationReceived: function(notification) {
        if (notification === 'GET_MOON') { 
                this.getInfo(); 
         }  
	}, 
	
	getInfo: function(url) {
		var self = this;
		 var now = moment().toISOString(); 
					var input = {  
				"time":now,
				"lat":42.089797,
				"lon": -76.807734
			};
			Algorithmia.client("simgoEtddECkJVn/hWQ8kkYuVrJ1")
			  .algo("jhurliman/SunMoonCalculator/0.1.0?timeout=300") // timeout is optional
			  .pipe(input)
			  .then(function(response) {
			//	console.log(response.get());
			  var moonInfo = {
		 	  MoonRise: moment(response.get().moonrise).format('h:mm a'),
			 	  MoonSet: moment(response.get().moonset).format('h:mm a')
			   };
			   self.sendSocketNotification("INFO_RESULT", moonInfo);
			   self.getMoon();
			   console.log("Sending MoonInfo data");	
			  }); 
    },  
	
	 
    
    getMoon: function() {
        var date = moment().unix();
        request({
            url: "http://api.farmsense.net/v1/moonphases/?d=" + date,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var moons = JSON.parse(body);
                var moon = moons[0];
                this.sendSocketNotification("MOON_RESULT", moon ? moon : 'NO_MOON_DATA');
				console.log("Sending Moon data2");
                 this.getSRSS();				
            }
        });
    },
    	
    getSRSS: function(callback) {
        var self = this;
        url = "https://api.sunrise-sunset.org/json?lat=42.062923&lng=-76.805946&formatted=0";
        request(url, function(error, response, body) {
            if (error) {
                console.log("Error: " + err.message);
            }
            var srss = JSON.parse(body); 
		 
            sun = {
                sunrise: moment(srss.results.sunrise).format('h:mm a'),
                sunset: moment(srss.results.sunset).format('h:mm a'),
                day_length: moment.utc(srss.results.day_length*1000).format('HH:mm'),
				usun: srss.results.sunrise,
				uset: srss.results.sunset 
            } 	 		
            self.sendSocketNotification("SRSS_RESULTS", sun ? sun : 'NO_SRSS_DATA');
			console.log("Sending Rise/set data"); 
        });
    },
	 

	 
});