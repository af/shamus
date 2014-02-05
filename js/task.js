var spawn = require('child_process').spawn;
var watch = require('node-watch');

var _ = require('underscore');
var Backbone = require('backbone');
var Backprop = require('backprop');
var parsers = require('./parsers');
Backprop.extendModel(Backbone.Model);


var Task = Backprop.Model.extend({
    name: Backprop.String(),
    command: Backprop.String(),
    fileMatcher: Backprop.String(),
    rootDir: Backprop.String(),
    isRunning: Backprop.Boolean({ default: false }),
    isOK: Backprop.Boolean(),
    lastRunAt: Backprop.Date(),
    lastRunDuration: Backprop.Number(),
    lastError: Backprop.Generic(),
    parser: Backprop.String({ choices: Object.keys(parsers), 'default': 'exitcode' }),

    initialize: function() {
        var task = this;
        var watchRegex = new RegExp(task.fileMatcher);

        Task._fileBus.on('change', function(filename) {
            if (!watchRegex.test(filename)) return;

            // node-watch sometimes triggers multiple events for one file change
            // so add some simple debouncing:
            var debounceInterval = 1400;
            var timeSinceLastRun = (new Date - task.lastRunAt) || Infinity;
            if (timeSinceLastRun > debounceInterval) task.run();
        });
    },

    parseCommand: function(cmdString) {
        var parts = cmdString.split(' ');
        return {
            cmd: parts[0],
            args: parts.slice(1)
        };
    },

    success: function() {
        this.isOK = true;
        this.isRunning = false;
    },

    error: function(errObj) {
        this.lastError = errObj;
        this.isOK = false;
        this.isRunning = false;
    },

    run: function() {
        var task = this;
        task.isRunning = true;
        task.lastRunAt = new Date();
        // TODO: throttling & not running multiple times simultaneously
        var splitCmd = this.parseCommand(this.command);
        var childProcess = spawn(splitCmd.cmd, splitCmd.args, { cwd: this.rootDir });
        childProcess.on('exit', function() {
            task.lastRunDuration = (new Date() - task.lastRunAt);
        });

        var parser = parsers[this.parser];
        parser(childProcess, task);
    }
}, {

    // Static event emitter that emits 'change' events when a watched file changes:
    _fileBus: _.extend({}, Backbone.Events),

    // Static method to run a single recursive watch() over the root directory.
    // If we run one watch() per task, only the first one works for some reason.
    startLoop: function(rootDir) {
        watch(rootDir, function(filename) {
            Task._fileBus.trigger('change', filename);
        });
    }
});

module.exports = Task;
