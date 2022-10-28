class Wiggly {
    constructor(cx, cy, radius, canvas, text) {
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.webkitImageSmoothingEnabled=true;
        this.drawScallopShape = false;
        this.drawFunkyShape = true;
        this.drawCircleShape = false;
        this.drawTextShape = true;
        this.drawSegmentBoundaryShape = false;
        this.color = "rgba(169,47,47,.9)";
        this.border = "rgb(0,0,0)";
        this.text = text;

        // these parameters define how the wiggle will turn and the segments
        this.degreeRotation = 0;
        this.wiggle.numSegments = Math.round(Math.random() * 5) + 7;// wiggle will have between 7 and 12 segments

        this.wiggle.createSegements();

        console.log(this.wiggle);

        this.animate = false;

        this.speed = 100;// timeout in miliseconds before next animationFrame is requested
    }

    // wiggle definition
    wiggle = {
        segments: [],
        numSegments: 0,
        maxCPOffset: 25,
        minCPOffset: 5,   
        CPIncrement: .5, 
        randomizeSegments: (amount) => {
            let amountToMove = amount;

            let totalRadom = 0;

            this.wiggle.segments.forEach(segment => {
                let amountAdded = Math.random() > .5 ? .1 : -.1;
                // add or substract 2 from each segment
                segment.curSegmentSize += amountAdded;
                totalRadom +=amountAdded;
            })

            console.log('totalRandom', totalRadom);
        },
        createSegements: () => {
            // randomize width of segments on initialization
            let numArray = [];
            let totalOfRandom = 0;
            let total = 0;

            // sudo-code for this found below
            // https://stackoverflow.com/questions/19277973/generate-4-random-numbers-that-add-to-a-certain-value-in-javascript

            // start by getting an array of random numbers
            for (let i = 0; i < this.wiggle.numSegments; i++) {
                let randInt = Math.round(Math.random() * 10 + 10);

                numArray.push(randInt)
            }


            // then we get the total of these random numbers
            totalOfRandom = this.totalArray(numArray);

            

            // finally we normalize the array based off total we desire (here it's 360 degrees)
            for (let i = 0; i < numArray.length; i++) {
                numArray[i] = Math.round(numArray[i] * (360 / totalOfRandom));
            }

            
            // Finally we need to ensure the randomize ints total to 360 as we can miss a degree or two due to rounding
            total = this.totalArray(numArray);

            if (total !== 360) {
                let tempTotal = 0;
                for (let i = 0; i < numArray.length; i++) {
                    if (i + 1 == numArray.length) {
                        numArray[i] = 360 - tempTotal;
                    } else {
                        tempTotal += numArray[i];
                    }
                }
            }

            
            numArray.forEach(segment => {
                const randInt1 = Math.round(Math.random() * 10) + 5; // between 5 and 10
                const randInt2 = Math.round(Math.random() * 10) + 5; // between 5 and 10

                this.wiggle.segments.push({
                    initialSegmentSize: segment,
                    curSegmentSize: segment,
                    initialCP1Offset: randInt1, 
                    curCP1Offset: randInt1,
                    initialCP2Offset: randInt2, 
                    curCP2Offset: randInt2,     
                    CPdirection: 'right'           
                })
            })
        }
    }

    // utility methods
    totalArray(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }

        return total;
    }

    getRadions(degrees) {return (Math.PI/180)*degrees;}

    getXatDegree(degree, radius, xCenter) {
        // x(t) = r * cos(t) + j
        // y(t) = r * sin(t) + k
        // where (j,k) is center of circle, t is degrees, r is radius
        return radius * Math.cos(this.getRadions(degree)) + xCenter;
    }
    
    getYatDegree(degree, radius, yCenter) {
        // x(t) = r * cos(t) + j
        // y(t) = r * sin(t) + k
        // where (j,k) is center of circle, t is degrees, r is radius
        return radius * Math.sin(this.getRadions(degree)) + yCenter;
    }

    // animation methods
    animateStart() {
        this.animate = true;
        this.animateLoop(0);
    }

    animateStop() {
        this.animate = false;
    }

    animateLoop(timestamp) {
        if (!this.animate) return;

        // animate at 60fps
        if (this.time === null) this.time = timestamp;

        let seg = Math.floor((timestamp - this.time) / this.delay);

        if (seg > this.frame) {
            this.frame = seg;
            this.draw();
        }

   
        window.requestAnimationFrame((timestamp) => {
                this.animateLoop(timestamp);            
        })
    }

    // canvas methods
    draw() {

        //this.cx += Math.random() > .5 ? 1 : -1;
        //this.cy += Math.random() > .5 ? 1 : -1;

        if (this.drawScallopShape) this.drawScallop();
        if (this.drawFunkyShape) this.drawFunky();
        if (this.drawCircleShape) this.drawCircle();
        if (this.drawSegmentBoundaryShape) this.drawSegmentBoundries();
        if (this.drawTextShape) this.drawText();
    }

    drawText() {
        this.ctx.font = '20px serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.text, this.cx, this.cy);
    }

    drawCircle() {
        this.ctx.beginPath();
        this.ctx.shadowColor = '';
        this.ctx.shadowBlur = 0;
        this.ctx.arc(this.cx,this.cy,this.radius,0,this.getRadions(360),false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    drawFunky() {    
        this.degreeRotation += .2;
        let startDeg = 0 + this.degreeRotation;
        let endDeg = 0 + this.degreeRotation;
        this.ctx.beginPath();

        for (let i = 0; i < this.wiggle.numSegments; i++) {
            let curSegment = this.wiggle.segments[i];
            let nextSegment = i + 1 >= this.wiggle.numSegments ? this.wiggle.segments[0] : this.wiggle.segments[i + 1];            
            
            startDeg = startDeg + curSegment.curSegmentSize;
            endDeg = startDeg + nextSegment.curSegmentSize;

            let x = this.getXatDegree(startDeg, this.radius, this.cx);
            let y = this.getYatDegree(startDeg, this.radius, this.cy);
        
            
            if (i === 0) this.ctx.moveTo(x, y);
            this.ctx.bezierCurveTo(
                this.getXatDegree(startDeg + curSegment.curCP1Offset, this.radius + 40, this.cx), 
                this.getYatDegree(startDeg + curSegment.curCP1Offset, this.radius + 40, this.cy), 
                this.getXatDegree(endDeg - curSegment.curCP2Offset, this.radius + 40, this.cx), 
                this.getYatDegree(endDeg - curSegment.curCP2Offset, this.radius + 40, this.cy), 
                this.getXatDegree(endDeg, this.radius, this.cx), 
                this.getYatDegree(endDeg, this.radius, this.cy)
            )



            // control point 1
            curSegment.curCP1Offset = curSegment.CPdirection === 'right' ?  curSegment.curCP1Offset + this.wiggle.CPIncrement : curSegment.curCP1Offset - this.wiggle.CPIncrement;

            if (curSegment.curCP1Offset >= this.wiggle.maxCPOffset) {
                curSegment.CPdirection = 'left';
                curSegment.curCP1Offset -= this.wiggle.CPIncrement;
            }

            if (curSegment.curCP1Offset <= this.wiggle.minCPOffset) {
                curSegment.CPdirection = 'right';
                curSegment.curCP1Offset += this.wiggle.CPIncrement;
            }

            // control point2
            curSegment.curCP2Offset = curSegment.CPdirection === 'left' ?  curSegment.curCP2Offset + this.wiggle.CPIncrement : curSegment.curCP2Offset - this.wiggle.CPIncrement;

            if (curSegment.curCP2Offset >= this.wiggle.maxCPOffset) {
                curSegment.CPdirection = 'right';
                curSegment.curCP2Offset -= this.wiggle.CPIncrement;
            }

            if (curSegment.curCP2Offset <= this.wiggle.minCPOffset) {
                curSegment.CPdirection = 'left';
                curSegment.curCP2Offset += this.wiggle.CPIncrement;
            }
        }

        // this.wiggle.randomizeSegments();
        this.ctx.closePath();
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 15;

        this.ctx.fillStyle = this.color;
        this.ctx.fill();

        this.ctx.strokeStyle = this.border;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

    }

    drawSegmentBoundries() {
        this.degreeRotation += 1;
        let startDeg = 0 + this.degreeRotation;
        let endDeg = 0 + this.degreeRotation;

        for (let i = -1; i < this.wiggle.numSegments - 1; i++) {
            startDeg = i === -1 ? startDeg : startDeg + this.wiggle.segments[i].curSegmentSize;
            endDeg = i === -1 ? this.wiggle.segments[0].curSegmentSize + this.degreeRotation : endDeg + this.wiggle.segments[i + 1].curSegmentSize;

            let x = this.getXatDegree(startDeg, this.radius, this.cx);
            let y = this.getYatDegree(startDeg, this.radius, this.cy);

            this.ctx.moveTo(this.cx, this.cy);
            this.ctx.lineTo(
                this.getXatDegree(endDeg, this.radius + 50, this.cx),
                this.getYatDegree(endDeg, this.radius + 50, this.cy)
            )
            this.ctx.stroke();
        }
    }

    drawScallop() {
        for (let i = 0; i< 360 ;i = i + 30) {
            let x = this.getXatDegree(i, this.radius, this.cx);
            let y = this.getYatDegree(i, this.radius, this.cy);
        
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.bezierCurveTo(
                this.getXatDegree(i, this.radius + 20, this.cx), 
                this.getYatDegree(i, this.radius + 20, this.cy), 
                this.getXatDegree(i + 30, this.radius + 20, this.cx), 
                this.getYatDegree(i + 30, this.radius + 20, this.cy), 
                this.getXatDegree(i + 30, this.radius, this.cx), 
                this.getYatDegree(i + 30, this.radius, this.cy)
            )
            this.ctx.stroke();
        }
    }
}

export {Wiggly};