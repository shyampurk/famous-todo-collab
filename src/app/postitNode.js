var Node = require('famous/core/Node');

var DOMElement = require('famous/dom-renderables/DOMElement');

var Position = require('famous/components/Position');
var Size = require('famous/components/Size');
var Transitionable = require('famous/transitions/Transitionable');

var headerContent = '<div> \
                    <div style="float:left;"> \
                      <span class="postitheader">Title #1</span> \
                    </div> \
                    <div style="float:right;padding-right:5px"> \
                      <span><img src="images/edit-icon.ico" height="20" width="20"/></span> \
                      <span><img src="images/flip-icon.png" height="20" width="20"/></span> \
                      <span><img src="images/trash-icon.png" height="20" width="20"/></span> \
                    </div> \
                  </div> \
                  ';

var postitContent = '<div> \
                    <div style="overflow:hidden;"> \
                      <textarea id="text" style="height:200px;resize:none;background-color:rgb(246, 240, 198);border:none;"></textarea> \
                    </div> \
                  </div> \
                  ';

function PostitNode(node,obj,options) {

    var that = this;
    //Call parent constructor
    this.node = node

    this.opacityTransitionable = new Transitionable(0);
    this.node.setOpacity(this.opacityTransitionable.get());


    this.postWidth = options.width;
    this.postHeight = options.height;

    this.frontNode = this.node.addChild();
    //this.backNode = this.node.addChild();

    this.contentNode = this.frontNode.addChild();
    this.headerNode = this.frontNode.addChild();

    this.postitData = obj;

    this.postitPosition = new Position(this.node);
    this.postitPosition.set(0,0,0);


    //this.position = new Position(this);
    //this.size     = new Size(this);

    this.node.setSizeMode(1,1,1);
    this.node.setAbsoluteSize(this.postWidth,this.postHeight,0);
    //this.node.setPosition(20,20);

    this.headerNode.setSizeMode('relative','relative','relative')
      .setProportionalSize(1,0.2)
      .setPosition(0,0);

    this.contentNode.setSizeMode('relative','relative','relative')
        .setProportionalSize(1,1)
        .setPosition(0,0);


    this.el = new DOMElement(node);
    this.el.setProperty('background-color','rgb(240, 232, 174)');
    this.el.setProperty('font-family' ,'"Reenie Beanie",arial,sans-serif');
    this.el.setProperty('font-size','140%');
    this.el.setProperty('box-shadow','5px 5px 7px rgba(33,33,33,.7)');



    this.elheader = new DOMElement(this.headerNode);
    this.elheader.setProperty('background-color','rgb(240, 232, 174)');
    this.elheader.setProperty('font-family' ,'"Reenie Beanie",arial,sans-serif');
    this.elheader.setProperty('font-size','180%');
    this.elheader.setProperty('font-weight','bold');
    this.elheader.setProperty('line-height','1');
    this.elheader.setProperty('padding-left','5px');
    this.elheader.setProperty('padding-right','5px');
    this.elheader.setContent(headerContent);

    this.elcontent = new DOMElement(this.contentNode);
    this.elcontent.setProperty('background-color','rgb(246, 240, 198)');
    this.elcontent.setProperty('font-family' ,'"Reenie Beanie",arial,sans-serif');
    this.elcontent.setProperty('font-size','140%');
    this.elcontent.setProperty('padding-left','5px');
    this.elcontent.setProperty('padding-top', (options.height * 0.2) + 'px');
    //this.elcontent.setProperty('padding-top','15px');
    this.elcontent.setContent(postitContent);


    var id = this.node.addComponent({
        onUpdate: function(time) {
            // Every frame, query transitionable state and set node opacity accordingly
            var newOpacity = that.opacityTransitionable.get();
            that.node.setOpacity(newOpacity);
            if (that.opacityTransitionable.isActive()) that.node.requestUpdate(id);
        }
    });

    this.node.requestUpdate(id);



}

// Extend the prototype
PostitNode.prototype = Object.create(Node.prototype);

PostitNode.prototype.display = function display(){

  this.baseDIV = new DOMElement(this, {
     id: 'postit',
     properties:{
       'background-color':'#ffc',
       'z-index' : 5
     }
  });



}

PostitNode.prototype.getNode = function getNode(){

  return this.node;

}

PostitNode.prototype.place = function place(xpos,ypos,zpos){

  this.postitPosition.set(xpos,ypos,zpos);

  this.opacityTransitionable.set(1, { duration: 500 });
}


PostitNode.prototype.shift = function shift(xpos,ypos,zpos){

  this.postitPosition.set(xpos,ypos,zpos,{duration : 500});

}


PostitNode.prototype.move = function move(){


}

PostitNode.prototype.resize = function resize(){


}

PostitNode.prototype.update = function update(postitObj){


}

module.exports = PostitNode;
