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

    // Init folders tree and bind context menu
    // to delegate for all elements in folders column
    $("div.directories").folderTree()
      .contextMenu({
        //title : "Folder menu",
        closeType: {
          zone:   'any',
          events: 'closeFolderClick,openFolderClick'
        },
        targetSelector : "div",
        list: [
        {
          text:      __("Add subfolder"),
          itemClass: "add",
          event:     "Filebrowser:dir:add"
        },
        {
          text:      __("Rename"),
          itemClass: "rename",
          event:     "Filebrowser:dir:rename"
        }
        ]
      });

    // Files context menu lines
    var filesMenu = [
    {
      text:      __("Select"),
      itemClass: "select",
      event:     "Filebrowser:file:select"
    },
    {
      text:      __("Download"),
      itemClass: "download",
      event:     "Filebrowser:file:download"
    },
    "break",
    {
      text:      __("Resize"),
      itemClass: "resize",
      event:     "Filebrowser:image:resize"
    },
    {
      text:      __("Crop"),
      itemClass: "crop",
      event:     "Filebrowser:image:crop"
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
      event: "Filebrowser:file:rename"
    },
    {
      text: __("Delete"),
      itemClass: "delete",
      event: "Filebrowser:file:delete"
    }
    ];

    $("#files-row")
      // Bind context menu to delegate
      // for picture file elements in files area
      .contextMenu({
        targetSelector: "div.picture",
        list:           filesMenu
      })
      // Bind context menu to delegate
      // for non-picture file elements in files area
      .contextMenu({
        targetSelector: "div.non_picture",
        list:           filesMenu.slice(0,2).concat(filesMenu.slice(8))
      });

    // Global events
    $(document)

      // Reload files list of current directory
      .bind("Filebrowser:loadFiles", function(e, path) {
        $("#files-row").empty();

        // Reload files list from server
        $.getJSON(global_config.files_url+path, function(data){
          $("#tpl-files")
            .tmpl(data)
            .appendTo("#files-row");
        });

        // Update breadcrumb
        $("#breadcrumb").empty();

        $("#tpl-breadcrumb")
          .tmpl({parts: path})
          .appendTo("#breadcrumb");
      })

      // Rename file
      .bind("Filebrowser:file:rename", function(e) {
        var filename  = $(e.target).find(".params .filename").text()
        var extension = $(e.target).find(".params .extension").text()

        $("#file-rename-modal input[name=filename]").val(filename);
        $("#file-rename-modal #file-extension").text(extension);

        $("#file-rename-modal")
          .on("show", function () {
            $(this)
              .find(".control-group")
              .removeClass("error")
              .find(".help-inline")
              .remove();

            $(this)
              .find("a.btn-success")
              .click(function() {
                $("#file-rename-modal")
                  .find("form")
                  .ajaxSubmit({
                    url:      'wysiwyg/filebrowser/rename'+$.getSelectedFilePath(e),
                    dataType: "json",
                    success:  function(data, statusText, xhr, $form) {
                      $($form)
                        .find(".control-group")
                        .removeClass("error")
                        .find(".help-inline")
                        .remove();

                      if(data.ok !== undefined) {
                        $(document).trigger("Filebrowser:loadFiles", path);
                        $("#file-rename-modal").modal("hide");
                      } else if(data.errors !== undefined) {
                        $($form)
                          .find(".control-group")
                          .addClass("error")
                          .append('<span class="help-inline">'+data.errors.filename+"</span>");
                      }
                    }
                  });

                return false;
              });
          })
          .on("hide", function() {
            $(this)
              .find("a.btn-success")
              .unbind("click");
          })
          .modal();

      })

      // Delete file
      .bind("Filebrowser:file:delete", function(e) {
        $("#file-delete-modal")
          .on("hide", function(){
            $(this).find("a.btn-success").unbind("click");
            $(this).find("form").unbind("submit");
          })
          .on("show", function(){
            $(this)
              .find(".control-group")
              .removeClass("error")
              .find(".help-inline")
              .remove();
          })
          .modal()
          .find("a.btn-success")
          .click(function() {
            $("#file-delete-modal form").ajaxSubmit({
              url:      'wysiwyg/filebrowser/delete'+$.getSelectedFilePath(e),
              dataType: "json",
              success:  function(data, statusText, xhr, $form) {
                if(data.ok !== undefined) {
                  $(document).trigger("Filebrowser:loadFiles", path);
                  $("#file-delete-modal").modal("hide");
                } else if (data.error !== undefined) {
                  $($form)
                    .find(".help-inline")
                    .remove();

                  $($form)
                    .find(".control-group")
                    .removeClass("error")
                    .addClass("error")
                    .append('<span class="help-inline">'+data.error+"</span>");
                }
              }
            });

            return false;
          });
      })

      // When we select file
      .bind("Filebrowser:file:select", function(e) {
        window.opener.CKEDITOR.tools.callFunction($.getUrlParam('CKEditorFuncNum'), global_config.root+$.getSelectedFilePath(e));
        window.close();
      })

      // Add new directory
      .bind("Filebrowser:dir:add", function(e) {
        $("#tpl-dir-modal")
          .tmpl({rename: false})
          .appendTo("#dir-modal");

        $("#dir-modal")
          .on("hide", function() {
            $(this).html("");
          })
          .modal();
      })

      // Change directory name
      .bind("Filebrowser:dir:rename", function(e) {
        var dir     = $(e.target).find("a");
        var dirname = dir.text();

        $("#tpl-dir-modal")
          .tmpl({rename: true})
          .appendTo("#dir-modal");

        $("#dir-modal")
          .find("input")
          .val(dirname);

        $("#dir-modal")
          .on("hide", function() {
            $(this).html("");
          })
          .modal()
          .find("a.btn-success")
          .click(function() {
            $("#dir-modal form").ajaxSubmit({
              url:      'wysiwyg/filebrowser/rename/'+dirname, // TO-DO!!!!!!!!!!
              dataType: "json",
              success:  function(data, statusText, xhr, $form) {
                if(data.ok !== undefined) {
                  $(document).trigger("Filebrowser:loadDirs", path);
                  dir.text($("#dir-modal").find("input").val());
                  $("#dir-modal").modal("hide");
                } else if (data.errors !== undefined) {
                  $($form)
                    .find(".help-inline")
                    .remove();

                  $($form)
                    .find(".control-group")
                    .removeClass("error")
                    .addClass("error")
                    .append('<span class="help-inline">'+data.errors.filename+"</span>");
                }
              }
            });

            return false;
          });
      })
      .trigger("Filebrowser:loadFiles", path);
      // End global events

    // Modal windows
    $(document).ready(function(){

      // Initialize all modal windows
      $(".modal").modal({
        show: false
      });

      // Upload dialog
      var up = new FancyUpload3.Attach('upload', '#upload-modal .attach, #upload-modal .attach-another', {
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

      // When the download dialog window closes,
      // clear the upload history
      $("#upload-modal").on("hide", function() {
        $("#upload-modal #upload").empty();
      });
      // End upload dialog

      $("#upload-link").click(function(){
        $("#upload-modal").modal('show');
        return false;
      });
    });
  // End modal windows
  });

  $.extend({
    recalculateHeight: function() {
      $("#dirs>div.directories").height($("body").height()-85+"px");
      $("#files").height($("body").height()-$("#info_wrap").height()-45+"px");
    }
  });

  $.fn.draggingOver = function(ev) {
    var area = this.getD().folderRect;
    return (area.left < ev.clientX && area.right > ev.clientX &&
      area.top < ev.clientY && area.bottom > ev.clientY) ? true : false;
  }

  $.getUrlParam = function(paramName) {
    var reParam = new RegExp("(?:[\?&]|&amp;)"+paramName+"=([^&]+)", "i") ;
    var match = window.location.search.match(reParam) ;
    return (match && match.length > 1) ? match[1] : '' ;
  }

  $.getSelectedFilePath = function(contextMenuEvent) {
    return path+"/"+$(contextMenuEvent.target).find("p.name span").text()
  }
})(jQuery);