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
