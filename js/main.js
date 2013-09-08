// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw


// Setup our window object.
// See https://github.com/rogerwang/node-webkit/wiki/Window
var fs = require('fs');
var gui = require('nw.gui');
var win = gui.Window.get();
win.title = 'Sentinel';

var Task = require('./js/task');
var TaskView = require('./js/taskview');

var Backbone = require('backbone');
var $ = require('littledom');
Backbone.$ = $;

var taskFile = process.argv[2] || '.sentinel.json';
var taskList = JSON.parse(fs.readFileSync(taskFile, 'utf8'));
taskList.tasks.forEach(function(taskSpec) {
    var t = new Task(taskSpec);
    var v = new TaskView({ model: t });
    $('#taskContainer')[0].appendChild(v.el);
});

Task.startLoop();
