
var __MAX_LAYOUT_COLUMN_ = 3;
var __HEADER_SIZE_PERCENT_ = 0.1;

var __LOGINPANEL_WIDTH_SIZE_PERCENT_ = 0.3;
var __LOGINPANEL_HEIGHT_SIZE_PERCENT_ = 0.2;


var appDimensionObject = {

  //Application Dimensions
  appWidth : 0,
  appHeight : 0,

  //Application Header Height
  appHeaderHeight : 0,

  //Login Panel Width & Height
  loginPanelWidth : 0,
  loginPanelHeight : 0

}

var appLayoutObject = {


}



var LayoutManager = {}


LayoutManager.calcAppDimensions = function calcAppDimensions(){

  appDimensionObject.appWidth  = window.innerWidth;
  appDimensionObject.appHeight = window.innerHeight;

  appDimensionObject.appHeaderHeight = appDimensionObject.appHeight * __HEADER_SIZE_PERCENT_;

  appDimensionObject.loginPanelWidth = appDimensionObject.appWidth * __LOGINPANEL_WIDTH_SIZE_PERCENT_;
  appDimensionObject.loginPanelHeight = appDimensionObject.appHeight * __LOGINPANEL_HEIGHT_SIZE_PERCENT_;

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


module.exports = LayoutManager;
