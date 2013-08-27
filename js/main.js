// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw


// Setup our window object.
// See https://github.com/rogerwang/node-webkit/wiki/Window
var gui = require('nw.gui');
var win = gui.Window.get();
win.title = 'Sentinel';

var EE = require('events').EventEmitter;
var bus = new EE();
var fs = require('fs');
var spawn = require('child_process').spawn;

// TODO: make these user-specifiable:
var watchRegex = new RegExp('\.js$');
var userCmd = 'mocha test.js -R tap';

function runTests() {
    bus.emit('running');
    var cmd = spawn('mocha', ['test.js', '-R', 'tap']);
    cmd.stdout.pipe(require('tub')(function(x) {
        console.log(require('util').inspect(x, { depth: null }));
        bus.emit(x.ok ? 'ok' : 'error');
    }));
}

runTests();     // Run tests on startup

fs.watch('.', function(evt, filename) {
    if (watchRegex.test(filename)) {
        console.log(filename + ' changed!');
        runTests();
    }
});


// Quick and dirty view code:
var $ = require('littledom');
var $status = $('.status');

bus.on('running', function() {
    $status.removeClass('ok error').addClass('running');
});
bus.on('ok', function() {
    $status.removeClass('running error').addClass('ok');
});
bus.on('error', function() {
    $status.removeClass('running ok').addClass('error');
});
