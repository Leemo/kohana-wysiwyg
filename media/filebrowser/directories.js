(function($){
	$.fn.folderTree = function(opt){
		var opt = $.extend({
			root : "wysiwyg/filebrowser/",
			getDirs : "dirs", //link suffix for folders json getting
			getFiles : "files", //link suffix for files json getting
			cacheTime : 0, //during this time (minutes) folder opening show last loaded inner
			autoTurnTree : true, //auto open tree to folder which files is currently opened in browser
			filesPathLine : "#files h3", //jQuery selector of outher html element has showing files path
			container : this //don't change!
		}, opt);

		$("div",this).each(function(){
			$(this).setPath(opt.root+opt.getDirs, opt);
		});
	};

	$.fn.setPath = function(parentPath,opt){
		var dir = this[0], dirP = $(dir).children("p");
		var isRoot = ($(this).attr("id") == "root") ? true : false;
		this.data("data",{
			"path" : parentPath+"/"+((!isRoot) ? $("a", this).text() : ""),
			"name" : $("a", this).text(),
			"isRoot" : isRoot,
			"open" : isRoot,
			"hasChild" : this.attr("name")*1,
			"lastResponce" : false,
			"filesLoaded" : false,
			"pathToSelected" : false
		});
		var dirData = $(dir).data("data");
		if(this.data("data").hasChild == 0) $("b", this.children("p")).css("visibility", "hidden");
		else {
			$("b", this.children("p")).toggle(
				function(){
					if(!dirData.lastResponce || new Date().getMinutes()- dirData.lastResponce > opt.cacheTime){
						var parentPath = dirData.path;
						$(dir).addClass("process");
						$.getJSON(parentPath, function(data){
							$(dir).removeClass("process").addClass("open").data("data").open = true;
							$("div", dir).remove();
							for(var dirName in data.dirs){
								$('<div name="'+data.dirs[dirName]+'"><p><b><span></span></b><a href="">'+dirName+'</a></p></div>').appendTo(dir).setPath(parentPath,opt);
							}
							if(opt.cacheTime) dirData.lastResponce = new Date().getMinutes();

							if(dirData.pathToSelected) {
								var path = dirData.pathToSelected.split("/");
								$(dir).children("div").each(function(){
									if($(this).data("data").name == path[0]){
										path.shift();
										$(this).children("p").addClass("selected").end().data("data").pathToSelected = (path.length > 0) ? path.join("/") : false;
										console.log($(this).data("data").name+ " -> " + $(this).data("data").pathToSelected);
										if(opt.autoTurnTree && $(this).data("data").pathToSelected) $("b", this).click();
									}
								});
							}
						});
					}
					else {
						$("div", dir).show();
						$(dir).addClass("open").data("data").open = true;
					}
					if(dirP.hasClass("selected") && !dirData.filesLoaded){
						dirP.removeClass("selected");
					}
				},
				function(){
					var selectedChild = dirData.open = false;
					$(dir).removeClass().find("div").each(function(){
						if($(this).data("data").filesLoaded) selectedChild = true;
						$(this).hide();
					});
					if(selectedChild) dirP.addClass("selected");
				}
				);
		} // end add handlers to click on triangle

		var $link = $("a", this.children("p"));
		var href = (!isRoot) ? parentPath.replace(opt.getDirs,opt.getFiles)+'/'+$link.text() : opt.root+"files";
		$link.attr("href", href);
		$link.click(function(){
			$.getJSON(this.href, function(data){
				$("#files").empty().append($("#tpl-files").tmpl(data));
				$("p", opt.container).removeClass("selected");
				$(opt.container).find("div").each(function(){
					$(this).data("data").pathToSelected = false;
					$(this).data("data").filesLoaded = false;
				});
				dirP.addClass("selected");
				dirData.filesLoaded = true;
				$(dir).addPathToParent();
			});
			return false;
		});
	};

	$.fn.addPathToParent = function(){
		var params = this.data("data"), parent = this.parent();
		if(parent.data("data")){
			if(!parent.data("data").isRoot){
				parent.data("data").pathToSelected = params.name+((params.pathToSelected) ? "/"+params.pathToSelected : "");
				console.log("dir: "+parent.data("data").name+" => "+ parent.data("data").pathToSelected);
				parent.addPathToParent();
			}
		}
		else return this;
	};

})(jQuery);