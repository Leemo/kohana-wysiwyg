(function($) {
  $(function(){
     $.recountHeight();
		 $(window).bind("resize", function(){$.recountHeight();});
		 $("div.treeview b").click(function(){$(this).parent().parent().toggleClass("open");});
     $(document).bind("filebrowser_load_dirs", {"path": ""}, function() {
       $("#dirs ul").treeview({
         "collapsed": true,
         "prerendered": true
       });
     }).bind("filebrowser_load_files", {"path": ""}, function() {
       $.getJSON("filebrowser/files", function(data){
         $("#tpl-files").tmpl(data).appendTo("#files");
       });
     }).trigger("filebrowser_load_dirs", "").trigger("filebrowser_load_files", "");
  })
}(jQuery));

$.extend({
	recountHeight : function(){
		$("#dirs>ul").height($("body").height()-70+"px");
		$("#files").height($("body").height()- $("#content div.header").height()-75+"px");
	}
});