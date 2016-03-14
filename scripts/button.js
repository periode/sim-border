var Button = function(_policy, _name, _act, _pos, _parent, _width, _height){
  this.policy = _policy;
  this.name = _name;
  this.act = _act //inc, dec, toggle
  this.pos = _pos;
  this.parent = _parent;
  this.w = _width;
  this.h = _height;


  this.display = function(){
    push();
    translate(this.pos.x, this.pos.y);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.name, 0, 0);

    rectMode(CENTER);
    stroke(0);
    noFill();
    rect(0, 0, this.w,this.h);
    pop();
  }

  this.handle = function(){
    if(this.act == 'inc'){
        this.parent.increase(this.policy);
    }

    if(this.act == 'dec'){
      this.parent.decrease(this.policy);
    }
  }
}
