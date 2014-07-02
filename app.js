function clear_form(selector) {
	$(selector).val('');
};

function create_zip(index_html) {
	// loading a zip file
	JSZipUtils.getBinaryContent("build.zip", function (err, data) {
		if(err) {
			throw err; // or handle the error
		}
		var zip = new JSZip(data);
		zip.file("index.html", index_html);
	});
}



$(document).ready(function(){
});