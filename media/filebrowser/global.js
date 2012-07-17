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
        $(this).find("a.upload").unbind("click");
        $(document).trigger("Filebrowser:loadFiles");
      }
    });
    // End upload dialog


    //Disable default submit by pressing "enter" on some field of 'modal' form and provide ajax POST request
    $("div.modal").delegate("form", "submit", function(){
      $(this).parent().siblings("div.modal-footer").children("a.btn-success").click();
      return false;
    });

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
                url:      'wysiwyg/filebrowser/rename/'+$.getSelectedFilePath(e),
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
        location.replace("wysiwyg/filebrowser/download/"+$.getSelectedFilePath(e));
      },

      // When we select file
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
        }).modal().find("a.btn-success").click(function() {
          $("#dir-modal form").ajaxSubmit({
            url:      'wysiwyg/filebrowser/' + mission + "/" + dir.buildFullPath(),
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



  // file multi-upload methods based on HTML5 File API


  $.fn.checkMultiUploadAPI = function(){ // check html5 files API support
    return (this[0].multiple && this[0].files) ? true : false;
  }

  $.fileListPreCheck = function(inputElement){
    // check selected in multiple input files before including to file list in upload modal
    /* files checking to:
    MIME-TYPE: by comparing with allowed types list form global config,
    SIZE: by comparing with max size from global config,
    VALID NAME: checking allowed symbols by regexp

    Method return array of files and error notes for each file
  */
    var files = [], valid = [];
    $.each(inputElement.files, function(i, file){
      var check = {
        "mime" : (file.type == "") ? true : ($.inArray(file.type, global_config.mime_types) == -1 ? true : false),
        "size" : file.size*1 > global_config.max_upload_size*1 ? true : false,
        "invalid" : ! /^[\w\.-]*$/.test(file.name)
      },
      note = "";
      for(var n in check) {
        note += check[n] === true ? (note != "" ? ", " : "") + global_config.upload_notes.file_err[n] : "";
      }
      files[i] = {
        "file": file,
        "note": note != "" ? note + "." : ""
      };
      if (note == "") valid.push(file.name); // files checked succefull
    });
    return {
      "all" : files,
      "valid" : valid
    };
  }

  // assemble selected files to modal, read properties, check allowed type and size
  $.fn.getFileToModal = function(uploadModalId){
    var modal = $("#" + uploadModalId),
    ul = modal.find("ul.upload"),
    upload = modal.find("a.upload");

    this.bind("change", function(){
      var checked = $.fileListPreCheck(this);

      $.post("/wysiwyg/filebrowser/status" + path, {
        "files": checked.valid // check for already existing file
      }, function(data){
        // creating file list
        var nothingToUpload = true; // to deactivate upload button if all files invalid and nothing to upload
        $.each(checked.all, function(i, item){
          if (data[item.file.name] === true) item.note = global_config.upload_notes.file_err["already_exist"];
          if(item.note == "") nothingToUpload = false;
          $("<li/>", {
            "html" :  item.file.name+" <em>("+(item.file.size/1000).toFixed(2)+" Kb)</em>"
            +(item.note == "" ? "<div class='progress progress-striped active'><div class='bar'></div></div>" : "")
            +"<span class='note'>" + item.note + "</span></li>",
            "class" : item.note == "" ? "allowed" : "disallowed"
          }).data("file", item.note == "" ? item.file : "").appendTo(ul);
        // all files showing in list but only allowed files put to <li> as jquery data
        });
        modal.find("a.upload")[ (nothingToUpload ? "add" : "remove")+"Class"]("disabled");
        modal.modal('show');

      });// end of post responce hundler
    });
  }

  $.fn.fileUpload = function(url, fileDataKey) {
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
 /*   var opera = "";
    for (var i in xhr) {
      opera += "'"+i+"': "+ xhr[i] + "\n"
    }
    alert (opera);
 */
  if(xhr.upload) {
    xhr.upload.addEventListener("progress", function(e) {
      if (e.lengthComputable) fill.width((e.loaded * 100) / e.total + "%");
    }, false);
  }
    // load and error events handlers
    xhr.onreadystatechange = function () {
      var obj, errorText = "";
      if (this.readyState == 4) {
        var xhr = this;
        fill.width("100%").parent().fadeOut(function(){
          li.addClass("finished");

          if(xhr.status == 200) {
            try {
              obj = $.parseJSON(xhr.responseText);
              for (var i in obj) errorText += obj[i]+" ";
              note.text(errorText).parent().addClass("error");
            }
            catch(e) {
              if(xhr.responseText == "Ok")  {
                note.parent().addClass("ok");
              }
            }

          } else {
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



})(jQuery);