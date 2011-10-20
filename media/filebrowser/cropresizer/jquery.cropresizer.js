;
(function($){
  $.fn.cropResize = function(original){
    var obj = $.extend(this,{

      // defauli parameters
      init : $.extend(this.position(),{
        w: original.width,
        h: original.height
      }),

      // current heometric & dynamic parameters
      currentSize : {
        w: original.width,
        h: original.height
      },
      currentPos : this.position(),
      area : this.parent()[0].getBoundingClientRect(),
      selection : {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      selectionRelativeCenter: {
        x: 0,
        y: 0
      },
      wheelTiks : 0,

      // structure elements
      win : this.parent(),
      clipImg : this.children("img").clone().css({
        "display": "block",
        "position": "absolute",
        "z-index": 49,
        "top": 0,
        "left": 0,
        "clip": "rect(0px,0px,0px,0px)"
      }).insertAfter("#overlay"),
      cropper   : $("#cropper"),
      undercoat : $("<div/>",{id: "undercoat"}).prependTo(this),
      picture : this.children("img"), //already two images
      // toolbar
      plus      : $("#plus"),
      minus     : $("#minus"),
      reset     : $("#reset"),
      center    : $("#center"),
      close     : $("#close"),
      save      : $("#save"),
      zoominput : $("#ratio"),
      drag      : $("#drag"),
      crop      : $("#crop"),
      cropsize  : $("#cropsize"),
      crop_w    : $("#crop_w"),
      crop_h    : $("#crop_h"),

      // other

      resizers : {
        lt : ["left","top"],
        mt : ["top"],
        rt : ["right","top"],
        rm : ["right"],
        rb : ["right","bottom"],
        mb : ["bottom"],
        lb : ["left","bottom"],
        lm : ["left"]
      },

      axles : {
        left : "X",
        right : "X",
        top : "Y",
        bottom : "Y"
      },

      //pictupe methods
      Drag : function(e) {

        var shift = {
          X : e.clientX-this.position().left,
          Y : e.clientY-this.position().top
        };
        var $box = this.addClass("movingNow");
        $(this.win).bind("mousemove.drag", function(e){
          $box.css({
            left: e.clientX-shift.X+"px",
            top : e.clientY-shift.Y+"px"
          });
        });
        $(document).bind("mouseup.drag", function(){
          obj.Drop();
        });
        return this;
      },

      Drop : function() {
        $(this.win).unbind("mousemove.drag");
        this.removeClass("movingNow");
        this.currentPos = this.position();
        this.trigger({
          type : "onDroped",
          element : this[0]
        });
        return this;
      },

      ZoomStart : function(mode, direct, go, timestep) {
        var hasSelection = this.cropper.hasClass("show");
        if(go){ // auto fast zoom
          var ratio, base, delay;
          if(mode == "button"){ //  auto zoom by buttons press
            ratio = (direct > 0)? 10 : 0.1;
            base = {
              w: this.init.w,
              h: this.init.h
            };
            delay = 500;
          }
          else if (mode == "wheel") { // zoom by mouse wheel
            ratio = (direct > 0) ? 0.83333 : 1.2;
            base = this.currentSize;
            delay = 0;
          }
          else if (mode == "input") { // zoom by entering digital ratio
            ratio = direct/100;
            base = {
              w: this.init.w,
              h: this.init.h
            };
          }

          this.zoominput.addClass("moving");
          this.picture.delay(delay).animate({ // image resize
            width: base.w*ratio+"px"
          },
          {
            duration: timestep,
            step: function(now,elem){
              obj._updateSize();

            },
            complete: function(){
              obj._updateSize();
            }
          });

          this.delay(delay).animate({ // div#img hold center
            left: parseInt(this.currentPos.left*1 + (this.currentSize.w - base.w*ratio)/2)+"px",
            top: parseInt(this.currentPos.top*1 + (this.currentSize.h - base.h*ratio)/2)+"px"
          },
          {
            duration : timestep,
            step : (hasSelection) ? function(){// selection hold position;
              obj.ClipHoldCenter();
            } : "",
            complete : function(){
              obj.currentPos = $(this).position();
              if(obj.wheelTiks != 0) {
                var dirnext = Math.abs(obj.wheelTiks)/obj.wheelTiks;
                obj.wheelTiks -= dirnext;
                obj.ZoomStart("wheel", dirnext*5, true, 30);
              }
              else obj.removeClass("active in out");
            }
          });
        }

        else { // handle hight presite zoom by click
          this.currentSize.w += mode*2;
          this.picture.css("width", this.currentSize.w+"px");
          obj._updateSize();
          if(hasSelection) obj.ClipHoldCenter();
        }

      },

      ZoomStop : function(){
        this.picture.stop(true);
        this.stop(true);
        this.cropper.stop(true);
        this._updateSize();
        this.currentPos = this.position();
      },

      Crop : function(e){
        var delta = {
          x: this.currentPos.left*1+this.area.left,
          y: this.currentPos.top*1+this.area.top
        };
        var start = {
          x: e.pageX,
          y: e.pageY
        };
        //			this.clipImg.removeAttr("style");
        this.cropper.removeAttr("style").removeClass();
        this.clipImg.css("clip", "(0,0,0,0)");
        this.bind({
          "mousemove.crop" : function(e){ // creating clip
            obj.selection = {
              left: parseInt((start.x <= e.pageX ? start.x : e.pageX)-delta.x),
              top : parseInt((start.y <= e.pageY ? start.y : e.pageY)-delta.y),
              right: parseInt((start.x >= e.pageX ? start.x : e.pageX)-delta.x),
              bottom : parseInt((start.y >= e.pageY ? start.y : e.pageY)-delta.y)
            };
            obj.ShowRect();
          },
          "mouseup.crop" : function(){ // setting of created clip
            obj._clipGetRelativeCenter().unbind(".crop").bind("contextmenu", function(){
              obj.ClipDelete().unbind("contextmenu");
              return false;
            }).cropper.addClass("created").bind("mousedown.clipmovestart", function(e){
              e.stopPropagation();
              obj.ClipMove(e);
            }).bind("selectstart", function(){return false}).children("b").bind(
              "mousedown.clipresizestart", function(e){
                e.stopPropagation();
                obj.ClipResize(e, $(this));
              });
          }
        });
        return this;
      },
      // selection methods
      ClipResize : function(e, $point){
        var resizer = this.resizers[$point.attr("id")], start = {};
        for(var i in resizer)	start[this.axles[resizer[i]]] = e["page"+this.axles[resizer[i]]] - this.selection[resizer[i]];

        this.bind({
          'mousemove.clipresize' : function(e){
            for(var i in resizer)	obj.selection[resizer[i]] = parseInt(e["page"+obj.axles[resizer[i]]]-start[obj.axles[resizer[i]]]);
            obj.ShowRect();
            return false;
          },
          "mouseup.clipresize" : function(){
            $(this).unbind('.clipresize');
            obj._clipGetRelativeCenter();
          }
        });
        return this;
      },

      ClipSetSize : function(elem) {
        var winsize = {
          w: this.win.width(),
          h: this.win.height()
        }
        elem.bind({
          "keyup" : function(){
            var value = parseInt($(this).val());
            if((!isNaN(value) && value > 0 && value < winsize[$(this).attr("name")]-20)) {
              if (this == obj.crop_w[0]) {
                obj.selection.left = parseInt((obj.selection.right + obj.selection.left - value)/2);
                obj.selection.right = obj.selection.left + value;
              }
              if (this == obj.crop_h[0]) {
                obj.selection.top = parseInt((obj.selection.bottom + obj.selection.top - value)/2);
                obj.selection.bottom = obj.selection.top + value;
              }
              obj.ShowRect();
            }
            else $(this).val("");
          },

          "focus": function(){
            obj.cropper.addClass("input");
          },

          "blur" : function(){
            obj.cropper.removeClass("input");
          }
        });
        return this;
      },

      ClipMove : function(e){
        var start = {};
        for(var side in obj.axles) start[side] = e["page"+obj.axles[side]]-this.selection[side];

        obj.bind({
          "mousemove.clipmove" : function(e){
            e.stopPropagation();
            obj.cropper.addClass("movingNow");
            for(var side in obj.axles) obj.selection[side] = parseInt(e["page"+obj.axles[side]]-start[side]);
            obj.ShowRect();
          },
          "mouseup.clipmove" : function(){
            obj._clipGetRelativeCenter().unbind(".clipmove").cropper.removeClass("movingNow");
          }
        });
        return this;
      },

      _clipGetRelativeCenter : function(){
        this.selectionRelativeCenter = {
          x: (this.selection.right + this.selection.left)/2/this.currentSize.w,
          y: (this.selection.bottom + this.selection.top)/2/this.currentSize.h
        };
        return this;
      },

      ClipHoldCenter : function(){
        var center = {
          x: this.currentSize.w*this.selectionRelativeCenter.x,
          y: this.currentSize.h*this.selectionRelativeCenter.y
        }
        var w = this.selection.right-this.selection.left;
        var h = this.selection.bottom - this.selection.top;
        var pos = {
          x: parseInt(center.x-w/2),
          y: parseInt(center.y-h/2)
        }
        this.selection = {
          left: pos.x,
          top : pos.y,
          right : pos.x + w,
          bottom : pos.y + h
        };
        console.log(w,h);
        this.ShowRect();
      },

      ClipDelete : function(){
        for(var side in this.axles) this.selection[side] = 0;
        this.clipImg.css("clip", "rect(0,0,0,0)");
        this.cropper.removeClass().removeAttr().unbind();
        this.undercoat.removeClass();
        this.selectionRelativeCenter = {
          x: 0,
          y: 0
        };
        return this;
      },

      ShowRect : function(){
        this.clipImg.css("clip","rect("+this.selection.top+"px,"+this.selection.right+"px,"+this.selection.bottom+"px,"+this.selection.left+"px)")
        var divsSize = {w: this.selection.right - this.selection.left +"px", h: this.selection.bottom - this.selection.top +"px"}
        this.cropper.css({
          left: this.selection.left+"px",
          top: this.selection.top+"px",
          width: divsSize.w,
          height: divsSize.h
        }).addClass("show");

        this.undercoat.css({
          left: this.selection.left+"px",
          top: this.selection.top+"px",
          width: divsSize.w,
          height: divsSize.h
        }).addClass("show");
        this.crop_w.val(this.selection.right - this.selection.left);
        this.crop_h.val(this.selection.bottom - this.selection.top);
        return this;
      },

      // common methods
      Reset : function(){
        this.zoominput.addClass("moving");
        this.picture.animate({
          width: this.init.w+"px"
        },300);
        this.animate({
          left: this.init.left+"px",
          top: this.init.top+"px"
        },300, function(){
          obj.zoominput.removeClass("moving").val("100");
          obj.currentPos = $(this).position();
          obj.currentSize = {
            w: obj.init.w,
            h: obj.init.h
          }
        });
        return this.ClipDelete();
      },

      Center : function(){
        this.animate({
          left: (this.area.right-this.area.left-this.currentSize.w)/2+"px",
          top: (this.area.bottom-this.area.top-this.currentSize.h)/2+"px"
        },300);
      },

      _updateSize : function(){
        this.currentSize = {
          w: this.picture.width()*1,
          h: this.picture.height()*1
        };
        this.zoominput.removeClass("moving").val(parseInt(this.picture.width()/this.init.w*100));
        return this;
      }
    });
    // end of object-----------------------------------------------

    if($.browser.msie && parseInt($.browser.version) < 9) this.addClass("inIE");

    this.picture.load(function(){
      obj.css({width: "auto", height: "auto"});
    });

    this.bind(
      "mousedown.setcrop", function(e){ // begin crop on image
        obj.Crop(e);
      });


    this.drag.click(function(){ // drag image button
      $(this).addClass("active");
      obj.crop.removeClass("active");
      obj.win.addClass("dragable");
      obj.unbind(".setcrop").bind("mousedown.drag", function(e){
        obj.Drag(e);
      });
    });

    this.crop.click(function(){
      obj.drag.removeClass("active");
      obj.win.removeClass("dragable");
      $(this).addClass("active");
      obj.unbind(".drag").bind(
        "mousedown.setcrop", function(e){
          obj.Crop(e);
        });
    });

    $.each([this.plus, this.minus], function(i){ // zoom buttons
      $(this).bind({
        "click" : function(){ // presition resize by single click
          obj.ZoomStart("button", 1-i*2, false);
        },
        "mousedown" : function(){
          obj.ZoomStart("button", 1-i*2, true, 3000);
        },
        "mouseup" : function(){
          obj.ZoomStop();
        }
      });
    });

    this.reset.click(function(){ // resr button
      obj.Reset();
    });

    this.center.click(function(){
      obj.Center()
    });

    this.close.click(function(){
      window.close();
    });

    this.save.click(function(){
      $(document).trigger({
        type: "savecrop",
        resize: obj.currentSize,
        selection: obj.selection
      });
    });

    this.win.bind('mousewheel DOMMouseScroll',  function(e){
      e.preventDefault();
      var dir = -e.wheelDelta || e.detail;
      obj.wheelTiks += dir/Math.abs(dir);
      if(!obj.hasClass("active")){
        obj.addClass("active "+((dir<0) ? "in" : "out"));
        obj.ZoomStart("wheel", dir, true, 10);
      }
    });

    this.cropsize.bind("mousedown mousemove click mouseup", function(e){ // disable seletion moving by size area
      e.stopPropagation();
    });

    $.each([this.crop_w, this.crop_h], function(i, elem){ // selection size inputs
      obj.ClipSetSize(elem);
    });

    this.zoominput.bind({ // zoom by entering required digital ratio
      "keydown" : function(){
        $(this).data("value", $(this).val());
      },
      "keyup" : function(){
        var val = parseInt($(this).val());
        if(!isNaN(val)){
          obj.ZoomStart("input", val, true, 150);
        }
        else $(this).val($(this).data("val"));
      }
    });


    return obj;
  }
})(jQuery);
