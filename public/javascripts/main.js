import { Wiggly } from "./wiggly.js";

const canvas = document.createElement('canvas');

// style the chart
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

document.getElementById("chart-mount").appendChild(canvas);





const wiggles = [];

for (let i = 0; i < 2; i++) {
    wiggles.push(new Wiggly(canvas.width/2 * Math.random(), canvas.height/2 * Math.random(), 100, canvas, "Kingdom"))
}


let delay = 1000 / 60; // 60fps
let frame = 0;
let time = null;

animateLoop(0);
function animateLoop(timestamp) {
    // animate at 60fps
    if (time === null) time = timestamp;

    let seg = Math.floor((timestamp - time) / delay);

    if (seg > frame) {
        frame = seg;
        canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height)
        wiggles.forEach(wiggle => {
            wiggle.draw();
        })  
    }


    window.requestAnimationFrame((timestamp) => {
            animateLoop(timestamp);            
    })
}