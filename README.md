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

TODO: document this. Although the example above covers most of it.


Parsers
-------

Shamus ships with a couple of simple parsers, which check the results of
your task process and report a success or failure to the app:

* `"exitcode"` - Detects a success if the task process has an exit code of 0.
* `"tap"` - Parses [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol)
            output and reports success if there are 0 failures.


Screenshots
-----------

Examples of the app running on its own codebase:

![Success](https://raw.github.com/af/shamus/master/docs/images/screenshot_success.png)
![Failure](https://raw.github.com/af/shamus/master/docs/images/screenshot_error.png)


License
-------
MIT
