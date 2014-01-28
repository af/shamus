Shamus
========

Shamus is a desktop application that watches a directory and runs tasks when
specified files change. Built with javascript and node-webkit, it should
work on OS X, Linux, and Windows. (Note that only OS X is tested at this time,
please file an issue if you have problems on other platforms)


Example Uses
------------

* Run your tests automatically when your code changes, and get instant
  feedback without leaving your editor.

* Run build tasks effortlessly when your code changes.

* Unlike CLI-based watchers and test/task runners, feedback is provided instantly
  through a dedicated app, which you can set to always be "on top" if you like.
  This is in contrast to keep separate console sessions open for every watcher
  and/or manually triggering build tasks in the shell.


Installing and Running the app
------------------------------

1. Install the app with `npm install -g shamus`

1. In your project's directory, run `shamus init`, which will create a `.shamus.json`
   file that holds the task declarations for this directory. You will want to
   customize this for your use, but by default it should look something like:

   ```
   {
      "window": {
          "alwaysOnTop": true,
          "top": 0,
          "right": 0
      },

      "tasks": [
          {
              "name": "JSHint",
              "command": "jshint .",
              "parser": "exitcode",
              "fileMatcher": "\\.js$"
          }
      ]
   }
   ```

   This config will have shamus run jshint (assuming you have it installed)
   every time a javascript file in your project directory changes.

   You'll also notice the `window` settings that will align shamus's
   window to the top-right of your screen, and keep it on top of other
   windows on your desktop.


1. Still in your project's root directory, enter `shamus` from the terminal.
   Shamus should start and report jshint's results.


JSON Config Format
------------------

A `.shamus.json` config file tells Shamus which tasks to run (the `"tasks"`
section, which should contain an array of task objects), and how to display
the app on the desktop (the optional `"window"` section). The following keys
are supported

### task objects

* `command` - The command to run when a matched file changes
* `fileMatcher` - A regular expression string that matches files that, when
                  they change, trigger the task run
* `parser` - (optional) How to parse the output of the task, and determine
             whether it succeeded or failed. See the Parsers section below.
* `name` - (optional) The name of the task, as displayed in the shamus app.

### window parameters

All window parameters are optional, and you can omit the section entirely

* `alwaysOnTop` - The shamus window will always be on top of all other windows
* `width` - The width of shamus's window, in pixels. Defaults to 400.
* `top`, `bottom`, `left`, `right` - Similar to CSS's properties, these parameters
  let you set where shamus should sit on your desktop. For example, using
  `"right": 0, "top": 0` will put the window in the top right corner of your desktop.



Parsers
-------

Shamus ships with a couple of simple parsers, which check the results of
your task process and report a success or failure to the app. If no parser
is specified for a task, `"exitcode"` will be used.

* `"exitcode"` - Detects a success if the task process has an exit code of 0.
* `"tap"` - Parses [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol)
            output and reports success if there are 0 failures.


Tips and Tricks
---------------
* `Ctrl-r` refreshes the app (and detects changes to `.shamus.json`)
* `Ctrl-d` opens the node-webkit devtools
* If you’re hacking on shamus, use `npm start` to launch the app, instead of
  the `shamus` script. This will ensure that all app logging and tracebacks
  will be dumped to the terminal where the app was launched.


Screenshots
-----------

Examples of the app running on its own codebase:

![Success](https://raw.github.com/af/shamus/master/docs/images/screenshot_success.png)
![Failure](https://raw.github.com/af/shamus/master/docs/images/screenshot_error.png)


License
-------
MIT
