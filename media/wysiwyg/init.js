(function($) {
  $(document).ready(function(){
    for(var environment in wysiwyg_config) {
      $(wysiwyg_config[environment].selector).ckeditor(wysiwyg_config[environment].config)
    }
  })
}(jQuery));