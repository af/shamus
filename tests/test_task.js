var assert = require('assert');
var Task = require('../js/task');

describe('Task model', function() {
    it('parses a string command to spawn()\'s format', function() {
        var t = new Task();
        var result = t.parseCommand('foo 1 2 3');
        assert.strictEqual(result.cmd, 'foo');
        assert.strictEqual(result.args.length, 3);
        assert.strictEqual(result.args[0], '1');
        assert.strictEqual(result.args[1], '2');
        assert.strictEqual(result.args[2], '3');
    });
});
