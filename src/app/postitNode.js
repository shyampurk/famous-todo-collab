var Node = require('famous/core/Node');

function PostitNode(postitObj) {

    //Call parent constructor
    Node.call(this);

    this.frontNode = this.addChild();
    this.backNode = this.addChild();

    this.postitData = postitObj;

    this.position = new Position(this);

}

// Extend the prototype
PostitNode.prototype = Object.create(Node.prototype);


PostitNode.prototype.move = function move(){


}

PostitNode.prototype.resize = function resize(){


}

PostitNode.prototype.update = function update(postitObj){


}
