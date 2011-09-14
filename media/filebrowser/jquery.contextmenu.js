/**
 * jQuery plugin for right click context menu.
 *
 * content of file contextmenu.css to be included in page css.
 * Auto correction direction of popup opening depending on position of edge of the screen:
 * context menu open to left or right or up or down from clicked object to be full visible whithout scrolling.
 * Also supported non-active point of menu, delimiter of points group, set method of closing popup, call diferent handlers or(end) start user events for each menu points.
 * Usage:
 *
 *   $(selector).contextMenu({
 *     cssClass: 'someClass' // (default:'contextMenu') class name for popup
 *     title: 'Popup title', // (default:empty) header of popup. If empty container don't generating,
 *     closeType: 'anyClick'|'outSideClick' // (default:'anyClick') anyclick - close by any click including menu elements click, 'outSideClick - close only by click outside popup
 *     list: [ // (default:empty array) array of objects (or string value for delemiter) for each menu point;
 *       {
 *				text:'someText', // the text of this menu point, empty value make this menu point ignored (irrespective of other parameters)
 *				itemClass:'classOfpoint', // the css class directly for this point contain for example bkg-color, bkg-icon, text-color
 *				event: 'eventName',  // user event starting on click this menu point, WARNING! event start on element which has opened contextmenu, not on menu point! you can get opener as event.target
 *				handler: function(){}, // anonym function which will call on click this menu point, it called "as is" like "<a>" onClick handler, return transport to link, you should controll return value
 *				href: 'http://somelink',  // link to some url will put to 'href' attribute, link behaviour should be coordinate to handler function (for ex. it can return 'false' and this 'href' not be processed)
 *			  nonActive : false,// (BOOL) setting 'true' make menu point visible but non clicable
 *
 *			 },
 *			"break", //change all described object to string "break" make the delimiter point between menu points. this point styles set in class '.delimiter'
 *     ]
 *   });
 *
 * - Leemo-studio, 2011 http://leemo-studio.net/
 *  
 * MIT License: https://github.com/joewalnes/jquery-simple-context-menu/blob/master/LICENSE.txt
 */

(function($){
	$.fn.contextMenu = function(opt) {
		var opt = $.extend({
			closeType: 'anyClick',
			cssClass : 'contextMenu',
			title: '',
			list: []
		}, opt);

		var $li, $menu = $("<ul>"), opener = this;
		$.each(opt.list, function(i,item){
			if(typeof(item) == "object"){
				if(item.text) {
					$li = $("<li>",{
						"class" : ((item.nonActive) ? "" :"active ")+item.itemClass
					}).appendTo($menu);
					$li.append((item.nonActive) ? $("<span>", {
						text : item.text
					}) : $("<a>",{
						text : item.text,
						href : item.href,
						click : (typeof(item.handler) == "function" || item.event != "") ?
						function(e){
							if(opt.closeType == 'outSideClick') e.stopPropagation();
							if(item.event) opener.trigger(item.event);
							return (item.handler)? item.handler(e) :"";
						}
						:""
					}));
				}
			}
			else $("<li>",{
				"class": "delimiter"
			}).appendTo($menu);
		});
    
		this.bind("contextmenu", function(e){
			var $popup = $('<div class = "'+opt.cssClass+'"></div>').append($menu).appendTo("body");
			if(opt.title) $("<h3>"+opt.title+"</h3>").insertBefore($menu);
			$popup.css({
				"left": e.pageX+"px",
				"top" : e.pageY+"px"
			});
			
			var right = $popup.offset().left*1 + $popup.outerWidth();
			var bottom = $popup.offset().top*1 + $popup.outerHeight();
			if(bottom > $(window).height()+$(document).scrollTop()) {
				$popup.css({
					"top" : e.pageY - $popup.outerHeight()+"px"
				})
			}
			if(right > $(window).width()) {
				$popup.css({
					"left" : e.pageX - $popup.outerWidth()
				});
			}
			$.each(['click','contextmenu'], function(i,ev){
				$(document).bind(ev, function(){
					$popup.remove();
					$(this).unbind(ev);
				});
			});
			return false;
		});
	}
})(jQuery);