# Connecting particle to websites through firebase and webhooks
Brief tutorial for on how to combine websites to particles through webhooks and firebase.
The tutorial is made to be followed step by step, but all the resulting documents are in the repository.

this tutorial is mainly based on the following tutorials:
⋅⋅* https://github.com/rickkas7/firebase_tutorial
⋅⋅* https://www.tutorialspoint.com/firebase/index.htm

For the sake of this workshop I will consider that a database is already set up.
To set up a firebase database follow this tutorial:
⋅⋅* https://firebase.google.com/docs/database/web/start

## Setting up a webpage

### Start with a basic html page
use the template-project.zip in the repository (or make your own).

### Adding firebase to a html document
add this script in the head of your html document.
```
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
<img src="https://github.com/apanin/particle-firebase-webhook-tutorial/blob/master/images/Screen%20Shot%202020-04-08%20at%203.17.16%20PM.png" width="20%" height="20%">

In the case where something is done wrong in the setup, you will get an error.

## sending data from the page
to send data I added a button inside the body tag of the html page
```  
<button onclick="sendColor()"> send color </button>
``` 
as you can see the button triggers the sendColor() function when it is clicked. We can define the sendColor function in the javaScript, to give you an idea of the value format I instructed the function to send fixed values to each element (r, g , b). Note that the put instruction will delete any current entry in the database and replace it with what is being sent. Firebase also has an update function which will only replace elements that are sent and keep the rest as is. This can be done by replacing the word set by update.

```
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
## adding a color wheel
to make the function more interesting I decided to integrate a colorwheel which I added over the button
```
<input id="color-picker" type="color" id="skin-color" value="#ff0000">
```

To make the send function more interesting I replaced the sendColor() function by the following
using a hex to rgb conversion function found [here](https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb) Note that I changed the data format to a single variable and took out the curly brackets because the hexToRgb() function already formats the data appropriately. You can confirm this by looking at the the printed variable in your javascript console.
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

## creating a webhook for your particle
The first thing you need to do to set up your particle is create a webhook.
Write the following json file (for example this is getColor.json)

```
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

## publishing the webhook
Webhooks can be made manually through particle's web ide, but it's nice to write them by hand, especially when you are working with more complex data sets/post requests rather than get.
You can publish the webhook by running the following command line in your terminal(mac), make sure to be in the repository of the json file on your terminal.
```particle webhook create getColor.json```

## wiring the particle
in this particular example I am using two items from the keyes studio sensor kit, first the [digital push button] (https://wiki.keyestudio.com/Ks0029_keyestudio_Digital_Push_Button) and the [RGB led module](https://wiki.keyestudio.com/Ks0032_keyestudio_RGB_LED_Module)

here are example codes for each [link](https://github.com/apanin/ParticleKeyeStudio37sensorKitExamples/blob/master/s11_Push_Button.ino)[link](https://github.com/apanin/ParticleKeyeStudio37sensorKitExamples/blob/master/s4_RGB_LED_module.ino)

follow the schematic for hookup

## coding the particle
Now that we have the webhook and the particle set up, we can use code.
For this tutorial I will be using the [web ide](https://build.particle.io/)
Create a new app and include the SparkJson library in the folder
paste the following code

```
#include <SparkJson.h>

#include "Particle.h"


// Forward declarations
void getDataHandler(const char *topic, const char *data);

const char *EVENT_NAME = "getColor";
// String data = String(10);


#define rPin D1
#define gPin D2
#define bPin D0
#define buttonPin D3
int r = 0;
int g = 0;
int b = 0;

void setup() {
	Serial.begin(9600);
	pinMode(rPin, OUTPUT);
	pinMode(gPin, OUTPUT);
	pinMode(bPin, OUTPUT);
	Particle.subscribe("hook-response/getColor", getDataHandler, MY_DEVICES);
}

void loop() {
    if (digitalRead(buttonPin) == LOW){
        Serial.println("button pushed");
        analogWrite(gPin, 255);
        analogWrite(rPin, 255);
        analogWrite(bPin, 255);
		Particle.publish(EVENT_NAME, "", PRIVATE);
		delay(1000);
	}
	
      analogWrite(rPin, 255-r);
      analogWrite(gPin, 255-g);
      analogWrite(bPin, 255-b);
      delay(1000);
}

void getDataHandler(const char *topic, const char *data) {
	// This isn't particularly efficient; there are too many copies of the data floating
	// around here, but the data is not very large and it's not kept around long so it
	// should be fine.
	Serial.println("handle");
	StaticJsonBuffer<256> jsonBuffer;
	char *mutableCopy = strdup(data);
	JsonObject& root = jsonBuffer.parseObject(mutableCopy);
	free(mutableCopy);

	Serial.printlnf("data: %s", data);
	r = root["r"];
	g = root["g"];
	b = root["b"];
	Serial.println(r);
	Serial.println(g);
	Serial.println(b);
}
```

Note that the event name is the name of your webhook.
Particle.subscribe() sets up which functions will be called when the event is publeshed, where it goes and with which devices it can be done.

Note that in this case the data we are sending from the html page is an int, but normally the data is in string format, in which case we would have had to define the colors as the following ```r = atoi(root["r"])```.

Note Notice taht I need to substract the color channels from 255 to get the desired color, this is due to the way the led module works, if I were using neopixels, I write the values directly as they are gotten from the webhook.

## posting data from the particle
In this tutorial I will be using google maps api, but you can send any type of data to the database as long as it is in a valid format.

## adding google maps api
Add the google maps integration to your particle account if it is not already done.
Add the google maps library to your project. You can then add a google maps locator to the particle app.
```GoogleMapsDeviceLocator locator;```

## creating a put webhook
Similarly to the get webhook, we will create a put type webhook.
You can create the following json file
```
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
In this case I used a put request rather than a post because I am logging the particles current location and do not wish to keep previous data, if I wanted to keep track of the entries I would use a POST request instead.

## Adding the put request to your particle code
Now that the webhook is setup we will make the particle publish the data to the firebase.
google maps function locationCallback() lets you use the location data (lat, lng), which we will use to post the data to the server.
```
// This #include statement was automatically added by the Particle IDE.
#include <google-maps-device-locator.h>

#include <SparkJson.h>

#include "Particle.h"

// Test Program #3 for Firebase Integration
// Reads data from the database and prints it to the debug serial port


// Forward declarations
void getDataHandler(const char *topic, const char *data);
const char *GET = "getColor";
const char *POST = "postPosition";
String deviceName;

GoogleMapsDeviceLocator locator;

#define rPin D1
#define gPin D2
#define bPin D0
#define buttonPin D3
int r = 0;
int g = 0;
int b = 0;

void setup() {
	Serial.begin(9600);
	pinMode(rPin, OUTPUT);
	pinMode(gPin, OUTPUT);
	pinMode(bPin, OUTPUT);
	//get location every 2000 seconds
	locator.withLocateOnce().withSubscribe(locationCallback);
}

void loop() {
    locator.loop();
    if (digitalRead(buttonPin) == LOW){
        Serial.println("button pushed");
        analogWrite(gPin, 255);
        analogWrite(rPin, 255);
        analogWrite(bPin, 255);
        Particle.subscribe("hook-response/getColor", getDataHandler, MY_DEVICES);
		Particle.publish(GET, "", PRIVATE);
		delay(1000);
		locator.publishLocation();
		delay(1000);
	}
	
      analogWrite(rPin, 255-r);
      analogWrite(gPin, 255-g);
      analogWrite(bPin, 255-b);
      delay(1000);
}

void getDataHandler(const char *topic, const char *data) {
	// This isn't particularly efficient; there are too many copies of the data floating
	// around here, but the data is not very large and it's not kept around long so it
	// should be fine.
	Serial.println("handle");
	StaticJsonBuffer<256> jsonBuffer;
	char *mutableCopy = strdup(data);
	JsonObject& root = jsonBuffer.parseObject(mutableCopy);
	free(mutableCopy);

	Serial.printlnf("data: %s", data);
	r = root["r"];
	g = root["g"];
	b = root["b"];
	Serial.println(r);
	Serial.println(g);
	Serial.println(b);
}

void locationCallback(float lat, float lon, float accuracy) {
    Serial.println("posting users postion");
    Serial.print('lat: ');
    Serial.println(lat);
    Serial.print('lng: ');
    Serial.println(lon);
    Particle.subscribe("spark/", deviceNameHandler);
    Particle.publish("spark/device/name");
    Serial.println("updating location");
	char buf[256];
	snprintf(buf, sizeof(buf), "{\"lat\":%.6f,\"lng\":%.6f,\"acc\":\"%.6f\"}", lat, lon, accuracy);
	Serial.printlnf("publishing %s", buf);
	Particle.publish(POST, buf, PRIVATE);
}

void deviceNameHandler(const char *topic, const char *data) {
	deviceName = data;
} 
```
# Retrieving data from the web
Now that we have the particle posting data to the server, we will retrieve this data from the browser.
Also note that an extra variable is given, which is the time stamp, this says when the data was posted from the particle.

## Updating html
I updated the body of the html page started earlier by the following:
```
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

## getting data
the added button triggers the function getLocation, we will use this to get data and update the pages content consequently.
```
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

```
var ref;

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
  ref = firebase.database().ref();
  console.log(firebase);
}

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

function getPosition(){
  console.log("get position");
  var positionRef = firebase.database().ref("position/");
  positionRef.on("value", function(snapshot) {
   console.log(snapshot.val());
   var data = snapshot.val();
   console.log("ts: " + data.ts);
   console.log("lat: " + data.lat);
   console.log("lng: " + data.lng);
   console.log("acc: " + data.acc);

   document.getElementById("particle-location-title").innerHTML = "Particle was last seen";
   document.getElementById("particle-location").innerHTML += "<p>" + data.ts + "</p> <p> lat: "+ data.lat + "</p> <p> lng: " + data.lng + "</p> <p> +/-: " + data.acc + "</p>";
  }, function (error) {
   console.log("Error: " + error.code);
 });
}


// function found on stack overflow
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

And there you have it, a website and a particle connected through firebase.
