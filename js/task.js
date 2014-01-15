var spawn = require('child_process').spawn;
var watch = require('node-watch');

var _ = require('underscore');
var Backbone = require('backbone');
var Backprop = require('backprop');
var parsers = require('./parsers');
Backprop.extendModel(Backbone.Model);

// TODO: the current single-fileBus system can only work when watching a
// single directory. Should add an extra abstraction so that we can watch
// multiple dirs at a time from different tasks.
var fileBus = _.extend({}, Backbone.Events);


module.exports = Backprop.Model.extend({
    name: Backprop.String({ default: 'Unnamed task' }),
    command: Backprop.String(),
    fileMatcher: Backprop.String(),
    rootDir: Backprop.String(),
    isRunning: Backprop.Boolean({ default: false }),
    isOK: Backprop.Boolean(),
    lastRunAt: Backprop.Date(),
    lastError: Backprop.Generic(),
    parser: Backprop.String({ choices: Object.keys(parsers), 'default': 'exitcode' }),

    initialize: function() {
        var task = this;
        var watchRegex = new RegExp(task.fileMatcher);

        fileBus.on('change', function(filename) {
            var isMatch = (watchRegex.test(filename));
            if (isMatch) task.run();
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

        var parser = parsers[this.parser];
        parser(childProcess, task);
    }
}, {

    // Static method to run a single recursive watch() over the root directory.
    // If we run one watch() per task, only the first one works for some reason.
    startLoop: function(rootDir) {
        watch(rootDir, function(filename) {
            fileBus.trigger('change', filename);
        });
    }
});
