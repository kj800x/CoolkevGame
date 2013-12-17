
      function generateammoside(sidename, sidecolor){
        return {
          "name": sidename+"_Ammo",
          "color": new color(sidecolor.r*(20/51), sidecolor.g*(20/51), sidecolor.b*(20/51))
        }
      }
      
      function side(name, color){
      	this.color = color;
        this.name = name;
        this.ammoside = generateammoside(name,color);
      }
      
      function unit(side,x,y){
      	this.side = side;
        this.x = x;
        this.y = y;
        this.dead = false;
        this.velocity = new vector(0,0);
        this.indicatorstyle = side.color.toHEX()
        this.tick = function(){};
      }
      
      function generateplayer(side,x,y){
      	var returnvalue = new unit(side,x,y);
        returnvalue.calculatelivingness = function(){
          if (this.health <= 0){
            this.dead = true;
            unitarray.push(generateexplosion(this.x, this.y, 100));
            this.deconstruct();
          }
        }
        
        
      function generateammoside(sidename, sidecolor){
        return {
          "name": sidename+"_Ammo",
          "color": new color(sidecolor.r*(20/51), sidecolor.g*(20/51), sidecolor.b*(20/51))
        }
      }
      
      function side(name, color){
      	this.color = color;
        this.name = name;
        this.ammoside = generateammoside(name,color);
      }
      
      
      
      function unit(side,x,y){
      	this.side = side;
        this.x = x;
        this.y = y;
        this.dead = false;
        this.velocity = new vector(0,0);
        this.indicatorstyle = side.color.toHEX()
        this.tick = function(){};
      }
      
      function generateplayer(side,x,y){
      	var returnvalue = new unit(side,x,y);
        returnvalue.calculatelivingness = function(){
          if (this.health <= 0){
            this.dead = true;
            unitarray.push(generateexplosion(this.x, this.y, 100));
            this.deconstruct();
          }
        }
        returnvalue.type = "player";
        returnvalue.indicatorstyle = side.color.toHEX()
        returnvalue.hit = function(type,side){
          if (type=="explosion"){this.health--}
          if (type=="bullet" && side != this.side){this.health--}
          if (type=="player"){this.health = 0;}
          if (type=="spawnpoint"){this.health++}
          if (type=="timebomb"){this.velocity.magnitude = 2}
        };
        returnvalue.deconstruct = function(){}
        returnvalue.render = function(cx,vpx,vpy){
          cx.beginPath();
          cx.strokeStyle=this.side.color.toHEX();
          cx.arc(this.x-vpx,this.y-vpy,5,0,2*Math.PI);
          cx.stroke();
          
          cx.beginPath();
          cx.moveTo(this.x-vpx,this.y-vpy);
          cx.lineTo(this.x-vpx + (Math.cos(this.velocity.radian())*20),this.y-vpy + (Math.sin(this.velocity.radian())*20));
          cx.closePath();
          cx.stroke();
        }
        returnvalue.hitcircle = function(){
          //var a = {type: "ship"};
          return 5;
        }
        returnvalue.health = Settings.starthealth;
        returnvalue.stars = [];
        for(var i = 0; i < 600; i++) {
          returnvalue.stars.push(new Star(c.width, c.height));
        }
        return returnvalue;
      }
      
      function generatecpu(side,x,y){
      	var returnvalue = new unit(side,x,y);
        returnvalue.calculatelivingness = function(){
          if (this.health <= 0){
            this.dead = true;
            unitarray.push(generateexplosion(this.x, this.y, 30));
            this.deconstruct();
          }
        }
        returnvalue.type = "cpu";
        returnvalue.indicatorstyle = side.color.toHEX()
        returnvalue.hit = function(type,side){
          if (type=="explosion"){this.health--}
          if (type=="bullet" && side != this.side){this.health--}
          if (type=="player" || type=="cpu"){this.health = 0;}
          if (type=="spawnpoint"){}
          if (type=="timebomb"){this.velocity.magnitude = 1}
        };
        returnvalue.deconstruct = function(){}
        returnvalue.render = function(cx,vpx,vpy){
          cx.beginPath();
          cx.strokeStyle=this.side.color.toHEX();
          cx.arc(this.x-vpx,this.y-vpy,5,0,2*Math.PI);
          cx.stroke();
          
          cx.beginPath();
          cx.moveTo(this.x-vpx,this.y-vpy);
          cx.lineTo(this.x-vpx + (Math.cos(this.velocity.radian())*20),this.y-vpy + (Math.sin(this.velocity.radian())*20));
          cx.closePath();
          cx.stroke();
        }
        returnvalue.hitcircle = function(){
        //  var a = {type: "ship"};
          return 5;
        }
        returnvalue.health = 30;
        returnvalue.tick = function() {
          
          var p1 = getplayerone(false);
          var p2 = getplayertwo(false);
          
          if ((p1 == undefined) && (p2 == undefined)){
            this.health = 0;
            this.deconstruct();
            return;
          }
          
          if (p1){
            var p1vect = vector_from_two_points(this, p1);
          }
          
          if (p2){
            var p2vect = vector_from_two_points(this, p2);
          }
          
          var target = undefined;
          
          if (p2 && p1) {
            //Find which ones closer
            if (p2vect.magnitude < p1vect.magnitude){
              target = p2vect;
            } else {
              target = p1vect;
            }
          } else {
            if (p2) {target = p2vect;} else {target = p1vect;}
          }
          
          //Aim for target
          
          var determiner = norm(target.direction - this.velocity.direction) - 180;
          
          if (determiner < -180) {determiner = determiner + 360}
          
          if (Math.abs(determiner) - 175 > 0){
            this.velocity.nudge( 180 + determiner)
          } else { 
            var sign = determiner?determiner<0?-1:1:0
            this.velocity.nudge(5 * -1 * sign)
          }
          /*
          if (determiner <= 180) {
            this.velocity.nudge(4)
          } else {
            this.velocity.nudge(-4)
          }*/
          
          this.velocity.push(3)
        };
        return returnvalue;
        
      }
      
      function generateexplosion(x,y,size){
      	var returnvalue = new unit(window.sides.ammo,x,y);
        returnvalue.size = size;
        returnvalue.indicatorstyle = "#FFFFFF"
        returnvalue.width = 1;
        returnvalue.type = "explosion";
        returnvalue.hit = function(type,side){};
        returnvalue.calculatelivingness = function(){
          if (this.width > this.size){
            this.dead = true;
          } 
        }
        returnvalue.render = function(cx,vpx,vpy){
          cx.strokeStyle=this.side.color.toHEX();
          
          cx.beginPath();
          //cx.moveTo(this.x-vpx,this.y-vpy);
          cx.arc(this.x-vpx, this.y-vpy, 1*this.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
          
          cx.beginPath();
          cx.moveTo(this.x-vpx,this.y-vpy);
          cx.arc(this.x-vpx, this.y-vpy, .5*this.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
          
          cx.beginPath();
          cx.moveTo(this.x-vpx,this.y-vpy);
          cx.arc(this.x-vpx, this.y-vpy, .25*this.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
          
          this.width++;
        }
        returnvalue.hitcircle = function(){
          return this.width;
        }
        return returnvalue;
      }
      
      function generatetimebomb(x,y,time,width){
      	var returnvalue = new unit(window.sides.timeammo,x,y);
        returnvalue.width = width;
        returnvalue.time = time;
        returnvalue.indicatorstyle = "#003B6F"
        returnvalue.life = 1;
        returnvalue.type = "timebomb";
        returnvalue.hit = function(type,side){};
        returnvalue.calculatelivingness = function(){
          if (this.life > this.time){
            this.dead = true;
          }
        }
        returnvalue.render = function(cx,vpx,vpy){
          cx.strokeStyle=this.side.color.toHEX();
          
          cx.beginPath();
          //cx.moveTo(this.x-vpx,this.y-vpy);
          cx.arc(this.x-vpx, this.y-vpy, 1*this.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
          
          cx.beginPath();
          cx.moveTo(this.x-vpx,this.y-vpy);
          cx.arc(this.x-vpx, this.y-vpy, .5*this.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
          
          cx.beginPath();
          cx.moveTo(this.x-vpx,this.y-vpy);
          cx.arc(this.x-vpx, this.y-vpy, .25*this.width, 0 , 2*Math.PI, false);
          cx.stroke();
          cx.closePath();
          
          this.life++;
        }
        returnvalue.hitcircle = function(){
          return this.width;
        }
        return returnvalue;
      }
      
      function generatebullet(side,x,y,velocity,TTL,variation){
        
        if (variation === undefined){
          variation = 0;
        }
        
      	var returnvalue = new unit(side,x,y);
        returnvalue.type = "bullet";
        returnvalue.hit = function(type,side){};
        returnvalue.velocity = new vector(velocity.direction + (2*(Math.random()-.5) * variation),velocity.magnitude + 2 + (Math.random() * variation));
        returnvalue.TTL = TTL;
        returnvalue.calculatelivingness = function(){
          if (this.TTL <= 0){
            this.dead = true;
            unitarray.push(generateexplosion(this.x, this.y, 20));
          } 
        }
        returnvalue.render = function(cx,vpx,vpy){
          cx.beginPath();
          cx.strokeStyle=this.side.color.toHEX();
          cx.moveTo(this.x-vpx,this.y-vpy);
          cx.lineTo(this.x-vpx + (Math.cos(this.velocity.radian())*5),this.y-vpy + (Math.sin(this.velocity.radian())*5));
          cx.closePath();
          cx.stroke();
          this.TTL --;
        } 
        returnvalue.hitcircle = function(){
          return 2;
        }
        return returnvalue;
      }
      
      
     /*
      spawnpoint = new unit(window.sides.gameelement, 0, 0) 
      spawnpoint.calculatelivingness = function(){
        this.dead = false;
      }
      spawnpoint.render = function (cx,vpx,vpy) {
        cx.beginPath();
        cx.strokeStyle=this.side.color.toHEX();
        cx.arc(this.x-vpx,this.y-vpy,10,0,2*Math.PI);
        cx.stroke();
        
        cx.beginPath();
        cx.moveTo((this.x-vpx)-10,this.y-vpy);
        cx.lineTo((this.x-vpx)+10,this.y-vpy);
        cx.closePath();
        cx.stroke();
        
        cx.beginPath();
        cx.moveTo(this.x-vpx,(this.y-vpy)+10);
        cx.lineTo(this.x-vpx,(this.y-vpy)-10);
        cx.closePath();
        cx.stroke();
      }
        
      spawnpoint.hitcircle = function(){
        return 2;
      }
      spawnpoint.type = "spawnpoint";
      spawnpoint.hit = function(type){};
        
      unitarray.push(spawnpoint);
      
      */
      
      function run(){
        c.width -= 1;
        c.width += 1;
        
        checkcollisions();
        for (var unitindex in unitarray){

              unitarray[unitindex].calculatelivingness();
              unitarray[unitindex].tick();
              if (unitarray[unitindex].dead){
                Arrayremove(unitarray, unitindex);
              } else {
          
                unitarray[unitindex].x += Math.cos(unitarray[unitindex].velocity.radian())*unitarray[unitindex].velocity.magnitude;
                unitarray[unitindex].y += Math.sin(unitarray[unitindex].velocity.radian())*unitarray[unitindex].velocity.magnitude;
              
              }
        }
      
        //rendertocanvas(lbuffer, getplayertwo(false));
        rendertocanvas(rbuffer, getplayerone(false));
        
        
        ctx.drawImage(rbuffer, 0, 0);
        //ctx.drawImage(lbuffer, c.width/2, 0);
        
        // ctx.strokeStyle="FFFFFF";
        // ctx.moveTo(c.width/2,0);
        //  ctx.lineTo(c.width/2,c.height);
        //   ctx.stroke();
      }
      
      window.sides = [];
      window.sides.ammo = new side("Ammo", new color(255,255,255));
      window.sides.timeammo = new side("TimeAmmo", new color(0,59,111));
      window.sides.evil = new side("Evil", new color(255,0,0));
      window.sides.good = new side("Good", new color(255,255,0));
      window.sides.goodtwo = new side("goodtwo", new color(255,0,255));
      window.sides.gameelement = new side("Game Elements", new color(0, 150, 0));
      
      unitarray = new Array();
      
      
      function checkcollisions(){
        
        var k, j;
        
        for (j = 0; j < unitarray.length - 1; j++)
          {
            for (k = j + 1; k < unitarray.length; k++){
              var l = (Math.pow(unitarray[j].x - unitarray[k].x,2) + Math.pow(unitarray[j].y - unitarray[k].y,2));
              var r = Math.pow(unitarray[k].hitcircle() + unitarray[j].hitcircle(), 2);
              if (l <= r){
                try {
                  unitarray[j].hit(unitarray[k].type, unitarray[k].side);
                } catch (e){}
                try {
                  unitarray[k].hit(unitarray[j].type, unitarray[j].side);
                } catch (e){}
              }
            }
          }
      }
      
