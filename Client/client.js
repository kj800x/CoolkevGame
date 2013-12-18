




      var parts = window.location.search.substr(1).split("&");
var _GET = {};
for (var i = 0; i < parts.length; i++) {
    var temp = parts[i].split("=");
    _GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}
      
      Settings = {};
      if (_GET["disableStars"]){
        Settings.disableStars = true;
      } else {
        Settings.disableStars = false;
      }
      if (_GET["unlimitedSpeed"]){
        Settings.unlimitedSpeed = true;
      } else {
        Settings.unlimitedSpeed = false;
      }
      if (_GET["autoGen"]){
        Settings.autoGen = true;
      } else {
        Settings.autoGen = false;
      }
      if (_GET["health"]){
        Settings.starthealth = parseInt(_GET["health"]);
      } else {
        Settings.starthealth = 100;
      }
      if (_GET["username"]){
        Settings.username = _GET["username"];
      } else {
        Settings.username = Math.round(Math.random()*1000);
      }
      if (_GET["overclock"]){
        Settings.clock = parseInt(_GET["overclock"]);
      } else {
        Settings.clock = 50;
      }
      
      
      
      stars = {}
      
      
      
      //KEYMONITOR
      
      keys = [];
      window.addEventListener("keydown",
          function(e){
              keys[e.keyCode] = true;
          },
      false);
      
      window.addEventListener('keyup',
          function(e){
              keys[e.keyCode] = false;
          },
      false);
      
      function gettruekeysfromarray(arr){
          var newArr = new Array();
          for(var i in arr){
              if(arr[i] == true){
                  newArr[newArr.length] = i;
              }
          }
          return newArr;
      }

      function magicforhandlingkeys(){
      	goodkeys = gettruekeysfromarray(keys);
        for (var key in goodkeys){
          if (goodkeys[key] in keyhandlers){
            keyhandlers[goodkeys[key]]();
          }
        }
      }
      
      
      var Star = function(w, h) {
        var wp = this;
        
        wp.x = Math.random() * w;
        wp.y = Math.random() * h;
        wp.z = Math.random() * 1 + 0.3;
        wp.size = 1.2;
        wp.opacity = Math.random() * 0.8 + 0.1;
        
        wp.update = function(bounds) {
                
          // Wrap around screen
          wp.x = wp.x < bounds[0].x ? bounds[1].x : wp.x;
          wp.y = wp.y < bounds[0].y ? bounds[1].y : wp.y;
          wp.x = wp.x > bounds[1].x ? bounds[0].x : wp.x;
          wp.y = wp.y > bounds[1].y ? bounds[0].y : wp.y;
        };
        
        wp.draw = function(context) {
          // Draw circle
          context.fillStyle = 'rgba(226,219,226,'+wp.opacity+')';
          //context.fillStyle = '#fff';
          context.beginPath();
          context.arc(wp.x, wp.y, this.z * this.size, 0, Math.PI*2, true);
          context.closePath();
          context.fill();
        };
}

      
      function screenloc_from_vect(vect, ctx){
        var x,y;
        if (vect.direction == 0){
          x = 1;
          y = 0;
          
          ctx.textAlign="end";
          ctx.textBaseline="middle";
          
        }
        if (vect.direction < 45 && vect.direction > 0){
          x = 1;
          y = Math.tan(toRadians(vect.direction));
          
          ctx.textAlign="end";
          ctx.textBaseline="middle";
        }
        
        if (vect.direction == 45){
          x = 1;
          y = 1;
          
          ctx.textAlign="end";
          ctx.textBaseline="top";
        }   
        if (vect.direction < 90 && vect.direction > 45){
          x = Math.tan(toRadians(90 - vect.direction));
          y = 1;
          
          ctx.textAlign="center";
          ctx.textBaseline="top";
        }     
        
        if (vect.direction == 90){
          x = 0;
          y = 1;
          
          ctx.textAlign="center";
          ctx.textBaseline="top";
        }
        if (vect.direction < 135 && vect.direction > 90){
          x = -Math.tan(toRadians(vect.direction-90));
          y = 1;
          ctx.textAlign="center";
          ctx.textBaseline="top";
        }
        
        if (vect.direction == 135){
          x = -1;
          y = 1;
          ctx.textAlign="left";
          ctx.textBaseline="top";
        }
        if (vect.direction < 180 && vect.direction > 135){
          x = -1;
          y = Math.tan(toRadians(180-vect.direction));
          ctx.textAlign="left";
          ctx.textBaseline="middle";
        }
        if (vect.direction == 180){
          x = -1;
          y = 0;
          
          ctx.textAlign="left";
          ctx.textBaseline="middle";
        }
        if (vect.direction < 225 && vect.direction > 180){
          x = -1;
          y = -Math.tan(toRadians(vect.direction-180));
          ctx.textAlign="left";
          ctx.textBaseline="middle";
        }
        
        if (vect.direction == 225){
          x = -1;
          y = -1;
          ctx.textAlign="left";
          ctx.textBaseline="bottom";
        }
        if (vect.direction < 270 && vect.direction > 225){
          x = -Math.tan(toRadians(270 - vect.direction));
          y = -1;
          ctx.textAlign="center";
          ctx.textBaseline="bottom";
        }
        
        if (vect.direction == 270){
          x = 0;
          y = -1;
          ctx.textAlign="center";
          ctx.textBaseline="bottom";
        }
        if (vect.direction < 315 && vect.direction > 270){
          x = Math.tan(toRadians(vect.direction - 270));
          y = -1;
          ctx.textAlign="center";
          ctx.textBaseline="bottom";
        }
        
        if (vect.direction == 315){
          x = 1;
          y = -1;
          ctx.textAlign="right";
          ctx.textBaseline="bottom";
        }
        if (vect.direction < 360 && vect.direction > 315){
          x = 1;
          y = -Math.tan(toRadians(360 - vect.direction));
          ctx.textAlign="end";
          ctx.textBaseline="middle";
        }
        return {"x": x/2 + .5, "y": .5 - y/2}
        
      }
      
      var connection;
      function makeConnection(){
      connection = new WebSocket('ws://localhost:8080/', []);

        // When the connection is open, send some data to the server
        connection.onopen = function () {
          connection.send(JSON.stringify(
          
          [
            {
            "type":"changeUsername",
            "username": Settings.username
            },
            {
            "type":"moveTo",
            "x": Math.floor(Math.random()*200),
            "y": Math.floor(Math.random()*200),
            "velocity": new vector(0,0),
            },
          ]
          
          ))
        };

        // Log errors
        connection.onerror = function (error) {
          console.log('WebSocket Error ' + error);
        };

        // Log messages from the server
        connection.onmessage = function (e) {
          unitarray = JSON.parse(e.data);
        };
      	
        
      }
      
      function setup(){
       	c=document.getElementById("thecanvas");
        var div = document.getElementById("container");
        c.width=div.scrollWidth;
        c.height=div.scrollHeight;
       	ctx=c.getContext("2d");
      	ctx.fillStyle="#FF0000";
      	
      	Settings.username = prompt("What should people call you?");
      	
      	stars.stars = [];
        for(var i = 0; i < 600; i++) {
          stars.stars.push(new Star(c.width, c.height));
        }
      	
      	makeConnection();
      	
        //lbuffer = document.createElement('canvas');
        //lbuffer.width = c.width/2;
        //lbuffer.height = c.height;
        
        rbuffer = document.createElement('canvas');
        rbuffer.width = c.width;
        rbuffer.height = c.height;
        
        window.setInterval(run,Settings.clock);  
        window.setInterval(magicforhandlingkeys,20);  
        if (Settings.autoGen){
          window.setInterval(autoGenEnemy,2000); 
        } 
      }
      
      unitarray = [];
      
      function run(){
        c.width -= 1;
        c.width += 1;
        
        //rendertocanvas(lbuffer, getplayertwo(false));
        rendertocanvas(rbuffer, getUnitByUsername(Settings.username));
        
        ctx.drawImage(rbuffer, 0, 0);
        //ctx.drawImage(lbuffer, c.width/2, 0);
        
        // ctx.strokeStyle="FFFFFF";
        // ctx.moveTo(c.width/2,0);
        //  ctx.lineTo(c.width/2,c.height);
        //   ctx.stroke();
      }
      
      
      function formatforlocdisplay(num, dec){
        var n = (num + "").split(".");
        if (dec){
          if (typeof n[1] == "undefined"){n[1] = 0;}
          var pad = "000000";
          var a = (pad+n[0]).slice(-pad.length);
          
          var pad = "00";
          var b = (pad+n[1]).slice(-pad.length);
          return a + "." + b;
        }
        else {
          var pad = "000000";
          return (pad+n[0]).slice(-pad.length);
        }
      }
      
      function getUnitByUsername(u){
        var i = 0;
        for (i = 0; i < unitarray.length; i++){
          if (unitarray[i].username == u){
            return unitarray[i];
          }
        }
        return undefined;
      }
      
      function renderUnit(unit, cx, vpx, vpy) {
        if (unit.type == "player"){
          cx.beginPath();
          cx.strokeStyle=colorFromTriple(unit.side.color).toHEX();
          cx.arc(unit.x-vpx,unit.y-vpy,5,0,2*Math.PI);
          cx.stroke();
          
          cx.beginPath();
          cx.moveTo(unit.x-vpx,unit.y-vpy);
          cx.lineTo(unit.x-vpx + (Math.cos(vectorFromJSON(unit.velocity).radian())*20),unit.y-vpy + (Math.sin(vectorFromJSON(unit.velocity).radian())*20));
          cx.closePath();
          cx.stroke();
          
          cx.fillStyle = "#FFFFFF"
          cx.font = "8pt Courier";
          cx.textAlign="center";

          cx.fillText(
            unit.username,
            unit.x-vpx,
            unit.y-(vpy-20)
            )
          
        } else if (unit.type == "explosion"){
          cx.strokeStyle=colorFromTriple(unit.side.color).toHEX();
          
          cx.beginPath();
          //cx.moveTo(this.x-vpx,this.y-vpy);
          cx.arc(unit.x-vpx, unit.y-vpy, 1*unit.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
          
          cx.beginPath();
          cx.moveTo(unit.x-vpx,unit.y-vpy);
          cx.arc(unit.x-vpx, unit.y-vpy, .5*unit.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
          
          cx.beginPath();
          cx.moveTo(unit.x-vpx,unit.y-vpy);
          cx.arc(unit.x-vpx, unit.y-vpy, .25*unit.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
        } else if (unit.type == "bullet"){
          cx.beginPath();
          cx.strokeStyle=colorFromTriple(unit.side.color).toHEX();
          cx.moveTo(unit.x-vpx,unit.y-vpy);
          cx.lineTo(unit.x-vpx + (Math.cos(vectorFromJSON(unit.velocity).radian())*5),unit.y-vpy + (Math.sin(vectorFromJSON(unit.velocity).radian())*5));
          cx.closePath();
          cx.stroke();
        }
      
      }
      
      
      function drawindicator(c, vctx, from, to){
      var v = vector_from_two_points({"x": from.x, "y": from.y},{"x": to.x, "y": to.y});//new vector((Math.round(new Date().getTime() / 1000) - inittime),25);//
          
        if (v.magnitude < (c.width + c.height)/4){
          return;
        }
        
          var coord = screenloc_from_vect(v, vctx);
          //vctx.fillText(formatforlocdisplay(v.direction, false) , c.width/2, 120);
          vctx.strokeStyle=to.indicatorstyle;
          vctx.beginPath();
          //vctx.moveTo(coord.x * c.width,coord.y * c.height);
          
          //DETERMINE THE RADIUS OF THE CIRCLE
          var m;
          if (v.magnitude > 10000){
           m = 10;
          } else {
           m = (-3/9604000)*(v.magnitude-200)*(v.magnitude-200) + 40
          }
          
          
          vctx.arc(coord.x * c.width,coord.y * c.height, m, 0 , 2*Math.PI, false);
          vctx.stroke();
          vctx.closePath();
          
          vctx.fillStyle = "#FFFFFF"
          vctx.font = "8pt Courier";

          vctx.fillText(
            to.username,
            coord.x * c.width,
            coord.y * c.height
            )
          
         /* vctx.beginPath();
          vctx.moveTo(c.width/2,c.height/2);
          vctx.lineTo(coord.x * c.width,coord.y * c.height);
          vctx.stroke(); */
      }
      
      function rendertocanvas(c, p){
        c.width--;
        c.width++;
        var vctx = c.getContext('2d');
        if (typeof(p) != "undefined"){
          var vpx = p.x - (c.width / 2);
          var vpy = p.y - (c.height / 2);
          
          if (typeof(stars.oldvp) == "undefined"){
            stars.oldvp = {"x":p.x,"y":p.y}
          }
          
          var delta = {
            "x": stars.oldvp.x - p.x,
            "y": stars.oldvp.y - p.y,
          }
          
          var bounds = [
            {
              "x":0,
              "y":0},
            {
              "x":c.width,
              "y":c.height}
          ];
          if (!Settings.disableStars){
            for(var i in stars.stars) {
              
              var star = stars.stars[i];
              star.x -= (star.z - 1.5) * delta.x * 2;
              star.y -= (star.z - 1.5) * delta.y * 2;
              
              star.update(bounds);
              star.draw(vctx);
              
            }
          }
            
          stars.oldvp = {"x":p.x,"y":p.y};
          
          vctx.fillStyle = "#FFFFFF"
          vctx.font = "10pt Courier";
          vctx.textAlign="end";

          vctx.fillText(p.health + " -- HEALTH__", c.width - 10, c.height - 50);
          vctx.fillText("(" + formatforlocdisplay(p.velocity.direction, false) +"o at "+ formatforlocdisplay(p.velocity.magnitude, false) +"wpu/s) -- HEADING_", c.width - 10, c.height - 30);
          vctx.fillText("(" + formatforlocdisplay(Math.round(p.x)/100, true) +","+ formatforlocdisplay(Math.round(0-p.y)/100, true) +") -- LOCATION", c.width - 10, c.height - 10);
          
          for (var unitindex in unitarray){
                          
              /* RENDER */
              
              renderUnit(unitarray[unitindex], vctx, vpx, vpy)
              
            if (unitarray[unitindex].type == "player" || unitarray[unitindex].type == "spawnpoint" || unitarray[unitindex].type == "cpu"){
              drawindicator(c, vctx, p, unitarray[unitindex]);
            }
              
              /*a = unitarray[unitindex].hitcircle();
                  vctx.strokeStyle="#FF0066";
                  vctx.beginPath();
                  vctx.moveTo(unitarray[unitindex].x-vpx,unitarray[unitindex].y-vpy);
                  vctx.arc(unitarray[unitindex].x-vpx, unitarray[unitindex].y-vpy, a, 0 , 2*Math.PI, false);
                  vctx.stroke();
              vctx.closePath();*/
          }
        } else {
          vctx.fillStyle="#FFFFFF";
          vctx.font = "15px monospace";
          vctx.textAlign = "center";
          vctx.textBaseline = "bottom";
          
          
          vctx.beginPath();
          vctx.moveTo(c.width/2,0);
          vctx.lineTo(c.width/2,c.height);
          vctx.stroke(); 
          
          vctx.fillText("COOLKEV - GAME", c.width/2, 20);
          vctx.fillText("MULTIPLAYER", c.width/2, 40);
          vctx.fillText("CONNECTION LOST/BROKEN/FAILED", c.width/2, 60);
          vctx.fillText("PLAYER ONE", c.width/2, 120);
          vctx.fillText("______________", c.width/2, 122);
          vctx.fillText("Up ---- Accelerate           ", c.width/2, 140);
          vctx.fillText("Down -- Deaccellerate        ", c.width/2, 160);
          vctx.fillText("Left -- Turn CounterClockwise", c.width/2, 180);
          vctx.fillText("Right - Turn Clockwise       ", c.width/2, 200);
          vctx.fillText("Space - Fire                 ", c.width/2, 220);
          
          }
        return c;
      }
      
      keyhandlers = new Array();
      keyhandlers[37] = function (){ //Player1 Left
        /*var player = getplayerone();
        player.velocity.nudge(3);*/
        connection.send('[{"type":"velocityChange","direction":3,"magnitude":0}]');
      }
      keyhandlers[38] = function (){ //Player1 Forward
        /*var player = getplayerone();
        player.velocity.push(.5);*/
        connection.send('[{"type":"velocityChange","direction":0,"magnitude":0.5}]');
      }
      keyhandlers[39] = function (){ //Player1 Right
        /*var player = getplayerone();
        player.velocity.nudge(-3);*/
        connection.send('[{"type":"velocityChange","direction":-3,"magnitude":0}]');
      }
      keyhandlers[40] = function (){ //Player1 Back
      
        connection.send('[{"type":"velocityChange","direction":0,"magnitude":-0.5}]');
        /*
        player.velocity.push(-.5);*/
      }
      keyhandlers[32] = function (){ //Player1 Fire
        connection.send('[{"type":"spawnBullet"}]');
      }
      keyhandlers[191] = function (){ //Player1 Die
     /*   var player = getplayerone();
        player.dead = true;
        playerone = undefined;*/
      }

