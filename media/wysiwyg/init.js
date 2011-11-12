(function($) {
  $(document).ready(function(){
    for(var environment in wysiwyg_config) {
      var env = wysiwyg_config[environment];

      if (typeof(env.config.filebrowser) != "undefined"
        && env.config.filebrowser !== false) {

        for (var key in filebrowser_config) {
          env.config[key] = filebrowser_config[key];
        }
      }

      $(env.selector).ckeditor(env.config);
      CKEDITOR.on( 'instanceReady', function(e) {
                   alert("loaded")
           });
    }
  })
}(jQuery));