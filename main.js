// Chose a random blurb and display it
const headers = ["Hello World", "Welcome!"]
let splashText = document.getElementById("title");
splashText.innerText = headers[Math.floor(Math.random() * headers.length)];