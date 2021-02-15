# Connecting particle to websites through firebase and webhooks
Brief tutorial for on how to combine websites to particles through webhooks and firebase.
The tutorial is made to be followed step by step, but all the resulting documents are in the repository.

this tutorial is mainly based on the following tutorials:
- https://github.com/rickkas7/firebase_tutorial
- https://www.tutorialspoint.com/firebase/index.htm

For the sake of this workshop I will consider that a database is already set up.
To set up a firebase database follow this tutorial:
- https://firebase.google.com/docs/database/web/start

## Setting up a webpage

### Start with a basic html page
use the template-project.zip in the repository (or make your own).

### Adding firebase to a html document
add this script in the head of your html document.
```html
<script defer src="https://www.gstatic.com/firebasejs/7.13.1/firebase.js"></script> 
```

### Configuring firebase in a js file
Your javascript file should contain the configuration of the firebase database.

To avoid the javascript function loading before the firebase-app script has been loaded, we add a window.onload condition.

``` javascript
if(window.attachEvent) {
    window.attachEvent('onload', loadFirebase);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            yourFunctionName(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = loadFirebase;
    }
}

function loadFirebase() {
  console.log("loading Firebase");
  var firebaseConfig = {
    apiKey: "AIzaSyCQVp_2mCxTvhDioDd0G8l-MMl1QJGJRro",
    authDomain: "particle-example-29829.firebaseapp.com",
    databaseURL: "https://particle-example-29829.firebaseio.com",
    projectId: "particle-example-29829",
    storageBucket: "particle-example-29829.appspot.com",
    messagingSenderId: "306280375832",
    appId: "1:306280375832:web:b3c46ed3040fcb0ee7856d",
    measurementId: "G-YJ40SYWVBP"
  };
 // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  console.log(firebase);
}
``` 
If the firebase has been configured correctly, your console should print the following:
<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/Screen%20Shot%202020-04-08%20at%203.17.16%20PM.png" width="35%" height="35%"> <br/>
In the case where something is done wrong in the setup, you will get an error.

### sending data from the page
to send data I added a button inside the body tag of the html page
``` javascript
<button onclick="sendColor()"> send color </button>
``` 
The button triggers the sendColor() function when it is clicked. We can define the sendColor function in the javaScript file, to give an idea of the value format I instructed the function to send fixed values to each element (r, g , b). Note that the put instruction will delete any current entry in the database and replace it with what is being sent. Firebase also has an update function which will only replace elements that are sent and keep the rest as is. This can be done by replacing the word set by update.

``` javascript
function sendColor(){
  firebase.database().ref('color/').set({
  r: 10,
  g: 30,
  b: 50
}, function(error) {
  if (error) {
    console.error("data was not sent");
  } else {
    console.log("data sent");
  }
});
}

``` 

If you go to your firebase after pressing the button it should look like this:

<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/Screen%20Shot%202020-04-08%20at%203.30.28%20PM.png" width="50%" height="50%"> <br/>


### adding a color wheel
to make the function more interesting I decided to integrate a colorwheel which I added over the button
```
<input id="color-picker" type="color" id="skin-color" value="#ff0000">
```

To make the send function more interesting I replaced the sendColor() function by the following

``` javascript
function sendColor(){
  var color = document.getElementById("color-picker").value;
  color = hexToRgb(color);
  console.log(color);
  firebase.database().ref('color/').set(
  color
, function(error) {
  if (error) {
    console.error("data was not sent");
  } else {
    console.log("data sent");
  }
});
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
```
I used the hex to rgb conversion function found [here](https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb). Note that I changed the data format to a single variable and took out the curly brackets because the hexToRgb() function already formats the data appropriately. You can confirm this by looking at the the printed variable in your javascript console.

<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/Screen%20Shot%202020-04-08%20at%203.33.55%20PM.png" width="50%" height="50%"> <br/>

## Setting the particle

### making a get webhook
The first thing you need to do to set up your particle is create a webhook. Write the following json file and save it as getColor.json.
This is a get request because we are retrieving data from the database and sending it to the particle.
```json
{
    "event": "getColor",
    "url": "https://particle-example-29829.firebaseio.com/color.json",
    "requestType": "GET",
    "query": {
    	"auth":"qjDhMye4hDtgY3z4b0lTLq35buOFuPkZPKlss35J"
    },
    "mydevices": true,
    "noDefaults": true
}
```
The url of the database can be found here
<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/Screen%20Shot%202020-04-08%20at%204.02.33%20PM.png" width="80%" height="80%"> <br/>
<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/Screen%20Shot%202020-04-08%20at%203.58.27%20PM.png" width="80%" height="80%"> <br/>

### publishing the webhook
Webhooks can be made manually through particle's web ide, but you can also make them through your terminal, which is handy when you are working with more complex data sets/post requests rather than get.
You can publish the webhook by running the following command line in your terminal(mac), make sure to be in the repository of the json file on your terminal.

```particle webhook create getColor.json```

Your terminal should respond with something of the sort
<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/Screen%20Shot%202020-04-08%20at%2012.05.14%20AM.png" width="80%" height="80%"> <br/>


### wiring the particle
in this particular example I am using two items from the keyes studio sensor kit, first the [digital push button] (https://wiki.keyestudio.com/Ks0029_keyestudio_Digital_Push_Button) and the [RGB led module](https://wiki.keyestudio.com/Ks0032_keyestudio_RGB_LED_Module)

here are example codes for each [link](https://github.com/apanin/ParticleKeyeStudio37sensorKitExamples/blob/master/s11_Push_Button.ino)[link](https://github.com/apanin/ParticleKeyeStudio37sensorKitExamples/blob/master/s4_RGB_LED_module.ino)

follow the schematic for hookup

<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/hookup.png" width="50%" height="50%"> <br/>

## coding the particle
Now that we have the webhook and the particle set up, we can use code.
For this tutorial I will be using the [web ide](https://build.particle.io/)
Create a new app and include the SparkJson library in the folder
paste the following code

``` c
#include <SparkJson.h>

#include "Particle.h"


// Forward declarations
void getDataHandler(const char *topic, const char *data);
//name of this particular event
const char *EVENT_NAME = "getColor";
// String data = String(10);

//defining parameters for the led
//red pin
#define rPin D1
//green pin
#define gPin D2
//blue pint
#define bPin D0
//push button pin
#define buttonPin D3
//values for each led
//min 255 (no light)
//max 0 (full brightness)
int r = 0;
int g = 0;
int b = 0;

//setup
void setup() {
	Serial.begin(9600);
	//set each pin as an output
	pinMode(rPin, OUTPUT);
	pinMode(gPin, OUTPUT);
	pinMode(bPin, OUTPUT);
	//setup the webhook parameters: directory of hook-response, data handler function and devices which can use the webhook
	Particle.subscribe("hook-response/getColor", getDataHandler, MY_DEVICES);
}

//loop function
void loop() {
    //if the push button is pressed
    if (digitalRead(buttonPin) == LOW){
        Serial.println("button pushed");
	//make the led white
        analogWrite(gPin, 255);
        analogWrite(rPin, 255);
        analogWrite(bPin, 255);
	//get the data front the firebase
	Particle.publish(EVENT_NAME, "", PRIVATE);
	delay(1000);
	}
	// show the color as defined in the database
      analogWrite(rPin, 255-r);
      analogWrite(gPin, 255-g);
      analogWrite(bPin, 255-b);
      delay(1000);
}

//data handler function
void getDataHandler(const char *topic, const char *data) {
	// This isn't particularly efficient; there are too many copies of the data floating
	// around here, but the data is not very large and it's not kept around long so it
	// should be fine.
	Serial.println("handle");
	//data buffer
	StaticJsonBuffer<256> jsonBuffer;
	//make a copy of the string of data because the data string is a local variable
	char *mutableCopy = strdup(data);
	//parse json object as defined by the json library
	JsonObject& root = jsonBuffer.parseObject(mutableCopy);
	//allocate memory for the mutable copy
	free(mutableCopy);
	//print the string of data as is
	Serial.printlnf("data: %s", data);
	//define global variables as their respective parameter in the json object
	r = root["r"];
	g = root["g"];
	b = root["b"];
	//print values
	Serial.println(r);
	Serial.println(g);
	Serial.println(b);
}
```

Note: the event name is the name of your webhook.
Particle.subscribe() sets up which functions will be called when the event is published, where it goes and with which devices it can be done.

Note: In this case the data we are sending from the html page is an int, but normally the data is in string format, in which case we would have had to define the colors as the following ```r = atoi(root["r"])```.

Note: I need to substract the color channels from 255 to get the desired color, this is due to the way the led module works, if I were using neopixels, I write the values directly as they are given from the webhook.

## posting data from the particle
In this case, I am using google maps api, but you can send any type of data to the database as long as it is in a valid format.

### adding google maps api
Add the google maps integration to your particle account if it is not already done.
Add the google maps library to your project. You can then add a google maps locator to the particle app.
```GoogleMapsDeviceLocator locator;```

## creating a put webhook
Similarly to the get webhook, we will create a put type webhook.
You can create the following postPosition.json file
```c
{
	"event": "postPosition",
	"url": "https://particle-example-29829.firebaseio.com/position.json",
	"requestType": "PUT",
	"query": {
		"auth":"JqYOBWnvqW3GXZ2wKKgcXXONSpHvK3LyoR6vS89r"
	},
	"json": {
		"lat": "{{lat}}",
		"lng": "{{lng}}",
		"acc": "{{acc}}",
		"ts": "{{PARTICLE_PUBLISHED_AT}}"
	},
	"mydevices": true,
	"noDefaults": true
}
```
After which like the first time you will create a webhook through the terminal with the following command
```particle webhook create postPosition.json```

You can test the webhook through the following command on the terminal (I used random sample data)
```particle publish postPosition "{\"lat\":100,\"lng\":12.32,\"acc\":0.05}"```
It should look like this
<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/Screen%20Shot%202020-04-08%20at%201.38.20%20AM.png" width="35%" height="35%"> <br/>

In this case I used a put request rather than a post because I am logging the particles current location and do not wish to keep previous data, if I wanted to keep track of the entries I would use a POST request instead.

### Adding the put request to your particle code
Now that the webhook is setup we will make the particle publish the data to the firebase.
google maps function locationCallback() lets you use the location data (lat, lng), which we will use to post the data to the server.
```c
//google maps library
#include <google-maps-device-locator.h>
//json extraction library
#include <SparkJson.h>
//particle library
#include "Particle.h"


// declare data related functions and values
void getDataHandler(const char *topic, const char *data);
//get color is our universal get function
const char *GET = "getColor";
//postPosition is our universal post function
const char *POST = "postPosition";
String deviceName;

GoogleMapsDeviceLocator locator;
//define pins
#define rPin D1
#define gPin D2
#define bPin D0
#define buttonPin D3
//values for each led
//min 255 (no light)
//max 0 (full brightness)
int r = 0;
int g = 0;
int b = 0;

void setup() {
	Serial.begin(9600);
	//set each pin as an output
	pinMode(rPin, OUTPUT);
	pinMode(gPin, OUTPUT);
	pinMode(bPin, OUTPUT);
	//locator setup
	//get location when triggered and call function locationCallback
	locator.withLocateOnce().withSubscribe(locationCallback);
}

void loop() {
    //keep locator active (will be activated if triggered)
     locator.loop();
    //if the push button is pressed
    if (digitalRead(buttonPin) == LOW){
        Serial.println("button pushed");
	//set led to white
        analogWrite(gPin, 255);
        analogWrite(rPin, 255);
        analogWrite(bPin, 255);
	//setup the webhook parameters: directory of hook-response, data handler function and devices which can use the webhook
        Particle.subscribe("hook-response/getColor", getDataHandler, MY_DEVICES);
	//Get data from firebase
	Particle.publish(GET, "", PRIVATE);
	//delay 1 second before posting data	
	delay(1000);
	//publish location
	locator.publishLocation();
	delay(1000);
	}
	
      analogWrite(rPin, 255-r);
      analogWrite(gPin, 255-g);
      analogWrite(bPin, 255-b);
      delay(1000);
}

//data handler function
void getDataHandler(const char *topic, const char *data) {
	// This isn't particularly efficient; there are too many copies of the data floating
	// around here, but the data is not very large and it's not kept around long so it
	// should be fine.
	Serial.println("handle");
	//data buffer
	StaticJsonBuffer<256> jsonBuffer;
	//make a copy of the string of data because the data string is a local variable
	char *mutableCopy = strdup(data);
	//parse json object as defined by the json library
	JsonObject& root = jsonBuffer.parseObject(mutableCopy);
	//allocate memory for the mutable copy
	free(mutableCopy);
	//print the string of data as is
	Serial.printlnf("data: %s", data);
	//define global variables as their respective parameter in the json object
	r = root["r"];
	g = root["g"];
	b = root["b"];
	//print values
	Serial.println(r);
	Serial.println(g);
	Serial.println(b);
}

//function called when
void locationCallback(float lat, float lon, float accuracy) {
    Serial.println("posting users postion");
    Serial.print('lat: ');
    Serial.println(lat);
    Serial.print('lng: ');
    Serial.println(lon);
    //setup the proper publish funxtion
    Particle.subscribe("spark/", deviceNameHandler);
    Particle.publish("spark/device/name");
    Serial.println("updating location");
	// create a json object for each parameter
	char buf[256];
	snprintf(buf, sizeof(buf), "{\"lat\":%.6f,\"lng\":%.6f,\"acc\":\"%.6f\"}", lat, lon, accuracy);
	Serial.printlnf("publishing %s", buf);
	//publish json object
	Particle.publish(POST, buf, PRIVATE);
}

void deviceNameHandler(const char *topic, const char *data) {
	deviceName = data;
}
```
## Retrieving data from the web
Now that we have the particle posting data to the server, we will retrieve this data from the browser.
Also note that an extra variable is given, which is the time stamp, this says when the data was posted from the particle.

### Updating html
I updated the body of the html page started earlier by the following:
```html
  <body>
	<h1> Firebase trial page </h1>
        <h2> Send a color </h2>
        <input id="color-picker" type="color" id="skin-color" value="#ff0000">
        <button onclick="sendColor()"> send color </button>
        <h2> Where is the particle? </h2>
        <p id="particle-location"></p>
        <button onclick="getLocation()"> get Location </button>
  </body>
```

### getting data
the added button triggers the function getLocation, we will use this to get data and update the pages content consequently.
```javascript
function getLocation(){
  console.log("get location");
  ref.on("value", function(snapshot) {
   console.log(snapshot.val());
  }, function (error) {
   console.log("Error: " + error.code);
 });
}
```
When written as such, you can see that firebase is sending you a json file. Now since we are targetting location values we can do such like this:

```javascript
/*****************
Firebase/Particle example
Nina Parenteau
******************/

var ref;
//triggered function when the page is fully loaded
if(window.attachEvent) {
    window.attachEvent('onload', loadFirebase);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            yourFunctionName(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = loadFirebase;
    }
}

//load firebase
function loadFirebase() {
  console.log("loading Firebase");
  //json object for configuration note if you are using a personal database, use your specific configuration (api key, domain, etc...)
  var firebaseConfig = {
    apiKey: "AIzaSyCQVp_2mCxTvhDioDd0G8l-MMl1QJGJRro",
    authDomain: "particle-example-29829.firebaseapp.com",
    databaseURL: "https://particle-example-29829.firebaseio.com",
    projectId: "particle-example-29829",
    storageBucket: "particle-example-29829.appspot.com",
    messagingSenderId: "306280375832",
    appId: "1:306280375832:web:b3c46ed3040fcb0ee7856d",
    measurementId: "G-YJ40SYWVBP"
  };
 // Initialize Firebase as configured
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  ref = firebase.database().ref();
  //print firebase to see parameters
  console.log(firebase);
}

//sends a color to the db which will be read by the particle photon
//and emitted by the led
function sendColor(){
  //define color variable as the value of the color picker 
  var color = document.getElementById("color-picker").value;
  //convert hex color to rgb value
  color = hexToRgb(color);
  console.log(color);
  //set reference of the database to color
  //and set it as the value of color (which has been transformed into an rgb json object)
  firebase.database().ref('color/').set(
  color
, function(error) {
  if (error) {
    console.error("data was not sent");
  } else {
    console.log("data sent");
  }
});
}

//retrieves data on the location of the particle and adds values to the html page
function getPosition(){
  console.log("get position");
  //sets firebase reference to position and retrieves json object
  var positionRef = firebase.database().ref("position/");
  positionRef.on("value", function(snapshot) {
   console.log(snapshot.val());
   var data = snapshot.val();
   console.log("ts: " + data.ts);
   console.log("lat: " + data.lat);
   console.log("lng: " + data.lng);
   console.log("acc: " + data.acc);
   //change values of inner html to the retrieved data
   document.getElementById("particle-location-title").innerHTML = "Particle was last seen";
   document.getElementById("particle-location").innerHTML = "<p>" + data.ts + "</p> <p> lat: "+ data.lat + "</p> <p> lng: " + data.lng + "</p> <p> +/-: " + data.acc + "</p>";
  }, function (error) {
   console.log("Error: " + error.code);
 });
}

// //old send color function which has been redefined
// function sendColor(){
//   firebase.database().ref('color/').update({
//   a: 10,
//   b: 30,
//   c: 50
// }, function(error) {
//   if (error) {
//     console.error("data was not sent");
//   } else {
//     console.log("data sent");
//   }
// });
// }

// function found on stack overflow
// transforms hex string into color json object
// src : https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

```

And there it is, a website and a particle connected through firebase. ( Watch the video to see what it looks like)
