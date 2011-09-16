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
			targetSelector : "a.file",
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

		$(document).bind("filebrowser_load_files", {
			"path": ""
		}, function() {
			$("#filesRow").empty();
			$.getJSON("filebrowser/files", function(data){
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
			// Need to open URI wysiwyg/filebrowser/resize/<path> in fancybox
			},
			"filebrowser_file_rename" : function(e){
				$.get('wysiwyg/filebrowser/rename/'+path+$(e.target).children("p:first").text(), function(data){
					$.fancybox(data, fancyBoxOptions);
				});
			},
			"filebrowser_file_delete" : function(e){
				$.get('wysiwyg/filebrowser/delete/'+path+$(e.target).children("p:first").text(), function(data){
					$.fancybox(data, fancyBoxOptions);
				});
			},
			"fancybox_ready" : function(){
				$("#fancybox-content .close").click(function(){
					$.fancybox.close();
					return false;
				});
		
				/*
      var totalSize = 0;
      var bytesUpload = 0;

      var uploadifySettings = {
        "uploader":        "/media/filebrowser/uploadify.swf",
        "script":          "/wysiwyg/filebrowser/upload",
        "cancelImg":       "/media/filebrowser/cancel.png",
        "auto":            true,
        //"width": 5,
        //"height": 5,
        "buttonText":      "Select Images",
        //"method":          "post",
        "multi":           true,
        "queueID":         "queue",
        "removeCompleted": true,
        "fileExt":         "*.jpg;*.gif;*.png",
        "fileDesc":        "Image files",
        //"onSWFReady":          function() { $("#fancybox-content .choose").click(function() { $("#file_upload").trigger("click"); return false })},
        //"hideButton": true,
        "onSelect":        function(event, ID, fileObj) { totalSize = fileObj.size; alert(totalSize); $("#uploadprogress").progressBar(0) },
        "onComplete":      function(event, ID, fileObj, response, data) { bytesUpload += fileObj.size },
        "onAllComplete":   function() { $(document).trigger("filebrowser_load_files", {"path": path}) },
        "onProgress":      function(event,ID,fileObj,data) { var progress = ((data.bytesLoaded+bytesUpload)/totalSize)*100; $("#uploadprogress").progressBar(progress) }
         "onError": function(a, b, c, d, e) {
          if (d !== "1") {
            alert("error "+d.type+" status: "+d.status+": "+d.text)
          }
        }
      };

      $("#file_upload").uploadify(uploadifySettings);

      $("#fancybox-content .choose").click(function() {

        for (var key in uploadifySettings) {
          $("#file_upload").uploadifySettings(key, uploadifySettings.key, true);
        }

        $("#file_upload").trigger("click");

        return false
      });

      $("#uploadprogress").progressBar({
        "boxImage": "media/filebrowser/images/progressbar.gif",
        "barImage": "media/filebrowser/images/progressbg_green.gif"
      });*/


				var uploadOptions = {
					"allowedFileTypes": [{
						"description": "Images",
						"extensions": "*.jpg; *.gif; *.png"
					}],
					"maxFileSize": 1024*1024,
					"swfId": "mySwfId",
					"swfUrl": "/media/filebrowser/uploadify.swf"
				};
			},
			onOpenContextMenu : function(e){
				if($(e.target).parent().parent().attr("id") == "root") $(e.menu).pointToggleActive(3);
			}

		}) // end of bind events to document
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
	});
})(jQuery);