;
(function($) {
  $(function(){

    // This global variable gets value
    // on each selecting of folders
    // by execute code in directories.js
    path = "";

    // When filebrowser window resized,
    // recalculate new window height
    $.recalculateHeight();

    $(window).bind("resize", function(){
      $.recalculateHeight();
    });

    // Refresh files of current directory
    $("#refresh-link").click(function(){
      $(document).trigger("Filebrowser:loadFiles", path);
      return false;
    });

    // Global events
    $(document)

    // Reload files list of current directory
    .bind("Filebrowser:loadFiles", function(e, path) {
      $("#files-row").empty();
      $.getJSON(global_config.files_url+path, function(data){
        $("#tpl-files").tmpl(data).appendTo("#files-row");
      });
    });
    // End global events

    // Modal windows
    $(document).ready(function(){
      $("#upload-link").click(function(){
        $("#upload-modal").modal();
        return false;
      });
    });
  // End modal windows
  });


  $.extend({
    "recalculateHeight": function(){
      $("#dirs>div.directories").height($("body").height()-85+"px");
      $("#files").height($("body").height()-$("#info_wrap").height() - 45+"px");
    }
  });

  $.fn.draggingOver = function(ev){
    var area = this.getD().folderRect;
    return (area.left < ev.clientX && area.right > ev.clientX &&
      area.top < ev.clientY && area.bottom > ev.clientY) ? true : false;
  }

  $.getUrlParam = function(paramName){
    var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i') ;
    var match = window.location.search.match(reParam) ;
    return (match && match.length > 1) ? match[1] : '' ;
  }

  $.getSelectedFilePath = function(contextMenuEvent) {
    return path+"/"+$(contextMenuEvent.target).find("p.fileName span").text()
  }
})(jQuery);