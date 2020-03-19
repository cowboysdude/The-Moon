/* Magic Mirror
 * Module: Moon
 *
 * By Cowboysdude
 * MIT Licensed.
 */
Module.register("The-Moon", {

    // Module config defaults.
    defaults: {
        updateInterval: 20 * 60 * 1000,
        initialLoadDelay: 0,
		
        moon: {
            "Last Quarter": 'modules/The-Moon/Moon/thirdquarter.png',
            "New Moon": 'modules/The-Moon/Moon/newmoon.png',
            "Waxing": 'modules/The-Moon/Moon/waxingcrescent.png',
            "First Quarter": 'modules/The-Moon/Moon/firstquarter.png',
            "Waxing Gibbous": 'modules/The-Moon/Moon/waxinggibbous.png',
            "Full Moon": 'modules/The-Moon/Moon/fullmoon.png',
            "Waning Gibbous": 'modules/The-Moon/Moon/waninggibbous.png',
            "Waning Crescent": 'modules/The-Moon/Moon/waningcrescent.png',
            "Waxing Crescent": 'modules/The-Moon/Moon/waxingcrescent.png',
            "3rd Quarter": 'modules/The-Moon/Moon/thirdquarter.png'
        } 
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },
    getStyles: function() {
        return ["The-moon.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name); 
        this.scheduleUpdate();
        this.srss = {};
        this.mooninfo = {};		
        this.moon = {};
		this.getMoon();
         
    }, 

    getDom: function() { 
 
        var wrapper = document.createElement('div');
		var rows = document.createElement('div');
		var moon = this.moon;
		var mooninfo = this.mooninfo;
		var srss = this.srss;
        var cycle = (Math.round(moon.Distance) < "404580" && Math.round(moon.Distance) > "251663") ? "Apogee - Furthest from Earth" : "Perigree - Closest to Earth";
        var distance = Math.round(moon.Distance);moon = this.moon;
         
		var moonSetIcon = "<img class=moons src'modules/The-Moon/ Moon/ Moonset1.svg'>";
		var moonRiseIcon = "<img class=moons src'modules/The-Moon/ Moon/ Moonrise1.svg'>";
		var Name = (this.moon.Moon[0] != undefined || null || 'undefined') ? "Name: " + this.moon.Moon[0] : "";
        var MoonPhase = this.config.moon[this.moon.Phase];
        var phase = this.moon.Phase;
        var light = this.moon.Illumination.toString().replace(/^[0.]+/, "");
        var litMoon = (light < 10 && phase != "Waning Crescent") ? light + "0" : light;
        var fullyLit = (this.moon.Illumination == "1") ? litMoon + "0%" : litMoon + "%";
        var path = 'modules/The-Moon/Moon/sun';
		var now = moment().format('h:MM a'); 
 		
		var endDiv = document.createElement('div');
        endDiv.classList.add("columns","small","bright"); 
		endDiv.innerHTML = `<img src =${MoonPhase} height="37px" width="37px"><br>${this.moon.Phase} ~ Illumination: ${fullyLit}<br>${Name}<br>The moon is: ${distance} miles from Earth<br>and is in ${cycle}<br>Moon Rise: ${mooninfo.MoonRise}<br>Moon Set: ${mooninfo.MoonSet}<br>
		<br>Sun Rise/Set<br><img src = ${path}/sunrise.svg height=8% width=8%>  ${srss.sunrise}<br><img src=${path}/sunset.svg height=8%; width=8%;>  ${srss.sunset}<br>Daylength  ${srss.day_length}`;
        
		rows.appendChild(endDiv);
		wrapper.appendChild(rows); 
	 
        return wrapper;
    }, 

    scheduleUpdate: function() {
        setInterval(() => {
			this.getMoon();
        }, this.config.updateInterval);
    }, 
	 
    processMOON: function(data) {
        this.moon = data;  
    },
	
	processINFO: function(data) {
        this.mooninfo = data; 	
    },

    processSRSS: function(data) {
        this.srss = data; 	
    }, 
    
    getMoon: function() {
        this.sendSocketNotification('GET_MOON');
    },
	 
    socketNotificationReceived: function(notification, payload) { 
        if (notification === "MOON_RESULT") { 
            this.processMOON(payload);
        }
		if (notification === "INFO_RESULT") { ;
            this.processINFO(payload);
        }
        if (notification === "SRSS_RESULTS") { ;
            this.processSRSS(payload);
        }		
        this.updateDom(this.config.initialLoadDelay);
    } 
});