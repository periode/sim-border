var Wall = function(_builder, _other){
  this.builder = _builder;
  this.other = _other;
  this.theta = p5.Vector.sub(this.builder.loc, this.other.loc).heading();
  this.w = 0.5;
  this.pos1 = createVector(cos(this.theta+this.w)*this.builder.territory*0.5, sin(this.theta+this.w)*this.builder.territory*0.5);
  this.pos2 = createVector(cos(this.theta-this.w)*this.builder.territory*0.5, sin(this.theta-this.w)*this.builder.territory*0.5);

}

Wall.prototype.display = function(){
  strokeWeight(10);
  strokeCap(SQUARE);
  stroke(150, 0, 0);
  push();
  translate(this.builder.loc.x, this.builder.loc.y);
  rotate(radians(this.theta)+PI);
  line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
  pop();
}
