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
		ua_code = "<!-- Google Analytics code not set in generator, therefore no analytics. Paste your own here. -->"	
	}
	return(index_html({html_ua: ua_code, html_key: basics_key, html_columns: basics_columns, html_title: basics_title}));
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

$(document).ready(function () {
	$.get("templates/index.html", function (data) {
		template_html = String(data);
	});
	$('#build-zip').click(function () {
		foo = $('#basics-columns').val();
		console.log(foo);
		basics_title = $('#basics-title').val();
		basics_url = $('#basics-url').val(); //parse this for basics_key later
		basics_key = $('#basics-key').val(); //check for validity later
		basics_ga = $('#basics-ga').val();
		basics_columns = $('#basics-columns').text();
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