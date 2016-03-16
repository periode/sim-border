var back;
var legend;
var memorial;
var translation;

var nations = [];
var nations_number = 10;
var territory_max;

var walls = [];

var refugees = [];
var refugee_index = 0;

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

//text
var text_button_back;
var text_button_legend;
var text_button_memorial;
var text_button_translation;

var text_legend_title;


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
    setInterval(addRefugee, 5000);
  }, 3000);

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

  translation = document.createElement('span');
  translation.style.position = 'absolute';
  translation.style.left = "1%";
  translation.style.top = '10%';
  translation.style.color = 'black';
  translation.style.background = 'rgba(255, 255, 255, 0.75)';
  translation.style.padding = '0.5%';
  translation.style.fontFamily = 'EdwardPro-Normal';
  translation.style.fontSize = '1.5em';
  translation.setAttribute('onclick', 'toggleTranslate()');
  document.body.appendChild(translation);

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

  stroke(160, 190, 253, 100);
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

function drawRoutes(){
  for(var i = 0; i < nations.length; i++){
    for(var j = 0; j < nations.length; j++){
      line(nations[i].getLocation().x, nations[i].getLocation().y, nations[j].getLocation().x, nations[j].getLocation().y);
    }
  }
}

function addRefugee(){
  // console.log('adding',refugee_index);
  var r = new Refugee(refugee_index);
  refugees.push(r);
  refugee_index++;
}

function setupStartingNation(){
  var max = width*0.2;
  var min = width*0.05;

  var territory = random(max, min);
  var position = createVector(width-(territory*0.5), height-(territory*0.5));

  var n = new Nation(position, territory, 0);
  nations.push(n);
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
  text(text_legend_title, width*0.5, height*0.15);
  //LEGENDE:
  // - countries
  // - routes
  // - refugees
  // - walls
  // - color means sth for countries?
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
    if(!(mouseX > width*0.1 && mouseX < width*0.9 && mouseY > height*0.1 && mouseY < height*0.8)){
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
      }else if(mouseX > width*0.5 && mouseX < width*0.8){
        current_interface.displaying_state = false;
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
  graves.push({pos: dead.position.copy(), size: Math.floor(random(2, 6))});
  memorial.innerHTML = text_button_memorial + deaths.toString();
}

function toggleTranslate(){
  if(language == 'fr')
    language = 'en';
  else
    language = 'fr';

  setupLanguage(language);
}

function setupLanguage(lang){
  console.log('current',language);
  if(lang == 'fr'){
    text_button_back = 'retour';
    text_button_legend = 'légende';
    text_button_memorial = 'morts en chemin: ';
    text_button_translation = 'english';

    text_legend_title = 'LÉGENDE';

    text_if_title = 'RÉPUBLIQUE NATIONALE';
    text_if_situation = 'SITUATION INTERNE';
    text_if_policies = 'POLITIQUES D\'IMMIGRATION';

    text_if_pol = 'Politique';
    text_if_soc = 'Économie';
    text_if_eco = 'Social';
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
    text_button_legend = 'legend';
    text_button_memorial = 'deaths on the way: ';
    text_button_translation = 'français';

    text_legend_title = 'LEGEND';

    text_if_title = 'NATIONAL REPUBLIC';
    text_if_situation = 'DOMESTIC SITUATION';
    text_if_policies = 'IMMIGRATION POLICIES';

    text_if_pol = 'Politics';
    text_if_soc = 'Economy';
    text_if_eco = 'Social';
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
  legend.innerHTML = text_button_legend;
  memorial.innerHTML = text_button_memorial+''+deaths.toString();
  translation.innerHTML = text_button_translation;
}

function keyPressed(){
  if(key == ' ')
  console.log('# of refugees',refugees.length);
}
