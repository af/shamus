var Backbone = require('backbone');

var Task = require('./task');
var TaskView = require('./taskview');


// AppView
// A Backbone view to manage UI at the app/window level.
// document.body should be passed in as view.el.
module.exports = Backbone.View.extend({
    menubarHeight: 22,     // Accurate on OS X 10.8, probably needs to be adjusted for platform

    configure: function(config) {
        this.config = config || {};
        this.config.window = this.config.window || {};
    },

    initWindow: function(window, nwWindow) {
        var app = this;
        var windowConfig = this.config.window;
        windowConfig.width = windowConfig.width || 400;     // Default width if none is specified
        this.window = window;
        this.screen = window.screen;

        // Setup our node-webkit window
        // See https://github.com/rogerwang/node-webkit/wiki/Window
        nwWindow.title = this.config.name || 'Sentinel';
        nwWindow.setAlwaysOnTop(windowConfig.alwaysOnTop || false);

        this.resizeWindow(windowConfig);
        setTimeout(function() {
            app.moveWindow(windowConfig);
            nwWindow.show();
            //nwWindow.showDevTools();      // Handy for debugging
        }, 10);   // Give time for webkit to resize the window before moving and showing it
    },

    // Set up Task instances from an array of task specs
    initTasks: function(taskList) {
        var app = this;
        var resizeFn = app.resizeWindow.bind(app);
        taskList.forEach(function(taskSpec) {
            var t = new Task(taskSpec);
            var v = new TaskView({ model: t });
            v.on('changeStatus', resizeFn);
            app.$('#taskContainer')[0].appendChild(v.el);
        });
        Task.startLoop();
    },

    // Position the window in the top right of the screen on startup.
    // Takes a config object with the supported keys: 'top', 'bottom', 'left', 'right'
    moveWindow: function(windowConfig) {
        var topEdge = windowConfig.top || 0;
        var leftEdge = windowConfig.left || 0;

        if (typeof windowConfig.right === 'number') leftEdge = this.screen.width - windowConfig.right - this.window.outerWidth;
        if (typeof windowConfig.bottom === 'number') topEdge = this.screen.height - windowConfig.bottom - this.window.outerHeight;
        this.window.moveTo(leftEdge, topEdge);
    },

    // Resize window so it takes exactly the same height as the list of tasks:
    resizeWindow: function(windowConfig) {
        windowConfig = windowConfig || {};
        var view = this;
        var w = this.window;

        // Give webkit a little time to re-render the resized elements before we detect the
        // height to change the window to:
        setTimeout(function() {
            var width = windowConfig.width || w.outerWidth;
            var height = w.getComputedStyle(view.el).height;
            w.resizeTo(width, parseFloat(height) + view.menubarHeight);
        }, 10);
    }
});
