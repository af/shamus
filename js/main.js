// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw


// Setup our window object.
// See https://github.com/rogerwang/node-webkit/wiki/Window
var gui = require('nw.gui');
var win = gui.Window.get();
win.title = 'Checkpoint';

var bus = new require('events').EventEmitter;
var fs = require('fs');
var exec = require('child_process').exec;

// TODO: make these user-specifiable:
var watchRegex = new RegExp('\.js$');
var userCmd = 'mocha test.js -R tap';

fs.watch('.', function(evt, filename) {
    if (watchRegex.test(filename)) {
        console.log(filename + ' changed!');
        exec(userCmd, function(err, stdout, stderr) {
            if (err) return console.error('ERROR WHEN RUNNING TESTS');
            console.log('STDOUT:', stdout);
        });
    }
});

var $ = require('littledom');
$('.status').on('click', function(evt) {
    $(evt.target).toggleClass('running');
});
