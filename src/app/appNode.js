var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');

var Position = require('famous/components/Position');
var Size = require('famous/components/Size');
var GestureHandler = require('famous/components/GestureHandler');

var LayoutManager = require('./layoutManager.js');
var LoginAndStatusPanel = require('./loginAndStatusPanel.js');
var PostitNode = require('./postitNode.js');




function AppNode(scene) {

    //Call parent constructor
    Node.call(this);

    this.context = scene

    //Drag Status 0 indicates the default drag behaviour for the container Panel
    //Drag status set to one indicates that a postit is being dragged
    this.context.dragStatus = 0;
    //Indicates if the strict grid layout is followed
    this.strictLayout = true;

    //Login Status
    this.loginStatus = false;

    this.postitEntries = [];

    this.postitSeq = 0;

    this.loginAndStatusPanel = this.addChild(new LoginAndStatusPanel(this.context));

    this.postitBasePanel = this.addChild();

    this.postitContainerPanel = this.postitBasePanel.addChild();
    this.postitContainerPanelPos = new Position(this.postitContainerPanel);
    this.postitContainerPanelPos.set(0,0);

    this.menuPanel = this.addChild();

    this.backgroundDiv = new DOMElement(this, {
       properties:{
         'background-color':'rgb(80, 76, 76)',
         'overflow' : 'hidden'
       }
    });

    this.postitPanelDiv = new DOMElement(this.postitBasePanel, {
       id : 'postitBasePanel',
       properties:{
         //'background-color':'rgb(95, 89, 89)',
         'background-color':'cyan',
         'overflow' : 'hidden'
    //     'z-index' : -1
       }
    });

    this.postitContainerDiv = new DOMElement(this.postitContainerPanel, {
       id : 'postitContainerPanel',
       properties:{
         'background-color':'rgb(95, 89, 89)',
         //'background-color':'blue',

         'z-index' : 1
       }
    });

    var that = this;


    this.gestures = new GestureHandler(this.postitContainerPanel);
    this.gestures.on({
        event: 'drag',
        points: 2,
        threshold: 10
    }, function(e){

        //console.log(e);

        if(that.context.dragStatus == 0){

          if(e.status == "move"){

              console.log("Pos Y : " + that.postitContainerPanelPos.getY());
              console.log("Pos Center Delta Y : " + e.centerDelta.y);

              var tempY = that.postitContainerPanelPos.getY() + e.centerDelta.y;

              var tempYLimit =  that.newYSize - LayoutManager.getPostitPanelHeight()


              if(tempY < 0 && (Math.abs(tempY) <= Math.abs(tempYLimit) ) ) {
                  that.postitContainerPanelPos.set(0, tempY );
              }

/*
              if(tempY < 0  ) {
                  that.postitContainerPanelPos.set(0, tempY );
              }
*/
            //  console.log("New y pos " + tempY);

          }

        }

    });

    this.lastRecordedPostitPanelDimWidth = LayoutManager.getAppDimensionWidth();


    this.addComponent({
        onSizeChange: function(sizew,sizeh){

          //Resize the login and status panel according to the new size limits
          that.loginAndStatusPanel.resize();

          //Resize the base panel as per the new dimensions
          that.postitBasePanel.setAbsoluteSize(1, LayoutManager.getPostitPanelHeight(),0 );

          console.log("Absolute size of container panel : " + that.postitContainerPanel.getAbsoluteSize()[1]);
          console.log("Y Pos of container panel : " + that.postitContainerPanelPos.getY());

          //Resize the container panel as per the new dimensions
          if( (that.postitContainerPanel.getAbsoluteSize()[1] - Math.abs(that.postitContainerPanelPos.getY()) )   <  LayoutManager.getPostitPanelHeight() ){

            var newhsize = that.postitContainerPanel.getAbsoluteSize()[1] + ( LayoutManager.getPostitPanelHeight()  -  (that.postitContainerPanel.getAbsoluteSize()[1] - Math.abs(that.postitContainerPanelPos.getY()) )  );
            console.log("New Height : " + newhsize);

            that.newYSize = newhsize;

            that.postitContainerPanel.setAbsoluteSize(LayoutManager.getPostitPanelWidth(), newhsize,1 );

          }


          if(that.loginStatus){

            if(LayoutManager.checkChangeInPostitPerRow() ||  ( Math.abs(that.lastRecordedPostitPanelDimWidth - LayoutManager.getAppDimensionWidth() ) > 50 )  ){

              that.lastRecordedPostitPanelDimWidth = LayoutManager.getAppDimensionWidth();

              for(var i = 0; i < that.postitEntries.length ; i++){

                var posArray = LayoutManager.getPostitPosition(i+1);

                that.postitEntries[i].shift(posArray[0],posArray[1],posArray[2]);

              }

              if(that.newYSize < LayoutManager.getPostitContainerPanelHeight(that.postitEntries.length)){

                  that.newYSize = LayoutManager.getPostitContainerPanelHeight(that.postitEntries.length);

                  that.postitContainerPanel.setAbsoluteSize(LayoutManager.getPostitPanelWidth(), that.newYSize,1 );

              }

            }

          } else {



          }





        }
    });


}

// Extend the prototype
AppNode.prototype = Object.create(Node.prototype);
AppNode.prototype.constructor = Node;



AppNode.prototype.initNode = function initNode(){

  this.loginAndStatusPanel.initPanel();
  this.initEvents();


/*
  this.postitBasePanel.setSizeMode(1,1,1)
    .setAbsoluteSize(LayoutManager.getPostitPanelWidth(), LayoutManager.getPostitPanelHeight(),0 )
    .setPosition(0, LayoutManager.getPostitPanelHeightOffset(),0);
    //.setPosition(0, 100,0);
*/

  this.postitBasePanel.setSizeMode('relative','absolute','absolute')
    .setAbsoluteSize(1, LayoutManager.getPostitPanelHeight(),0 )
    .setPosition(0, LayoutManager.getPostitPanelHeightOffset(),0);



  this.postitContainerPanel.setSizeMode('relative','absolute','absolute')
    .setAbsoluteSize(LayoutManager.getPostitPanelWidth(), LayoutManager.getPostitPanelHeight(),1 )
    .setPosition(0, 0,0);

  this.postitPanelDiv.setProperty('display','none');

  //Y SIze of COntainer panel. It can grow and shrink based on the number of postit notes added
  this.newYSize = LayoutManager.getPostitPanelHeight();



}

AppNode.prototype.initEvents = function initEvents(){

  var that = this;
  //Initialize all intra DOM UI events
  $('body').on("click",'#addPostit',function(){

    that.postitSeq++ ;

    var taskDate = new Date().toUTCString();

    var postitObject = {};
    postitObject.postitID = that.postitSeq;
    postitObject.creator = 'demo';
    postitObject.creationDate = taskDate.substr(0 , taskDate.length - 4);
    postitObject.modificationDate = null;
    postitObject.postitContent = "";
    postitObject.postitCriticality = 1;

    that.addNewPostit(postitObject);


  });

  $('body').on("click",'#loginPanel_Submit',function(){

    if(that.loginAndStatusPanel.doLogin()){

      $('#postitBasePanel').fadeIn(1000);

      that.loginStatus = true;

    }

  });

}

AppNode.prototype.addNewPostit = function addNewPostit(postitObj){

  var postitID     = postitObj.postitID;

  var createrName  = postitObj.creator;

  var dateCreated  = postitObj.creationDate;

  var dateModified = postitObj.modificationDate;

  var content      = postitObj.postitContent;

  var criticality  = postitObj.postitCriticality;

  var postit = new PostitNode(this.postitContainerPanel.addChild(),postitObj,{width:250,height:250},this.context);
  this.postitEntries.unshift(postit);

  var newpos = LayoutManager.getPostitPosition(1);
  this.postitEntries[0].place(newpos[0],newpos[1],newpos[2]);


  for(var i = 1; i < this.postitEntries.length ; i++){

    var posArray = LayoutManager.getPostitPosition(i + 1);
    if(!this.postitEntries[i].checkOutOfOrder()){
        this.postitEntries[i].shift(posArray[0],posArray[1],posArray[2]);
    }

  }

  this.loginAndStatusPanel.increment();

  this.newYSize = LayoutManager.getPostitContainerPanelHeight(this.postitEntries.length);

  if(this.newYSize > LayoutManager.getPostitPanelHeight()){

      this.postitContainerPanel.setAbsoluteSize(LayoutManager.getPostitPanelWidth(), this.newYSize,1 );

  }

}


AppNode.prototype.deletePostit = function deletePostit(postitID){

  var toBeDeletedSeq = -1;

  for(var i = 0 ; i < this.postitEntries.length ; i++){
    if(this.postitEntries[i].getSeq() == postitID){
      toBeDeletedSeq = i;
      break;
    }
  }


  if(toBeDeletedSeq != -1){

    this.postitEntries[toBeDeletedSeq].remove();

    this.postitContainerPanel.removeChild(this.postitEntries[toBeDeletedSeq].getNode());
    this.postitEntries[toBeDeletedSeq] = null;




    for(var i = toBeDeletedSeq ; i < (this.postitEntries.length - 1) ; i++){

      var posArray = LayoutManager.getPostitPosition(i+1);

      this.postitEntries[i+1].shift(posArray[0],posArray[1],posArray[2]);

      this.postitEntries[i] = this.postitEntries[i+1];

    }


    //this.postitContainerPanel.removeChild(toBeDeletedEntry.getNode());

    this.postitEntries.pop();

  }

  this.loginAndStatusPanel.decrement();

  console.log(this.postitEntries);

}

AppNode.prototype.modifyPostit = function modifyPostit(postitObj){

  var modificationtype = postitObj.modType;

  //Check the modification type and run through a switch statement

  //Make the modification in the postitEntries

  //Make the visual modification in the DIV element on screen


}

AppNode.prototype.layoutPostit = function layoutPostit(postitObj){

  var posArray = LayoutManager.getPostitPosition(this.postitSeq);

  postitObj.getNode().setPosition(posArray[0],posArray[1],posArray[2]);

}


AppNode.prototype.reArrange = function reArrange(postitObj){

  //Run through all the postits in the postitEntries array
  //Rearrange them as per the current layout
  //Set the strictLayout to true
  console.log("rearrange triggered");

  for(var i = 0 ; i < this.postitEntries.length ; i++){

    var posArray = LayoutManager.getPostitPosition(i+1);

    this.postitEntries[i].shift(posArray[0],posArray[1],posArray[2]);

    if(this.postitEntries[i].checkOutOfOrder()){
      this.postitEntries[i].resetOutOfOrder();
    }

  }

}

AppNode.prototype.logoff = function logoff(){

  for(var i = 0 ; i < this.postitEntries.length ; i++){

    this.postitContainerPanel.removeChild(this.postitEntries[i].getNode());

  }

  this.postitEntries = [];


}

module.exports = AppNode;
