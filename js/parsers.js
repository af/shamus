exports.tap = function(childProcess, task) {
    var onFinish = function(results) {
        if (results.ok) task.success();
        else {
            var output = results.fail.length + ' tests failed';
            results.fail.forEach(function(f) {
                var entry = ('\n\n* ' + f.name + '\n' + f.extra);
                output += entry;
            });
            task.error({
                msg: output,
                outputType: 'tap'
            });
        }
    };

    var parser = require('tap-parser')(onFinish);
    childProcess.stdout.pipe(parser);
};


exports.exitcode = function(childProcess, task) {
    var bufferedStderr = '';
    var bufferedStdout = '';

    // Buffer both stderr and stdout:
    childProcess.stderr.on('data', function(d) { bufferedStderr += d; });
    childProcess.stdout.on('data', function(d) { bufferedStdout += d; });

    childProcess.on('exit', function(code, signal) {
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
};

