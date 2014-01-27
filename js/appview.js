var path = require('path');
var Backbone = require('backbone');

var Task = require('./task');
var TaskView = require('./taskview');


// AppView
// A Backbone view to manage UI at the app/window level.
// document.body should be passed in as view.el.
module.exports = Backbone.View.extend({
    menubarHeight: 22,     // Accurate on OS X 10.8, probably needs to be adjusted for platform
    started: false,

    events: {
        'keyup': 'keypressDispatch'
    },

    configure: function(projectDir) {
        var taskFile = path.join(projectDir, '.shamus.json');
        var config = JSON.parse(require('fs').readFileSync(taskFile, 'utf8'));
        this.config = config || {};
        this.projectDir = projectDir;
    },

    start: function(window, nwWindow) {
        if (!this.started) this.initWindow(window, nwWindow, this.config.window);
        this.initTasks(this.config.tasks);
    },

    // Set up the application window
    // window - The global js window object
    // nwWindow - The node-webkit window object
    initWindow: function(window, nwWindow, windowConfig) {
        var app = this;
        windowConfig = windowConfig || {};
        windowConfig.width = windowConfig.width || 400;     // Default width if none is specified
        this.window = window;
        this.screen = window.screen;
        this.nwWindow = nwWindow;

        // Setup our node-webkit window
        // See https://github.com/rogerwang/node-webkit/wiki/Window
        nwWindow.title = this.projectDir;
        nwWindow.setAlwaysOnTop(windowConfig.alwaysOnTop || false);

        this.resizeWindow(windowConfig);
        setTimeout(function() {
            app.moveWindow(windowConfig);
            nwWindow.show();
        }, 50);   // Give time for webkit to resize the window before moving and showing it
    },

    // Set up Task instances from an array of task specs
    initTasks: function(taskList) {
        var app = this;
        var resizeFn = app.resizeWindow.bind(app);

        app.$('#taskContainer').html('');
        taskList.forEach(function(taskSpec) {
            taskSpec.rootDir = app.projectDir;
            var t = new Task(taskSpec);
            var v = new TaskView({ model: t });
            v.on('changeStatus', resizeFn);
            app.$('#taskContainer')[0].appendChild(v.el);
            t.run();
        });

        if (!this.started) Task.startLoop(this.projectDir);
        this.started = true;
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
    },

    // Handle keypresses app-wide
    keypressDispatch: function(evt) {
        // Hitting Ctrl-d opens the devtools:
        if (evt.keyCode === 68 && evt.ctrlKey) this.nwWindow.showDevTools();
        // Hitting Ctrl-r refreshes the page/window:
        // FIXME: this inits an additional recursive file watcher; should clean up the old one
        if (evt.keyCode === 82 && evt.ctrlKey) {
            this.configure(this.projectDir);    // Reload .shamus.json
            this.start();                       // Restart tasks
        }
    }
});
