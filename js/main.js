// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw


// Setup our window object.
// See https://github.com/rogerwang/node-webkit/wiki/Window
var gui = require('nw.gui');
var win = gui.Window.get();
win.title = require('./package.json').name;

var Backbone = require('backbone');
var $ = require('littledom');
Backbone.$ = $;

var taskFile = process.argv[2] || '.sentinel.json';
var taskList = JSON.parse(require('fs').readFileSync(taskFile, 'utf8'));

var AppView = require('./js/appview');
var app = new AppView({ el: document.body });
app.initWindow(window);
app.initTasks(taskList);
