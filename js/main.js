// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw


// Setup our window object.
// See https://github.com/rogerwang/node-webkit/wiki/Window
var gui = require('nw.gui');
var win = gui.Window.get();
win.title = 'Sentinel';

var Task = require('./js/task');
var t = new Task({
    name: 'Example mocha runner',
    command: 'mocha tests -R tap',
    watchMatcher: '\.js$'
});

setTimeout(function() { t.run(); }, 100);      // Not sure why timeout is needed for tests to work...
t.watch();

// Quick and dirty view code:
var $ = require('littledom');
var $status = $('.status');

// TODO: refactor to Backbone view
t.on('change:isRunning', function(task) {
    console.log('in view handler');
    if (task.isRunning) $status.removeClass('ok error').addClass('running');
    else {
        if (task.isOK) $status.removeClass('running error').addClass('ok');
        else $status.removeClass('running ok').addClass('error');
    }
});
