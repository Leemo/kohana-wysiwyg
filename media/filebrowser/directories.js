;(function($){
	$.fn.folderTree = function(opt){
		var opt = $.extend({
			root : "wysiwyg/filebrowser/",
			getDirs : "dirs", //link suffix for folders json getting
			getFiles : "files", //link suffix for files json getting
			cacheTime : 0, //during this time (minutes) folder opening show last loaded inner
			autoTurnTree : true, //auto open tree to folder which files is currently opened in browser
			filesPathLine : "#files h3", //jQuery selector of outher html element has showing files path
			filesPathDelimiter : "<span> / </span>",
			container : this //don't change!
		}, opt);

	$.fn.setPath = function(parentPath){
		var dir = this[0], dirP = $(dir).children("p");
		var isRoot = ($(this).attr("id") == "root") ? true : false;
		this.data("data",{
			"path" : parentPath+"/"+((!isRoot) ? $("a", this).text() : ""),
			"name" : dirP.children("a").text(),
			"isRoot" : isRoot,
			"open" : isRoot,
			"hasChild" : this.attr("name")*1,
			"lastResponce" : false,
			"filesLoaded" : false,
			"pathToSelected" : false
		});

		$.fn.getD = function(){return this.data("data");};

		var dirData = $(dir).getD();
		if($(this).getD().hasChild == 0) $("b", this.children("p")).css("visibility", "hidden");
		else {
			$("b", this.children("p")).toggle(
				function(){
					if(!dirData.lastResponce || new Date().getMinutes()- dirData.lastResponce > opt.cacheTime){
						var parentPath = dirData.path;
						$(dir).addClass("process");
						$.getJSON(parentPath, function(data){
							$(dir).removeClass("process").addClass("open").getD().open = true;
							$("div", dir).remove();
							for(var dirName in data.dirs){
								$('<div name="'+data.dirs[dirName]+'"><p><b><span></span></b><a href="">'+dirName+'</a></p></div>').appendTo(dir).setPath(parentPath,opt);
							}
							if(opt.cacheTime) dirData.lastResponce = new Date().getMinutes();

							if(dirData.pathToSelected) {
								var path = dirData.pathToSelected.split("/");
								$(dir).children("div").each(function(){
									if($(this).getD().name == path[0]){
										path.shift();
										$(this).children("p").addClass("selected").end().getD().pathToSelected = (path.length > 0) ? path.join("/") : false;
										if(opt.autoTurnTree && $(this).getD().pathToSelected) $("b", this).click();
									}
								});
							}
						});
					}
					else {
						$("div", dir).show();
						$(dir).addClass("open").getD().open = true;
					}
					if(dirP.hasClass("selected") && !dirData.filesLoaded){
						dirP.removeClass("selected");
					}
					$(document).trigger("openFolderClick");
				},
				function(){
					var selectedChild = dirData.open = false;
					$(dir).removeClass().find("div").each(function(){
						if($(this).getD().filesLoaded) selectedChild = true;
						$(this).hide();
					});
					if(selectedChild) dirP.addClass("selected");
					$(document).trigger("closeFolderClick");
				}
				);
		} // end add handlers to click on triangle

		var $link = $("a", this.children("p"));
		var href = (!isRoot) ? global_config.files_url+'/'+$link.text() : global_config.files_url;
		$link.attr("href", href);
		$link.click(function(){
			$.getJSON(this.href, function(data){
				$("#filesRow").empty().append($("#tpl-files").tmpl(data));
				$("p", opt.container).removeClass("selected");
				$(opt.container).find("div").each(function(){
					$(this).getD().pathToSelected = false;
					$(this).getD().filesLoaded = false;
				});
				dirP.addClass("selected");
				dirData.filesLoaded = true;
				$(dir).addPathToParent();
				$(opt.filesPathLine).buildFullPath(dir);
			});
			return false;
		});
	};

	$.fn.addPathToParent = function(){
		var params = this.getD(), parent = this.parent();
		if(parent.getD()){
			if(!parent.getD().isRoot){
				parent.getD().pathToSelected = params.name+((params.pathToSelected) ? "/"+params.pathToSelected : "");
				parent.addPathToParent();
			}
		}
		else return this;
	};

		$("div",this).each(function(){
			$(this).setPath(opt.root+opt.getDirs, opt);
		});

		$.fn.buildFullPath = function(dir){
		var fullPath = this.empty();
		var parent = function(folder){
			if(folder.getD()){
				fullPath.prepend((fullPath.children().length > 0)
					?'<a href="">'+folder.getD().name+'</a><span>'+opt.filesPathDelimiter+'</span>'
					: '<b>'+folder.getD().name+'</b>');
				return parent(folder.parent());
			}
			else return;
		};
		parent($(dir));
	};
	return this;
};

})(jQuery);