var getParam = function(sname) {
  var params = location.search.substr(location.search.indexOf("?")+1);
  var sval = "";
  params = params.split("&");
    // split param and value into individual pieces
    for (var i=0; i<params.length; i++)
       {
         temp = params[i].split("=");
         if ( [temp[0]] == sname ) { sval = temp[1]; }
       }
  return sval;
};

var setBreakpoint = function(cssFile, breakpoint, applyToPage) {
  var bp, over, under, ret;

  if (breakpoint.match(/px$/g))
    bp = Math.ceil(Number(breakpoint.replace('px', '')) / Number($('body').css('font-size').replace('px', '')));
  else if (breakpoint.match(/em$/g))
    bp = Number(breakpoint.replace('em', ''));

  over = (bp + 10) + 'em',
  under = (bp - 1) + '.9375em';

  $.ajax({
    url: cssFile,
    async: false,
    success: function(css) {
      var s = $('<style />');

      var replacements = {
        '60em': bp + 'em',
        '70em': over,
        '59.9375em': under
      };

      $.each(replacements, function(k, v) {
        css = css.replace(new RegExp(k, 'g'), v);
      });

      s.html(css);
      if (applyToPage)
        $('head').append(s);

      ret = css;
    }
  });

  return ret;
};
