basics_title = '';
basics_url = '';
basics_key = '';
basics_ga = '';
basics_columns = '';

function create_index_html() {
	index_html = _.template(template_html);
	ua_code = ' ';
	if (basics_ga !== '') {
		// Doing the Analytics by hand, which should be a template
		ua_code = "<!-- begin analytics <script type='text/javascript'> var _gaq = _gaq || []; _gaq.push(['_setAccount', '" +
						basics_ga +
						"']); _gaq.push(['_trackPageview']); (function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })(); </script> end analytics -->";
	} else {
		ua_code = "<!-- Google Analytics code not set in generator, therefore no analytics. Paste your own here. -->";
	}
	return (index_html({html_ua: ua_code, html_key: basics_key, html_columns: basics_columns, html_title: basics_title}));
}

function create_zip(index_html) {
	create_index_html();
	// loading pre-created zip, instead of loading and adding all the files
	JSZipUtils.getBinaryContent("build.zip", function (err, data) {
		if (err) {
			throw err; // or handle the error
		}
		var zip = new JSZip(data);
		var index_html_file = create_index_html(); // creates index.html
		zip.file("index.html", index_html_file); // names index.html and adds it to the zip
		var content = zip.generate({type: "blob"}); //generates the zip
		var filename = basics_title + ".zip";
		saveAs(content, filename); // with browser support, saves it to your default save location
	});
}

function getKeyFromUrl() {
	var toSlashes = /[/&=?#]+/gi;
	basics_url = $('#basics-url').val().replace(toSlashes, "/").split('/');
	basics_url.sort(function (a, b) { return b.length - a.length; });
	return(basics_url[0]);
}
function getKey() {
	if (validateKey(basics_key)) {
		return basics_key;	
	} else if (basics_url.length >= 44) {
		basics_key = getKeyFromUrl();	
		return basics_key;
	} else {
		alert("Invalid key or URL\nDid you put the URL in the key box?"); 
	}
}

function showInfo(data) {
	console.log(tabletop.models.Sheet1.column_names);
	columns_array = tabletop.models.Sheet1.column_names.map(function(item) {return [item, '']});
	var doubleToSingleQuotes = /["\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u301D\u301E\u301F\uFF02\uFF07]/g // Matches " and any Unicode quote-like character
	columns_array = JSON.stringify(columns_array).replace(doubleToSingleQuotes, "'");
	$('#basics-columns').html(columns_array); // outputs to the columns textarea
}

function validateKey(key) {
	if (key.length === 44) {
		return true;
	} else {
		return false;
	}
}



$(document).ready(function () {
	// Loads the template, once the page has loaded
	$.get("templates/index.html", function (data) {
		template_html = String(data);
	});
	
	// Updates basics_key and basics_url when #basics-url is updated URL
	$('#basics-url').change(function() {
		basics_key = getKeyFromUrl();
		$('#basics-key').val(basics_key);
	});
	// Updates basics_key when #basics-key is updated
	$('#basics-key').change(function() {
		basics_key = $('#basics-key').val();
	});
	// Updates basics_ga when #basics-ga is updated
	$('#basics-ga').change(function() {
		basics_ga = $('#basics-ga').val();
	});
	// Updates basics_title when #basics-ga is updated
	$('#basics-title').change(function() {
		basics_title = $('#basics-title').val();
	});

	
	// Starts tabletop, gets spreadsheet JSON
	$('#start-tabletop').click(function() {
		tabletop = Tabletop.init( { key: getKey(), 
															 callback: showInfo, 
															 debug: true, 
															 simpleSheet: true } );
	});
	
	// Builds and delivers the zip to the reader
	$('#build-zip').click(function () {
		foo = $('#basics-columns').val();
		console.log(foo);
		basics_columns = $('#basics-columns').text(); // this really should be validated somehow
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