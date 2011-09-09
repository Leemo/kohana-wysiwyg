(function($) {
  $(function(){

    var path = "";

    $.recountHeight();

    $(window).bind("resize", function(){
      $.recountHeight();
    });

    $("ul.directories span").click(function(){
      $(this).toggleClass("open");
    });

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

      $("#fancybox-content #file_upload").fancybox({
        "swf": "media/filebrowser/uploadify.swf",
        "uploader": "wysiwyg/filebrowser/upload/"+path,
        "auto": true,
        "buttonText": "Select Images",
        "width": 150,
        "height": 30,
        "fileSizeLimit": 1*1024, // 1MB
        "fileTypeExts": '*.gif;*.jpg;*.png',
        "method": "post",
        "multi": true,
        "queueID": "queue",
        "removeCompleted": true
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
      "onComplete": function(){ $(document).trigger("fancybox_ready") },
      "onClosed": function(){ $(document).trigger("filebrowser_load_files", {"path": path}) }
    });

  })
}(jQuery));

$.extend({
  recountHeight : function(){
    $("#dirs>ul").height($("body").height()-70+"px");
    $("#files").height($("body").height()- $("#content div.header").height()- $("#info_wrap").height() - 40+"px");
  }
});