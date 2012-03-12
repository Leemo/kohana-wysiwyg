;
(function($) {
  // When filebrowser window resized,
  // recalculate new window height
  $(window).bind("load resize", function(){
    $.recalculateHeight();
  });

  // This global variable gets value
  // on each selecting of folders
  // by execute code in directories.js
  path = "";

  $(function(){

    // Bind handlers to nav-bar links
    var navBar = {
      "upload-link" : function(){
        $("#upload-modal").modal('show');
        return false;
      },
      "refresh-link" : function(){
        $(document).trigger("Filebrowser:loadFiles");
        return false;
      },
      "exit-link" : function(){
        window.close();
      }
    }

    for (var id in navBar) $("#" + id).click(navBar[id]);


    // Modal windows

    // Initialize all modal windows
    $("div.modal").modal({
      show: false
    });

    // When the download dialog window closes,
    // clear the upload history
    $("#upload-modal").on({
      "show" : function() {
        $.uploaderInit();
      },
      "hide" : function() {
        $("#upload-modal #upload").empty();
        $("span.swiff-uploader-box").remove();
        $("#upload-modal div.modal-footer a.btn").css("display", "");
      }
    });
    // End upload dialog


    // End modal windows


    // Init folders tree
    $("div.directories").folderTree().contextMenu({
      closeType: {
        zone:   'any',
        events: 'closeFolderClick,openFolderClick'
      },
      targetSelector : "#root",
      containerClass : "contextMenu dropdown-menu",
      listClass: "nav nav-list",
      list: [
      {
        text:      __("Add subfolder"),
        itemClass: "add",
        bootstrapiconClass : "icon-folder-close",
        event:     "Filebrowser:dir:add"
      }
      ]
    });
    // bind context menu to CHILDREN folders of root,
    // root folder don't get context menu
    $("#root").contextMenu({
      closeType: {
        zone:   'any',
        events: 'closeFolderClick,openFolderClick'
      },
      targetSelector : "div",
      containerClass : "contextMenu dropdown-menu",
      listClass: "nav nav-list",
      list: [
      {
        text:      __("Add subfolder"),
        itemClass: "add",
        bootstrapiconClass : "icon-folder-close",
        event:     "Filebrowser:dir:add"
      },
      {
        text:      __("Rename"),
        itemClass: "rename",
        bootstrapiconClass : "icon-pencil",
        event:     "Filebrowser:dir:rename"
      }
      ]
    });

    // Files context menu lines
    var filesMenu = [
    {
      text:      __("Select"),
      itemClass: "select",
      bootstrapiconClass : "icon-ok",
      event:     "Filebrowser:file:select"
    },
    {
      text:      __("Download"),
      itemClass: "download",
      bootstrapiconClass : "icon-download",
      event:     "Filebrowser:file:download"
    },
    "break",
    {
      text:      __("Resize"),
      itemClass: "resize",
      bootstrapiconClass : "icon-picture",
      event:     "Filebrowser:image:resize"
    },
    {
      text:      __("Crop"),
      itemClass: "crop",
      bootstrapiconClass : "icon-edit",
      event:     "Filebrowser:image:crop"
    },
    {
      text: __("Rotate right"),
      itemClass: "rotate-right",
      bootstrapiconClass : "icon-empty",
      event: "Filebrowser:image:rotate:right"
    },
    {
      text: __("Rotate left"),
      itemClass: "rotate-left",
      bootstrapiconClass : "icon-empty",
      event: "Filebrowser:image:rotate:left"
    },
    "break",
    {
      text: __("Rename"),
      itemClass: "rename",
      bootstrapiconClass : "icon-pencil",
      event: "Filebrowser:file:rename"
    },
    {
      text: __("Delete"),
      itemClass: "delete",
      bootstrapiconClass : "icon-trash",
      event: "Filebrowser:file:delete"
    }
    ];

    $("#files-row")
    // Bind context menu to delegate
    // for picture file elements in files area
    .contextMenu({
      containerClass : "contextMenu dropdown-menu",
      listClass: "nav nav-list",
      targetSelector: "div.picture",
      list:           filesMenu
    })
    // Bind context menu to delegate
    // for non-picture file elements in files area
    .contextMenu({
      containerClass : "contextMenu dropdown-menu",
      listClass: "nav nav-list",
      targetSelector: "div.non_picture",
      list: filesMenu.slice(0,2).concat(filesMenu.slice(8))
    })
    // delegate dbl-click handler of files
    .delegate('div.file', 'dblclick', function(){
      $(this).trigger("Filebrowser:file:select");
    });

    // Global events
    $(document).bind({
      // Reload files list of current directory
      "Filebrowser:loadFiles" : function() {
        $("#files-row").empty();
        // Reload files list from server
        $.getJSON(global_config.files_url+path, function(data){
          $("#files-row").empty().append($("#tpl-files").tmpl(data));
          $("#breadcrumb").breadcrumbUpdate();

          // crossbrowser icon position vertical correction
          $("#files-row div.file div.icon img").load(function(){
            $(this).css("margin-top", ($(this.parentNode).height() - $(this).height()) / 2 +"px");
          });
        });
      },

      // Rename file
      "Filebrowser:file:rename" : function(e) {
        var filename  = $(e.target).find(".params .filename").text();
        var extension = $(e.target).find(".params .extension").text();

        $("#file-rename-modal input[name=filename]").val(filename);
        $("#file-rename-modal #file-extension").text(extension);

        $("#file-rename-modal").on({
          "show" : function () {
            $(this).find(".control-group").removeClass("error").find(".help-inline").remove();

            $(this).find("a.btn-success").click(function() {
              $("#file-rename-modal form").ajaxSubmit({
                url:      'wysiwyg/filebrowser/rename'+$.getSelectedFilePath(e),
                dataType: "json",
                success:  function(data, statusText, xhr, $form) {
                  $form.find("div.control-group").removeClass("error").find(".help-inline").remove();
                  if(data.ok !== undefined) {
                    $(document).trigger("Filebrowser:loadFiles");
                    $("#file-rename-modal").modal("hide");
                  }
                  else if(data.errors !== undefined) {
                    $form.find(".control-group").addClass("error")
                    .append('<span class="help-inline">'+data.errors.filename+"</span>");
                  }
                }
              });

              return false;
            });
          },
          "hide" : function() {
            $(this).find("a.btn-success").unbind("click");
          }
        }).modal();
      },

      // Delete file
      "Filebrowser:file:delete" : function(e) {
        $("#file-delete-modal").on({
          "hide" : function(){
            $(this).find("a.btn-success").unbind("click").end().find("form").unbind("submit");
          },
          "show" : function(){
            $(this).find(".control-group").removeClass("error").find(".help-inline").remove();
          }
        }).modal()
        .find("a.btn-success").click(function() {
          $("#file-delete-modal form").ajaxSubmit({
            url:      'wysiwyg/filebrowser/delete'+$.getSelectedFilePath(e),
            dataType: "json",
            success:  function(data, statusText, xhr, $form) {
              if(data.ok !== undefined) {
                $(document).trigger("Filebrowser:loadFiles");
                $("#file-delete-modal").modal("hide");
              } else if (data.error !== undefined) {
                $form.find(".help-inline").remove();

                $form.find("div.control-group").addClass("error")
                .append('<span class="help-inline">'+data.error+"</span>");
              }
            }
          });

          return false;
        });
      },

      // Download file
      "Filebrowser:file:download" : function(e) {
        location.replace("wysiwyg/filebrowser/download"+$.getSelectedFilePath(e));
      },

      // When we select file
      "Filebrowser:file:select" : function(e) {
        window.opener.CKEDITOR.tools.callFunction($.getUrlParam('CKEditorFuncNum'), global_config.root+$.getSelectedFilePath(e));
        window.close();
      },

      // Crop and resize image
      "Filebrowser:image:crop" : function(e) {
        if(window.cropresizerWin)cropresizerWin.close();
        var imgSize = $.parseSizeFormRel(e.target);
        var openSize = {
          w: (screen.availWidth >= imgSize.width + 20 && imgSize.width + 20 > 900)? imgSize.width + 20 : 900,
          h: (screen.availHeight >= imgSize.height + 50 && imgSize.width + 50 > 500)? imgSize.height + 50 : 500
        };
        window.open("/wysiwyg/filebrowser/crop"+$.getSelectedFilePath(e), "cropresizerWin",
          "width="+openSize.w+", height="+openSize.h+", left="+(screen.availWidth-openSize.w)/2+", top="+(screen.availHeight-openSize.h)/2+", location=yes, resizable=yes");
      },
      // Rotate image
      "Filebrowser:image:rotate:left" : function(e){
        $.get('wysiwyg/filebrowser/rotate_left'+$.getSelectedFilePath(e), function(data){
          $(document).trigger('Filebrowser:loadFiles')
        });
      },

      "Filebrowser:image:rotate:right" : function(e){
        $.get('wysiwyg/filebrowser/rotate_right'+$.getSelectedFilePath(e), function(data){
          $(document).trigger('Filebrowser:loadFiles')
        });
      },

      // One handler gor add new directory, or rename directory
      "Filebrowser:dir:rename Filebrowser:dir:add" : function(e){
        var dir = $(e.target),
        data = dir.getD(),
        mission = e.type.split(":")[2]; // detect required mission: add or rename

        $("#tpl-dir-modal").tmpl({
          rename: mission == 'rename' ? true : false
        }).appendTo("#dir-modal");

        var input = $("#dir-modal").find('input');
        if(mission == "rename") input.val(data.name);

        $("#dir-modal").on("hide", function() {
          $(this).html("");
        }).modal().find("a.btn-success").click(function() {
          $("#dir-modal form").ajaxSubmit({
            url:      'wysiwyg/filebrowser/' + mission + dir.buildFullPath(),
            dataType: "json",
            success:  function(data, statusText, xhr, $form) {
              if(data.ok !== undefined) {
                // use (add/rename)Folder() methods from file directories.js
                dir[mission+'Folder'](mission == 'rename' ? input.val() : '');
                $("#dir-modal").modal("hide");
              } else if (data.errors !== undefined) {
                $form.find(".help-inline").remove();
                $form.find(".control-group").addClass("error")
                .append('<span class="help-inline">'+data.errors.filename+"</span>");
              }
            }
          });

          return false;
        }); // end of btn click handler

      } // end of dir del/rename events handler

    }) // end of user event handlers
    .trigger("Filebrowser:loadFiles");

  }); // End document ready

  $.extend({
    recalculateHeight: function() {
      var c = $("body").height() - $("div.navbar").height()
      $("#dirs").height(c - 40 + "px");
      $("#files-row").height(c - $("#breadcrumb").height()- 65 +"px");
    },

    getUrlParam : function(paramName) { // for correct transmitt data to CKEdirtor
      var reParam = new RegExp("(?:[\?&]|&amp;)"+paramName+"=([^&]+)", "i") ;
      var match = window.location.search.match(reParam) ;
      return (match && match.length > 1) ? match[1] : '' ;
    },

    getSelectedFilePath : function(contextMenuEvent) {
      return path+$(contextMenuEvent.target).find("p.name span").text()
    },

    parseSizeFormRel : function(element){ // create object from rel attribute value
      var relVal = $(element).attr("rel");
      if(relVal.indexOf("{") == 0) {
        return Function("var c = new Object(); c=" + relVal + "; return c")();
      }
      else {
        console.warn ("parseSizeFormRel() : element " + element + "has non-object code in 'rel' attribute value or has no 'rel' attribute");
        return false;
      }
    }

  });

  $.fn.draggingOver = function(ev) { // check folder: is dragging file icon lay over this folder
    var area = this.getD().folderRect;
    return (area.left < ev.clientX && area.right > ev.clientX &&
      area.top < ev.clientY && area.bottom > ev.clientY) ? true : false;
  }

  $.fn.breadcrumbUpdate = function(){
    this.empty().append($("#tpl-breadcrumb")
      .tmpl({
        parts: path.replace(/^\/(.*)\/$/, '$1').split("/")
      }));
  };

  $.uploaderInit = function(){  // Upload dialog
    // !!!ACHTUNG MOOTOOLS SYNTAX
    $.upLoader = new FancyUpload3.Attach('upload', '#upload-modal .attach, #upload-modal .attach-another', {
      path:        '/media/filebrowser/fancyupload/Swiff.Uploader.swf',
      url:         '/wysiwyg/filebrowser/upload'+path,
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
        $(document).trigger("Filebrowser:loadFiles");
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

    }); // end of uploader mootoolls syntax
  }

})(jQuery);