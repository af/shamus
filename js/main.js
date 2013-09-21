// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw


// Setup our window object.
// See https://github.com/rogerwang/node-webkit/wiki/Window
var fs = require('fs');
var gui = require('nw.gui');
var win = gui.Window.get();
win.title = require('./package.json').name;

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

    v.on('changeStatus', resizeWindow);
});

Task.startLoop();
resizeWindow();


// Resize window so it takes exactly the same height as the list of tasks:
function resizeWindow() {
    var menubarHeight = 22;     // Accurate on OS X 10.8, probably needs to be adjusted for platform

    // Give webkit a little time to re-render the resized elements before we detect the new
    // height to change the window to:
    setTimeout(function() {
        var height = getComputedStyle(document.body).height;
        window.resizeTo(window.outerWidth, parseFloat(height) + menubarHeight);
    }, 10);
}

// Position the window in the top right of the screen on startup.
// TODO: make this a config option
window.moveTo(screen.width - window.outerWidth, 0);
