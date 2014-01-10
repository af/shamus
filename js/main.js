// Main entrypoint for shamus app

var path = require('path');
var gui = require('nw.gui');
var Backbone = require('backbone');
Backbone.$ = require('littledom');

// Load a json config file from the project directory
// (ie. where the app was started from):
//
// TODO: add config parser abstraction that supports searching parent dirs
// recursively until finding a json config file, and/or using ~/.shamus.json
var appDir = path.dirname(location.pathname);   // dir where shamus code is located
var projectDir = gui.App.argv[0] || appDir;     // dir where the app was launched
var taskFile = path.join(projectDir, '.shamus.json');
var config = JSON.parse(require('fs').readFileSync(taskFile, 'utf8'));
config.projectDir = projectDir;

var AppView = require('./js/appview');
var app = new AppView({ el: document.body });
app.configure(config);
app.initWindow(window, gui.Window.get());
app.initTasks(config.tasks);
