
$.fn.folderTree = function(opt){
	var opt = $.extend({
		unit : "div", //each folder unit
		root : "wysiwyg/filebrowser/",
		getDirs : "dirs", //link suffix for folders json getting
		getFiles : "files", //link suffix for files json getting
		cacheTime : 1, //during this time (minutes) folder opening show last loaded inner
		container : this
	}, opt);

	this.children(opt.unit).each(function(){
		$(this).setPath(opt.root+opt.getDirs, opt);
	});
};

$.fn.setPath = function(parentPath,opt){
	var dir = this[0];
	$(dir).data("data",{
		"path" : parentPath+"/"+$("a", this).text(),
		"name" : $("a", this).text(),
		"open" : false,
		"hasSelected" : false,
		"hasChild" : this.attr("name")*1,
		"lastResponce" : false,
		"filesLoaded" : false
	});
	console.log(parentPath+"/"+$("a", this).text());
	$("b", this).toggle(
		function(){
			if(!$(dir).data("data").lastResponce || new Date().getMinutes()-$(dir).data("data").lastResponce > opt.cacheTime){
				var parentPath = $(dir).data("data").path;
				$(dir).addClass("process");
				$.getJSON(parentPath, function(data){
					$(dir).removeClass("process").addClass("open");
					$(dir).data("data").open = true;
					$("div", dir).remove();
					for(var dirName in data.dirs){
						$('<div name="'+data.dirs[dirName]+'"><p><b><span></span></b><a href="">'+dirName+'</a></p></div>').appendTo(dir).setPath(parentPath,opt);
					}
					$(dir).data("data").lastResponce = new Date().getMinutes();
				});
			}
			else {
				$("div", dir).show();
				$(dir).addClass("open").data("data").open = true;
				if($(dir).children("p").hasClass("selected") && $(dir).data("data").hasSelected && !$(dir).data("data").filesLoaded){
					$(dir).removeClass("selected");
				}
			}
		},
		function(){
			var selectedChild = false;
			$(dir).data("data").open = false;
			$(dir).removeClass().children("div").each(function(){
				if($(this).data("data").filesLoaded) selectedChild = $(this).data("data").name;
				$(this).hide();
			});
			$(dir).data("data").hasSelected = selectedChild;
			if(selectedChild) $(dir).children("p").addClass("selected");
		}
		);

	var $link = $("a", this);
	$link.attr("href", parentPath.replace(opt.getDirs,opt.getFiles)+'/'+$link.text());
	$link.click(function(){
		$.getJSON(this.href, function(data){
			$("#files").empty().append($("#tpl-files").tmpl(data));
			$("p", opt.container).removeClass("selected");
			$("div", opt.container).data("data").filesLoad = false;
			$(dir).children("p").addClass("selected");
			$(dir).data("data").filesLoad = true;
		});
		return false;
	});
}

/*$.fn.markSelectParent = function(mode){
	$.data(this.parent()[0],
}*/