// To build & run:
// zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw

var path = require('path');
var gui = require('nw.gui');
var Backbone = require('backbone');
Backbone.$ = require('littledom');

// Load a json config file from the project directory (where the app was started from):
// FIXME: tasks/watchers run from this code's root dir, not the project's
// TODO: if no json config found in this dir, search parent dirs until finding one
var appDir = path.dirname(location.pathname);   // the dir where this code is located
var projectDir = gui.App.argv[0] || appDir;     // the dir from which the app was launched
var taskFile = path.join(projectDir, '.sentinel.json');
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
