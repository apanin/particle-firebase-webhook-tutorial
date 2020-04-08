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