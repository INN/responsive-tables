# Responsive tables

[Generate responsive tables using the webapp](http://inn.github.io/responsive-tables/)

## What is it?

A [simple webapp](http://inn.github.io/responsive-tables/) that takes your Google Drive spreadsheet key, lets you format the columns, then generates a .zip with a ready-for-deployment responsive table and all required assets.

It works best with tables that have 5-7 columns.

## Usage

[Use the webapp](http://inn.github.io/responsive-tables/). We've published it on GitHub pages for ease of use. 

1. Paste in your URL
2. Configure your column headers and the table title
3. Optionally, add your Google Analytics ID
4. Optionally, preview the table
5. Download the `.zip` and unzip it to your server
6. [Embed the table in your site](#embedding-the-table)

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

Be sure to replace `http://yourdomain.com/path/to/index.html` with the actual URL of your table, and to replace `http://yourdomain.com/path/to/pym.js` with the location of the `pym.js` file, found in the same directory.

## Troubleshooting

**Data in wrong column**:

Are the simplified labels in your `config.json` composed only of lowercase letters, numbers, and dashes?

**No data shows**:

Is your spreadsheet [published](https://support.google.com/docs/answer/183965?rd=1&authuser=0)?

## Libraries used

This little project uses:

- [pym.js](http://blog.apps.npr.org/pym.js/)
- [tabletop](https://github.com/jsoma/tabletop)
- [tablesaw](https://github.com/filamentgroup/tablesaw/)
- [JSzip](https://stuk.github.io/jszip/) and [JSzip-utils](https://stuk.github.io/jszip-utils/)
- [FileSaver.js](http://eligrey.com/blog/post/saving-generated-files-on-the-client-side)

Check them out!

