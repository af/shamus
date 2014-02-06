var path = require('path');
var Backbone = require('backbone');

var Task = require('./task');
var TaskView = require('./taskview');


// Small helper class for handling config loading and default values.
function Config(rootDir) {
    this.rootDir = rootDir;
    var pathToFile = path.join(rootDir, '.shamus.json');

    this.parsed = JSON.parse(require('fs').readFileSync(pathToFile, 'utf8'));
    if (!this.parsed.watcher) this.parsed.watcher = { paths: ['.'] };
}
Config.prototype = {
    getRootDir: function() { return this.rootDir },
    getWindowSettings: function() {
        var w = this.parsed.window || {};
        w.width = w.width || 400;     // Default width if none is specified
        w.alwaysOnTop = w.alwaysOnTop || false;
        return w;
    },
    getTasks: function() {
        return this.parsed.tasks || [];
    },

    getWatchPaths: function() {
        var config = this;
        return this.parsed.watcher.paths.map(function(p) {
            return path.join(config.rootDir, p);    // Return fully resolved paths
        });
    }
};


// AppView
// A Backbone view to manage UI at the app/window level.
// document.body should be passed in as view.el.
module.exports = Backbone.View.extend({
    menubarHeight: 22,     // Accurate on OS X 10.8, probably needs to be adjusted for platform
    started: false,

    events: {
        'keyup': 'keypressDispatch'
    },

    start: function(projectDir, window, nwWindow) {
        this.config = new Config(projectDir);
        if (!this.started) this.initWindow(window, nwWindow, this.config.getWindowSettings());
        this.initTasks(this.config.getTasks());
    },

    // Set up the application window
    // window - The global js window object
    // nwWindow - The node-webkit window object
    initWindow: function(window, nwWindow, windowConfig) {
        var app = this;
        this.window = window;
        this.screen = window.screen;
        this.nwWindow = nwWindow;

        // Setup our node-webkit window
        // See https://github.com/rogerwang/node-webkit/wiki/Window
        nwWindow.title = this.config.getRootDir();
        nwWindow.setAlwaysOnTop(windowConfig.alwaysOnTop);

        this.resizeWindow();
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
            taskSpec.rootDir = app.config.getRootDir();
            var t = new Task(taskSpec);
            var v = new TaskView({ model: t });
            v.on('changeStatus', resizeFn);
            app.$('#taskContainer')[0].appendChild(v.el);
            t.run();
        });

        if (!this.started) Task.startLoop(this.config.getWatchPaths());
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
    resizeWindow: function() {
        var view = this;
        var w = this.window;
        var windowConfig = this.config.getWindowSettings();

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
        // Ctrl-d opens the devtools:
        if (evt.keyCode === 68 && evt.ctrlKey) this.nwWindow.showDevTools();

        // Ctrl-r refreshes the page/window:
        if (evt.keyCode === 82 && evt.ctrlKey) {
            this.start(this.config.getRootDir(), this.window, this.nwWindow);    // Reload .shamus.json and restart tasks
        }
    }
});
