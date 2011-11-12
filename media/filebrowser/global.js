;
(function($) {
  $(function(){
    path = "";
    var fancyBoxOptions = {
      "overlayOpacity": 0,
      "hideOnOverlayClick": false,
      "showCloseButton": false,
      "width": 300,
      "speedIn": 100,
      "speedOut": 100,
      "onComplete": function(){
        $(document).trigger("fancybox_ready")
      }
    };

    $.recountHeight();

    $(window).bind("resize", function(){
      $.recountHeight();
    });

    $("div.directories").folderTree()
    .contextMenu({  // bind context menu to delegate for all elements in folders column
      //title : "Folder menu",
      closeType : {
        zone : 'any',
        events : 'closeFolderClick,openFolderClick'
      },
      list : [
      {
        text : __("Add subfolder"),
        itemClass : "add",
        event : "onAddFolderClick",
        href : "http://www.google.com"
      },
      {
        text : __("Rename"),
        itemClass : "rename",
        event : "onRenameFolderClick",
        handler : function(){
          console.log(this);
          return false;
        },
        href : "http://ya.ru"
      },
      "break",
      {
        text : __("Delete"),
        itemClass : "delete",
        event : "onDelFolderClick",
        handler : function(){
          alert("сработала функция-обработчик клика по пункту меню ");
          return false;
        },
        href : "/delfolder"
      }
      ]
    });

    $("#filesRow").contextMenu({ // bind context menu to delegate for all elements in files area
      targetSelector : "div.file",
      list: [
      {
        text: __("Select"),
        itemClass: "select"
      },
      {
        text: __("Download"),
        itemClass: "download"
      },
      "break",
      {
        text: __("Resize"),
        itemClass: "resize",
        event: "filebrowser_image_resize"
      },
      {
        text: __("Crop"),
        itemClass: "crop",
        event: "filebrowser_image_crop"
      },
      {
        text: __("Rotate right"),
        itemClass: "rotate-right",
        event: "filebrowser_image_rotate_right"
      },
      {
        text: __("Rotate left"),
        itemClass: "rotate-left",
        event: "filebrowser_image_rotate_left"
      },
      "break",
      {
        text: __("Rename"),
        itemClass: "rename",
        event: "filebrowser_file_rename"
      },
      {
        text: __("Delete"),
        itemClass: "delete",
        event: "filebrowser_file_delete"
      }
      ]
    });

    $(document).bind("filebrowser_load_files", function(e, path) {
      $("#filesRow").empty();

      $.getJSON(global_config.files_url+path, function(data){
        $("#tpl-files").tmpl(data).appendTo("#filesRow");
      });
    }).bind(
    {
      "filebrowser_file_download" : function(e){
        alert($(e.target).children("p:first").text());
      },
      "filebrowser_image_resize" : function(e){
        alert($(e.target).children("p:first").text());
      // Need to open URI wysiwyg/filebrowser/resize/<path> in fancybox
      },
      "filebrowser_image_crop" : function(e){
        if(window.cropresizerWin)cropresizerWin.close();
        var imgSize = Function("var c = new Object(); c="+$(e.target).attr("rel")+"; return c")();
        var openSize = {
          w: (screen.availWidth >= imgSize.width + 20 && imgSize.width + 20 > 900)? imgSize.width + 20 : 900,
          h: (screen.availHeight >= imgSize.height + 50 && imgSize.width + 50 > 500)? imgSize.height + 50 : 500
        };
        window.open("/wysiwyg/filebrowser/crop/"+path+$(e.target).find("img").attr("alt"), "cropresizerWin",
          "width="+openSize.w+", height="+openSize.h+", left="+(screen.availWidth-openSize.w)/2+", top="+(screen.availHeight-openSize.h)/2+", location=yes, resizable=yes");
      },
      "filebrowser_file_rename" : function(e){
        $.get('wysiwyg/filebrowser/rename/'+path+$(e.target).find("img").attr("alt"), function(data){
          $.fancybox(data, fancyBoxOptions);
        });
      },
      "filebrowser_file_delete" : function(e, path){
        $.get('wysiwyg/filebrowser/delete/'+path+$(e.target).children("p:first").text(), function(data){
          $.fancybox(data, fancyBoxOptions);
        });
      },
      "filebrowser_startFileMove" : function(){
        $("div.directories div").each(function(){
          $(this).getD().folderRect = $(this).children("p")[0].getBoundingClientRect();
        });
      },

      // begin "fancybox_ready" handler
      "fancybox_ready" : function(){
        $("#fancybox-content .close").click(function(){
          $.fancybox.close();
          return false;
        });

        window.addEvent('domready', function() {
          /**
           * Uploader instance
           */
          var up = new FancyUpload3.Attach('upload', '#fancybox-content .attach, #fancybox-content .attach-another', {
            path: '/media/filebrowser/fancyupload/Swiff.Uploader.swf',
            url: '/wysiwyg/filebrowser/upload'+path,
            fileSizeMax: 20 * 1024 * 1024,

            verbose: true,

            onSelectFail: function(files) {
              files.each(function(file) {
                new Element('li', {
                  'class': 'file-invalid',
                  events: {
                    click: function() {
                      this.destroy();
                    }
                  }
                }).adopt(
                  new Element('span', {
                    html: file.validationErrorMessage || file.validationError
                  })
                  ).inject(this.list, 'top');
              }, this);
            },

            onFileSuccess: function(file) {
              file.ui.element.highlight('#e6efc2');
            },

            onFileError: function(file) {
              file.ui.cancel.set('html', __("Retry")).removeEvents().addEvent('click', function() {
                file.requeue();
                return false;
              });

              new Element('span', {
                html: file.errorMessage,
                'class': 'file-error'
              }).inject(file.ui.cancel, 'before');
            },

            onFileRequeue: function(file) {
              file.ui.element.getElement('.file-error').destroy();

              file.ui.cancel.set('html', __("Cancel")).removeEvents().addEvent('click', function() {
                file.remove();
                return false;
              });

              this.start();
            }

          });

        });
      },
      // end "fancybox_ready" handler

      onOpenContextMenu : function(e){
        if($(e.target).parent().parent().attr("id") == "root") $(e.menu).pointToggleActive(3);
      }

    }) // end of bind events to document
    .trigger("filebrowser_load_dirs", "")
    .trigger("filebrowser_load_files", "");

    $("#refresh").click(function(){
      $(document).trigger("filebrowser_load_files", path);
      return false
    });

    $("a[rel=boxed]").fancybox(fancyBoxOptions);

    // drag files to folders

    $("#filesRow").delegate("div.file", "mousedown", function(event){
      if(event.which == 1) { // left button down only
        var draggedFile = $(this).addClass("replacing");

        var clone = $("<div>", {
          "class" : "file clone",
          "css"   : {
            "left" :draggedFile.offset().left+"px",
            "top"  : draggedFile.offset().top+"px"
          },
          "html" : draggedFile.html(),
          "selectstart" : function(){
            return false;
          }
        }).appendTo("body").append("<div class='cloneOverlay'></div>");

        var shift = {
          X : event.clientX-clone.position().left,
          Y : event.clientY-clone.position().top
        };

        var overFolder = false;
        var prevMove = false;

        $(document).bind({
          mousemove : function(e){
            if(!prevMove) {
              $(document).trigger("filebrowser_startFileMove");
              prevMove = true;
            }
            clone.css({
              left: e.clientX-shift.X+"px",
              top : e.clientY-shift.Y+"px"
            });
            overFolder = false;
            $("div.directories div").each(function(){ // on each move check panels for find panel under during mouse position
              if($(this).draggingOver(e) && !$(this).getD().filesLoaded) {
                overFolder = $(this);
                $(this).children("p").addClass("overDrop");
              }
              else $(this).children("p").removeClass("overDrop");
            });
          },

          mouseup   : function(e){
            $(document).unbind("mousemove");
            if(overFolder) {
              clone.animate({
                width: "5px",
                height: "5px",
                left:   overFolder.getD().folderRect.left*1+10+"px",
                top:   overFolder.getD().folderRect.top+"px"
              },function(){
                $(this).remove();
                draggedFile.removeClass("replacing");
                $(document).unbind("mouseup");
              });

              var post = {
                "fileName" : clone.children("p.fileName").children("span").text(),
                "path" : path,
                "toFolder" : overFolder.getD().path+"/0"+overFolder.getD().name
              };
              $.post("filebrowser.php", post, function(data){
                }, "json");
              overFolder.children("p").removeClass("overDrop");
            }
            else {
              clone.fadeOut(function(){
                $(this).remove();
                draggedFile.removeClass("replacing");
                $(document).unbind("mouseup");
              });
            }
          }
        }); // end of mouse events handlers
      }
    });
  });
  // end document ready

  $.extend({
    "recountHeight": function(){
      $("#dirs>div.directories").height($("body").height()-85+"px");
      $("#files").height($("body").height()-$("#info_wrap").height() - 45+"px");
    }
  });

  $.fn.draggingOver = function(ev){
    var area = this.getD().folderRect;
    return (area.left < ev.clientX && area.right > ev.clientX &&
      area.top < ev.clientY && area.bottom > ev.clientY) ? true : false;
  }

})(jQuery);