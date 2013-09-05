var spawn = require('child_process').spawn;
var watch = require('node-watch');

var Backbone = require('backbone');
var Backprop = require('backprop');
Backprop.monkeypatch(Backbone);

// Rough attempt at pluggable parsers for the output of each task's process:
var PARSERS = {
    tap: function(childProcess, task) {
        var tub = require('tub');
        childProcess.stdout.pipe(tub(function(x) {
            console.log(require('util').inspect(x, { depth: null }));
            task.isOK = x.ok;
            task.isRunning = false;
        }));
    },

    exitcode: function(childProcess, task) {
        childProcess.on('exit', function(code, signal) {
            console.log('got exit code ' + code);
            task.isOK = (code === 0);
            task.isRunning = false;
        });
    }
}

module.exports = Backbone.Model.extend({
    name: Backbone.property({ coerce: String, default: 'Unnamed task' }),
    command: Backbone.property({ coerce: String }),
    watchMatcher: Backbone.property({ coerce: String }),
    isRunning: Backbone.property({ coerce: Boolean, default: false }),
    isActive: Backbone.property({ coerce: Boolean, default: true }),
    isOK: Backbone.property({ coerce: Boolean }),
    parser: Backbone.property({ choices: ['tap', 'exitcode'], default: 'exitcode' }),

    watch: function() {
        var task = this;
        var watchRegex = new RegExp(task.watchMatcher);
        watch('.', function(filename) {
            console.log(filename + ' changed!');
            if (watchRegex.test(filename)) {
                task.run();
            }
        });
    },

    parseCommand: function(cmdString) {
        var parts = cmdString.split(' ');
        return {
            cmd: parts[0],
            args: parts.slice(1)
        };
    },

    run: function() {
        var task = this;
        task.isRunning = true;
        // TODO: throttling & not running multiple times simultaneously
        var splitCmd = this.parseCommand(this.command);
        var childProcess = spawn(splitCmd.cmd, splitCmd.args);

        var parser = PARSERS[this.parser];
        parser(childProcess, task);
    },

    start: function() {
        var task = this;

        // Not sure why timeout is needed here, but we get errors from
        // Mocha when it's not present...
        setTimeout(function() { task.run(); }, 300);
        task.watch();
    }
});
