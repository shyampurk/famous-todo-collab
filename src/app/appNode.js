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
    //Indicates if the strict grid layout is followed
    this.strictLayout = true;

    //Login Status
    this.loginStatus = false;

    this.postitEntries = [];

    this.postitSeq = 0;

    this.loginAndStatusPanel = this.addChild(new LoginAndStatusPanel());

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
         'background-color':'rgb(95, 89, 89)',
         'overflow' : 'hidden'
    //     'z-index' : -1
       }
    });

    this.postitContainerDiv = new DOMElement(this.postitContainerPanel, {
       id : 'postitContainerPanel',
       properties:{
         'background-color':'rgb(95, 89, 89)',

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

        if(e.status == "move"){

            var tempY = that.postitContainerPanelPos.getY() + e.centerDelta.y;
            that.postitContainerPanelPos.set(0, tempY );
          //  console.log("New y pos " + tempY);

        }

    });

/*
    var myComponent = {
    onReceive: function(event, payload) {
        console.log(
            'Received ' + event + ' event!'
            );
        }
    };
    this.addComponent(myComponent);
*/


}

// Extend the prototype
AppNode.prototype = Object.create(Node.prototype);
AppNode.prototype.constructor = Node;



AppNode.prototype.initNode = function initNode(){

  this.loginAndStatusPanel.initPanel();
  this.initEvents();

  this.postitBasePanel.setSizeMode(1,1,1)
    .setAbsoluteSize(LayoutManager.getPostitPanelWidth(), LayoutManager.getPostitPanelHeight(),0 )
    .setPosition(0, LayoutManager.getPostitPanelHeightOffset(),0);

  this.postitContainerPanel.setSizeMode(1,1,1)
    .setAbsoluteSize(LayoutManager.getPostitPanelWidth(), LayoutManager.getPostitPanelHeight(),0 )
    .setPosition(0, 0,0);

  this.postitPanelDiv.setProperty('display','none');



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

      //var post = new PostitNode(100,100)

      //var pt = that.postitContainerPanel.addChild(new PostitNode());
      //pt.display();
      //var pt = that.postitContainerPanel.addChild();


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
    this.postitEntries[i].shift(posArray[0],posArray[1],posArray[2]);


  }


  //Animate the movement of all the existing nodes

  //Create the child node

  //Create the DIV Element with postit style

  //Populate the div element with the data

  //Animate the child node and display it on top

  //Add it to the postitEntries array


}


AppNode.prototype.deletePostit = function deletePostit(postitID){

  //Search for the child node with postitID in the postitEntries
  var toBeDeletedEntry = null;
  var toBeDeletedSeq = 0;

  for(var i = 0 ; i < this.postitEntries.length ; i++){
    if(this.postitEntries[i].getSeq() == postitID){
      toBeDeletedEntry = this.postitEntries[i];
      toBeDeletedSeq = i;
      break;
    }
  }

  if(toBeDeletedEntry){

    toBeDeletedEntry.remove();

    for(var i = toBeDeletedSeq ; i < (this.postitEntries.length - 1) ; i++){

      var posArray = LayoutManager.getPostitPosition(i+1);

      this.postitEntries[i+1].shift(posArray[0],posArray[1],posArray[2]);

      this.postitEntries[i] = this.postitEntries[i+1];

    }

    this.postitEntries.pop();
    this.postitContainerPanel.removeChild(toBeDeletedEntry.getNode());

  }


  //Remove the child node from the app node

  //Remove the entry from the postitEntries array

  //Animate all the child nodes to rearrange them without the removed node

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

}

/*
AppNode.prototype.onReceive = function onReceive(type, ev) {
    //console.log(type + ' event received for ' + ev + ' !');
    if (type === 'delete') {
        console.log('Delete event received for ' + ev + ' !');
    }

};
*/
module.exports = AppNode;
