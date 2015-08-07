var Node = require('famous/core/Node');

var DOMElement = require('famous/dom-renderables/DOMElement');

var Position = require('famous/components/Position');
var Size = require('famous/components/Size');
var Rotation = require('famous/components/Rotation');
var GestureHandler = require('famous/components/GestureHandler');

var Transitionable = require('famous/transitions/Transitionable');

var headerContentPre = '<div' ;
var headerContentPost = '> \
                    <div class="title" style="float:left;width:50%;"> \
                      <textarea readonly style="height:35px;width:100%;resize:none;background-color:rgb(240, 232, 174);border:none;overflow:hidden;" maxlength="11"></textarea> \
                    </div> \
                    <div class="icons" style="float:right;padding-right:5px;"> \
                      <span><img class="edit" src="images/edit-icon.ico" height="20" width="20"/></span> \
                      <span><img class="flip" src="images/flip-icon.png" height="20" width="20"/></span> \
                      <span><img class="delete" src="images/trash-icon.png" height="20" width="20"/></span> \
                    </div> \
                  </div> \
                  ';

var postitContent = '<div> \
                    <div class="content" style="overflow:hidden;"> \
                      <textarea readonly style="height:200px;resize:none;background-color:rgb(246, 240, 198);border:none;"></textarea> \
                    </div> \
                  </div> \
                  ';

function PostitNode(node,obj,options,app) {

    var that = this;
    //Call parent constructor
    this.node = node
    this.parent = app;

    this.backNode = this.node.addChild();

    this.postWidth = options.width;
    this.postHeight = options.height;
    this.seqId = obj.postitID;


    this.node.setSizeMode(1,1,1);
    this.node.setAbsoluteSize(this.postWidth,this.postHeight,5);

    this.node.setOrigin(0.5,0.5,0)
    this.rotation = new Rotation(this.node);
    this.rotation.set(0,0,0);

    this.postitPosition = new Position(this.node);
    this.postitPosition.set(0,0,500);


    this.opacityTransitionable = new Transitionable(0);
    this.node.setOpacity(this.opacityTransitionable.get());



    this.frontNode = this.node.addChild();
    //this.backNode = this.node.addChild();
    /*
    this.wontNode = this.node.addChild();
    this.shakNode = this.node.addChild();
    this.dakNode = this.node.addChild();
    this.lakNode = this.node.addChild();
*/

    this.backNode.setSizeMode('absolute', 'absolute')
          .setAbsoluteSize(this.postWidth, this.postHeight)
          .setPosition(0,0,0)
          .setOrigin(0.5,0.5,0)
          .setRotation(0,Math.PI,0);

    this.cyanDIV = new DOMElement(this.backNode, {
        id : "Postit-Back"+this.seqId,
        content : '<div> \
                    <div> \
                      <span style="font-weight:bold;"> Creator : </span> \
                      <span> demo </span> </br> \
                    </div> \
                    </br> \
                    <div> \
                      <span style="font-weight:bold;"> Creation Date/Time : </span> </br> \
                      <span>' + obj.creationDate + '</span> \
                    </div> \
                  </div>',
        properties:{
          'background-color':'rgb(189, 239, 239)',
          'padding' : '5px 5px 5px 5px'
        }
      });

    this.cyanDIV.setProperty('font-family' ,'"Lato",arial,sans-serif');
    this.cyanDIV.setProperty('font-size','80%');

    this.contentNode = this.frontNode.addChild();
    this.headerNode = this.frontNode.addChild();

    this.postitData = obj;


    this.headerNode.setSizeMode('relative','relative','relative')
      .setProportionalSize(1,0.15,1)
      .setPosition(0,0,10);

    this.contentNode.setSizeMode('relative','relative','relative')
        .setProportionalSize(1,1)
        .setPosition(0,0,5);


    this.el = new DOMElement(node);
    this.el.setProperty('background-color','rgb(240, 232, 174)');
    this.el.setProperty('font-family' ,'"Reenie Beanie",arial,sans-serif');
    this.el.setProperty('font-size','140%');
    this.el.setProperty('box-shadow','5px 5px 7px rgba(33,33,33,.7)');



    this.elheader = new DOMElement(this.headerNode);
    this.elheader.setAttribute("id","Postit-Header" + this.seqId);
    this.elheader.setProperty('background-color','rgb(240, 232, 174)');
    this.elheader.setProperty('font-family' ,'"Reenie Beanie",arial,sans-serif');
    this.elheader.setProperty('font-size','160%');
    this.elheader.setProperty('font-weight','bold');
    this.elheader.setProperty('line-height','1');
    this.elheader.setProperty('padding-left','5px');
    this.elheader.setProperty('padding-right','5px');
    this.elheader.setContent(headerContentPre +  headerContentPost);
    this.headerRef = null;

    this.elcontent = new DOMElement(this.contentNode);
    this.elcontent.setAttribute("id","Postit-Content" + this.seqId);
    this.elcontent.setProperty('background-color','rgb(246, 240, 198)');
    this.elcontent.setProperty('font-family' ,'"Reenie Beanie",arial,sans-serif');
    this.elcontent.setProperty('font-size','140%');
    this.elcontent.setProperty('padding-left','5px');
    this.elcontent.setProperty('padding-top', (options.height * 0.2) + 'px');
    //this.elcontent.setProperty('padding-top','15px');
    this.elcontent.setContent(postitContent);
    this.contentRef = null;

    var id = this.node.addComponent({
        onUpdate: function(time) {
            // Every frame, query transitionable state and set node opacity accordingly
            var newOpacity = that.opacityTransitionable.get();
            that.node.setOpacity(newOpacity);
            if (that.opacityTransitionable.isActive()) that.node.requestUpdate(id);
        }
    });

    this.node.requestUpdate(id);

    this.editMode = false;

    //Out of order nodes are positioned manually by user through dragging.
    //Out of order behaviour can be reset by clickign on the grid icon
    this.isOutofOrder = false;

    var that = this;
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

PostitNode.prototype.getSeq = function getSeq(){

  return this.seqId;

}


PostitNode.prototype.getNode = function getNode(){

  return this.node;

}

PostitNode.prototype.place = function place(xpos,ypos,zpos){

  var that = this;

  this.postitPosition.set(xpos,ypos,zpos);

  this.opacityTransitionable.set(1, { duration: 500 } , function(){

      that.headerRef = $("#Postit-Header" + that.seqId);
      that.contentRef = $("#Postit-Content" + that.seqId);

      $(that.headerRef).hover(
        function(){
          if($(this).find("textarea").val().length > 0){
            $(this).find(".icons").stop().fadeIn();
          }

        },
        function(){
            if($(this).find("textarea").val().length > 0){
              $(this).find(".icons").stop().fadeOut();
            }

        }
      )

      $(that.headerRef).find('.edit').on('click',function(){
        if(that.editMode){

          that.editMode = false;

          $(that.headerRef).find("textarea").attr("readonly","readonly");
          $(that.contentRef).find("textarea").attr("readonly","readonly");
          $(this).css("opacity",0.5);


        } else {

          that.editMode = true;

          $(that.headerRef).find("textarea").removeAttr("readonly");
          $(that.contentRef).find("textarea").removeAttr("readonly");
          $(this).css("opacity",1);

        }

      });

      $(that.headerRef).find('.delete').on('click',function(){

        that.parent.emit("del",{seqno: that.seqId});

      });

      $(that.headerRef).find('.flip').on('click',function(){

        that.rotation.set(0,Math.PI,0,{duration:1000});

      });

      $('body').on('click',"#Postit-Back"+that.seqId,function(){

        that.rotation.set(0,0,0,{duration:1000});

      });


  });


}


PostitNode.prototype.shift = function shift(xpos,ypos,zpos){

  if((this.postitPosition.getX() != xpos) || (this.postitPosition.getY() != ypos)  ) {

    this.postitPosition.set(xpos,ypos,zpos,{duration : 500});

  }



}


PostitNode.prototype.remove = function remove(){

  this.opacityTransitionable.set(1, { duration: 500 } );


/*
  this.node.removeChild(this.frontNode);
  this.node.removeChild(this.backNode);

  this.node.removeChild(this.wontNode);
  this.node.removeChild(this.shakNode);
  this.node.removeChild(this.dakNode);
  this.node.removeChild(this.lakNode);
*/



}

PostitNode.prototype.checkOutOfOrder = function checkOutOfOrder(){

  return this.isOutofOrder;

}

PostitNode.prototype.resetOutOfOrder = function resetOutOfOrder(){

  this.isOutofOrder = false;

}



PostitNode.prototype.move = function move(){


}

PostitNode.prototype.resize = function resize(){


}

PostitNode.prototype.update = function update(postitObj){


}

module.exports = PostitNode;
