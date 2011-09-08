$(function(){
	$("div.directories div").each(function(){
	  var dir = this;
		$("b", this).click(function(){
			$(dir).toggleClass("open");
		});
	});
});
