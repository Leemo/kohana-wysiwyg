/**
 * jQuery plugin for right click context menu.
 *
 * content of file 'contextmenu.css' to be included in page css styles.
 * Auto correction direction of popup opening depending on position of edge of the screen:
 * context menu open to left or right or up or down from clicked object to be full visible whithout scrolling.
 * Also supported non-active (visible but not clicable) point of menu, delimiter of points group, set method and events list of closing popup, call individual handlers or(and) start user events for click each menu points.
 *
 * Plugin should be binded to parent element of objects which need context menu. Progressive method 'delegate' use, and delegete right click event to child elements,
 * so it possible to save in memory only one function-handler on parent element, without many handlers for all elements. Parameter 'targetSelector' set child elements need context menu.
 * Context menu also will work for all future child elements in this parent container.
 *
 * Plugin start event "onOpenContextMenu" on opener (element on which menu open). Event has parameter 'event.menu', it returns menu container.
 *
 * Plugin has 2 public methods: pointToggleActive(number) and pointToggleShow(number). Methods can be use in outher scripts
 * it should call on menu box element to change a view of menu poins (make active, non-active, hide or visible). All they recive a number of <li> element in list.
 *
 * Usage:
 *
 *   $(selector).contextMenu({
 *     cssClass: 'someClass' // (default:'contextMenu') class name for popup
 *
 *     title: 'Popup title', // (default:empty) header of popup. If empty container don't generating,
 *
 *     targetSelector : "a"  // (default: "a") selector in jquery format, for example "a", ".class", "#id" "div>p", show elements need context menu
 *
 *     closeType: { zone: 'any'|'outSide', events:[event1,event2,event3...]} // (default:{zone: 'any', events: ''})
 *     //"zone": - click on what element(s) will close popup: 'any' - all document including popup elements,'outSide - close only by 'click' outside popup,
 *     // "events": the list of events (in addition to 'click') should close popup. WARNING! Browser events 'click' and 'contextmenu' always close popup irrespective of any settings.
 *
 *     list: [ // (default:empty array) array of objects (or string value for delemiter) for each menu point;
 *       {
 *				text:'someText',            // the text of this menu point, empty make this point ignored (irrespective of other parameters)
 *				itemClass:'classOfpoint',   // the css class directly for this point contain for example bkg-color, bkg-icon, text-color
 *				event: 'eventName' | {} ,  // user event (name or event object) starting on click this menu point, WARNING! event start on element which has opened contextmenu, not on menu point! you can get opener as event.target
 *				handler: function(){},      // anonymous function which will call on click this menu point. WARNING! It will called "as is" like "<a>" onClick handler, it's 'return' will transport to link, you should controll return value
 *				href: 'http://somelink',    // link to some url will put to point 'href' attribute, link behaviour should be coordinate to handler function if it exist (for ex. handler can return 'false' and this 'href' not be processed)
 *			  nonActive : false,          // (BOOL) setting 'true' make menu point visible but non clicable, this point <li> element will contain overlay <span> over <a> and have no class ".active"
 *			 },
 *			"break",                      //change all described object to string "break" make the delimiter point between menu points. this point styles set in class '.delimiter'
 *     ]
 *   });
 *
 * - Leemo-studio, 2011 http://leemo-studio.net/
 *
 * MIT License: https://github.com/joewalnes/jquery-simple-context-menu/blob/master/LICENSE.txt
 */

;
(function($){
	$.fn.contextMenu = function(opt) {
		var opt = $.extend({
			closeType: {
				zone : 'any',
				events : ''
			},
			cssClass : 'contextMenu',
			targetSelector : "a",
			title: '',
			list: []
		}, opt);

		return this.delegate(opt.targetSelector, "contextmenu", function(e){
      $("div."+opt.cssClass).remove();
			var $p = $('<div class = "'+opt.cssClass+'"></div>').appendTo(document.body);
			if(opt.title) $p.append("<h3>"+opt.title+"</h3>");
			var $li, $menu = $("<ul/>").appendTo($p), opener = $(e.target);
			if(opener.parent() != this) { // if event.target is targrtSelector's child
				opener = $(e.target).closest(opt.targetSelector) || opener;
			}
			$.each(opt.list, function(i,item){
				if(typeof(item) == "object"){
					if(item.text) {
						$li = $("<li>",{
							"class" : ((item.nonActive) ? "nonActive " :"active ")+item.itemClass
						}).appendTo($menu);
						$li.append( $("<a/>", {
							text : item.text,
							href : (item.nonActive) ? item.href : null,
							click : (typeof(item.handler) == "function" || item.event != "") ?
							function(e){
								if(opt.closeType.zone == 'outSide') e.stopPropagation();
								else if(opt.closeType.zone == 'any') $p.remove();
								if(item.event) opener.trigger(item.event);
								return (item.handler)? item.handler(e) :"";
							}
							:""
						}
						)).append((item.nonActive) ? "<span/>" :"").data("href", item.href);
					}
				}
				else $("<li>",{
					"class": "delimiter"
				}).appendTo($menu);
			});

			$p.css({
				"left": e.pageX+"px",
				"top" : e.pageY+"px"
			});
			if($p[0].getBoundingClientRect().bottom > $(window).height()+$(document).scrollTop()) {
				$p.css({
					"top" : e.pageY - $p.outerHeight()+"px"
				});
			}
			if($p[0].getBoundingClientRect().rigth > $(window).width()) {
				$p.css({
					"left" : e.pageX - $p.outerWidth()
				});
			}
			$.each(opt.closeType.events.split(",").concat(['click','contextmenu']), function(i,ev){
				$(document).bind(ev, function(e){
					$p.remove();
					$(this).unbind(e);
				});
			});
			$("a").bind('click contextmenu', function(e){ // for clicks which have stopPropagation or return false (for Chrome, IE)
				$p.remove();
				$(this).unbind(e);
			});

			opener.trigger({
				type: "onOpenContextMenu",
				menu: $p
			});

			return false;
		});
    return this;
	};

	$.fn.pointToggleActive = function(n){ // public method for menu points
		var list = $("li", this);
		if(list.length > 0 && typeof(list[n]) != 'undefined'){
			if(!$(list[n]).hasClass("delimiter")){
				var $li = $(list[n]), $link = $li.children("a");
				if($li.hasClass("nonActive") && $li.children("span").length > 0) {
					$li.removeClass("nonActive").addClass("active").children("span").remove();
					$link.attr("href", $li.data("href"));
				}
				else if($li.hasClass("active")) {
					$li.removeClass("active").addClass("nonActive").append("<span/>");
					$link.removeAttr("href");
				}
			}
			else console.warn("pointToggleActive: element number "+n+" is delemiter, not menu point");
		}
		else console.warn("pointToggleActive: context menu isn't contain element number "+n+" or empty");
		return this;
	}

	$.fn.pointToggleShow = function(n){
	var list = $("li", this);
		if(list.length > 0 && typeof(list[n]) != 'undefined'){
			if(!$(list[n]).hasClass("delimiter")) list[n].toggle();
			else console.warn("pointToggleShow: element number "+n+" is delemiter, not menu point");
		}
		else console.warn("pointToggleShow: context menu isn't contain element number "+n+" or empty");
		return this;
	}

})(jQuery);