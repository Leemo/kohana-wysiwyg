(function($) {
  $(document).ready(function(){

     $(document).bind("filebrowser_load_dirs", {"path": ""}, function() {
       $("#dirs ul").treeview({
         "collapsed": true,
         "prerendered": true
       });
     });

     $(document).bind("filebrowser_load_files", {"path": ""}, function() {
       $.getJSON("filebrowser/files", function(data){
         $("#tpl-files")
           .tmpl(data)
           .appendTo("#files div");
       });
     });

     $(document)
      .trigger("filebrowser_load_dirs", "")
      .trigger("filebrowser_load_files", "");
  })
}(jQuery));