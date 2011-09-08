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
      "onComplete": function(){ $("#fancybox-content .close").click(function(){ $.fancybox.close(); return false }) },
      "onClosed": function(){ $(document).trigger("filebrowser_load_files", {"path": path}) }
    });

  })
}(jQuery));

$.extend({
  recountHeight : function(){
    $("#dirs>ul").height($("body").height()-70+"px");
    $("#files").height($("body").height()- $("#content div.header").height()-75+"px");
  }
});