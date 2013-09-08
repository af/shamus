Sentinel
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


Building and Running the app
----------------------------

These instructions are for OS X, it should be pretty similar on any other unix OS.

1. Download a prebuilt binary from https://github.com/rogerwang/node-webkit/,
   and save it to the root directory of this repository.
2. Run the following command (obviously the second part will change if you are
   not on a Mac:

```
zip -r app.nw index.html css js package.json; ./node-webkit.app/Contents/MacOS/node-webkit app.nw
```


License
-------
MIT
