/*global collideRectRect, fill, noFill, stroke, rect */


//helper class to define the boundaries of a rectangle
class QuadBoundary{
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(person){
    return (person.x > this.x && person.x < this.x + this.w && person.y > this.y && person.y < this.y + this.h);
  }
}

//data structure for efficiently containing and managing a large set of points (in this case person objects)
class QuadTree{
  constructor(boundary, limit){
    this.boundary = boundary;
    this.limit = limit;
    this.people = [];
    this.divided = false;
  }
  //inserts a person into the quad tree data structure
  insert(person){
    //if person is not within the current QuadTree objects boundary, reject it.
    if (!this.boundary.contains(person)){
      return;
    }
    //if the quadtree has capacity, add the person to it.
    if (this.people.length < this.limit){
      this.people.push(person);
    }
    //if not, create 4 new QuadTrees (if not alredy divided), and attempt to insert the person in to each of them
    else{
      if (!this.divided){
     
        let upperLeftBoundary = new QuadBoundary(this.boundary.x, this.boundary.y, this.boundary.w/2, this.boundary.h/2);
        let upperRightBoundary = new QuadBoundary(this.boundary.x+this.boundary.w/2, this.boundary.y, this.boundary.w/2, this.boundary.h/2);
        let lowerLeftBoundary = new QuadBoundary(this.boundary.x, this.boundary.y+this.boundary.h/2, this.boundary.w/2, this.boundary.h/2);
        let lowerRightBoundary = new QuadBoundary(this.boundary.x+this.boundary.w/2, this.boundary.y+this.boundary.h/2, this.boundary.w/2, this.boundary.h/2);
        this.upperLeft = new QuadTree(upperLeftBoundary, this.limit);
        this.upperRight = new QuadTree(upperRightBoundary, this.limit);
        this.lowerLeft = new QuadTree(lowerLeftBoundary, this.limit);
        this.lowerRight = new QuadTree(lowerRightBoundary, this.limit);
        this.divided = true;
      }
      this.upperLeft.insert(person);
      this.upperRight.insert(person);
      this.lowerLeft.insert(person);
      this.lowerRight.insert(person);
    }
  }
  getPointsInRange(boundary, points=[]){
    //if the current boundary intersects with the desired search range, we can search it more thouroughly
    if (collideRectRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h, boundary.x, boundary.y, boundary.w, boundary.h)){
      //first check all of its points to see if they are in the range
      for (let i = 0; i < this.people.length; i ++){
        if (boundary.contains(this.people[i])){
          points.push(this.people[i]);
        }
      }
      //next check all of the sub quad trees within the current quad tree in the same fashion
      if (this.divided){
        this.upperLeft.getPointsInRange(boundary, points);
        this.upperRight.getPointsInRange(boundary, points);
        this.lowerLeft.getPointsInRange(boundary, points);
        this.lowerRight.getPointsInRange(boundary, points);
      }
      
    }
    return points;
  }
  draw(){
    noFill();
    stroke('white');
   // console.log(this.boundary);
    rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    if (this.divided){
      this.upperLeft.draw();
      this.upperRight.draw();
      this.lowerLeft.draw();
      this.lowerRight.draw();
    }
    

    
  }
  
}