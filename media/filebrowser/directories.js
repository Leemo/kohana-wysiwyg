$(function(){
	$("div.directories").folderTree();
});


$.fn.folderTree = function(opt){
	var opt = $.extend({
		unit : "div", //each folder unit
		root : "filebrowser/",
		getDirs : "dirs", //link suffix for folders json getting
		getFiles : "files", //link suffix for files json getting
		cacheTime : 1 //during this time (minutes) folder opening show last loaded inner 
	}, opt);

	this.children(opt.unit).each(function(){
		$(this).setPath(opt.root+opt.getDirs, opt);
	});
};

$.fn.setPath = function(parentPath,opt){
	var dir = this[0];
	$.data(dir, "path", parentPath+"/"+$("a", this).text());
	console.log(parentPath+"/"+$("a", this).text());
	$("b", this).toggle(function(){
		
		if(!$.data(dir,"lastResponce") || new Date().getMinutes()-$.data(dir,"lastResponce") > opt.cacheTime){
			$("div", dir).remove();
			var parentPath = $.data(dir, "path");
			$.getJSON(parentPath, function(data){
				$(dir).addClass("open");
				for(var i in data.dirs){
					$('<div><p><b><span></span></b><a href="">'+data.dirs[i]+'</a></p></div>').appendTo(dir).setPath(parentPath,opt);
				}
				$.data(dir,"lastResponce", new Date().getMinutes());
			});
		}
		else {
			$("div", dir).show();
			$(dir).addClass("open");
		}
		
		

	},
	function(){
		$(this.parentNode.parentNode).removeClass("open").children("div").hide();
	});
	var $link = $("a", this);
	$link.attr("href", parentPath.replace(opt.getDirs,opt.getFiles)+'/'+$link.text());
	$link.click(function(){
		$.getJSON(this.href, function(data){
			$("#files").empty().append($("#tpl-files").tmpl(data));
			$("p", dir.parentNode).removeClass("selected");
			$(dir).children("p").addClass("selected");
		});
		return false;
	});

}
