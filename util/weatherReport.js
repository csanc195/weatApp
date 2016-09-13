
// The required modules.
var http = require("http");
var https = require("https");

//result object
var resultSet = {
    latitude :"",
    longitude:"",
    localInfo:"",
    weather:"",
    humidity:"",
    pressure:"",
    time:""
    
};

//print out error messages
function printError(error){
    console.error(error.message);
}

//Forecast API required information:
//key for the forecast IO app
var forecast_IO_Key = "Copy the API key here";
var forecast_IO_Web_Adress = "https://api.forecast.io/forecast/";


//Create Forecast request string function
function createForecastRequest(latitude, longitude){
    var request = forecast_IO_Web_Adress + forecast_IO_Key + "/"
                      + latitude +"," + longitude;
    return request;
}

//Google GEO API required information:
//Create Google Geo Request
var google_GEO_Web_Adress =  "https://maps.googleapis.com/maps/api/geocode/json?address=";

function createGoogleGeoMapRequest(zipCode){
    var request = google_GEO_Web_Adress+zipCode + "&sensor=false";
    return request;
}

module.exports.get = function get(zipCode, returnFunction){
    // 1- Need to request google for geo locations using a given zip
    var googleRequest = https.get(createGoogleGeoMapRequest(zipCode), function(response){
        //console.log(createGoogleGeoMapRequest(zipCode));
        var body = "";
        var status = response.statusCode;
        //a- Read the data.
        response.on("data", function(chunk){
            body+=chunk;
        });
        //b- Parse the data.
        response.on("end", function(){  
            if(status === 200){
               try{
                   var coordinates = JSON.parse(body);
                   resultSet.latitude = coordinates.results[0].geometry.location.lat;
                   resultSet.longitude = coordinates.results[0].geometry.location.lng;
                   
                   resultSet.localInfo = coordinates.results[0].address_components[0].long_name + ", " +
                               coordinates.results[0].address_components[1].long_name + ", " +
                               coordinates.results[0].address_components[2].long_name + ", " +
                               coordinates.results[0].address_components[3].long_name + ". ";
               }catch(error){
                   printError(error.message);
               }finally{
                  connectToForecastIO(resultSet.latitude,resultSet.longitude);
               } 
            }else{
                printError({message: "Error with GEO API"+http.STATUS_CODES[response.statusCode]})
            }
        });
    });

    function connectToForecastIO(latitude,longitude){
        var forecastRequest = https.get(createForecastRequest(latitude,longitude),function(response){
           // console.log(createForecastRequest(latitude,longitude));
            var body = "";
            var status = response.statusCode;
            //read the data
             response.on("data", function(chunk){
                body+=chunk;
            });
            //parse the data
            response.on("end", function(){
                try{
                    var weatherReport = JSON.parse(body);
                    
                    resultSet.weather = weatherReport.currently.summary;
                    resultSet.humidity = weatherReport.currently.humidity;
                    resultSet.temperature = weatherReport.currently.temperature;
                    resultSet.pressure = weatherReport.currently.pressure;
                    resultSet.time = weatherReport.currently.time;
                }catch(error){
                    printError(error.message);
                }finally{
                   // console.log(resultSet);
                    returnFunction(resultSet);
                }
            });
        });    
    }
}

//define the name of the outer module.

