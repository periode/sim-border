var Refugee = function(_index){
  this.index = _index;
  this.identity = random(10000);
  this.current_nation = nations[0];
  this.position = this.current_nation.getLocation();
  this.body = 4;
  this.skin = color(0, 0, 0);
  this.lifespan = random(10, 20)*1000;
  this.start_life = millis();
  this.alive = true;

  this.origin = this.current_nation.getLocation();


  this.desired_nation = this.seekDestination();
  this.destination = this.desired_nation.loc;

  this.settled = false;

  this.lerp_val = 0;
  this.lerp_inc = 0.005;

  this.update = function(){
    this.travel();

    if(millis() - this.start_life > this.lifespan){
      this.alive = false;
      acknowledgeDeath();
    }
  }
}

Refugee.prototype.display = function(){
  ellipseMode(CENTER);
  noStroke();
  fill(this.skin);
  push();
  translate(this.position.x, this.position.y);
  // ellipse(0, 0, this.body, this.body);
  for(var i =0 ; i < 4; i++){
    ellipse((noise(i, millis()*0.001)-0.5)*10, (noise(i+i, millis()*0.001)-0.5)*10, this.body*0.5, this.body*0.5);
  }
  pop();

  this.drawItinerary();
}

Refugee.prototype.drawItinerary = function(){
  strokeWeight(1);
  stroke(this.skin);
  line(this.position.x, this.position.y, this.destination.x, this.destination.y);
  stroke(this.skin*0.5);
  line(this.position.x, this.position.y, this.origin.x, this.origin.y);
}

Refugee.prototype.travel = function(){
  if(this.lerp_val < 1)
    this.lerp_val += this.lerp_inc;
  else
    this.arrivedInCountry();

  this.position = p5.Vector.lerp(this.origin, this.destination, this.lerp_val);
}

Refugee.prototype.seekDestination = function(){
  var current_indicator = this.current_nation.wealth + this.current_nation.employment + this.current_nation.welcoming + this.current_nation.diversity;

  //start with a random neighbor;
  var best_nation = this.current_nation.neighbors[Math.floor(Math.random()*this.current_nation.neighbors.length)];
  var best_indicator = 0;
  // console.log('looking through', this.current_nation.neighbors);
  for(var i = 0; i < this.current_nation.neighbors.length; i++){
    var candidate = this.current_nation.neighbors[i];
    // console.log('candidate is',candidate);
    var indicator = candidate.borders + candidate.subsidies + candidate.family + candidate.naturalization;
    // console.log('indicator is at',indicator);
    if(indicator > best_indicator){
      best_indicator = indicator;
      best_nation = candidate;
    }
  }

  // console.log('best nation is',best_nation);

  if(best_indicator > current_indicator){
    return best_nation;
  }else{
    this.settled = true;
    refugees.splice(this.index, 1);
    return this.current_nation;
  }

}

Refugee.prototype.arrivedInCountry = function(){
  this.current_nation.number_of_refugees--;
  this.current_nation = this.desired_nation;
  this.current_nation.number_of_refugees++;

  this.origin = this.current_nation.loc;

  this.assessSettlement();

  if(!this.settled){
    this.desired_nation = this.seekDestination();
    if(this.desired_nation != null)
      this.destination = this.desired_nation.loc;
    else
        this.destination = this.current_nation.loc;
    this.lerp_val = 0;
  }
}

Refugee.prototype.assessSettlement = function(){
  //look for an average of wealth + employment + tolerance + subsidies + family + naturalization. if it is above a certain threshold, then settle
  var satisfaction = this.current_nation.wealth*0.16 + this.current_nation.employment*0.16 + this.current_nation.welcoming*0.16 + this.current_nation.subsidies*0.16 + this.current_nation.family*0.16 + this.current_nation.naturalization*0.16;
  if(satisfaction > 0.5)
    this.settled = true;
}
