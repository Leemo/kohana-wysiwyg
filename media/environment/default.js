(function($) {
  $(document).ready(function() {
    var wysiwyg_config = {

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

    // Понеслася! (rus. "Here we go!") :)
    $(".rte").ckeditor(wysiwyg_config);
  })
}(jQuery));