var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');

var Position = require('famous/components/Position');
var Size = require('famous/components/Size');

var LayoutManager = require('./layoutManager.js');
var LoginAndStatusPanel = require('./loginAndStatusPanel.js');



function AppNode() {

    //Call parent constructor
    Node.call(this);

    //Indicates if the strict grid layout is followed
    this.strictLayout = true;

    //Login Status
    this.loginStatus = false;

    this.postitEntries = [];

    this.loginAndStatusPanel = this.addChild(new LoginAndStatusPanel());


    this.menuPanel = this.addChild();

    this.backgroundDiv = new DOMElement(this, {
       properties:{
         'background-color':'#666'
       }
    });


}

// Extend the prototype
AppNode.prototype = Object.create(Node.prototype);

AppNode.prototype.initNode = function initNode(){

  this.loginAndStatusPanel.initPanel();
  this.initEvents();

}

AppNode.prototype.initEvents = function initEvents(){

  var that = this;
  //Initialize all intra DOM UI events
  $('body').on("click",'#loginPanel_Submit',function(){

    that.loginAndStatusPanel.doLogin();

  });

}

AppNode.prototype.addNewPostit = function addNewPostit(postitObj){

  var postitID     = postitObj.postitID;

  var createrName  = postitObj.creator;

  var dateCreated  = postitObj.creationDate;

  var dateModified = postitObj.modificationDate;

  var content      = postitObj.postitContent;

  var criticality  = postitObj.postitCriticality;

  //Animate the movement of all the existing nodes

  //Create the child node

  //Create the DIV Element with postit style

  //Populate the div element with the data

  //Animate the child node and display it on top

  //Add it to the postitEntries array


}


AppNode.prototype.deletePostit = function deletePostit(postitID){

  //Search for the child node with postitID in the postitEntries

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

AppNode.prototype.reArrange = function reArrange(postitObj){

  //Run through all the postits in the postitEntries array
  //Rearrange them as per the current layout
  //Set the strictLayout to true

}

module.exports = AppNode;
