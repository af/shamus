Shamus
========

A desktop application that watches a directory and runs tasks when
specified files change. Built with javascript and node-webkit, it should
work on OS X, Linux, and Windows.

NOTE! This project is still under under active development and isn't yet
generally useful. However, you can run its own tasks while hacking on it,
and it seems to actually be really handy!


Example Uses
------------

* Run your tests automatically when your code changes, and get instant
  feedback without leaving your editor.

* Run build tasks when your code changes.


Installing and Running the app
------------------------------

1. Install the app with `npm install -g shamus`

1. Create a `.shamus.json` file in the root directory of the project you want
   to work on. Here's an example file that will run jshint (assuming you have it
   installed) every time a javascript file in your root dir changes.

   ```
   {
    "tasks": [
        {
            "name": "JSHint",
            "command": "jshint .",
            "parser": "exitcode",
            "fileMatcher": ".js$"
        }
    ]
   }
   ```

1. Still in your project's root directory, enter `shamus` from the terminal.
   Shamus should start and report jshint's results.


License
-------
MIT
