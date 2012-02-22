
;
(function($) {
  $(function(){

    path = ""; // this global variable get value on each selecting of folders by execute code in directories.js

    var fancyOpts = {
      "overlayOpacity": 0,
      "hideOnOverlayClick": false,
      "showCloseButton": false,
      "width": 300,
      "speedIn": 100,
      "speedOut": 100,
      "onComplete": function(){
        $(document).trigger("fancybox_ready", {
          mission: "file"
        })
      }
    };


    $.recountHeight();
    $(window).bind("resize", function(){
      $.recountHeight();
    });

    $("#refresh").click(function(){
      $(document).trigger("filebrowser_load_files");
      return false;
    });

    $("a[rel=boxed]").fancybox(fancyOpts);

    $("div.directories").folderTree()
    .contextMenu({  // bind context menu to delegate for all elements in folders column
      //title : "Folder menu",
      closeType : {
        zone : 'any',
        events : 'closeFolderClick,openFolderClick'
      },
      targetSelector : "div",
      list : [
      {
        text : __("Add subfolder"),
        itemClass : "add",
        event : {
          type: "filebrowser_folder",
          mission: "add"
        }
      },
      {
        text : __("Rename"),
        itemClass : "rename",
        event : {
          type: "filebrowser_folder",
          mission: "rename"
        }
      }
      ]
    });

    // files context menu lines
    var filesMenu = [
    {
      text: __("Select"),
      itemClass: "select",
      event: "filebrowser_file_select"
    },
    {
      text: __("Download"),
      itemClass: "download",
      event: "filebrowser_file_download"
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
    ];


    $("#filesRow").contextMenu({ // bind context menu to delegate for picture file elements in files area
      targetSelector : "div.picture",
      list: filesMenu
    }).contextMenu({ // bind context menu to delegate for non-picture file elements in files area
      targetSelector : "div.non_picture",
      list: filesMenu.slice(0,2).concat(filesMenu.slice(8))
    });

    $(document).bind("filebrowser_load_files", function() {
      $.upDateFilesRow();
    }).bind(
    {
      "filebrowser_file_select" : function(e){
        window.opener.CKEDITOR.tools.callFunction($.getUrlParam('CKEditorFuncNum'), global_config.root + $.getSelectedFilePath(e));
        window.close();
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
        window.open("/wysiwyg/filebrowser/crop/"+$.getSelectedFilePath(e), "cropresizerWin",
          "width="+openSize.w+", height="+openSize.h+", left="+(screen.availWidth-openSize.w)/2+", top="+(screen.availHeight-openSize.h)/2+", location=yes, resizable=yes");
      },

      "filebrowser_image_rotate_left" : function(e){
        $.get('wysiwyg/filebrowser/rotate_left'+$.getSelectedFilePath(e), function(data){
          $(document).trigger('filebrowser_load_files')
        });
      },

      "filebrowser_image_rotate_right" : function(e){
        $.get('wysiwyg/filebrowser/rotate_right'+$.getSelectedFilePath(e), function(data){
          $(document).trigger('filebrowser_load_files')
        });
      },

      "filebrowser_file_rename" : function(e){
        $.get('wysiwyg/filebrowser/rename'+$.getSelectedFilePath(e), function(data){
          $.fancybox(data, fancyOpts);
        });
      },

      "filebrowser_file_download" : function(e){
        location.replace('wysiwyg/filebrowser/download'+$.getSelectedFilePath(e));
      },

      "filebrowser_file_delete" : function(e){
        $.get('wysiwyg/filebrowser/delete'+$.getSelectedFilePath(e), function(data){
          $.fancybox(data, fancyOpts);
        });
      },

      "filebrowser_startFileMove" : function(){
        $("div.directories div").each(function(){
          $(this).getD().folderRect = $(this).children("p")[0].getBoundingClientRect();
        });
      },

      // Folder menu events
      "filebrowser_folder" : function(e){
        $.get("wysiwyg/filebrowser/"+e.mission+$(e.target).buildFullPath(), function(data){
          $.fancybox(data, $.extend(fancyOpts, {
            "onComplete": function(){
              $(document).trigger("fancybox_ready", {
                mission: e.mission+"Dir",
                targetFolder : e.target
              });
            }
          }));
        });
      },

      // begin "fancybox_ready" handler
      "fancybox_ready" : function(e, eventData){
        $("#fancybox-content form").ajaxForm({
          "success": function(responseText, statusText, xhr, $form) {
            if(responseText === "") {
              switch(eventData.mission){
                case "file":
                  $(document).trigger("filebrowser_load_files");
                  break;
                case "addDir":
                  $(eventData.targetFolder).addFolder();
                  break;
                case "renameDir":
                  $(eventData.targetFolder).renameFolder("name"); // debug value
                  break;
              }

              $.fancybox.close()
            } else {
              $form.parent().html(responseText);
              $(document).trigger("fancybox_ready", {
                mission: data.mission
              })
            }
          }
        });

        $("#fancybox-content .close").click(function(){
          $.fancybox.close();
          return false;
        });

        $("#fancybox-content .ajaxed").each(function(){
          $(this).click(function(){
            $.get(this.href);
            $(document).trigger("filebrowser_load_files");
            $.fancybox.close();
            return false;
          })
        });

        if($("#fancybox-content .attach").length > 0) {
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

        };
      },
      // end "fancybox_ready" handler

      "onOpenContextMenu" : function(e){
        if($(e.target).parent().parent().attr("id") == "root") $(e.menu).pointToggleActive(3);
      }

    }) // end of bind events to document
    .trigger("filebrowser_load_dirs", "")
    .trigger("filebrowser_load_files");


    // drag files to folders
    $("#filesRow").delegate("div.file", "mousedown", function(event){
      if(event.which == 1) { // left button down only to drag file
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
              clone.empty().animate({
                width: "5px",
                height: "5px",
                left:   overFolder.getD().folderRect.left*1+10+"px",
                top:   overFolder.getD().folderRect.top+"px"
              },{
                complete: function(){
                  $(this).remove();
                  draggedFile.removeClass("replacing");
                  $(document).unbind("mouseup");
                },
                duration: 200
              });

              var fileName = clone.children("p.fileName").children("span").text();

              var post = {
                "to": overFolder.getD().path
              };

              $.post(global_config.move_url+path+"/"+fileName, post, function(data){
                if (data.result == "ok") {
                  $(document).trigger("filebrowser_load_files");
                }
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
      } // end of if
    }); // end of delegate
  });
  // end document ready

  $.extend({
    "recountHeight": function(){
      $("#dirs>div.directories").height($("body").height()-85+"px");
      $("#files").height($("body").height()-$("#info_wrap").height() - 45+"px");
    }
  });

  $.upDateFilesRow = function(){
    $("#filesRow").empty();
    $.getJSON(global_config.files_url+path, function(data){
      $("#tpl-files").tmpl(data).appendTo("#filesRow");
    });
  }

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