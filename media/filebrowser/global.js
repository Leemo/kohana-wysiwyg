(function($) {
  $(function(){

    var path = "";

    $.recountHeight();

    $(window).bind("resize", function(){
      $.recountHeight();
    });

	  $("div.directories").folderTree();

    $(document).bind("filebrowser_load_dirs", {
      "path": ""
    }, function() {
      /* $("#dirs ul").treeview({
        "collapsed": true,
        "prerendered": true
      }); */
      }).bind("filebrowser_load_files", {
      "path": ""
    }, function() {
      $("#files").html("");

      $.getJSON("filebrowser/files", function(data){
        $("#tpl-files").tmpl(data).appendTo("#files");
      });
    })
    .bind("fancybox_ready", function(){
      $("#fancybox-content .close")
        .click(function(){
          $.fancybox.close(); return false
        });

      $("#file_upload").uploadify({
        "uploader": "media/filebrowser/uploadify.swf",
        "script": "/wysiwyg/filebrowser/upload",
        "cancelImg": "media/filebrowser/cancel.png",
        "auto": true,
        "buttonText": "Select Images",
        "method": "post",
        "multi": true,
        "queueID": "queue",
        "removeCompleted": true,
        /* "onComplete": function() { $(document).trigger("filebrowser_load_files", {"path": path}) }, */
        "onError": function(a, b, c, d, e) { if (d !== "1") { alert("error "+d.type+" status: "+d.status+": "+d.text) } }
      })
    })
    .trigger("filebrowser_load_dirs", "")
    .trigger("filebrowser_load_files", "");

    $("#refresh").click(function(){
      $(document).trigger("filebrowser_load_files", {
        "path": path
      });
      return false
    });

    $("a[rel=boxed]").fancybox({
      "overlayOpacity": 0,
      "hideOnOverlayClick": false,
      "showCloseButton": false,
      "speedIn": 100,
      "speedOut": 100,
      "onComplete": function(){ $(document).trigger("fancybox_ready") }
    });

  })
}(jQuery));

$.extend({
  recountHeight : function(){
    $("#dirs>ul").height($("body").height()-70+"px");
    $("#files").height($("body").height()- $("#content div.header").height()- $("#info_wrap").height() - 40+"px");
  }
});