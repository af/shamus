// Main entrypoint for shamus app

var path = require('path');
var gui = require('nw.gui');
var Backbone = require('backbone');
Backbone.$ = require('littledom');

// Load a json config file from the project directory
// (ie. where the app was started from):
var appDir = path.dirname(location.pathname);   // dir where shamus code is located
var projectDir = gui.App.argv[0] || appDir;     // dir where the app was launched

var AppView = require('./js/appview');
var app = new AppView({ el: document.body });
app.start(projectDir, window, gui.Window.get());
