var Nation = function(_pos, _rad, _index){
  this.index = _index;
  this.name  = this.index.toString();
  this.loc = createVector(_pos.x, _pos.y);
  this.territory = _rad;
  this.sides = parseInt(random(5, 10));
  this.offset = [];
  for(var i = 0; i < this.sides; i++){
    this.offset[i] = 1+random(-0.2, 0.2);
  }
  this.canExpand = true;
  this.tint = color(random(190, 250), 200);

  this.wealth_rad = 0;
  this.population = random(2000000, 80000000); //population in million inhabitants

  this.neighbors = [];

  this.neighbor_coeff = 1.25;

  this.refugees = [];
  this.last_refugee = null;

  this.walls = [];

  if(this.index != 0){
    //current state - eco

    this.start_wealth = random(-6, 6); //0 - poor - 1 - rich
    this.wealth = this.start_wealth;
    this.start_employment = random(-6, 6); //0 - low - 1 - high
    this.employment = this.start_employment;

    //current state - pol
    this.start_regime = random(-6, 6); //0 - authoritarian - 1 - participative
    this.regime = this.start_regime;
    this.start_climate = random(-3, 6) //0 - bureaucratic - 1 - informal
    this.climate = this.start_climate;

    //current state - soc
    this.start_welcoming = random(-6, 6); //0 - exclusive/violent - 1 - inclusive/peaceful
    this.welcoming = this.start_welcoming;
    this.start_diversity = random(-6, 0); //0 - homogeneous - 1 - heterogeneous
    this.diversity = this.start_diversity;

    //border policies - set a random range at start
    this.borders = parseInt(random(-4, 4));
    this.subsidies = parseInt(random(-4, 4));
    this.family = parseInt(random(-4, 4));
    this.naturalization = parseInt(random(-4, 4));
  }else{
    //current state - eco
    this.start_wealth = -9;
    this.wealth = this.start_wealth;
    this.start_employment = -9;
    this.employment = this.start_employment;

    //current state - pol
    this.start_regime = -9;
    this.regime = this.start_regime;
    this.start_climate = -9;
    this.climate = this.start_climate;

    //current state - soc
    this.start_welcoming = -9;
    this.welcoming = this.start_welcoming;
    this.start_diversity = -9;
    this.diversity = this.start_diversity;

    //border policies - set a random range at start
    this.borders = parseInt(random(-4, 0));
    this.subsidies = parseInt(random(-4, 0));
    this.family = parseInt(random(-4, 0));
    this.naturalization = parseInt(random(-4, 0));
  }

  this.border_intensity = map(this.borders, -10, 10, 8, 0);

  //coefficients for stats adjustments
  this.coeff_wealth_family = 0.5;
  this.coeff_wealth_regime = 0.5;
  this.coeff_wealth_refugee = 0.12;
  this.coeff_wealth_noise = 5;
  this.coeff_wealth_subsidies = 0.25;
  this.coeff_wealth_employment = 0.02;

  this.coeff_employment_noise = 0.25;
  this.coeff_employment_refugees = 0.5;

  this.coeff_regime_wealth = 0.025;
  this.coeff_regime_borders = 0.025;
  this.coeff_regime_climate = 0.025;
  this.coeff_regime_naturalization = 0.1;

  this.coeff_climate_wealth = 0.25;
  this.coeff_climate_regime = 0.25;
  this.coeff_climate_diversity = 0.25;
  this.coeff_climate_employment = 0.45;
  this.coeff_climate_borders = 0.65;

  this.coeff_welcoming_regime = 0.25;
  this.coeff_welcoming_diversity = 0.25;
  this.coeff_welcoming_refugees = 0.25;
  this.coeff_welcoming_employment = 0.25;
  this.coeff_welcoming_borders = 0.45;
  this.coeff_welcoming_family = 0.45;

  this.coeff_diversity_refugees = 1.0;

  this.addNeighbors = function(){
    // var n = [];
    for(var i = 0; i < nations.length; i++){
      if(nations[i] != this){
        if((this.loc.dist(nations[i].getLocation()) < (this.territory+nations[i].getTerritory())*this.neighbor_coeff) && this.neighbors.indexOf(nations[i]) == -1){
          this.neighbors.push(nations[i]);
        }
      }
    }
  }

  this.startAddingNeighbors = function(){
    this.addNeighbors();
    for(var i = 0; i < 4; i++){
      if(this.neighbors.length < 4-i){
        this.neighbor_coeff += 0.5;
        this.addNeighbors();
      }
    }
  }

  this.completeNeighbors = function(){
    for(var i = 0; i < this.neighbors.length; i++){//go through all neighbors
      var current_n = this.neighbors[i].neighbors;//look into each neighbor's own neighbors
      if(current_n.indexOf(this) == -1){ //if this neighbor doesn't contain a reference to this nation in its neighbors list
        current_n.push(this);//add it
      }
    }
  }


  this.update = function(){
    if(this.canExpand)
      this.expand();

      this.react();

      this.restrictValues();

      if(this.refugees.length > 0){
        var flux = parseInt(0.004*((this.naturalization+10)/20));
        this.refugees.splice(0, flux); //removing refugees
        this.population += flux; //adding citizens
      }

  }

  this.expand = function(){
    for(var i = 0; i < nations.length; i++){
      if(nations[i] != this){
        if((this.loc.dist(nations[i].getLocation()) > (this.territory+nations[i].getTerritory())*0.5) && this.territory < territory_max){
            this.territory++;
        }else{
          this.canExpand = false;
        }
      }
    }
  }

  this.increase = function(_policy){
    if(_policy == 'borders'){
      this.borders++;
      this.border_intensity = map(this.borders, -10, 10, 8, 0);
    }else if(_policy == 'subsidies')
      this.subsidies++;
    else if(_policy == 'family')
      this.family++;
    else
      this.naturalization++;
  }

  this.decrease = function(_policy){
    if(_policy == 'borders'){
      this.borders--;
      this.border_intensity = map(this.borders, -10, 10, 8, 0);
    }else if(_policy == 'subsidies')
      this.subsidies--;
    else if(_policy == 'family')
      this.family--;
    else
      this.naturalization--;
  }
}

Nation.prototype.listen = function(){
  if(createVector(mouseX, mouseY).dist(this.loc) < this.territory*0.5){
    interfaces[this.index].is_displayed = true;
    current_interface = interfaces[this.index];
    interface_displayed = true;
  }
}

Nation.prototype.display = function(){
  strokeWeight(this.border_intensity);
  stroke(0);
  fill(this.tint);
  push();
  translate(this.loc.x, this.loc.y);
  this.drawNation();

  stroke(0);
  strokeWeight(1);
  for(var i = 0; i < this.refugees.length*0.1; i++){
    point(this.refugees[i].x, this.refugees[i].y);
  }

  // noStroke();
  // fill(0);
  // textAlign(CENTER);
  // text(this.diversity, 0, 0);
  pop();

  strokeWeight(3);
  for(var i = 0; i < this.neighbors.length; i++){
    if(hasWallBetween(this, this.neighbors[i]))
      stroke(150, 0, 0, 20);
    else
      stroke(0, 20);

    line(this.loc.x, this.loc.y, this.neighbors[i].loc.x, this.neighbors[i].loc.y);
  }
}

Nation.prototype.drawNation = function(){
  var step = 360/this.sides;
  beginShape();
  var j = 0
  for(var i = 0; i < 360; i+=step){
    vertex(cos(radians(i))*this.territory*0.5*this.offset[j], sin(radians(i))*this.territory*0.5*this.offset[j]);
    j++;
  }
  endShape(CLOSE);

  //draw wealth
  noStroke();
  fill(255, 100);
  beginShape();
  var j = 0
  for(var i = 0; i < 360; i+=step){
    vertex(cos(radians(i))*this.territory*0.5*this.offset[j]*this.wealth_rad, sin(radians(i))*this.territory*0.5*this.offset[j]*this.wealth_rad);
    j++;
  }
  endShape(CLOSE);
}

Nation.prototype.react = function(){
  //this is where i change stuff based on refugee influx
  // this.wealth = ??? refugees increase wealth but they also increase unemployment
  this.adjustWealth();
  // this.employment = this is a function of original population, if it is below a certain threshold it
  this.adjustEmployment();
  // this.regime = this is the power decision of the gvt / top down initiative, it is slowe but has more impact (less diversity, more climate) vs  actually the power decision of the people / grassroots initiative (more diversity, could be less and could be more)
  this.adjustRegime();
  // this.climate = this is based on the number of refugees compare to the current wealth, on the employment
  this.adjustClimate();
  // this.appealing = function of open borders + function of subsidies + function of family + function of naturalization
  this.adjustWelcoming();
  // this.diversity = function of the number of refugees
  this.adjustDiversity();

  if(((this.wealth > -5 && this.climate < 0) || (this.refugees.length/this.population > 0.15)) && this.last_refugee != null)
    this.buildWall();

  if(this.wealth > 2 && this.climate > 1 && this.walls.length > 0 && (this.refugees.length/this.population < 0.15))
    this.tearDownWalls();

  this.tint = max(map(this.climate, -10, 10, 100, 255), 150);

}

Nation.prototype.adjustWealth = function(){
  this.wealth = this.start_wealth + (noise(millis()*0.00005)-0.45)*this.coeff_wealth_noise;

  if(this.subsidies > 0)
    this.wealth -= this.subsidies*this.coeff_wealth_subsidies*min(map(this.refugees.length, 0, 10000, 0, 1), 1);

  if(this.family > 0)
    this.wealth -= this.family*this.coeff_wealth_family*min(map(this.refugees.length, 0, 10000, 0, 1), 1);

    this.wealth_rad = map(this.wealth, -10, 10, 0, 1);
}

Nation.prototype.adjustEmployment = function(){
  var overpop = 1;
  if(this.refugees.length < this.population*0.1){
    overpop = 1;
  }else{
    overpop = -1;
  }
  this.employment = this.start_employment + this.wealth + (noise(millis()*0.0005)-0.25)*this.coeff_employment_noise + (this.refugees.length/this.population) * this.coeff_employment_refugees*overpop;
     //based on wealth, modulated by num of refugees
}

Nation.prototype.adjustRegime = function(){
  //TODO add naturalization as a factor
  //regime is a reflection of climate and welcoming?
  this.regime = this.start_regime + this.climate*this.coeff_regime_climate + this.wealth*this.coeff_regime_wealth - this.naturalization*this.coeff_regime_naturalization + (noise(millis()*0.001)-0.5)*0.2;
}

Nation.prototype.adjustClimate = function(){
  //climate is a function of employment (a lot of employment keeps people happy
    this.climate = this.start_climate + Math.floor(this.employment)*this.coeff_climate_employment + (noise(millis()*0.02)-0.35)*0.1 - this.borders*this.coeff_welcoming_borders + (this.refugees.length/this.population)*2;

}

Nation.prototype.adjustWelcoming = function(){
  //welcoming is a function of diversity + employment //REMOVE REGIME

  //maybe the welcoming should be handled internally by refugees? yes
  // this.welcoming += this.employment*this.coeff_welcoming_employment + this.regime*this.coeff_welcoming_regime + this.diversity*this.coeff_welcoming_diversity - this.refugees.length*this.coeff_welcoming_refugees;
  //TODO add borders as a factor
  if(this.climate > 0){
    this.welcoming = this.climate + this.diversity*this.coeff_welcoming_diversity + this.family*this.coeff_welcoming_family;
  }else{
    this.welcoming = this.climate - abs(this.diversity)*this.coeff_welcoming_diversity + this.family*this.coeff_welcoming_family;
  }
}

Nation.prototype.adjustDiversity = function(){
  //diversity is a straight up function of number of refugees
  this.diversity = this.start_diversity +(this.refugees.length/this.population)*5000;
  // console.log((this.refugees.length/this.population)*40);
}

Nation.prototype.buildWall = function(){
  var wallBuilt = false;
  for(var i = 0; i < walls.length; i++){
    if(walls[i].builder == this && walls[i].other == this.last_refugee.previous_nation)
      wallBuilt = true;
  }

  if(!wallBuilt){
    var neighbor_to_be_removed;
    for(var i = 0; i < this.last_refugee.previous_nation.neighbors.length; i++){
      if(this.last_refugee.previous_nation.neighbors[i] == this)
        neighbor_to_be_removed = i;
    }
    this.last_refugee.previous_nation.neighbors.splice(neighbor_to_be_removed, 1);
    var w = new Wall(this, this.last_refugee.previous_nation);
    walls.push(w);
    this.walls.push(w);
  }
}

Nation.prototype.tearDownWalls = function(){
  var to_be_removed = [];

  for(var i = 0; i < walls.length; i++){
    for(var j = 0; j < this.walls.length; j++){
      if(walls[i] == this.walls[j]){
        to_be_removed.push(i);

        if(this.neighbors.indexOf(walls[i].other) != -1)
          this.neighbors.push(walls[i].other);
      }
    }
  }

  //removing walls from the global array
  for(var i = 0; i < to_be_removed.length; i++){
    walls.splice(to_be_removed[i], 1);
  }

  //removing walls from local array
  this.walls = [];
}

Nation.prototype.restrictValues = function(){
  this.borders = constrain(this.borders, -10, 10);
  this.subsidies = constrain(this.subsidies, -10, 10);
  this.family = constrain(this.family, -10, 10);
  this.naturalization = constrain(this.naturalization, -10, 10);
  this.refugees.length = max(0, this.refugees.length);

  this.wealth = constrain(this.wealth, -10, 10);
  this.employment = constrain(this.employment, -10, 10);
  this.regime = constrain(this.regime, -10, 10);
  this.climate = constrain(this.climate, -10, 10);
  this.welcoming = constrain(this.welcoming, -10, 10);
  this.diversity = constrain(this.diversity, -10, 10);
}

Nation.prototype.getIndex = function(){
  return this.index;
}

Nation.prototype.getLocation = function(){
  return this.loc;
}

Nation.prototype.getTerritory = function(){
  return this.territory;
}
