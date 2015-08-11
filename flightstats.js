/* Name: flightstats.js
   Description: Module to grab flight data from FlightStats, which is frankly a nightmare.
   Authors: Nisal Periyapperuma
   Creation Date: 2014-09-12
   CHANGES: 2014-09-12 Initial version.
            2015-08-11 Code Refactoring and realizing how much of an idiot I was an year ago.
*/

var rest = require('node-rest-client').Client;
var querystring = require("querystring");

var client = new rest();

var SCHEDULE_URL = "https://api.flightstats.com/flex/schedules/rest/v1/json/flight/";
var FLIGHT_STATUS_URL = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/";
var FLIGHT_STATUS_BY_ID_URL = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/";
var ALERT_URL = "https://api.flightstats.com/flex/alerts/rest/v1/json/";


function FlightStatsAPIClient(config) {
    this.APP_ID = config.app_id;
    this.APP_KEY = config.app_key;

    if (typeof config.watch_url !== 'undefined') this.WATCH_URL = config.watch_url;
}

FlightStatsAPIClient.prototype.callAPI = function(URL, callback) {
    client.get(URL, function(data, response) {
        //errors related to accessing the resource
        var error = false;

        if (typeof data === 'string') error = true;
        if (typeof data.error !== 'undefined') error = true;

        if (!error) {
            callback(true, data);
        } else {
            callback(false, data);
        }
    });

}

// Flighstats Flight Schedule API

FlightStatsAPIClient.prototype.generateFlightScheduleURL = function(options) {
    var url = SCHEDULE_URL;
    url += options.carrier_code + "/" + options.flight_no + "/";
    url += "departing/";
    url += options.year + "/" + options.month + "/" + options.date
    url += "?appId=" + this.APP_ID + "&appKey=" + this.APP_KEY;
    return url;
}

// Flightstats Flight Status API

FlightStatsAPIClient.prototype.generateFlightStatusURL = function(options, callback) {
    /*options in the format {carrier,flight_no,year,month,date} */
    // Method status_type = "dep","arr"

    var url = FLIGHT_STATUS_URL;
    url += options.carrier + "/";

    if (typeof options.status_type === 'undefined')options.status_type = 'dep'

    url += options.flight_no + "/" + options.status_type;
    url += options.year + "/";
    url += options.month + "/";
    url += options.date;
    url += "?appId=" + this.APP_ID + "&" + "appKey=" + this.APP_KEY + "&utc=false";
    return url;
}

FlightStatsAPIClient.prototype.generateFlightStatusByIdURL = function(flight_id, callback) {
    var url = FLIGHT_STATUS_BY_ID_URL;
    url += flight_id;
    url += "?appId=" + this.APP_ID + "&" + "appKey=" + this.APP_KEY + "&utc=false";
    return url;
}

// Flight Stats Alerts API

FlightStatsAPIClient.prototype.watchFlightURL = function(params) {
    ///params in the format{carrier,flight_no,dep_airport,arr_airport,date{year,month,day}}
    var addAlertUrl = ALERT_URL;
    addAlertUrl += "create/" + params.carrier + "/" + params.flight_no + "/";

    if (params.alert_type === 'arriving') addAlertUrl += 'to/' + params.arr_airport + '/';
    if (params.alert_type === 'departing') addAlertUrl += 'from/' + params.dep_airport + '/';

    addAlertUrl += params.alert_type + '/';
    addAlertUrl += params.date.year + "/" + params.date.month + "/" + params.date.date;
    addAlertUrl += "?appId=" + this.APP_ID;
    addAlertUrl += "&appKey=" + this.APP_KEY;
    addAlertUrl += "&type=JSON&";

    addAlertUrl += querystring.stringify({
        deliverTo: this.WATCH_URL
    });

    if (typeof params.event !== 'undefined') {
        addAlertUrl = +"&events="
        for (i = 0; i < params.event.length; i++) {
            addAlertUrl += params.event[i];
        }
    }
    return addAlertUrl;
}

FlightStatsAPIClient.prototype.testFlightAlertURL = function(params) {
    var testAlertUrl = ALERT_URL;
    testAlertUrl += 'testdelivery/';
    testAlertUrl += params.carrier + '/' + params.flight_no;
    testAlertUrl += '/from/' + params.dep_airport;
    testAlertUrl += '/to/' + params.arr_airport;

    // Authentication
    testAlertUrl += "?appId=" + this.APP_ID;
    testAlertUrl += "&appKey=" + this.APP_KEY;
    return testAlertUrl;
}

FlightStatsAPIClient.prototype.getRules = function() {
    var getRulesUrl = ALERT_URL + '/list';
    // Authentication
    getRulesUrl += "?appId=" + this.APP_ID;
    getRulesUrl += "&appKey=" + this.APP_KEY;

    return getRulesUrl;
}

FlightStatsAPIClient.prototype.getRuleById = function(params) {
    var getRuleUrl = ALERT_URL + '/get/' + params.rule_id;
    // Authentication
    getRuleUrl += "?appId=" + this.APP_ID;
    getRuleUrl += "&appKey=" + this.APP_KEY;

    return getRuleUrl;
}

FlightStatsAPIClient.prototype.deleteRuleById = function(params) {
    var getRuleUrl = ALERT_URL + '/delete/' + params.rule_id;
    // Authentication
    getRuleUrl += "?appId=" + this.APP_ID;
    getRuleUrl += "&appKey=" + this.APP_KEY;

    return getRuleUrl;
}

exports.client = FlightStatsAPIClient;