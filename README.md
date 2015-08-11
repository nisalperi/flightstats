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