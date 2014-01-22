// Main entrypoint for shamus app

var path = require('path');
var gui = require('nw.gui');
var Backbone = require('backbone');
Backbone.$ = require('littledom');

// Load a json config file from the project directory
// (ie. where the app was started from):
var appDir = path.dirname(location.pathname);   // dir where shamus code is located
var projectDir = gui.App.argv[0] || appDir;     // dir where the app was launched
var taskFile = path.join(projectDir, '.shamus.json');
var config = JSON.parse(require('fs').readFileSync(taskFile, 'utf8'));

var AppView = require('./js/appview');
var app = new AppView({ el: document.body });
app.configure(config, projectDir);
app.initWindow(window, gui.Window.get(), config.window);
app.initTasks(config.tasks);
