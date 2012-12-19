;
(function($) {

  // This global variable gets value
  // on each selecting of folders
  // by execute code in directories.js
  path = "/";

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

    // multi upload checking
    var filesInput = $("#upload-link input");
    if(filesInput.checkMultiUploadAPI()) { //html5 API support

      // delete click handler open modal -- system window will opened  for file multiselect
      navBar["upload-link"] = function(){};
      // multi-upload by html5 files API, modal id must be in argument
      filesInput.getFileToModal("upload-modal");

      if($.browser.mozilla && $.browser.version < 18) {
        var accept = filesInput[0].accept;
        $("input[type=file]").attr("accept", accept.replace(/,?(\w+)\/(\w+)/g, "$1/*,"));
      }
    }

    else filesInput.remove(); // remove multi=upload input from link, standart single upload in modal

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
        var modal = $(this);
        modal.find("a.upload").click(function(){
          $(this).addClass("disabled");
          modal.find("ul.upload").children("li").each(function(){
            $(this).fileUpload("/wysiwyg/filebrowser/upload" + path, "Filedata");
          });
          return false;
        });
        modal.find("a.attach-another").children("input").getFileToModal("upload-modal");
      },
      "hide" : function() {
        $("#upload-modal ul.upload").empty();
        $(this).find("a.upload").off("click").siblings("a").children("input").off();
        $(document).trigger("Filebrowser:loadFiles");
      }
    });
    // End upload dialog

    //Disable default submit by pressing "enter" on some field of 'modal' form and provide ajax POST request
    $("div.modal").on("submit", "form", function(){
      $(this).parent().siblings("div.modal-footer").children("a.btn-success").click();
      return false;
    });

    // End modal windows

    // Init folders tree
    $.tree = $("div.directories");
    $.draggingFile = null;

    // bind drag-n-drop handlers to folders for moving files to folders
    $.tree.on({
      dragover: function(e){
        e.originalEvent.dataTransfer.dropEffect = 'copy';
        $(this).addClass("overDrop");
        return false;
      },

      dragenter: function(){
        $(this).addClass("overDrop");
        return false;
      },

      dragleave: function() {
        $(this).removeClass("overDrop");
        return false;
      },

      drop: function(e) {
        // fire event 'Filebrowser:dir:file:move:to' listened in global events listener code
        e.stopPropagation();
        $.draggingFile.trigger("dragend");
        $(this).removeClass("overDrop").parent().addClass("process").trigger({
          type: "Filebrowser:dir:file:move:to",
          fileName: e.originalEvent.dataTransfer.getData("text")
        });
        return false;
      }
    }, "p:not(.selected)");

    // bind contect menu to folders and files

    $.tree.folderTree().contextMenu({
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
    // for non-picture file elements in files area
    .contextMenu({
      containerClass : "contextMenu dropdown-menu",
      listClass: "nav nav-list",
      targetSelector: "div.non_picture",
      list: filesMenu.slice(0,2).concat(filesMenu.slice(8))
    })

    // delegate all other handlers to files
    .on({
      // delegate dbl-click handler of files
      dblclick: function(){
        $(this).trigger("Filebrowser:file:select");
      },
      // bing drag-n-drop files to folders
      dragstart: function(e){
        $.draggingFile = $(this).addClass("dragged");
        var dt = e.originalEvent.dataTransfer;
        dt.effectAllowed = "copy";
        dt.setData("Text", $(this).find("p.name span").text());
      },
      dragend: function(){
        $(this).removeClass("dragged");
        $.draggingFile = null;
      },
      // for old IE
      selectstart: function(){
        this.dragDrop && this.dragDrop(); // only IE method
        return false;
      }
    }, "div.file");
    // end of 'files' elements handlers delegating

    // bind drag-n-drop external files to upload
    $("#files").on({
      dragover: function(e){
        var dt = e.originalEvent.dataTransfer;
        if(!dt) return;
        //FF
        if(dt.types.contains&&!dt.types.contains("Files")) return;
        //Chrome
        if(dt.types.indexOf&&dt.types.indexOf("Files")==-1) return;

        e.originalEvent.dataTransfer.dropEffect = 'copy';
        $(this).addClass("over");
        return false;
      },
      dragenter: function(){
        return false;
      },
      dragleave: function() {
        $(this).removeClass("over");
        return false;
      },
      drop: function(e) {
        e.stopPropagation();
        $(this).removeClass("over");
        var files = e.originalEvent.dataTransfer.files;
        if (files.length > 0 ) $.createFilesModal(e.originalEvent.dataTransfer.files, "upload-modal");
        return false;
      }
    });


    // Global events listener
    $(document).on(
    {
      // Reload files list of current directory
      "Filebrowser:loadFiles" : function() {
        $("#files-row").empty();
        // Reload files list from server
        $.getJSON(global_config.files_url + path, function(data){
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
            $(this).find("a.btn-success").off("click");
          }
        }).modal();
      },

      // Delete file
      "Filebrowser:file:delete" : function(e) {
        $("#file-delete-modal").on({
          "hide" : function(){
            $(this).find("a.btn-success").off("click").end().find("form").off("submit");
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
        location.replace("wysiwyg/filebrowser/download/"+$.getSelectedFilePath(e));
      },

      // When we select file to insert in editor page
      "Filebrowser:file:select" : function(e) {
        window.opener.CKEDITOR.tools.callFunction($.getUrlParam('CKEditorFuncNum'), "/" + global_config.root + $.getSelectedFilePath(e));
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
        window.open("/wysiwyg/filebrowser/crop/"+$.getSelectedFilePath(e), "cropresizerWin",
          "width="+openSize.w+", height="+openSize.h+", left="+(screen.availWidth-openSize.w)/2+", top="+(screen.availHeight-openSize.h)/2+", location=yes, resizable=yes");
      },

      // Resize image
      "Filebrowser:image:resize" : function(e) {
        $("#image-resize-modal").on({
          "hide" : function(){
            $(this).find("a.btn-success").off("click").end()
            .find("form").off("submit")
            .find("input").off().removeAttr("readonly checked").end()
            .find("div.proportion div.controls").removeClass("allow-arbitrary");
          },

          "show" : function(){
            $(this).find(".control-group").removeClass("error").find(".help-inline").remove();
            var imgSize = $.parseSizeFormRel(e.target),
            form = $(this).find("form"),
            prop = imgSize.width / imgSize.height,
            sides = {},
            revers = {
              width: "height",
              height: "width"
            };

            $.each(["width", "height"], function(i, item){
              sides[item] = form.find("input[name=" + item + "]")
            });

            var inputEvent = "oninput" in sides["width"][0] ? "input" : "keyup";

            for(var side in imgSize) {
              $(this).find("#current-" + side).text(imgSize[side]);
              sides[side].val(imgSize[side])
              .on(inputEvent + " focus blur", function(e){
                if (e.type == inputEvent) {
                  var v = this.value;
                  sides[revers[this.name]].val(parseInt(this.name == "width" ? v / prop : v * prop));
                }

                else if (e.type == "focus") {
                  sides[revers[this.name]].attr("readonly", "readonly");
                }

                else form.find("input").removeAttr("readonly");
              });
            }
          }

        }).modal()
        .find("a.btn-success").click(function() {
          $("#image-resize-modal form").ajaxSubmit({
            url:      'wysiwyg/filebrowser/resize'+$.getSelectedFilePath(e),
            dataType: "json",
            success:  function(data, statusText, xhr, $form) {
              if(data.ok !== undefined) {
                $(document).trigger("Filebrowser:loadFiles");
                $("#image-resize-modal").modal("hide");
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

      // Rotate image
      "Filebrowser:image:rotate:left" : function(e){
        $.get('wysiwyg/filebrowser/rotate_left/'+$.getSelectedFilePath(e), function(data){
          $(document).trigger('Filebrowser:loadFiles')
        });
      },

      "Filebrowser:image:rotate:right" : function(e){
        $.get('wysiwyg/filebrowser/rotate_right/'+$.getSelectedFilePath(e), function(data){
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
        }).modal()
        .find("a.btn-success").click(function() {
          $("#dir-modal form").ajaxSubmit({
            url:      "wysiwyg/filebrowser/" + mission + "/" + dir.buildFullPath(),
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

      }, // end of dir del/rename events handler

      "Filebrowser:dir:file:move:to" : function(e) {
        var dir = $(e.target);

        $.post("wysiwyg/filebrowser/move" + path + e.fileName, {
          path: dir.buildFullPath() + e.fileName
        },

        function(data){

          $(dir).removeClass("process");

          if(data.ok !== undefined) {
            $(document).trigger('Filebrowser:loadFiles');
          }
          else if (data.error !== undefined) {
            var alert = $("#error-modal").find("div.alert");
            $("#error-modal").on("show hide", function(e){
              alert.text(e.type == "show" ? data.error : "");
            }).modal();
          }
        }, "json")
      }

    }) // end of user event handlers
    .trigger("Filebrowser:loadFiles");

  }); // End document ready

  $.extend({
    // for correct transmitt data to CKEdirtor
    getUrlParam : function(paramName) {
      var reParam = new RegExp("(?:[\?&]|&amp;)"+paramName+"=([^&]+)", "i") ;
      var match = window.location.search.match(reParam) ;
      return (match && match.length > 1) ? match[1] : '' ;
    },

    getSelectedFilePath : function(contextMenuEvent) {
      return path+$(contextMenuEvent.target).find("p.name span").text();
    },

    // create object from rel attribute value
    parseSizeFormRel : function(element){
      var relVal = $(element).attr("rel");
      if(relVal.indexOf("{") == 0) {
        return Function("var c = new Object(); c=" + relVal + "; return c")();
      }
      else {
        console.warn ("parseSizeFormRel() : element " + element + "has non-object code in 'rel' attribute value or has no 'rel' attribute");
        return false;
      }
    },

    createFilesModal: function(filesList, modalId){
      var modal = $("#" + modalId),
      ul = modal.find("ul.upload");
      // creating file list
      $.each(filesList, function(i, item){
        $("<li/>", {
          "html" :  item.name+" <em>("+(item.size/1000).toFixed(2)+" Kb)</em>"
          + "<div class='progress progress-striped active'><div class='bar'></div></div>"
          +"<span class='note'></span></li>"
        }).data("file", item).appendTo(ul);
      });
      modal.find("a.upload").removeClass("disabled").end().modal('show');
    }

  });

  $.extend($.fn, {

    // update breadcrumb on change path
    breadcrumbUpdate: function(){
      this.empty().append($("#tpl-breadcrumb")
        .tmpl({
          parts: path.replace(/^\/(.*)\/$/, '$1').split("/")
        }));
    },

    // file multi-upload methods based on HTML5 File API
    checkMultiUploadAPI: function(){ // check html5 files API support
      return (this[0].multiple && this[0].files) ? true : false;
    },

    // assemble selected files to modal, read properties
    getFileToModal: function(uploadModalId){
      this.change(function(){
        $.createFilesModal(this.files, uploadModalId)
      });
    },

    fileUpload: function(url, fileDataKey) {
      /* method to be used for each uploading file and must be called on <li> element,
      created in previous method and contain file as jQuery.data().
     * Method send files by XMLHttpRequest() as binary data, emulating file request structure.
     * url - the URL to send request,
     * postDataKey - string, which will key of $_FILE array in server (analog value of <input> 'name' attribute .
     */
      if( ! this.data("file") || this.data("file") == "" || this.hasClass("finished")) return this;
      var progress = this.children("div.progress"),
      fill = progress.children("div"),
      note = this.children("span.note"),
      file = this.data("file"),
      li = this;

      var xhr = new XMLHttpRequest();
      if(xhr.upload) {
        xhr.upload.addEventListener("progress", function(e) {
          if (e.lengthComputable) fill.width((e.loaded * 100) / e.total + "%");
        }, false);
      }
      // load and error events handlers
      xhr.onreadystatechange = function() {
        var errorText = "";
        if (this.readyState == 4) {
          var xhr = this;
          fill.width("100%").parent().fadeOut(function(){
            li.addClass("finished");
            if(xhr.status == 200) {
              try {
                var json = $.parseJSON(xhr.responseText);
                for (var i in json.errors) errorText += json.errors[i]+" ";
                note.text(errorText).parent().addClass("error");
              }
              catch (e) {
                note.parent().addClass("ok");
              }
            }
            else {
              note.text(global_config.upload_notes.error + " status:" + xhr.status).parent().addClass("error");
            }
          });
        }
      };

      xhr.open("POST", url);

      if(window.FormData) {
        // W3C (Chrome, Safari, Firefox 4+)
        var formData = new FormData();
        formData.append(fileDataKey, file);
        xhr.send(formData);
      }

      else if (window.FileReader && xhr.sendAsBinary) {
        // FF < 4
        var boundary = "xxxxxxxxx";
        // headers setting
        xhr.setRequestHeader("Content-Type", "multipart/form-data, boundary="+boundary);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        // body setting
        var body = "--" + boundary + "\r\n";
        body += "Content-Disposition: form-data; name='" + fileDataKey + "'; filename='" + file.name + "'\r\n";
        body += "Content-Type: application/octet-stream\r\n\r\n";
        body += (file.getAsBinary ? file.getAsBinary() : file.readAsBinary()) + "\r\n";
        body += "--" + boundary + "--";

        xhr.sendAsBinary(body);
      }

      else {
        // Other
        xhr.setRequestHeader('Upload-Filename', file.name);
        xhr.setRequestHeader('Upload-Size', file.size);
        xhr.setRequestHeader('Upload-Type', file.type);
        xhr.send(file);
      }
      return li;
    }

  }); // end of methods

})(jQuery);