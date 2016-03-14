var Interface = function(_nation, _index){
  this.nation = _nation;
  this.index = _index;
  this.pos = createVector(width*0.5, height*0.5);
  this.w = width*0.8;
  this.h = height*0.8;

  this.stroke_col =  0;
  this.fill_col = 255;
  this.alpha = 255;

  this.is_displayed = false;
  this.displaying_state = true;

  var button_left = -width*0.3+width*0.5;
  var button_right = width*0.3+width*0.5;
  var button_top = -height*0.1+height*0.5;
  var button_middle_top = 0+height*0.5;
  var button_middle_bottom = height*0.1+height*0.5;
  var button_bottom = height*0.2+height*0.5;
  var button_w = width*0.02;
  var button_h = width*0.02;

  this.buttons = [];
  this.buttons[0] = new Button('borders', '-', 'dec', createVector(button_left, button_top), this.nation, button_w, button_h);
  this.buttons[1] = new Button('borders', '+', 'inc', createVector(button_right, button_top), this.nation, button_w, button_h);
  this.buttons[2] = new Button('subsidies', '-', 'dec', createVector(button_left, button_middle_top), this.nation, button_w, button_h);
  this.buttons[3] = new Button('subsidies', '+', 'inc', createVector(button_right, button_middle_top), this.nation, button_w, button_h);
  this.buttons[4] = new Button('family', '-', 'dec', createVector(button_left, button_middle_bottom), this.nation, button_w, button_h);
  this.buttons[5] = new Button('family', '+', 'inc', createVector(button_right, button_middle_bottom), this.nation, button_w, button_h);
  this.buttons[6] = new Button('naturalization', '-', 'dec', createVector(button_left, button_bottom), this.nation, button_w, button_h);
  this.buttons[7] = new Button('naturalization', '+', 'inc', createVector(button_right, button_bottom), this.nation, button_w, button_h);

  this.update = function(){

  }

  this.display = function(){
    rectMode(CENTER);
    strokeWeight(1);
    stroke(this.stroke_col, this.alpha);
    fill(this.fill_col, this.alpha*0.95);

    push();
    translate(this.pos.x, this.pos.y);
    rect(0, 0, this.w, this.h);

    noStroke();
    if(this.displaying_state){
      this.displayState();
    }else{
      this.displayPolicy();
    }
    pop();
  }

  this.displayState = function(){
    textAlign(CENTER);
    fill(this.stroke_col);
    text('RÉPUBLIQUE NATIONALE', 0, -height*0.35);

    textSize(24);
    fill(this.stroke_col, this.alpha);
    // text('STATE OF AFFAIRS', -width*0.2, -height*0.3);
    text('SITUATION NATIONALE', -width*0.2, -height*0.3);
    fill(this.stroke_col, this.alpha*0.25);
    // text('POLICIES', width*0.2, -height*0.3);
    text('POLITIQUES', width*0.2, -height*0.3);


    textSize(14);
    fill(this.stroke_col, this.alpha);
    textAlign(CENTER);
    // text('ECONOMY', 0, -height*0.25);
    // text('POLITICS', 0, 0);
    // text('SOCIETY', 0, height*0.25);
    text('ÉCONOMIE', 0, -height*0.25);
    text('POLITIQUE', 0, 0);
    text('SOCIÉTÉ', 0, height*0.25);

    textAlign(LEFT);
    // text('current wealth:'+this.nation.wealth, -width*0.2, -height*0.2);
    // text('current employment:'+this.nation.employment, -width*0.2, -height*0.15);
    //
    //
    // text('current regime:'+this.nation.regime, -width*0.2, height*0.05);
    // text('current structure:'+this.nation.structure, -width*0.2, height*0.1);
    //
    //
    // text('current tolerance:'+this.nation.welcoming, -width*0.2, height*0.3);
    // text('current diversity:'+this.nation.diversity, -width*0.2, height*0.35);
    text('richesse nationale: '+parseInt(this.nation.wealth), -width*0.2, -height*0.2);
    text('taux d\'emploi: '+parseInt(this.nation.employment), -width*0.2, -height*0.15);

    text('système démocratique: '+parseInt(this.nation.regime), -width*0.2, height*0.05);
    text('climat politique: '+parseInt(this.nation.climate), -width*0.2, height*0.1);

    text('tolérance à autrui: '+parseInt(this.nation.welcoming), -width*0.2, height*0.3);
    text('diversité de population: '+parseInt(this.nation.diversity), -width*0.2, height*0.35);


    strokeWeight(2);
    push();
    translate(width*0.2, -height*0.01);
    stroke(lerpColor(red, green, map(this.nation.wealth, -10, 10, 0, 1)));
    line(-width*0.2, -height*0.2, map(this.nation.wealth, -10, 10, -width*0.2, width*0.15), -height*0.2);
    stroke(lerpColor(red, green, map(this.nation.employment, -10, 10, 0, 1)));
    line(-width*0.2, -height*0.15, map(this.nation.employment, -10, 10, -width*0.2, width*0.15), -height*0.15);
    stroke(lerpColor(red, green, map(this.nation.regime, -10, 10, 0, 1)));
    line(-width*0.2, height*0.05, map(this.nation.regime, -10, 10, -width*0.2, width*0.15), height*0.05);
    stroke(lerpColor(red, green, map(this.nation.climate, -10, 10, 0, 1)));
    line(-width*0.2, height*0.1, map(this.nation.climate, -10, 10, -width*0.2, width*0.15), height*0.1);
    stroke(lerpColor(red, green, map(this.nation.welcoming, -10, 10, 0, 1)));
    line(-width*0.2, height*0.3, map(this.nation.welcoming, -10, 10, -width*0.2, width*0.15), height*0.3);
    stroke(lerpColor(red, green, map(this.nation.diversity, -10, 10, 0, 1)));
    line(-width*0.2, height*0.35, map(this.nation.diversity, -10, 10, -width*0.2, width*0.15), height*0.35);
    pop();
  }

  this.displayPolicy = function(){

    pop();
    for(var i = 0; i < this.buttons.length; i++){
      this.buttons[i].display();
    }
    push();
    translate(this.pos.x, this.pos.y);

    textAlign(CENTER);
    noStroke();
    fill(this.stroke_col);
    text('NATION '+this.nation.name, 0, -height*0.35);

    textSize(24);
    fill(this.stroke_col, this.alpha*0.25);
    // text('STATE OF AFFAIRS', -width*0.2, -height*0.3);
    text('SITUATION NATIONALE', -width*0.2, -height*0.3);
    fill(this.stroke_col, this.alpha);
    // text('POLICIES', width*0.2, -height*0.3);
    text('POLITIQUES', width*0.2, -height*0.3);

    textAlign(CENTER);
    textSize(14);
    fill(this.stroke_col, this.alpha);
    //policies
    //open borders ++ or --  > has a direct impact on inclusivity but makes employment go down and if its too low, then more violence
    // text('BORDER CONTROL', 0, -height*0.1);
    text('OUVERTURE DES FRONTIÈRES', 0, -height*0.1);
    text(this.nation.borders, 0, -height*0.05);
    //give allocations > has an impact on wealth, but is a factor for having refugees come over
    // text('STATE SUBSIDIES', 0, -height*0);
    text('ALLOCATIONS D\'ÉTATS', 0, -height*0);
    text(this.nation.subsidies, 0, height*0.05);
    //family reunion possibility > if inclusivity is high enough, then it makes for a happier country, otherwise the opposite
    // text('FAMILY IMMIGRATION POLICIES', 0, height*0.1);
    text('RÉUNIONS FAMILIALES', 0, height*0.1);
    text(this.nation.family, 0, height*0.15);
    //possiblity to become a citizen > this should be a great incentive
    // text('NATURALIZATION PROCESS', 0, height*0.2);
    text('PROCESSUS DE NATURALISATION', 0, height*0.2);
    text(this.nation.naturalization, 0, height*0.25);

    //if there is too much violence, then migrants get killed
  }
}
