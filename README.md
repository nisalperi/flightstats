# Node FlightStats Client

## Usage

```javascript
var flightStats = require('./flightstats.js');

var flightStatsClient = new flightStats.client({
	app_id: FLIGHTSTATS APP ID,
	app_key: FLIGHTSTATS APP KEY,
	watch_url: POST ENDPOINT FOR RECEIVING FLIGHT ALERTS
});
```
### Calling the FlightStats API

`instanceName.callAPI()` can be used to call the Flightstats API. The entire FlightStats API is based on "GET" for some reason. URLs for different API can be generated using functions listed below.

```javascript
flightStatsClient.callAPI(url,function(status,data){
	//console.log(status,data);
});
```

### Flightstats Schedule API

```javascript
var schedule_url = flightStatsClient.generateFlightScheduleURL({
	carrier_code: CARRIER CODE,
	flight_no: FLIGHT NO,
	date:{
		year: YEAR,
		month: MONTH,
		date: DATE
	}
});

flightStatsClient.callAPI(schedule_url,function(status,data){
	console.log(status,data);
});

```

### Flightstats Status API

```javascript
var status_url = flightStatsClient.generateFlightStatusURL({
    carrier_code: CARRIER CODE,
	flight_no: FLIGHT NO,
	date:{
		year: YEAR,
		month: MONTH,
		date: DATE
	},
	status_type: "dep" or "arr"
});

flightStatsClient.callAPI(status_url,function(status,data){
	console.log(status,data);
});

```
### Flightstats Alerts

```javascript
var add_alert_url = flightStatsClient.watchFlightURL({
	carrier: CARRIER NAME,
	flight_no: FLIGHT NUMBER,
	arr_airport: ARRIVAL AIRPORT,
	alert_type: ALERT TYPE, //arr_airport should be set if alert_type === 'arriving', if alert_type === 'departing', dep_airport should be set
	date:{
		year: YEAR,
		month: MONTH,
		date: DATE
	}
});
```
