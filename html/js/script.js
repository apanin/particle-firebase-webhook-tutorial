/*****************

Firebase example
Nina Parenteau
******************/
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
   document.getElementById("particle-location").innerHTML = "<p>" + data.ts + "</p> <p> lat: "+ data.lat + "</p> <p> lng: " + data.lng + "</p> <p> +/-: " + data.acc + "</p>";
  }, function (error) {
   console.log("Error: " + error.code);
 });
}

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
