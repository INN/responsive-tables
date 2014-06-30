# Responsive tables

## What is it?

A simple `render.py` script that reads from `config.json` to find your Google Drive spreadsheet key and column formatting information then generates a `build` directory with a ready-for-deployment responsive table and all required assets.

It works best with tables that have 5-7 columns.

## Usage

### Setup

Start by downloading this repository [as a .zip](https://github.com/INN/responsive-tables/archive/master.zip) or via git:

    git clone https://github.com/INN/responsive-tables.git

[Publish](https://support.google.com/docs/answer/37579?authuser=0) your Google Spreadsheet.

### Configuration

Copy `config-example.json` to `config.json`. Open `config.json` and add your spreadsheet's key. The key is a long string, such as `10yccwbMYeIHdcRQazaNOaHSkpoSa1SUJEtWBfWPsgx0` in https://docs.google.com/spreadsheets/d/10yccwbMYeIHdcRQazaNOaHSkpoSa1SUJEtWBfWPsgx0/edit#gid=0, which was used to generate [this embedded example](http://nerds.investigativenewsnetwork.org/discounts/). The key may include dashes. 

Fill in `title` to set the table's title tag.

Fill in `ua_code` to enable Google Analytics.

    {
        "ua_code": "googleanalyticsuacodegoeshere",
        "title": "Title tag",
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

Each item in the `columns` array follows the format `["simplifiedlabel", "Label for display"]`. Simplified labels are the column headings in your document with spaces and underscores removed, and uppercase letters made lowercase. Allowed characters are lowercase a-z, numbers, and the `-` character. 

### Render

Once you've filled in `config.json`, run:

    ./render.py

This will create a build directory and place a copy of your rendered table and all assets inside it. You can deploy the contents of this directory to your host as-is.

If you receive the following error, you do not have Jinja2 installed, which this program uses for templates.

    Traceback (most recent call last):
      File "./render.py", line 11, in <module>
        from jinja2 import Environment, FileSystemLoader
    ImportError: No module named jinja2
    
[Follow these instructions](http://jinja.pocoo.org/docs/intro/#installation) to install Jinja2, a Python templating engine.

If the project renders successfully but you have a blank page, make sure your document is [published](https://support.google.com/docs/answer/183965?rd=1&authuser=0) and that permissions allow anyone with the link to view the document. 

### Multiple configurations

As a convenience, you can create config files and store them in the `configs` directory to ease re-rendering of tables.

For example, if you create a config file named `myspecialtable.json`, then you can tell `render.py` to render that specific configuration like so:

    ./render.py -c myspecialtable

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

Be sure to replace `http://yourdomain.com/path/to/index.html` with the actual URL of your table.

## Troubleshooting

**Data in wrong column**:

Are the simplified labels in your `config.json` entirely lowercase and without capitals or underscores?

**No data shows**:

Is your spreadsheet [published](https://support.google.com/docs/answer/183965?rd=1&authuser=0)?

**Render fails with an error mentioning jinja2**:

Install [Jinja2](http://jinja.pocoo.org/docs/intro/#installation)

## Libraries used

This little project uses [pym.js](http://blog.apps.npr.org/pym.js/), [tabletop](https://github.com/jsoma/tabletop), [tablesaw](https://github.com/filamentgroup/tablesaw/) and [Jinja2](http://jinja.pocoo.org/). Check them out!

