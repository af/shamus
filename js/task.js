var spawn = require('child_process').spawn;
var watch = require('node-watch');

var _ = require('underscore');
var Backbone = require('backbone');
var Backprop = require('backprop');
Backprop.monkeypatch(Backbone);

// TODO: the current single-fileBus system can only work when watching a
// single directory. Should add an extra abstraction so that we can watch
// multiple dirs at a time from different tasks.
var fileBus = _.extend({}, Backbone.Events);

// Rough attempt at pluggable parsers for the output of each task's process:
var PARSERS = {
    tap: function(childProcess, task) {
        var tub = require('tub');
        childProcess.stdout.pipe(tub(function(x) {
            if (x.ok) task.success();
            else {
                var output = x.summary;
                x.failed.forEach(function(f) { output += ('\n\n' + f.info); });
                task.error({ msg: output });
            }
        }));
    },

    exitcode: function(childProcess, task) {
        var bufferedStderr = '';
        var bufferedStdout = '';

        // Buffer both stderr and stdout:
        childProcess.stderr.on('data', function(d) { bufferedStderr += d; });
        childProcess.stdout.on('data', function(d) { bufferedStdout += d; });

        childProcess.on('exit', function(code) {
            // Need the timeout to make sure we capture all stderr/stdout output.
            // Often the exit event comes before the last data is returned.
            setTimeout(function() {
                if (code === 0) return task.success();

                task.error({
                    code: code,
                    outputType: bufferedStderr ? 'stderr' : 'stdout',
                    msg: (bufferedStderr || bufferedStdout || '').trim()
                });
            }, 100);
        });
    }
};

module.exports = Backbone.Model.extend({
    name: Backprop.String({ default: 'Unnamed task' }),
    command: Backprop.String(),
    watchMatcher: Backprop.String(),
    isRunning: Backprop.Boolean({ default: false }),
    isActive: Backprop.Boolean({ default: true }),
    isOK: Backprop.Boolean(),
    parser: Backprop.String({ choices: ['tap', 'exitcode'], 'default': 'exitcode' }),

    initialize: function() {
        var task = this;
        var watchRegex = new RegExp(task.watchMatcher);

        // Not sure why timeout is needed here, but we get errors from
        // Mocha when it's not present...
        setTimeout(function() { task.run(); }, 300);

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
        this.isOK = false;
        this.isRunning = false;
        this.trigger('error', this, errObj);
    },

    run: function() {
        var task = this;
        task.isRunning = true;
        // TODO: throttling & not running multiple times simultaneously
        var splitCmd = this.parseCommand(this.command);
        var childProcess = spawn(splitCmd.cmd, splitCmd.args);

        var parser = PARSERS[this.parser];
        parser(childProcess, task);
    }
}, {

    // Static method to run a single recursive watch() over the root directory.
    // If we run one watch() per task, only the first one works for some reason.
    startLoop: function() {
        watch('.', function(filename) {
            fileBus.trigger('change', filename);
        });
    }
});
