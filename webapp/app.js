(function() {
  var basics_title = '',
      basics_key = '',
      basics_ga = '',
      basics_columns = '',
      ua_code = '';

  function create_index_html() {
    var rendered;
    $.ajax({
      url: "/templates/index.html",
      async: false,
      success: function(data) {
        rendered = swig.render(data, {
          locals: {
            ua_code: ua_code,
            key: basics_key,
            columns: basics_columns,
            title: basics_title
          },
          autoescape: false
        });
      }
    });
    return rendered;
  }

  function create_zip() {
    // loading pre-created zip, instead of loading and adding all the files
    JSZipUtils.getBinaryContent("webapp/build.zip", function (err, data) {
      if (err)
        throw err;

      var zip = new JSZip(data),
          html = create_index_html(); // creates index.html

      zip.file("index.html", html); // names index.html and adds it to the zip
      var content = zip.generate({ type: "blob" }), //generates the zip
          filename = basics_title + ".zip";

      saveAs(content, filename); // with browser support, saves it to your default save location
    });
  }

  function getKeyFromUrl() {
    var toSlashes = /[\/&=?#]+/gi,
        basics_url = basics_key.replace(toSlashes, "/").split('/');
    basics_url.sort(function (a, b) { return b.length - a.length; });
    return(basics_url[0]);
  }

  function getKey() {
    if (validateKey(basics_key)) {
      return basics_key;
    } else if (basics_key.length >= 44) {
      basics_key = getKeyFromUrl();
      return basics_key;
    } else {
      alert("Invalid key or URL:\n\n" + basics_key);
    }
  }

  function showInfo(data) {
    var columns_array = Object.keys(data[0]).map(function(item) { return [item, '']; }),
        doubleToSingleQuotes = /["\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u301D\u301E\u301F\uFF02\uFF07]/g; // Matches " and any Unicode quote-like character

    columns_array = JSON.stringify(columns_array).replace(doubleToSingleQuotes, "\"");
    columns_array = columns_array.replace(/\]\,/g, "],\n");

    // outputs to the columns textarea
    $('#basics-columns').html(columns_array);
    // Title to the title <input> 
    $('#basics-title').val( Object.keys(tabletop.models)[0].toString() );
  }

  function startTabletop() {
    tabletop = Tabletop.init({
      key: getKey(),
      callback: showInfo,
      debug: true,
      simpleSheet: true
    });
  }
  
  function validateKey(key) {
    if (key.match(/[0-9a-z-]{44}/ig) && key.length === 44) {
      return true;
    } else {
      return false;
    }
  }

  $(document).ready(function () {
    // Updates basics_key when #basics-keyurl is updated URL
    $('#basics-keyurl').change(function() {
			basics_key = $('#basics-keyurl').val();
      basics_key = getKey();
      $('#basics-keyurl').val(basics_key);
      startTabletop();
    });
    // Updates basics_ga when #basics-ga is updated
    $('#basics-ga').change(function() {
      basics_ga = $('#basics-ga').val();
    });
    // Updates basics_title when #basics-title is updated
    $('#basics-title').change(function() {
      basics_title = $('#basics-title').val();
    });

    // Starts tabletop, gets spreadsheet JSON
    $('#start-tabletop').click(function() {
      startTabletop();
    });

    // Builds and delivers the zip to the reader
    $('#build-zip').click(function () {
      try {
        var columns_json = JSON.parse($('#basics-columns').val()); // make sure columns definition is valid JSON
        basics_columns = JSON.stringify(columns_json); // this really should be validated somehow
      } catch (err) {
        throw new Error("Unable to parse your column definition. Columns must be defined using valid JSON.");
      }
      create_zip();
    });

    // Responsive navigation
    $('.navbar .toggle-nav-bar').each( function() {
      var toggleButton = $(this);
      var navbar = toggleButton.closest('.navbar');

      // Support both touch and click events
      toggleButton.on( 'touchstart.toggleNav', function() {
        // If it is a touch event, get rid of the click events.
        toggleButton.off( 'click.toggleNav' );
        navbar.toggleClass( 'open' );

        // Close all the open sub navigation upon closing the menu
        if ( !navbar.hasClass( 'open' ) ) {
          navbar.find( '.nav-shelf li.open' ).removeClass( 'open' );
        }
      });

      toggleButton.on( 'click.toggleNav', function() {
        navbar.toggleClass( 'open' );
      });

      // Secondary nav
      navbar.on( 'touchstart.toggleNav click.toggleNav', '.nav-shelf .caret', function( event ) {
        // Only handle when
        if ( toggleButton.css( 'display') == 'none' ) {
          return;
        }

        if ( event.type == 'touchstart' ) {
          navbar.off( 'click.toggleNav', '.nav-shelf .caret' );
        }

        var li = $( event.target ).closest('li');

        // Close the others if we are opening
        if ( !li.hasClass('open') ) {
          navbar.find( '.nav-shelf li.open' ).removeClass( 'open' );
        }

        // Open ours
        li.toggleClass( 'open' );

        event.preventDefault();
      });
    } );
  });
})();
