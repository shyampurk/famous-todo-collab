var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Position = require('famous/components/Position');
var Size = require('famous/components/Size');

var LayoutManager = require('./layoutManager.js');

//Inner HTML Snippets
var loginHTML = '<div id="loginandstatusPanel">\
	        <div id="loginPanel">\
	          <div class="ui form segment">\
	            <div class="field required">\
	              <label>Username</label>\
	              <input id="loginPanel_Username" placeholder="Username" type="text">\
	            </div> \
	            <div class="field required">\
	              <label>Password</label>\
	              <div class="ui icon input"> \
	                <i class="lock icon"></i> \
                 <input id="loginPanel_Password" placeholder="Password" type="password"/> \
	              </div> \
	            </div> \
	            <div id="loginPanel_Submit" class="ui submit button">Submit</div>\
	            <div id="loginPanel_Reset" class="ui reset button">Reset</div>\
	          </div>\
	        </div>\
	      </div>';

var menuHTML = '<div style="width:100%;height:100%;"> \
									<div style="float:left;width:15%;height:100%;"> \
										<div id="addPostit" style="width:100%;height:100%;font-size: 5vh;line-height:55px;text-align: center;cursor:pointer;background-color: rgb(115, 240, 240);"> \
											<span>+</span> \
										</div> \
									</div> \
									<div> \
									</div> \
									<div style="float:right;width:15%;height:100%;"> \
										<span><img src="images/logout-icon.png" style="height:100%;width:100%;"/></span> \
									</div> \
								</div>';

var loginUser = 'demo';
var loginPassword = '12345'


function LoginAndStatusPanel(postitObj) {

    //Call parent constructor
    Node.call(this);


    this.loginAndStatusDiv = new DOMElement(this, {
       content : loginHTML,
       properties:{
         'background-color':'rgb(172, 167, 167)',

       }
    });

    this.loginAndStatusPanelPosition = new Position(this);
    this.loginAndStatusPanelSize = new Size(this);



}

// Extend the prototype
LoginAndStatusPanel.prototype = Object.create(Node.prototype);

LoginAndStatusPanel.prototype.initPanel = function initPanel(){

  this.loginAndStatusPanelPosition.set(100,100,0);
  this.loginAndStatusPanelSize.setMode(1,1,1);

  this.loginAndStatusPanelSize.setAbsolute(LayoutManager.getLoginPageWidth(),LayoutManager.getLoginPageHeight(),0);


}

LoginAndStatusPanel.prototype.doLogin = function doLogin(){

  var capturedUsername = $('#loginPanel_Username').val();

	var capturedPassword = $('#loginPanel_Password').val();

	if(capturedUsername == loginUser && capturedPassword == loginPassword){

	  _postLoginHandler.call(this);
		return true;

	} else {
		return false;
	}
}

function _postLoginHandler(){

  var that = this;

  $('#loginPanel').fadeOut(100);

  this.loginAndStatusPanelPosition.set(100,10,0,{duration : 500});

  this.loginAndStatusPanelSize.setAbsolute(LayoutManager.getLoginPageWidth(),LayoutManager.getAppDimensionHeaderHeight() * 0.6 ,0,{duration : 500},function(){

    that.loginAndStatusPanelPosition.set(LayoutManager.getAppDimensionWidth() - LayoutManager.getLoginPageWidth() - 10,10,0,{duration : 500});

		that.loginAndStatusDiv.setContent(menuHTML);

  });



}

module.exports = LoginAndStatusPanel;
