var test = require('tape');
var Task = require('../js/task');

test('Task model command parsing', function(t) {
    t.plan(5);

    var task = new Task();
    var result = task.parseCommand('foo 1 2 3');
    t.equal(result.cmd, 'foo');
    t.equal(result.args.length, 3);
    t.equal(result.args[0], '1');
    t.equal(result.args[1], '2');
    t.equal(result.args[2], '3');
});
