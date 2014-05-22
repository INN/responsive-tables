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

## Embedding the table on your site

This code snippet assumes you are have jQuery loaded on the site where you plan to embed your table.

    <script type="text/javascript">
    (function() {
      var $ = jQuery;
      var setHeight = function() {
       $('#table-iframe').height('auto');
       $('#table-iframe').height($('#table-iframe').contents().height());
      };
      $(function() {
        $('#table-iframe').on('load', setHeight);
        $(window).on('resize', setHeight);
      });
    }());
    </script>
    <iframe src="http://yourdomain.com/path/to/index.html"
        id="table-iframe"
        scrolling="auto"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        style="width:100%;">Loading...</iframe>
    </script>

Be sure and replace `http://yourdomain.com/path/to/index.html` with the actual URL of your table.

Note: the script portion of the code snippet is what makes the iframe responsive. Currently, this embed snippet does not work cross domain. Your table must be hosted on the same domain as the site you plan to embed it on.

## Libraries used

This little project uses [tabletop](https://github.com/jsoma/tabletop) and [tablesaw](https://github.com/filamentgroup/tablesaw/). Check them out!

