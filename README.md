# Responsive tables

[Generate responsive tables using the webapp](http://inn.github.io/responsive-tables/)

🚨 This project is **not maintained or supported,** as of [February 16, 2018](https://github.com/INN/responsive-tables/commit/5ab7f9673a9431ebbbb471e19fdd4e0787f87b2f). 🚨

## What is it?

This repo contains two utilities that do the same thing:

- A [simple webapp](http://inn.github.io/responsive-tables/) that takes your Google Drive spreadsheet key, lets you format the columns, then generates a .zip with a ready-for-deployment responsive table and all required assets.
- A simple `render.py` script that reads from `config.json` to find your Google Drive spreadsheet key and column formatting information then generates a build directory with a ready-for-deployment responsive table and all required assets.

It works best with tables that have 5-7 columns.

## Webapp Usage

[Use the webapp](http://inn.github.io/responsive-tables/). We've published it on GitHub pages for ease of use. 

1. Paste in your URL
2. Configure your column headers and the table title
3. Optionally, add your Google Analytics ID
4. Optionally, preview the table
5. Download the `.zip` and unzip it to your server
6. [Embed the table in your site](#embedding-the-table)

## Script usage

If you want to use the script instead of the webapp, go ahead and install this repository on your computer. 

### Setup

You'll need [Jinja2](http://jinja.pocoo.org/) and Python for this project.

    sudo easy_install pip
    pip install -r requirements.txt
    
Install this repository:

    git clone https://github.com/INN/responsive-tables.git

[Publish](https://support.google.com/docs/answer/37579?authuser=0) your Google Spreadsheet.

### Configuration

Copy `config-example.json` to `config.json`. Open `config.json` and add your spreadsheet's key. The key is a long sequence of apparently-random characters, such as `10yccwbMYeIHdcRQazaNOaHSkpoSa1SUJEtWBfWPsgx0`, found in the URL of the page you use to edit the spreadsheet. An example URL is https://docs.google.com/spreadsheets/d/10yccwbMYeIHdcRQazaNOaHSkpoSa1SUJEtWBfWPsgx0/edit#gid=0, which was used to generate [this embedded example](http://labs.inn.org/discounts/). The key may include dashes. The key is also included in the URL found in the "Document link" field of the [Publish to web](https://support.google.com/docs/answer/183965/?hl=en&authuser=0) dialog. 

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
    
If the project renders successfully but you have a blank page, make sure your document is [published](https://support.google.com/docs/answer/183965?rd=1&authuser=0) and that permissions allow anyone with the link to view the document. 

### Multiple configurations

As a convenience, you can create config files and store them in the `configs` directory to ease re-rendering of tables.

For example, if you create a config file named `myspecialtable.json`, then you can tell `render.py` to render that specific configuration like so:

    ./render.py -c myspecialtable

### Deploying to server

Copy the contents of the `build` directory to a directory on your website.

## Embedding the table

We're using [pym.js](http://blog.apps.npr.org/pym.js/) to make our tables responsive when embedded via iframe.

To embed a table, you can use this snippet to get started:

    <div id="table-iframe-container"></div>
    <script src="https://pym.nprapps.org/pym.v1.min.js"></script>
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

Are the simplified labels in your `config.json` composed only of lowercase letters, numbers, and dashes?

**No data shows**:

Is your spreadsheet [published](https://support.google.com/docs/answer/183965?rd=1&authuser=0)?

## Libraries used

This little project uses:

- [pym.js](http://blog.apps.npr.org/pym.js/), 
- [tabletop](https://github.com/jsoma/tabletop), 
- [tablesaw](https://github.com/filamentgroup/tablesaw/) 
- [JSzip](https://stuk.github.io/jszip/) and [JSzip-utils](https://stuk.github.io/jszip-utils/)
- [FileSaver.js](http://eligrey.com/blog/post/saving-generated-files-on-the-client-side)

Check them out!

