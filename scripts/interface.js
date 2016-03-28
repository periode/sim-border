var Interface = function(_nation, _index){
  this.nation = _nation;
  this.index = _index;
  this.pos = createVector(width*0.5, height*0.5);
  this.w = width*0.7;
  this.h = height*0.8;

  this.stroke_col =  0;
  this.fill_col = 255;
  this.alpha = 255;

  this.is_displayed = false;
  this.displaying_state = true;

  var button_left = -width*0.1+width*0.5;
  var button_right = width*0.1+width*0.5;
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
    text(text_if_title, 0, -height*0.35);

    textSize(24);
    fill(this.stroke_col, this.alpha);
    // text('STATE OF AFFAIRS', -width*0.2, -height*0.3);
    text(text_if_situation, -width*0.2, -height*0.3);
    fill(this.stroke_col, this.alpha*0.25*(cos(millis()*0.0035)+1)+30);
    // text('POLICIES', width*0.2, -height*0.3);
    text(text_if_policies, width*0.2, -height*0.3);


    textSize(14);
    fill(this.stroke_col, this.alpha);
    textAlign(CENTER);
    textSize(10);
    text(text_if_soc, 0, -height*0.225);
    text(text_if_pol, 0, 0);
    text(text_if_eco, 0, height*0.2);


    textSize(14);
    text(text_if_wealth+': '+parseInt(this.nation.wealth), 0, -height*0.175);
    text(text_if_employment+': '+parseInt(this.nation.employment), 0, -height*0.1);

    text(text_if_regime+': '+parseInt(this.nation.regime), 0, height*0.05);
    text(text_if_climate+': '+parseInt(this.nation.climate), 0, height*0.125);

    text(text_if_welcoming+': '+parseInt(this.nation.welcoming), 0, height*0.25);
    text(text_if_diversity+': '+parseInt(this.nation.diversity), 0, height*0.325);


    strokeWeight(2);
    push();

    stroke(lerpColor(red, green, map(this.nation.wealth, -10, 10, 0, 1)));
    line(0, -height*0.15, map(this.nation.wealth, -10, 10, -width*0.2, width*0.2), -height*0.15);
    line(0, -height*0.14, 0, -height*0.16);
    stroke(lerpColor(red, green, map(this.nation.employment, -10, 10, 0, 1)));
    line(0, -height*0.075, map(this.nation.employment, -10, 10, -width*0.2, width*0.2), -height*0.075);
    line(0, -height*0.065, 0, -height*0.085);

    stroke(lerpColor(red, green, map(this.nation.regime, -10, 10, 0, 1)));
    line(0, height*0.075, map(this.nation.regime, -10, 10, -width*0.2, width*0.2), height*0.075);
    line(0, height*0.065, 0, height*0.085);
    stroke(lerpColor(red, green, map(this.nation.climate, -10, 10, 0, 1)));
    line(0, height*0.15, map(this.nation.climate, -10, 10, -width*0.2, width*0.2), height*0.15);
    line(0, height*0.14, 0, height*0.16);

    stroke(lerpColor(red, green, map(this.nation.welcoming, -10, 10, 0, 1)));
    line(0, height*0.275, map(this.nation.welcoming, -10, 10, -width*0.2, width*0.2), height*0.275);
    line(0, height*0.265, 0, height*0.285);
    stroke(lerpColor(red, green, map(this.nation.diversity, -10, 10, 0, 1)));
    line(0, height*0.35, map(this.nation.diversity, -10, 10, -width*0.2, width*0.2), height*0.35);
    line(0, height*0.36, 0, height*0.34);

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
    text(text_if_title, 0, -height*0.35);

    textSize(24);
    fill(this.stroke_col, this.alpha*0.25*(cos(millis()*0.0035)+1)+30);
    // text('STATE OF AFFAIRS', -width*0.2, -height*0.3);
    text(text_if_situation, -width*0.2, -height*0.3);
    fill(this.stroke_col, this.alpha);
    // text('POLICIES', width*0.2, -height*0.3);
    text(text_if_policies, width*0.2, -height*0.3);

    textAlign(CENTER);
    textSize(14);
    fill(this.stroke_col, this.alpha);
    //policies
    //open borders ++ or --  > has a direct impact on inclusivity but makes employment go down and if its too low, then more violence
    text(text_if_borders, 0, -height*0.1);
    text(this.nation.borders, 0, -height*0.05);
    //give allocations > has an impact on wealth, but is a factor for having refugees come over
    text(text_if_subsidies, 0, -height*0);
    text(this.nation.subsidies, 0, height*0.05);
    //family reunion possibility > if inclusivity is high enough, then it makes for a happier country, otherwise the opposite
    text(text_if_family, 0, height*0.1);
    text(this.nation.family, 0, height*0.15);
    //possiblity to become a citizen > this should be a great incentive
    text(text_if_naturalization, 0, height*0.2);
    text(this.nation.naturalization, 0, height*0.25);

    //if there is too much violence, then migrants get killed
  }
}
