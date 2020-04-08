# Connecting particle to websites through firebase and webhooks
Brief tutorial for on how to combine websites to particles through webhooks and firebase

using source tutorial https://github.com/rickkas7/firebase_tutorial

For the sake of this workshop I will consider that a database is already set up.
You can learn how to do so here:
https://firebase.google.com/docs/database/web/start
## Start with a basic html page
use the template as given in the repository (or make your own).
## Adding firebase to a html document
add this script in the head of your html document.
``` <script defer src="https://www.gstatic.com/firebasejs/7.13.1/firebase.js"></script> ```

## Configuring firebase in a js file
your javascript file should contain the configuration of the database.
To avoid the javascript function loading before the firebase-app script has been loaded, we add a window.onload condition.
Everything is working fine if your firebase object is being printed.
In the case where something is done wrong in the setup, you will get an error.

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
#sending data from the page
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

to make the function more interesting I decided to integrate a colorwheel which I added over the button
```
<input id="color-picker" type="color" id="skin-color" value="#ff0000">
```

To make the send function more interesting I replaced the sendColor() function by the following
using a hex to rgb conversion function found [here](// src : https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb) Note that I changed the data format to a single variable and took out the curly brackets because the hexToRgb() function already formats the data appropriately. You can confirm this by looking at the the printed variable in your javascript console.
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

#getting the date on your particle

The first
