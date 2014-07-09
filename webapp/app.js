(function() {
  var basics_title = '',
      basics_key = '',
      basics_ga = '',
      ua_code = '',
      spinner;

  function create_index_html() {
    var rendered;
    $.ajax({
      url: "templates/index.html",
      async: false,
      success: function(data) {
        rendered = swig.render(data, {
          locals: {
            ua_code: ua_code,
            key: basics_key,
            columns: JSON.stringify(getColumnsData()),
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

  function preview(html) {
    $('#table-iframe-container').html(''); // to prevent spare iframes
    var url = 'webapp/preview.html?key=' + basics_key + '&columns=' +  window.btoa(JSON.stringify(getColumnsData()));
    var pymParent = new pym.Parent(
      'table-iframe-container',
      url, {});
  }

  function showInfo(data) {
    var columns_array = Object.keys(data[0]).map(function(item) { return [item, '']; });

    $('.column-def').remove();
    $.each(columns_array, function(idx, val) {
      var input = '<tr class="column-def"><td>' + val[0] + '</td>' +
                  '<td><input type="checkbox" data-column-key="' + val[0] + '" name="use_column" checked /></td>' +
                  '<td><input type="text" data-column-key="' + val[0] + '" name="column_label" /></td></tr>';
      $('#columns-form table tbody').append(input);
    });

    $('#basics-title').val(tabletop.foundSheetNames[0]);

    $('#the-rest').fadeIn();
    loadingStop();
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

  function loadingStart() {
    if (!spinner)
      spinner = new Spinner({ color: 'white', width: 2 }).spin($('.spinner')[0]);

    $('.loading-modal').show();
  }

  function loadingStop() {
    $('.loading-modal').hide();
  }

  function getColumnsData() {
    var ret = [],
        container = $('#columns-form');

    $.each(container.find('input'), function(k, v) {
      if ($(this).attr('name') == 'use_column' && $(this).is(':checked')) {
        var label = container.find('input[name="column_label"][data-column-key="' + $(this).data('column-key') +'"]');
        ret.push([$(this).data('column-key'), label.val()]);
      }
    });

    return ret;
  }

  $(document).ready(function () {
    // Updates basics_key when #basics-keyurl is updated URL
    var keyOrUrlUpdate = function() {
      loadingStart();
      basics_key = $('#basics-keyurl').val();
      basics_key = getKey();
      $('#basics-keyurl').val(basics_key);
      startTabletop();
    };
    $('#basics-keyurl').change(keyOrUrlUpdate);
    $('#basics-keyurl').on('paste', function() {
      $(this).on('keyup', keyOrUrlUpdate);
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
      loadingStart();
      startTabletop();
    });

    // Builds zip, embeds in preview div
    $('#preview').click(function() {
      preview();
    });

    // Builds and delivers the zip to the reader
    $('#build-zip').click(function () {
      create_zip();
    });

    // Tab nav
    var active_tab = $('#tab-nav li.active').data('tab');
    $('#' + active_tab).show();

    $('#tab-nav li').click(function() {
      active_tab = $(this).data('tab');
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      $('.tab').hide();
      $('#' + active_tab).show();
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
