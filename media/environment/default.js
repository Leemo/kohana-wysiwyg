(function($) {
  $.wysiwyg_config = {
    // Main configuration
    skin:        "kama",
    filebrowser: true,

    // Filebrowser settings
    filebrowserBrowseUrl:      "wysiwyg/filebrowser/browse",
    filebrowserImageBrowseUrl: "wysiwyg/filebrowser/images",
    filebrowserFlashBrowseUrl: "wysiwyg/filebrowser/flash",
    filebrowserUploadUrl:      "wysiwyg/filebrowser/upload",
    filebrowserImageUploadUrl: "wysiwyg/filebrowser/upload",
    filebrowserFlashUploadUrl: "wysiwyg/filebrowser/upload"
  };

  $(function() {

    // Понеслася! (rus. "Here we go!") :)
    $(".rte").ckeditor($.wysiwyg_config);

    // set output HTML code rules
    CKEDITOR.on( 'instanceReady', function(ev) {
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
  })
}(jQuery));