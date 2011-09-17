(function($) {
  $(function(){

    var path = "";

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

    $("div.directories").folderTree();

    $(document).bind("filebrowser_load_dirs", {
      "path": ""
    }, function() {
      }).bind("filebrowser_load_files", {
      "path": ""
    }, function() {
      $("#filesRow").empty();

      $.getJSON("filebrowser/files", function(data){
        $("#tpl-files").tmpl(data).appendTo("#filesRow");

        $("#filesRow a.file").contextMenu({
          "list": [
          {
            "text": __("Select"),
            "itemClass": "select"
          },
          {
            "text": __("Download"),
            "itemClass": "download"
          },
          "break",
          {
            "text": __("Resize"),
            "itemClass": "resize",
            "event": "filebrowser_image_resize"
          },
          {
            "text": __("Crop"),
            "itemClass": "crop",
            "event": "filebrowser_image_crop"
          },
          {
            "text": __("Rotate right"),
            "itemClass": "rotate-right",
            "event": "filebrowser_image_rotate_right"
          },
          {
            "text": __("Rotate left"),
            "itemClass": "rotate-left",
            "event": "filebrowser_image_rotate_left"
          },
          "break",
          {
            "text": __("Rename"),
            "itemClass": "rename",
            "event": "filebrowser_file_rename"
          },
          {
            "text": __("Delete"),
            "itemClass": "delete",
            "event": "filebrowser_file_delete"
          }
          ]
        });
      });
    })
    .bind("filebrowser_file_download", function(e){
      alert($(e.target).children("p:first").text())
    })
    .bind("filebrowser_image_resize", function(e){
      alert($(e.target).children("p:first").text())
    // Need to open URI wysiwyg/filebrowser/resize/<path> in fancybox
    })
    .bind("filebrowser_image_crop", function(e){
      // Need to open URI wysiwyg/filebrowser/resize/<path> in fancybox
      })
    .bind("filebrowser_file_rename", function(e){
      $.get('wysiwyg/filebrowser/rename/'+path+$(e.target).children("p:first").text(), function(data){
        $.fancybox(data, fancyBoxOptions);
      })
    })
    .bind("filebrowser_file_delete", function(e){
      $.get('wysiwyg/filebrowser/delete/'+path+$(e.target).children("p:first").text(), function(data){
        $.fancybox(data, fancyBoxOptions);
      })
    })
    .bind("fancybox_ready", function(){
      $("#fancybox-content .close")
      .click(function(){
        $.fancybox.close();
        return false
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
    })
    .trigger("filebrowser_load_dirs", "")
    .trigger("filebrowser_load_files", "");

    $("#refresh").click(function(){
      $(document).trigger("filebrowser_load_files", {
        "path": path
      });
      return false
    });

    $("a[rel=boxed]").fancybox(fancyBoxOptions);

  });

  $.extend({
    "recountHeight": function(){
      $("#dirs>div.directories").height($("body").height()-70+"px");
      $("#files").height($("body").height()- $("#content div.header").height()- $("#info_wrap").height() - 40+"px");
    }
  })
}(jQuery));