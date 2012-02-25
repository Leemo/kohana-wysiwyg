;
(function($){
  $.fn.folderTree = function(opt){
    var opt = $.extend({
      autoTurnTree : true, //auto open tree to folder which files is currently opened in browser
      container : this //don't change!
    }, opt);

    $.fn.getD = function(){
      return this.data("data");
    };

    $.fn.addSelectMarkToParent = function(){
      var parent = this.parent();
      if(parent.getD()){
        if(!parent.getD().isRoot){
          parent.getD().isParentOfSelected = true;
          parent.addSelectMarkToParent();
        }
      }
      else return this;
    };

    var parentsArray;

    $.fn.processFolder = function(){
      var dir = this[0], dirP = $(dir).children("p");
      var isRoot = ($(this).attr("id") == "root") ? true : false;
      this.data("data",{
        "name" : dirP.children("a").text(),
        "isRoot" : isRoot,
        "open" : isRoot,
        "hasChild" : this.attr("name")*1,
        "lastResponce" : false,
        "filesLoaded" : false,
        "isParentOfSelected" : false,
        "folderRect" : dirP[0].getBoundingClientRect()
      });

      if(isRoot) $(this).children("p").addClass("selected");

      var dirData = $(dir).getD();
      if($(this).getD().hasChild == 0) this.children("p").addClass("no_Child");
      else {
        $("i", this.children("p")).toggle(
          function(){ // open folder
            $(dir).addClass("process");
            var fullPath = $(dir).buildFullPath();
            $.getJSON(global_config.dirs_url + fullPath, function(data){
              $(dir).removeClass("process").addClass("open").getD().open = true;
              $("div", dir).remove();
              for(var dirName in data.dirs){
                if(!isNaN(data.dirs[dirName])){
                  $('<div name="'+data.dirs[dirName]+'"><p><i class="icon-chevron-right"></i><a href="">'+dirName+'</a><em></em></p></div>').appendTo(dir).processFolder();
                }
              }

              if(path != "") { // auto turn tree to selected folder
                var level = $.inArray(dirData.name, parentsArray);
                if(level != -1 && dirData.isParentOfSelected) {
                  $(dir).children("div").each(function(){
                    if($(this).getD().name == parentsArray[level+1]){
                      $(this).children("p").addClass("selected").children("i").addClass("icon-white");
                      if(level+2 == parentsArray.length) {
                        $(this).getD().filesLoaded = true;
                      }
                      else {
                        $(this).getD().isParentOfSelected = true;
                        if(opt.autoTurnTree) $("i", this).click();
                      }
                    }
                  });
                }
              }
            });

            if(dirP.hasClass("selected") && !dirData.filesLoaded){
              dirP.removeClass("selected").children("i").removeClass("icon-white");
            }
            $(document).trigger("openFolderClick", fullPath);
          },
          function(){ // close folder
            dirData.isParentOfSelected = dirData.open = false;
            $(dir).removeClass().find("div").each(function(){
              if($(this).getD().filesLoaded) {
                dirData.isParentOfSelected = true;
                dirP.addClass("selected").children("i").addClass("icon-white");
              }
              $(this).hide();
            });
            $(document).trigger("closeFolderClick");
          }
          );
      }
      // end add handlers to click on "open/close" icon

      $("a", this.children("p")).click(function(){ // click for files load
        path = $(dir).buildFullPath();
        parentsArray = path.split("/");
        parentsArray.shift();
        parentsArray.pop();
        $.getJSON('/'+global_config.files_url+((!isRoot)? path : ''), function(data){
          $("#files-row").empty().append($("#tpl-files").tmpl(data));
          $("p", opt.container).removeClass("selected").children("i").removeClass("icon-white");
          $(opt.container).find("div").each(function(){
            $(this).getD().isParentOfSelected = false;
            $(this).getD().filesLoaded = false;
          });
          dirP.addClass("selected").children("i").addClass("icon-white");

          dirData.filesLoaded = true;
          $(dir).addSelectMarkToParent();
          $("#breadcrumb").breadcrumbUpdate(); // method defined in global.js
        });
        return false;
      });
    }; // end of prosessFolder()

    $("div",this).each(function(){
      $(this).processFolder();
    });

    return this;
  };

  // public methods of folders tree

  $.fn.buildFullPath = function(){
    var pathTxt = '';
    var parent = function(folder){
      if(!folder.data("data").isRoot){
        pathTxt = folder.data("data").name+"/" + pathTxt;
        parent(folder.parent());
      }
      else return;
    };
    parent(this);
    return "/" + pathTxt;
  };

  $.fn.addFolder = function(){
    var dirData = this.getD();
    if(dirData.hasChild == 0) $("b", this.children("p")).css("visibility", "visible");
    dirData.hasChild++;
    $("b", this.children("p")).click();
  }

  $.fn.renameFolder = function(name){
    var dirData = this.getD();
    dirData.name = name;
    $("a", this.children("p")).text(name);
    if(dirData.isParentOfSelected) {
      this.find("div").each(function(){
        if($(this).getD().filesLoaded){
          path = $(this).buildFullPath();
        }
      });
    }
  }

})(jQuery);