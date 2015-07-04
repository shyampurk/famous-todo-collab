'use strict';

// Famous dependencies

var FamousEngine = require('famous/core/FamousEngine');
var App = require('./app/app');

// Boilerplate code to make your life easier
FamousEngine.init();

var scene = FamousEngine.createScene();
// Initialize with a scene; then, add a 'node' to the scene root


var app = App(scene);
