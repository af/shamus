// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw


// Setup our window object.
// See https://github.com/rogerwang/node-webkit/wiki/Window
var gui = require('nw.gui');
var win = gui.Window.get();
win.title = 'Sentinel';

var Task = require('./js/task');
var TaskView = require('./js/taskview');

var t = new Task({
    name: 'Example mocha runner',
    command: 'mocha tests -R tap',
    parser: 'tap',
    watchMatcher: '\.js$'
});

var t2 = new Task({
    name: 'Sentinel stylus',
    command: 'stylus css',
    parser: 'exitcode',
    watchMatcher: '\.styl$'
});

Task.startLoop();


var Backbone = require('backbone');
var $ = require('littledom');
Backbone.$ = $;

var v = new TaskView({ model: t });
var v2 = new TaskView({ model: t2 });
$('#taskContainer')[0].appendChild(v.el);
$('#taskContainer')[0].appendChild(v2.el);
