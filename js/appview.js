var Backbone = require('backbone');

var Task = require('./task');
var TaskView = require('./taskview');


// AppView
// A Backbone view to manage UI at the app/window level.
// document.body should be passed in as view.el.
module.exports = Backbone.View.extend({
    menubarHeight: 22,     // Accurate on OS X 10.8, probably needs to be adjusted for platform

    initWindow: function(window) {
        this.window = window;
        this.screen = window.screen;

        this.moveWindow();
        this.resizeWindow();
    },

    // Set up Task instances from an array of task specs
    initTasks: function(taskList) {
        var app = this;
        var resizeFn = app.resizeWindow.bind(app);
        taskList.tasks.forEach(function(taskSpec) {
            var t = new Task(taskSpec);
            var v = new TaskView({ model: t });
            v.on('changeStatus', resizeFn);
            app.$('#taskContainer')[0].appendChild(v.el);
        });
        Task.startLoop();
    },

    // Position the window in the top right of the screen on startup.
    // TODO: make window position a config option and pass it in
    moveWindow: function() {
        this.window.moveTo(this.screen.width - this.window.outerWidth, 0);
    },

    // Resize window so it takes exactly the same height as the list of tasks:
    resizeWindow: function() {
        var view = this;
        var w = this.window;

        // Give webkit a little time to re-render the resized elements before we detect the
        // height to change the window to:
        setTimeout(function() {
            var height = w.getComputedStyle(view.el).height;
            w.resizeTo(w.outerWidth, parseFloat(height) + view.menubarHeight);
        }, 10);
    }
});
