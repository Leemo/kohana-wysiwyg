(function($){
  $(function(){

    // Initialize dropdown menus
    $(".dropdown-toggle").dropdown();

    // Bind global actions
    $(document).bind({
      // Save croped file
      "Filebrowser:crop:save": function(e) {
        var hiddenInputs = {
          'image_width'  : e.resize.w,
          'image_height' : e.resize.h,
          'crop_width'   : e.selection.right-e.selection.left,
          'crop_height'  : e.selection.bottom-e.selection.top,
          'offset_x'     : e.selection.left,
          'offset_y'     : e.selection.top
        }, inputHtml = '';

        for (var name in hiddenInputs) {
          inputHtml += '<input type="hidden" name="'+name+'" value="'+hiddenInputs[name]+'" />'
        }
        $("#crop-form").append(inputHtml);

        $("#save-modal").on({
          "show" : function () {
            $(this).find(".control-group").removeClass("error").find(".help-inline").remove();

            $(this).find("a.btn-success").click(function() {
              $("#crop-form").ajaxSubmit({
                url:      'wysiwyg/filebrowser/rename'+$.getSelectedFilePath(e),
                dataType: "json",
                success:  function(data, statusText, xhr, $form) {
                  $form.find("div.control-group").removeClass("error").find(".help-inline").remove();
                  if(data.ok !== undefined) {
                    $(document).trigger("Filebrowser:loadFiles");
                    $("#file-rename-modal").modal("hide");
                  }
                  else if(data.errors !== undefined) {
                   $form.find(".control-group").addClass("error")
                    .append('<span class="help-inline">'+data.errors.filename+"</span>");
                  }
                }
              });

              return false;
            });
          },
          "hide" : function() {
            $(this).find("a.btn-success").unbind("click");
          }
        }).modal();

      },

      // Close cropresize window
      "Filebrowser:crop:exit": function() {
        window.close()
      }
    });

    // Close cropresizer window on click to "Exit" button
    $("#button-close").click(function() {
      $(document).trigger("Filebrowser:crop:exit");
    });

/*
    $(document).bind("Filebrowser:crop:save", function(e){
      $("#crop-form input[name=image_width]").val(e.resize.w);
      $("#crop-form input[name=image_height]").val(e.resize.h);
      $("#crop-form input[name=crop_width]").val(e.selection.right-e.selection.left);
      $("#crop-form input[name=crop_height]").val(e.selection.bottom-e.selection.top);
      $("#crop-form input[name=offset_x]").val(e.selection.left);
      $("#crop-form input[name=offset_y]").val(e.selection.top);
      $.fancybox($("#crop-form").html(), fancyboxSettings);
    }).bind("fancybox_ready", function(){
      $(document).trigger("process_form");

      $("#fancybox-content .close").click(function(){
        $.fancybox.close();

        return false;
      });

      $("#fancybox-content .exit").click(function(){
        window.close();
        return false
      })
    }).bind("process_form", function(){
      $("#fancybox-content form").ajaxForm({
        "success": function(responseText) {
          try {
            var data = $.parseJSON(responseText);
            location.replace(data.redirect);
            return
          } catch(e) {
            $.fancybox(responseText, fancyboxSettings)
          }
        },
        "iframe": true,
        "data": {
          "X-REQUESTED-WITH": "XMLHTTPREQUEST"
        },
        "beforeSubmit": function() {
          $("#fancybox-content form .submit").addClass("spinner")
        }
      })
    })
*/
  })
})(jQuery);