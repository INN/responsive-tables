(function() {
  var spinner;

  function create_index_html() {
    var rendered;
    $.ajax({
      url: "templates/index.html",
      async: false,
      success: function(data) {
        rendered = swig.render(data, {
          locals: {
            ua_code: $('#basics-ga').val(),
            key:     getKey($('#basics-keyurl').val()),
            columns: JSON.stringify(getColumnsData()),
            title:   $('#basics-title').val()
          },
          autoescape: false
        });
      }
    });
    return rendered;
  }

  function setBreakpoints() {
    var breakpoint = $('#breakpoint input').val();
    if (breakpoint !== '') {
      return {
        'tablesaw/tablesaw.css': setBreakpoint('assets/tablesaw/tablesaw.css', breakpoint),
        'style.css': setBreakpoint('assets/style.css', breakpoint)
      };
    }
    return false;
  }

  function create_zip() {
    // loading pre-created zip, instead of loading and adding all the files
    JSZipUtils.getBinaryContent("webapp/build.zip", function (err, data) {
      if (err)
        throw err;

      var zip = new JSZip(data),
          html = create_index_html(),
          css = setBreakpoints();

      zip.file("index.html", html); // names index.html and adds it to the zip

      if (css)
        $.each(css, function(k, v) { zip.file(k, v); });

      var content = zip.generate({ type: "blob" }), //generates the zip
          filename = $('#basics-title').val() + ".zip";

      saveAs(content, filename); // with browser support, saves it to your default save location
    });
  }

  function getKeyFromUrl(url) {
    var toSlashes = /[\/&=?#]+/gi,
        url = url.replace(toSlashes, "/").split('/');
    url.sort(function (a, b) { return b.length - a.length; });
    return(url[0]);
  }

  function getKey(value) {
    if (validateKey(value)) {
      return value;
    } else if (value.length >= 44) {
      return getKeyFromUrl(value);
    } else {
      alert("Invalid key or URL:\n\n" + value);
      loadingStop();
    }
  }

  function preview(html) {
    $('#previewTable').show();
    $('#table-iframe-container').html('');
    window.location.href = '#previewTable';

    var params = {
      key: getKey($('#basics-keyurl').val()),
      breakpoint: ($('#breakpoint input').val() !== '')? $('#breakpoint input').val() : '60em',
      columns: btoa(JSON.stringify(getColumnsData()))
    };

    var url = 'webapp/preview.html?' + decodeURIComponent($.param(params));

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
      key: getKey($('#basics-keyurl').val()),
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

  function hidePreview() {
    $('#previewTable').hide();
    window.location.href = '#';
    $('#table-iframe-container').html('');
  }

  function goToTab(tab) {
    var li = $('li[data-tab="' + tab + '"]');
    li.siblings().removeClass('active');
    li.addClass('active');
    $('.tab').hide();
    $('#' + tab).show();
  }

  $(document).ready(function () {
    // Fetch the spreadsheet data when url/key is pasted or changed
    var keyOrUrlUpdate = function() {
      var key = getKey($('#basics-keyurl').val());
      hidePreview();
      loadingStart();
      if (key) {
        $('#basics-keyurl').val(key);
        startTabletop();
      } else
        loadingStop();

      $('#basics-keyurl').off('keyup');
    };
    $('#basics-keyurl').on('paste', function() {
      $(this).on('keyup', keyOrUrlUpdate);
    });

    // Starts tabletop, gets spreadsheet JSON
    $('#start-tabletop').click(function() {
      loadingStart();
      startTabletop();
    });

    // Builds zip, embeds in preview div
    $('#preview').click(preview);

    // Builds and delivers the zip to the reader
    $('#build-zip').click(function() {
      goToTab('upload-embed');
      create_zip();
    });

    // Focus on url/key field on ready
    setTimeout(function() { $('#basics-keyurl').focus(); }, 0);

    // Tab nav
    var active_tab = $('#tab-nav li.active').data('tab');
    $('#' + active_tab).show();

    $('#tab-nav li').click(function() {
      goToTab($(this).data('tab'));
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
