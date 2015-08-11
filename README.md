# Node FlightStat Client

## Usage

```
var flightStats = require('./flightstats.js');

var flightStatsClient = new flightStats.client({
	app_id: FLIGHTSTATS APP ID,
	app_key: FLIGHTSTATS APP KEY,
	watch_url: POST ENDPOINT FOR RECEIVING FLIGHT ALERTS
});
```
### Calling the FlightStats API

`instanceName.callAPI()` can be used to call the Flightstats API. The entire FlightStats API is based on "GET" for some reason. URLs for different API can be generated using functions listed below.

```
flightStatsClient.callAPI(url,function(status,data){
	//console.log(status,data);
});
```


### Using the Flightstats Schedule API

```
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