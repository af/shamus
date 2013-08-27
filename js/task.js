var fs = require('fs');
var spawn = require('child_process').spawn;

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
        console.log('WATCHING');

        var watchRegex = new RegExp(task.watchMatcher);
        fs.watch('.', function(evt, filename) {
            console.log(filename + ' changed!');
            if (watchRegex.test(filename)) {
                task.run();
            }
        });
    },

    run: function() {
        console.log('RUNNING');
        var task = this;
        task.isRunning = true;
        // TODO: parse string to cmd & args
        var cmd = spawn('mocha', ['test.js', '-R', 'tap']);

        // TODO: pluggable stdout parser
        cmd.stdout.pipe(require('tub')(function(x) {
            console.log(require('util').inspect(x, { depth: null }));
            task.isOK = x.ok;
            task.isRunning = false;
        }));
    }
});
