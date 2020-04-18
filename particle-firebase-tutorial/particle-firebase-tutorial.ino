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
