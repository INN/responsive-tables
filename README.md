# Responsive tables

## What is it?

A simple `render.py` script that reads from `config.json` to find your Google Drive spreadsheet key and column formatting information then generates a `build` directory with a ready-for-deployment responsive table and all required assets.

It works best with tables that have 5-7 columns.

## Usage

### Configuration

Copy `config-example.json` to `config.json`. Open `config.json` and add your spreadsheet's key.

    {
        "key": "yourspreadsheetkeygoeshere",
    ...

Next, define the columns to display in your table. For example:

    ...
        "columns": [
          ["tool", "Tool"],
          ["category", "Category"],
          ["typeofresource", "Type of resource"],
          ["developingmember", "Developing member"],
          ["description", "Description"],
          ["url", "link"],
          ["notes", "notes"]
        ]
    }

Each item in the `columns` array follows the format `["simplifiedlabel", "Label for display"]`.

### Render

Once you've filled in `config.json`, run:

    ./render.py

This will create a build directory and place a copy of your rendered table and all assets inside it. You can deploy the contents of this directory to your host as-is.

## Embedding the table

We're using [pym.js](http://blog.apps.npr.org/pym.js/) to make our tables responsive when embedded via iframe.

To embed a table, you can use this snippet to get started:

    <div id="table-iframe-container"></div>
    <script src="http://yourdomain.com/path/to/pym.js"></script>
    <script type="text/javascript">
    (function() {
      var pymParent = new pym.Parent(
        'table-iframe-container',
        'http://yourdomain.com/path/to/index.html', {});
    }());
    </script>

Be sure and replace `http://yourdomain.com/path/to/index.html` with the actual URL of your table.

## Libraries used

This little project uses [pym.js](http://blog.apps.npr.org/pym.js/), [tabletop](https://github.com/jsoma/tabletop) and [tablesaw](https://github.com/filamentgroup/tablesaw/). Check them out!

