# Connecting particle to websites through firebase and webhooks
Brief tutorial for firebase with webhooks

using source tutorial https://github.com/rickkas7/firebase_tutorial

For the sake of this workshop I will consider that a database is already set up.
You can learn how to do so here:
https://firebase.google.com/docs/database/web/start

## Adding firebase to a html document
add this script in your html document.
``` <script defer src="https://www.gstatic.com/firebasejs/7.13.1/firebase-app.js"></script> ```

## Configuring firebase in a js file
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
    apiKey: "AIzaSyDFnukUIuNszVe26EXJ9uAszmWhUrtryhE",
    authDomain: "scout-d8d6c.firebaseapp.com",
    databaseURL: "https://scout-d8d6c.firebaseio.com",
    projectId: "scout-d8d6c",
    storageBucket: "scout-d8d6c.appspot.com",
    messagingSenderId: "53366250598",
    appId: "1:53366250598:web:b918abc6d1752fbcbba1a7",
    measurementId: "G-F9QX4BF58P"
  };

//   // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);
}
``` 



