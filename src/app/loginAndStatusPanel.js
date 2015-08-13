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

var menuHTMLPre = '<div id="menuContent" style="width:90%;height:100%;float:left;"> \
									<div style="float:left;width:15%;height:100%;"> \
										<div id="addPostit" style="width:100%;height:100%;text-align: center;cursor:pointer;background-color: rgb(115, 240, 240);"> \
											<span><img src="images/add-icon.png" style="height:100%;width:100%;"/></span> \
										</div> \
									</div> \
									<div style="float:left;width:15%;height:100%;"> \
										<div id="gridPostit" style="width:100%;height:100%;text-align: center;cursor:pointer;padding:5px;"> \
											<span><img src="images/grid-icon.png" style="height:100%;width:100%;"/></span> \
										</div> \
									</div> \
									<div> \
									</div> \
									<div style="float:left;width:50%;height:100%;text-align:center;"> \
										<span>Postits : ';

var menuHTMLPost =	'</span> \
											</div> \
											<div id="logoutPostit" style="float:right;width:15%;height:100%;"> \
												<span><img src="images/logout-icon.png" style="height:100%;width:100%;"/></span> \
											</div> \
										</div>'  ;

var grabberHTML =	'<div id="menuGrabber" style="width:5%;height:100%;float:right;padding:2px;">  \
											<span id="menuMinimize"><img src="images/mesh-icon.png" style="height:100%;width:100%;"/></span> \
									</div>';

var loginUser = 'demo';
var loginPassword = '12345'


function LoginAndStatusPanel(app) {

    //Call parent constructor
    Node.call(this);

		this.context = app;

    this.loginAndStatusDiv = new DOMElement(this, {
       content : loginHTML,
       properties:{
         'background-color':'rgb(172, 167, 167)',

       }
    });

    this.loginAndStatusPanelPosition = new Position(this);
    this.loginAndStatusPanelSize = new Size(this);

		this.menuCollapsedState = false;
		this.postitCount = 0;

		this.setMountPoint(1,0,0);

		this.loginStatus = false;

		this.currentXPos = 0;

		__initEvents.call(this);

}

// Extend the prototype
LoginAndStatusPanel.prototype = Object.create(Node.prototype);

LoginAndStatusPanel.prototype.initPanel = function initPanel(){

  this.loginAndStatusPanelPosition.set(LayoutManager.getLoginPageXOffset(),100,0);
  this.loginAndStatusPanelSize.setMode(1,1,1);

  this.loginAndStatusPanelSize.setAbsolute(LayoutManager.getLoginPageWidth(),LayoutManager.getLoginPageHeight(),0);


}

LoginAndStatusPanel.prototype.doLogin = function doLogin(){

  var capturedUsername = $('#loginPanel_Username').val();

	var capturedPassword = $('#loginPanel_Password').val();

	if(capturedUsername == loginUser && capturedPassword == loginPassword){

	  _postLoginHandler.call(this);
		this.loginStatus = true;
		return true;

	} else {
		this.loginStatus = false;
		return false;
	}
}

function _postLoginHandler(){

  var that = this;

  $('#loginPanel').fadeOut(100);

  this.loginAndStatusPanelPosition.set(this.currentXPos,5,0,{duration : 500});

  this.loginAndStatusPanelSize.setAbsolute(LayoutManager.getLoginPageWidth(),LayoutManager.getAppDimensionHeaderHeight() * 0.5 ,0,{duration : 500},function(){



    //that.loginAndStatusPanelPosition.set(LayoutManager.getAppDimensionWidth() - LayoutManager.getLoginPageWidth() - 10,5,0,{duration : 500});
		that.loginAndStatusPanelPosition.set(LayoutManager.getAppDimensionWidth() - 10,5,0,{duration : 500});




		that.loginAndStatusDiv.setContent( menuHTMLPre + that.postitCount + menuHTMLPost + grabberHTML);



  });



}

function __initEvents(){

	var that = this;

	$('body').on('click','#gridPostit',function(){

		that.context.emit("rearrange");



	});

	$('body').on('click','#logoutPostit',function(){

		that.context.emit("logout");
		that.postitCount = 0;

		$('#postitBasePanel').fadeOut(1000);

		that.loginAndStatusPanelPosition.set(that.currentXPos,10,0,{duration : 500},function(){

			that.loginAndStatusDiv.setContent('');

			that.loginAndStatusPanelPosition.set(that.currentXPos,100,0,{duration : 500},function(){

				that.loginAndStatusPanelSize.setAbsolute(LayoutManager.getLoginPageWidth(),LayoutManager.getLoginPageHeight(),0,{duration : 500},function(){

					that.loginAndStatusDiv.setContent(loginHTML);

				});



			});


		});

		that.loginStatus = false;

	});


	$('body').on('click','#menuMinimize',function(){

		if(that.menuCollapsedState){

			$('body').find('#menuContent').fadeIn();

			$('body').find('#menuGrabber').css('width','5%');

			that.loginAndStatusPanelSize.setAbsolute(LayoutManager.getLoginPageWidth() - 10,LayoutManager.getAppDimensionHeaderHeight() * 0.5 ,0,{duration : 500},function(){

				//that.loginAndStatusPanelSize.setAbsolute(LayoutManager.getLoginPageWidth(),LayoutManager.getAppDimensionHeaderHeight() * 0.5 ,0,{duration : 500});
				//$('body').find('#menuGrabber').css('width','100%');


			});


			that.menuCollapsedState = false;

		} else {

			$('body').find('#menuContent').fadeOut();

			that.loginAndStatusPanelSize.setAbsolute(15,LayoutManager.getAppDimensionHeaderHeight() * 0.5 ,0,{duration : 500},function(){

				$('body').find('#menuGrabber').css('width','100%');

			});


			that.menuCollapsedState = true;
		}



	});


}

LoginAndStatusPanel.prototype.increment = function increment(){

	this.postitCount++;
	this.loginAndStatusDiv.setContent( menuHTMLPre + this.postitCount + menuHTMLPost + grabberHTML);

}

LoginAndStatusPanel.prototype.decrement = function decrement(){

	this.postitCount--;
	this.loginAndStatusDiv.setContent( menuHTMLPre + this.postitCount + menuHTMLPost + grabberHTML);

}

LoginAndStatusPanel.prototype.resize = function resize(){

	this.currentXPos = LayoutManager.getLoginPageXOffset();

	this.loginAndStatusPanelPosition.set(LayoutManager.getAppDimensionWidth() - 10,5,0);

	if(this.loginStatus){


	} else {

		this.loginAndStatusPanelSize.setAbsolute(LayoutManager.getLoginPageWidth(),LayoutManager.getLoginPageHeight(),0);

		this.loginAndStatusPanelPosition.set(this.currentXPos,100,0);
	}


}


module.exports = LoginAndStatusPanel;
