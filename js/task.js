var spawn = require('child_process').spawn;
var watch = require('node-watch');

var Backbone = require('backbone');
var Backprop = require('backprop');
Backprop.monkeypatch(Backbone);

module.exports = Backbone.Model.extend({
    name: Backbone.property({ coerce: String, default: 'Unnamed task' }),
    command: Backbone.property({ coerce: String }),
    watchMatcher: Backbone.property({ coerce: String }),
    isRunning: Backbone.property({ coerce: Boolean, default: false }),
    isActive: Backbone.property({ coerce: Boolean, default: true }),
    isOK: Backbone.property({ coerce: Boolean }),

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
        // TODO: parse string to cmd & args
        var parsedCommand = this.parseCommand(this.command);
        var taskObj = spawn(parsedCommand.cmd, parsedCommand.args);

        // TODO: pluggable stdout parser
        taskObj.stdout.pipe(require('tub')(function(x) {
            console.log(require('util').inspect(x, { depth: null }));
            task.isOK = x.ok;
            task.isRunning = false;
        }));
    }
});
