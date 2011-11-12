;(function($){
	$.fn.folderTree = function(opt){
		var opt = $.extend({
			cacheTime : 0, //during this time (minutes) folder opening show last loaded inner
			autoTurnTree : true, //auto open tree to folder which files is currently opened in browser
			filesPathLine : "#header h2", //jQuery selector of outher html element has showing files path
			filesPathDelimiter : " / ",
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
			"pathToSelected" : false,
      "folderRect" : dirP[0].getBoundingClientRect()
		});

		$.fn.getD = function(){return this.data("data");};

    $(opt.filesPathLine).data("path", $(opt.filesPathLine).text());
		var dirData = $(dir).getD();
		if($(this).getD().hasChild == 0) $("b", this.children("p")).css("visibility", "hidden");
		else {
			$("b", this.children("p")).toggle(
				function(){
          	if(!dirData.lastResponce || new Date().getMinutes()- dirData.lastResponce > opt.cacheTime){
						var parentPath = dirData.path;
						$(dir).addClass("process");
						$.getJSON(global_config.dirs_url+parentPath, function(data){
							$(dir).removeClass("process").addClass("open").getD().open = true;
							$("div", dir).remove();
							for(var dirName in data.dirs){
								$('<div name="'+data.dirs[dirName]+'"><p><b><span></span></b><a href="">'+dirName+'</a><em></em></p></div>').appendTo(dir).setPath(parentPath,opt);
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
					$(document).trigger("openFolderClick", dirData.path);
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
		var href = (!isRoot) ? '/'+global_config.files_url+this.getD().path : global_config.files_url;
		$link.attr("href", href);
		$link.click(function(){
      path = $(this).parent().parent().getD().path;
      console.log (path);
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
			$(this).setPath("", opt);
		});

		$.fn.buildFullPath = function(dir){
		var fullPath = this.empty(), pathTxt = '';
		var parent = function(folder){
			if(folder.getD()){
				fullPath.prepend((fullPath.children().length > 0)
					?'<em>'+folder.getD().name+'</em><span>'+opt.filesPathDelimiter+'</span>'
					:'<em>'+folder.getD().name+'</em>');
         pathTxt = folder.getD().name+"/" + pathTxt;
				return parent(folder.parent());
			}
			else {
        $(this).data("path", pathTxt);
        return this;
      }
		};
		parent($(dir));
	};
	return this;
};

})(jQuery);