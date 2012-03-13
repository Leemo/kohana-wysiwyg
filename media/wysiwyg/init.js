(function($) {
  $(function(){
    for(var environment in wysiwyg_config) {
      var env = wysiwyg_config[environment];

      if (typeof(env.config.filebrowser) != "undefined"
        && env.config.filebrowser !== false) {

        for (var key in filebrowser_config) {
          env.config[key] = filebrowser_config[key];
        }
      }

      $(env.selector).ckeditor(env.config);
    }
    // set output HTML code rules

    CKEDITOR.on( 'instanceReady', function( ev ) {
      var writer = ev.editor.dataProcessor.writer,

      tags = ['p','h1','h2','h3','h4','h5','h6','dl','dt','dd','div','ul','li'];

      writer.indentationChars = '   ';

      for (var i=0; i<tags.length; i++) {
        writer.setRules(tags[i],
        {
          indent : true,
          breakBeforeOpen : true,
          breakAfterOpen : true,
          breakBeforeClose : true,
          breakAfterClose : true
        });
      }
    });
  });
}(jQuery));