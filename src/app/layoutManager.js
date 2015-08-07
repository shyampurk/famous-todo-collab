
var __MAX_LAYOUT_COLUMN_ = 3;
var __HEADER_SIZE_PERCENT_ = 0.1;

var __LOGINPANEL_WIDTH_SIZE_PERCENT_ = 0.25;
var __LOGINPANEL_HEIGHT_SIZE_PERCENT_ = 0.2;

var __POSTITBASEPANEL_HEIGHT_SIZE_PERCENT_ = 0.8;


var appDimensionObject = {

  //Application Dimensions
  appWidth : 0,
  appHeight : 0,

  //Application Header Height
  appHeaderHeight : 0,

  //Login Panel Width & Height
  loginPanelWidth : 0,
  loginPanelHeight : 0,

  postitPanelWidth : 0,
  postitPanelheight : 0

}

var appLayoutObject = {

  postitXOffset : 50,
  postitYOffset : 50,

  postitInterXOffset : 20,

  postitInterYOffset : 50,

  postitPerRow : 0,

  prevpostitPerRow : 0,

  postitInterColOffset : 100,

  postitWidth : 250,
  postitHeight : 250,

  postitInterXOffsetActual : 0,

}



var LayoutManager = {}


LayoutManager.calcAppDimensions = function calcAppDimensions(){

  appDimensionObject.appWidth  = window.innerWidth;
  appDimensionObject.appHeight = window.innerHeight;

  appDimensionObject.appHeaderHeight = appDimensionObject.appHeight * __HEADER_SIZE_PERCENT_;

  appDimensionObject.loginPanelWidth = appDimensionObject.appWidth * __LOGINPANEL_WIDTH_SIZE_PERCENT_;
  appDimensionObject.loginPanelHeight = appDimensionObject.appHeight * __LOGINPANEL_HEIGHT_SIZE_PERCENT_;

  appDimensionObject.postitPanelWidth = appDimensionObject.appWidth;
  appDimensionObject.postitPanelHeight = appDimensionObject.appHeight * __POSTITBASEPANEL_HEIGHT_SIZE_PERCENT_;

  appLayoutObject.prevpostitPerRow = appLayoutObject.postitPerRow;

  appLayoutObject.postitPerRow = Math.floor((appDimensionObject.appWidth - (appLayoutObject.postitXOffset * 2)) / (appLayoutObject.postitWidth + appLayoutObject.postitInterXOffset)) ;

  if(appLayoutObject.postitPerRow > 1){

    appLayoutObject.postitInterXOffsetActual = ((appDimensionObject.appWidth - (appLayoutObject.postitXOffset * 2)) - (appLayoutObject.postitPerRow * appLayoutObject.postitWidth)) / (appLayoutObject.postitPerRow - 1);

  } else {

    appLayoutObject.postitInterXOffsetActual = 0;
    
  }


}

LayoutManager.getAppDimensionWidth = function getAppDimensionWidth(){

  return appDimensionObject.appWidth;

}

LayoutManager.getAppDimensionHeight = function getAppDimensionHeight(){

  return appDimensionObject.appHeight;

}

LayoutManager.getAppDimensionHeaderHeight = function getAppDimensionHeaderHeight(){

  return appDimensionObject.appHeaderHeight;

}

LayoutManager.getLoginPageWidth = function getLoginPageWidth(){

  return appDimensionObject.loginPanelWidth;

}


LayoutManager.getLoginPageHeight = function getLoginPageHeight(){

  return appDimensionObject.loginPanelHeight;

}

LayoutManager.getPostitPanelWidth = function getPostitPanelWidth(){

  return appDimensionObject.postitPanelWidth;

}


LayoutManager.getPostitPanelHeight = function getPostitPanelHeight(){

  return appDimensionObject.postitPanelHeight;

}

LayoutManager.getPostitPanelHeightOffset = function getPostitPanelHeightOffset(){

  return appDimensionObject.appHeaderHeight * 0.5 + 10;

}

LayoutManager.getPostitPosition = function getPostitPosition(pSeq){

  var rowPos =  Math.ceil(pSeq / appLayoutObject.postitPerRow);

  var colPos = pSeq % appLayoutObject.postitPerRow ? pSeq % appLayoutObject.postitPerRow : appLayoutObject.postitPerRow;

  var XPos =  appLayoutObject.postitXOffset + ((colPos - 1) * appLayoutObject.postitInterXOffsetActual) + ((colPos - 1) * appLayoutObject.postitWidth);

  var YPos =  appLayoutObject.postitYOffset + ((rowPos - 1) * appLayoutObject.postitInterYOffset) + ((rowPos - 1) * appLayoutObject.postitHeight);

  return [XPos , YPos , 500];

}

LayoutManager.getPostitContainerPanelHeight = function getPostitContainerPanelHeight(pCount){

  var rowPos =  Math.ceil(pCount / appLayoutObject.postitPerRow);

  return (2*appLayoutObject.postitYOffset) + ((rowPos - 1) * appLayoutObject.postitInterYOffset) + ((rowPos) * appLayoutObject.postitHeight);

}


LayoutManager.checkChangeInPostitPerRow = function checkChangeInPostitPerRow(){

  return (appLayoutObject.prevpostitPerRow == appLayoutObject.postitPerRow) ?  false :  true ;

}




module.exports = LayoutManager;
