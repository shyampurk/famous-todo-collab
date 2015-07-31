
var FamousEngine = require('famous/core/FamousEngine');
var DOMElement = require('famous/dom-renderables/DOMElement');

var Size = require('famous/components/Size');
var Position = require('famous/components/Position');

var AppNode = require('./appNode.js');
var LayoutManager = require('./layoutManager.js');

function App(scene) {

    // Dimensions
    LayoutManager.calcAppDimensions();
    console.log("LayoutManager width " + LayoutManager.getAppDimensionWidth());


    var APP_WIDTH  = window.innerWidth;
    var APP_HEIGHT = window.innerHeight;

    var headerHeight = APP_HEIGHT * 0.1;

    var rootNode = scene.addChild();
    var headerNode = rootNode.addChild();

    var appNode = rootNode.addChild(new AppNode(scene));

    appNode.onReceive = function(e,p){

      if(e === "del"){

        console.log(
                'Received ' + e + ' event!' + ' with ' + p.seqno
                );

        appNode.deletePostit(p.seqno);


      } else if(e == "rearrange"){
        appNode.reArrange();
      } else if(e == "logout"){
        appNode.logoff();
      }

    }


    setTimeout(function(){

        console.log("Fired");
        scene.emit("eventoo",{data : "payload"});

    },5000);

    //headerNode.setSizeMode('relative','relative','relative')
    //  .setPosition(0,0)
    //  .setProportionalSize(1, 0.1);

    headerNode.setSizeMode('absolute','absolute','absolute')
      .setPosition(0,0)
      .setAbsoluteSize(LayoutManager.getAppDimensionWidth(), LayoutManager.getAppDimensionHeaderHeight());

    appNode.setSizeMode('absolute','absolute','absolute')
      .setPosition(0,LayoutManager.getAppDimensionHeaderHeight())
      .setAbsoluteSize(LayoutManager.getAppDimensionWidth(), LayoutManager.getAppDimensionHeight() - LayoutManager.getAppDimensionHeaderHeight());


    rootNode.addComponent({
        onSizeChange: function(sizew,sizeh){
          console.log(sizew,sizeh);

          LayoutManager.calcAppDimensions();
          console.log("LayoutManager width " + LayoutManager.getAppDimensionWidth());



          APP_WIDTH  = window.innerWidth;
          APP_HEIGHT = window.innerHeight;

          headerHeight = APP_HEIGHT * 0.1;

          headerNode.setAbsoluteSize(LayoutManager.getAppDimensionWidth(), LayoutManager.getAppDimensionHeaderHeight());
          appNode.setPosition(0,LayoutManager.getAppDimensionHeaderHeight()).setAbsoluteSize(LayoutManager.getAppDimensionWidth(), LayoutManager.getAppDimensionHeight() - LayoutManager.getAppDimensionHeaderHeight());


        }
    });

    var expanderDIV = new DOMElement(headerNode, {
       content : "Famous Collaboration",
       properties:{
         'background-color':'rgb(62, 67, 68)',
         'color' : '#AAA7A7',
         //'line-height' : '35px',
         'padding-top' : '2.5vh',
         'text-align' : 'center',
         'font-size' : '7.5vh'
       }
    });

/*
    scene.onReceive = function(event, payload) {
        console.log(
            'Received Scene ' + event + ' event!'
          );
        };
*/


    expanderDIV.onReceive = function(event, payload) {
        console.log(
            'Received ' + event + ' event!'
        );

        // this.receive is an alias of the original Node#onReceive method.
        // It is equivalent to
        // Node.prototype.onReceive.call(this, event, payload).
        //this.receive(event, payload);
    };

    appNode.initNode();


}



module.exports = App;
