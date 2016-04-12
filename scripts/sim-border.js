var back;
var restart;
var legend;
var memorial;
var travel;
var settle;
var translation;

var nations = [];
var nations_number = 10;
var territory_max;

var walls = [];

var refugees = [];
var refugee_index = 0;
var refugee_add_interval = 3000;

var travelers = 0;
var settlers = 0;
var graves = [];
var deaths = 0;

var interfaces = [];
var interface_displayed = false;
var legend_displayed = false;
var current_interface;

var font;

var red;
var green;

var language;

//legend
var legend_nation_pos;
var legend_nation_territory;
var legend_nation_offset = [];
var legend_refugee_pos;
var legend_wall_pos;

//text
var text_button_back;
var text_button_restart;
var text_button_legend;
var text_button_memorial;
var text_button_settle;
var text_button_travel;
var text_button_translation;

var text_l_title;
var text_l_general;
var text_l_eco;
var text_l_pol;
var text_l_soc;

var text_if_title;
var text_if_situation;
var text_if_policies;

var text_if_pol;
var text_if_soc;
var text_if_eco;
var text_if_wealth;
var text_if_employment;
var text_if_regime;
var text_if_climate;
var text_if_welcoming;
var text_if_diversity;

var text_if_borders;
var text_if_subsidies;
var text_if_family;
var text_if_naturalization;

function preload(){
  font = loadFont('../sim-border/fonts/EdwardPro-ExtraLight.otf');
}

function setup(){
 var cnv = createCanvas(windowWidth, windowHeight);

 language = 'fr';

 territory_max = height*0.45;

 red = color(255, 0, 0);
 green = color(0, 255, 0);

 setupLegend();

 setupStartingNation();

 for(var i = 0; i < nations_number; i++){
    setupNations(i);
 }

 for(var i = 0; i < nations.length; i++){
    nations[i].startAddingNeighbors();
 }

 for(var i = 0; i < nations.length; i++){
   nations[i].completeNeighbors();
 }

 setupInterfaces();

  setTimeout(function(){
    setTimeout(addRefugee, refugee_add_interval);
  }, 3000);


  setupHTML();


   setupLanguage(language);
}

function update(){
  for(var i = 0; i < nations.length; i++){
    nations[i].update();
  }

  for(var i = 0; i < refugees.length; i++){
    if(!refugees[i].settled && refugees[i].alive){
      refugees[i].update();
    }

  }

  for(var i = 0; i < interfaces.length; i++){
    if(interfaces[i].is_displayed)
      interfaces[i].update();
  }
}

function draw(){
  textFont(font);
  drawBackground();

  update();

  for(var i = 0; i < nations.length; i++){
    nations[i].display();
  }

  for(var i = 0; i < walls.length; i++){
    walls[i].display();
  }

  for(var i = 0; i < refugees.length; i++){
    if(!refugees[i].settled && refugees[i].alive)
      refugees[i].display();
  }

  stroke(150, 0, 0);
  strokeWeight(1);
  for(var i = 0; i < graves.length; i++){
    line(graves[i].pos.x, graves[i].pos.y-graves[i].size, graves[i].pos.x, graves[i].pos.y+graves[i].size);
    line(graves[i].pos.x+3, graves[i].pos.y, graves[i].pos.x-graves[i].size, graves[i].pos.y);
  }

  for(var i = 0; i < interfaces.length; i++){
    if(interfaces[i].is_displayed)
      interfaces[i].display();
  }

  if(legend_displayed)
    displayLegend();

  drawForeground();
}

function drawBackground(){
  // background(160, 190, 253);
  background(255);

  stroke(160, 190, 253, 50);
  var i = 0;
  for(var x = 0; x < width; x += width/50){
    if(i % 4 == 0)
      strokeWeight(2);
    else
      strokeWeight(1);

    line(x, 0, x, height);
    i++;
  }

  var i = 0;
  for(var y = 0; y < height; y += height/50){
    if(i % 4 == 0)
      strokeWeight(2);
    else
      strokeWeight(1);

    line(0, y, width, y);
    i++;
  }

  stroke(0);
  noFill();
  rect(width*0.005, height*0.005, width*0.99, height*0.99);
}

function drawForeground(){
  rectMode(CORNER);
  strokeWeight(1);
  stroke(0);
  fill(0);
  rect(0, 0, width*0.005, height);
  rect((width*0.995), 0, width*0.005, height);

  rect(0, 0, width, height*0.005);
  rect(0, height*0.995, width, height*0.005);
}

function addRefugee(){
  var r = new Refugee(refugee_index);
  refugees.push(r);
  refugee_index++;
  travelers+=r.population;
  travel.innerHTML = text_button_travel+''+travelers.toString();

  refugee_add_interval = random(1500, 3000)*((cos(millis()*0.001)+1)*4);
  setTimeout(addRefugee, refugee_add_interval);
}

function setupStartingNation(){
  var max = width*0.2;
  var min = width*0.05;

  var territory = random(max, min);
  var position = createVector(width-(territory*0.5), height-(territory*0.5));

  var n = new Nation(position, territory, 0);
  nations.push(n);
}

function setupHTML(){
  back = document.createElement('a');
  back.style.left = "1%";
  back.style.top = '1%';
  back.style.position = 'absolute';
  back.style.color = 'black';
  back.style.padding = '0.5%';
  back.style.background = 'rgba(255, 255, 255, 0.75)';
  back.style.fontFamily = 'EdwardPro-Normal';
  back.style.fontSize = '1.5em';
  back.setAttribute('href', 'index.html');
  document.body.appendChild(back);

  legend = document.createElement('a');
  legend.style.left = "1%";
  legend.style.bottom = '1%';
  legend.style.position = 'absolute';
  legend.style.background = 'rgba(255, 255, 255, 0.75)';
  legend.style.color = 'black';
  legend.style.padding = '0.5%';
  legend.style.fontFamily = 'EdwardPro-Normal';
  legend.style.fontSize = '1.5em';
  legend.setAttribute('onclick', 'toggleLegend()');
  document.body.appendChild(legend);

  restart = document.createElement('a');
  restart.style.left = "1%";
  restart.style.top = '8.5%';
  restart.style.position = 'absolute';
  restart.style.color = 'black';
  restart.style.padding = '0.5%';
  restart.style.background = 'rgba(255, 255, 255, 0.75)';
  restart.style.fontFamily = 'EdwardPro-Normal';
  restart.style.fontSize = '1.5em';
  restart.setAttribute('href', 'sim-border.html');
  document.body.appendChild(restart);

  memorial = document.createElement('span');
  memorial.style.position = 'absolute';
  memorial.style.right = "1%";
  memorial.style.top = '1%';
  memorial.style.color = 'black';
  memorial.style.background = 'rgba(255, 255, 255, 0.75)';
  memorial.style.padding = '0.5%';
  memorial.style.fontFamily = 'EdwardPro-Normal';
  memorial.style.fontSize = '1.5em';
  document.body.appendChild(memorial);

  travel = document.createElement('span');
  travel.style.position = 'absolute';
  travel.style.right = "1%";
  travel.style.top = '8.5%';
  travel.style.color = 'black';
  travel.style.background = 'rgba(255, 255, 255, 0.75)';
  travel.style.padding = '0.5%';
  travel.style.fontFamily = 'EdwardPro-Normal';
  travel.style.fontSize = '1.5em';
  document.body.appendChild(travel);

  settle = document.createElement('span');
  settle.style.position = 'absolute';
  settle.style.right = "1%";
  settle.style.top = '16%';
  settle.style.color = 'black';
  settle.style.background = 'rgba(255, 255, 255, 0.75)';
  settle.style.padding = '0.5%';
  settle.style.fontFamily = 'EdwardPro-Normal';
  settle.style.fontSize = '1.5em';
  document.body.appendChild(settle);

  translation = document.createElement('span');
  translation.style.position = 'absolute';
  translation.style.left = "1%";
  translation.style.top = '16%';
  translation.style.color = 'black';
  translation.style.background = 'rgba(255, 255, 255, 0.75)';
  translation.style.padding = '0.5%';
  translation.style.fontFamily = 'EdwardPro-Normal';
  translation.style.fontSize = '1.5em';
  translation.setAttribute('onclick', 'toggleTranslate()');
  document.body.appendChild(translation);
}

function setupNations(index){
  var max = width*0.1;
  var min = width*0.05;

  var territory = random(max, min);
  var position = createVector(width*0.1+random((territory*0.5), width*0.9-(territory*0.5)), height*0.1+random((territory*0.5), height*0.9-(territory*0.5)));

  var close = false;
  for(var i = 0; i < nations.length; i++){
    if(nations[i].getLocation().dist(position) < (territory + nations[i].getTerritory())*0.5){
      close = true;
    }
  }
  if(!close){
    var n = new Nation(position, territory, i);
    nations.push(n);
  }
}

function setupInterfaces(){
  for(var i = 0; i < nations.length; i++){
    interfaces[i] = new Interface(nations[i], i);
  }
}

function remove(id){
  for(var i = 0; i < refugees.length; i++){
    if(refugees[i].identity == id){
      refugees.splice(i, 1);
    }
  }
}

function hasWallBetween(nation1, nation2){
  var hasWall = false;
  for(var i = 0; i < walls.length; i++){
    if((walls[i].builder == nation1 && walls[i].other == nation2) || (walls[i].other == nation1 && walls[i].builder == nation2))
      hasWall = true;
  }
  return hasWall;
}

function toggleLegend(){
  legend_displayed = !legend_displayed;
}

function displayLegend(){
  drawLegendFrame();
  drawLegendText();
}

function drawLegendFrame(){
  rectMode(CENTER);
  fill(255);
  stroke(0);
  rect(width*0.5, height*0.5, width*0.8, height*0.8);
}

function drawLegendText(){
  textAlign(CENTER);
  noStroke();
  fill(0);
  textSize(24);
  text(text_l_title, width*0.5, height*0.15);
  textSize(18);
  text(text_l_general, width*0.5, height*0.3);
  drawLegendNation();
  drawLegendRefugees();
  drawLegendWall();
  drawLegendGrave();
  textSize(16);
  text(text_l_eco, width*0.5, height*0.5);
  text('-', width*0.5, height*0.55);
  text(text_l_pol, width*0.5, height*0.6);
  text('-', width*0.5, height*0.65);
  text(text_l_soc, width*0.5, height*0.7);
}

function drawLegendNation(){
  push();
  stroke(0);
  fill(150);
  translate(legend_nation_pos.x, legend_nation_pos.y);
  var step = 360/8;
  beginShape();
  var j = 0
  for(var i = 0; i < 360; i+=step){
    vertex(cos(radians(i))*legend_nation_territory*0.5*legend_nation_offset[j], sin(radians(i))*legend_nation_territory*0.5*legend_nation_offset[j]);
    j++;
  }
  endShape(CLOSE);
  pop();
}

function drawLegendRefugees(){
  push();
  translate(legend_refugee_pos.x, legend_refugee_pos.y);
  fill(0);
  for(var i = 0; i < 10; i++){
    ellipse((noise(i, millis()*0.001)-0.5)*13, (noise(i+i, millis()*0.001)-0.5)*13, 3, 3);
  }
  pop();
}

function drawLegendWall(){
  push();
  translate(legend_wall_pos.x, legend_wall_pos.y);
  stroke(150, 0, 0);
  strokeWeight(8);
  strokeCap(SQUARE);
  line(-10, 10, 10, -10);
  pop();
}

function drawLegendGrave(){
  push();
  translate(legend_grave_pos.x, legend_grave_pos.y);
  stroke(100, 0, 0);
  strokeWeight(1);
  strokeCap(SQUARE);
  line(0, 6, 0, -2);
  line(-2, 0, 3, 0);
  pop();
}

function mouseReleased(){
  if(legend_displayed){
    if(!(mouseX > width*0.1 && mouseX < width*0.9 && mouseY > height*0.1 && mouseY < height*0.8)){
      legend_displayed = false;
    }
  }

  if(!interface_displayed){
    for(var i = 0; i < nations.length; i++){
      nations[i].listen();
    }
  }else{
    //QUIT INTERFACE
    if(!(mouseX > width*0.15 && mouseX < width*0.85 && mouseY > height*0.1 && mouseY < height*0.8)){
      for(var i = 0; i < interfaces.length; i++){
        interfaces[i].is_displayed = false;
      }

      current_interface = null;
      interface_displayed = false;
    }

    //SWITCH BETWEEN STATE AND POLICY
    if(mouseY > height*0.1 && mouseY < height*0.3){
      if(mouseX > width*0.2 && mouseX < width*0.5){
        current_interface.displaying_state = true;
        if(current_interface.lerp_dir == -1)
          current_interface.lerp_dir = 1;
      }else if(mouseX > width*0.5 && mouseX < width*0.8){
        current_interface.displaying_state = false;
        if(current_interface.lerp_dir == 1)
          current_interface.lerp_dir = -1;
      }
    }

    //CHECK IF YOU'RE HITTING A BUTTON
    if(current_interface !=  null){
      for(var j = 0; j < current_interface.buttons.length; j++){
        var b = current_interface.buttons[j];
        if(mouseX > b.pos.x - b.w && mouseX < b.pos.x + b.w && mouseY > b.pos.y - b.h && mouseY < b.pos.y + b.h){
          b.handle();
        }
      }
    }
  }
}

function acknowledgeDeath(dead){
  deaths+= dead.population;
  travelers -= dead.population
  graves.push({pos: dead.position.copy(), size: Math.floor(random(2, 6))});
  memorial.innerHTML = text_button_memorial + deaths.toString();
  travel.innerHTML = text_button_travel + travelers.toString();
}

function toggleTranslate(){
  if(language == 'fr')
    language = 'en';
  else
    language = 'fr';

  setupLanguage(language);
}

function setupLegend(){
  for(var i = 0; i < 8; i++){
    legend_nation_offset[i] = 1+random(-0.2, 0.2);
  }

  legend_nation_pos = createVector(width*0.385, height*0.365);
  legend_nation_territory = width*0.04;

  legend_refugee_pos = createVector(width*0.525, height*0.365);
  legend_wall_pos = createVector(width*0.655, height*0.365);
  legend_grave_pos = createVector(width*0.535, height*0.365);
}

function setupLanguage(lang){
  if(lang == 'fr'){
    text_button_back = 'retour';
    text_button_restart = 'recommencer';
    text_button_legend = 'légende';
    text_button_memorial = 'morts: ';
    text_button_settle = 'arrivés: ';
    text_button_travel = 'en route: ';
    text_button_translation = 'english';

    text_l_title = 'LÉGENDE';
    text_l_general = "Chaque pays peut accueillir des réfugiés ou construire un mur.";
    text_l_eco = "La richesse et le taux d'emploi d'un pays dépendent en partie des allocations allouées aux réfugiées.\nCette situation économique est représentée par la surface de la zone gris clair à l'intérieur du pays.";
    text_l_pol = "L'autorité d'un régime et le climat politique d'un pays dépendent en partie de l'ouverture des frontières et de la facilité de naturalisation.\nCette situation politique est représentée par la teinte de gris du pays.";
    text_l_soc = "La tolérance envers autrui et la diversité de population dépendent en partie du climat politique et du rassemblement des familles.\nCette situation sociale est représentée par l'épaisseur des frontières.";

    text_if_title = 'ÉTAT SOUVERAIN';
    text_if_situation = 'SITUATION INTERNE';
    text_if_policies = 'POLITIQUES D\'IMMIGRATION';

    text_if_pol = 'POLITIQUE';
    text_if_soc = 'ÉCONOMIE';
    text_if_eco = 'SOCIAL';
    text_if_wealth = 'Richesse nationale';
    text_if_employment = 'Taux d\'emploi';
    text_if_regime = 'Stabilité politique';
    text_if_climate = 'Climat social';
    text_if_welcoming = 'Tolérance envers autrui';
    text_if_diversity = 'Diversité de la population';

    text_if_borders = 'Ouverture des frontières';
    text_if_subsidies = 'Allocations';
    text_if_family = 'Réunion familiale';
    text_if_naturalization = 'Processus de nationalisation';
  }else if(lang == 'en'){
    text_button_back = 'back';
    text_button_restart = 'restart';
    text_button_legend = 'legend';
    text_button_memorial = 'dead: ';
    text_button_settle = 'settled: ';
    text_button_travel = 'on the way: ';
    text_button_translation = 'français';

    text_l_title = 'LEGEND';
    text_l_general = "Each country can welcome refugees or build walls.";
    text_l_eco = "Wealth and employment depend partly on the amount of subsidies allocated to incoming refugees.\n Wealth is represented by the light gray area within the country.";
    text_l_pol = "Regime stability and political climate are affected by the openness of borders and the naturalization process.\n Political climate is represented by the shade of gray of the country's color.";
    text_l_soc = "Tolerance to others and diversity are based on the number of refugees settled and the ease for families to reunite.\n Social situation is represented by the thickness of its borders.";

    text_if_title = 'SOVEREIGN STATE';
    text_if_situation = 'DOMESTIC SITUATION';
    text_if_policies = 'IMMIGRATION POLICIES';

    text_if_pol = 'POLITICS';
    text_if_soc = 'ECONOMY';
    text_if_eco = 'SOCIAL';
    text_if_wealth = 'Domestic wealth';
    text_if_employment = 'Employment rate';
    text_if_regime = 'Political stability';
    text_if_climate = 'Social climate';
    text_if_welcoming = 'Tolerance to others';
    text_if_diversity = 'Population diversity';

    text_if_borders = 'Border openness';
    text_if_subsidies = 'Subsidies';
    text_if_family = 'Family reunions';
    text_if_naturalization = 'Naturalization process';
  }

  back.innerHTML = text_button_back;
  restart.innerHTML = text_button_restart;
  legend.innerHTML = text_button_legend;
  memorial.innerHTML = text_button_memorial+''+deaths.toString();
  travel.innerHTML = text_button_travel+''+travelers.toString();
  settle.innerHTML = text_button_settle+''+settlers.toString();
  translation.innerHTML = text_button_translation;
}

function keyPressed(){
  if(key == ' ')
  console.log('# of refugees',refugees.length);
}
