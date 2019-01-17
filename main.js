
///////////////////////////////////////
//                                   //
//    Code by Oliver Kovacs, 2019    //
//    NodeJSFPS - main.js            //
//    CC-BY-NC-SA                    //
//                                   //
///////////////////////////////////////


//vars

var socket = io();      //client side socket.io

var i;
var j;

var c;                  //canvas
var ctx;                //canvas context

var mode;               //"static", "dynamic"
var getExternalData;    //server or client settings

var msg = "";           //message shown upon opening

var keys = {};          //keyboard input detection

//classes

class Client {
    constructor() {
        this.playerX;
        this.playerY;
        this.playerA;
        this.playerFOV;
        this.playerRenderDist;
        this.playerSpeed;
        this.playerSensitivity = 0.1;

        this.maps = [];
        this.map = [];

        this.vector = {};
        this.ray = [];

        this.render = {};
        this.render.ceiling = {};
        this.render.ceiling.color = {r: 0, g: 0, b: 0};
        this.render.wall = {};
        this.render.wall.color = {r: 5, g: 5, b: 5};
        this.render.floor = {};
        this.render.floor.color = {r: 0, g: 0, b: 0};

        this.render.ceiling.subdiv = 5;
        this.render.wall.height = 0.8;      //the smaller the number the higher the walls, def: 0.8
        this.render.wall.distance =  0.5;   //the higher the number the smaller the render distace and the faster the growth upon approach, def: 0.5
        this.render.floor.subdiv = 5

        this.toFixed = 20;
        this.screenWidth;
        this.screenHeight;
        this.pixelSize;
        this.mapIndex;
        this.rayAcc;
        this.performanceIssues = 0;
        this.minFPS = {fps: 30, amount: 5}; //fps -> frames per second

        this.GAMELOOP;
    }

    start() {
        for (i = 0; i < this.screenWidth; i++) {
            this.ray[i] = {};
            this.ray[i].vector = {};
        }
        this.playerRenderDist = 16;
        this.angelBtwRays = (this.playerFOV / this.screenWidth).toFixed(this.toFixed);
        alert(msg);
        this.GAMELOOP = setInterval(this.tick, 0);
    }

    tick() {
        this.now = Date.now();
        this.dt = this.now - this.lastUpdate;
        this.lastUpdate = this.now;

        if ((1000 / this.dt).toFixed(0) < client.minFPS.fps) {
            client.performanceIssues++;
            if (client.performanceIssues >= client.minFPS.amount) {
                console.log("warn fps dropped " + client.performanceIssues + " times under " + client.minFPS.fps);
                client.performanceIssues = 0;
            }
        }

        //dt -> deltatime, time between current and last tick in miliseconds
        client.update({dt: this.dt});
        client.draw({dt: this.dt});
    }

    update(data) {
        //vector of player direction
        this.vector.x = JSON.parse(Math.sin((this.playerA * Math.PI / 180).toFixed(this.toFixed)).toFixed(this.toFixed));
        this.vector.y = JSON.parse(Math.cos((this.playerA * Math.PI / 180).toFixed(this.toFixed)).toFixed(this.toFixed));

        //keyboard input
        if (keys[87] == true) {     //w
            this.playerX += this.vector.x * this.playerSpeed * data.dt;
            this.playerY += this.vector.y * this.playerSpeed * data.dt;
            if (this.map[Math.floor(this.playerY)][Math.floor(this.playerX)] == "#") {      //collision detection
                this.playerX -= this.vector.x * this.playerSpeed * data.dt * 2;
                this.playerY -= this.vector.y * this.playerSpeed * data.dt * 2;
            }
        }
        if (keys[83] == true) {     //s
            this.playerX -= this.vector.x * this.playerSpeed * data.dt;
            this.playerY -= this.vector.y * this.playerSpeed * data.dt;
            if (this.map[Math.floor(this.playerY)][Math.floor(this.playerX)] == "#") {      //collision detection
                this.playerX += this.vector.x * this.playerSpeed * data.dt;
                this.playerY += this.vector.y * this.playerSpeed * data.dt;
            }
        }
        if (keys[65] == true) {     //a
            this.playerA -= this.playerSensitivity * data.dt;
        }
        if (keys[68] == true) {     //d
            this.playerA += this.playerSensitivity * data.dt;
        }

        //casts ray for each pixel column of canvas
        for (i = 0; i < this.screenWidth; i++) {
            this.ray[i].a = (this.playerA * Math.PI / 180).toFixed(this.toFixed) - this.playerFOV / 2 + (this.angelBtwRays * i);

            this.ray[i].x = JSON.parse(this.playerX.toFixed(this.toFixed));
            this.ray[i].y = JSON.parse(this.playerY.toFixed(this.toFixed));

            this.ray[i].vector.x = JSON.parse(Math.sin(this.ray[i].a).toFixed(this.toFixed));
            this.ray[i].vector.y = JSON.parse(Math.cos(this.ray[i].a).toFixed(this.toFixed));


            //measure distance to wall
            this.hitWall = false;
            this.ray[i].l = 0;
            while (this.hitWall == false && this.ray[i].l < this.playerRenderDist) {        
                this.ray[i].x += this.ray[i].vector.x * this.rayAcc;
                this.ray[i].y += this.ray[i].vector.y * this.rayAcc;

                this.ray[i].l += 1 * this.rayAcc;

                if (this.map[Math.floor(this.ray[i].y)][Math.floor(this.ray[i].x)] == "#") {
                    this.hitWall = true;
                }
            }
        }
    }

    draw(data) {
        for (i = 0; i < this.screenWidth; i++) {

            this.ceiling = (this.screenHeight / 2) + this.render.wall.distance - (this.screenHeight / this.ray[i].l / this.render.wall.height);
            this.floor = this.screenHeight - this.ceiling;

            for (j = 0; j < this.screenHeight; j++) {                   //determine pixel color
                if (j < this.ceiling) {                                 //ceiling
                    this.renderCeiling();
                }
                else if (j > this.ceiling && j < this.floor) {          //wall
                    this.renderWall();
                }
                else {                                                  //floor
                    this.renderFloor();
                }
                ctx.fillRect(i * this.pixelSize, j * this.pixelSize, 1 * this.pixelSize, 1 * this.pixelSize);       //draw pixel
            }
        }

        this.ms.innerHTML = "ms: " + data.dt + " | fps: " + (1000 / data.dt).toFixed(0);        //ms/fps display
    }

    renderCeiling() {
        ctx.fillStyle = "#0000FF";
    }

    renderWall() {
        ctx.fillStyle = "#" + (99 - this.render.wall.color.r * this.ray[i].l.toFixed(0)) + (99 - this.render.wall.color.g * this.ray[i].l.toFixed(0)) + (99 - this.render.wall.color.b * this.ray[i].l.toFixed(0));
    }

    renderFloor() {
        ctx.fillStyle = "#0000FF";
    }

    setParameters() {
        client.pixelSize = 10;
        c.width = 120 * client.pixelSize;
        c.height = 60 * client.pixelSize;
        c.style = "border:1px solid #000000;";
        c.style.width = (120 * client.pixelSize) + "px";
        c.style.height = (60 * client.pixelSize) + "px";
        client.playerX = 2;
        client.playerY = 2;
        client.playerA = 45;
        client.playerFOV = 0.8;
        client.playerSpeed = 0.005;
        client.mapIndex = 0;
        client.screenWidth = 120;
        client.screenHeight = 60;
        client.rayAcc = 0.02;
        ctx = c.getContext("2d");
    }

    makeMap() {
        this.mapStr =   "################;" +
                        "#.........#....#;" +
                        "#.........#....#;" +
                        "#..... #..#....#;" +
                        "#......####....#;" +
                        "#..............#;" +
                        "#....###.......#;" +
                        "#....#.........#;" +
                        "#....###.......#;" +
                        "#..............#;" +
                        "#..............#;" +
                        "#########......#;" +
                        "#....#.........#;" +
                        "#...........####;" +
                        "#...........####;" +
                        "#...........####;" +
                        "#..............#;" +
                        "#...........####;" +
                        "################";
        this.mapRows = this.mapStr.split(";");
        this.map = [];
        for (i = 0; i < this.mapRows.length; i++) {
            this.map[i] = this.mapRows[i].split("");
        }
    }
}

//functions

function loaded() {                             //after all elements loaded
    mode = "static";
    getExternalData = true;
    c = document.getElementById("gameCanvas");
    client.ms = document.getElementById("ms");
    if (mode == "static") {
        getExternalData = false;
        console.log("warn getExternalData set to false because mode is 'static'");
    }
    if (getExternalData == true) {              //normal mode, everything from server
        socket.emit("getParameters", {});
        socket.emit("getMaps", {});
    }
    else {
        if (mode != "static") {                 //testing mode, only map from server
            client.setParameters();
            socket.emit("getMaps", {});
        }
        else {                                  //static mode without nodejs -> for the github version
            client.setParameters();
            client.makeMap();
            client.start();
        }
    }
}

socket.on("getParametersRes", function(data) {      //data from server (./server/settings.json)
    c.width = data.canvasWidth * data.canvasPixelSize;
    c.height = data.canvasHeight * data.canvasPixelSize;
    c.style = data.canvasStyle;
    c.style.width = (data.canvasWidth * data.canvasPixelSize) + "px";
    c.style.height = (data.canvasHeight * data.canvasPixelSize) + "px";
    msg = data.msg;
    client.pixelSize = data.canvasPixelSize;
    client.playerX = data.spawn.x;
    client.playerY = data.spawn.y;
    client.playerA = data.spawn.a;
    client.playerFOV = data.fov;
    client.playerSpeed = data.speed;
    client.mapIndex = data.mapIndex;
    client.screenWidth = data.canvasWidth;
    client.screenHeight = data.canvasHeight;
    client.rayAcc = data.rayAcc,
    ctx = c.getContext("2d");
});

socket.on("getMapsRes", function(data) {            //map from server
    client.maps = data.maps;
    client.map = client.maps[client.mapIndex];
    client.start();
});

window.onkeyup = function(event) {                  //keyboard input detection
    keys[event.keyCode] = false;
}
window.onkeydown = function(event) {                //keyboard input detection
    keys[event.keyCode] = true;
}

//code

let client = new Client();