// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw

var gui = require('nw.gui');

var Backbone = require('backbone');
var $ = require('littledom');
Backbone.$ = $;

var taskFile = process.argv[2] || '.sentinel.json';
var config = JSON.parse(require('fs').readFileSync(taskFile, 'utf8'));

var AppView = require('./js/appview');
var app = new AppView({ el: document.body });
app.configure(config);      // TODO: add config parser abstraction that also supports ~/.sentinel.json
app.initWindow(window, gui.Window.get());

// FIXME: find a way to remove this timeout before initializing models.
// It's here to prevent the "X assertions not reported" error that we get
// from tub/mocha when running the sentinel tests on app startup.
setTimeout(function() {
    app.initTasks(config.tasks);
}, 500);
