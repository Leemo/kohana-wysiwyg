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
        },
        inputHtml = '',
        btnSuccess = $("#save-modal a.btn-success");

        for (var name in hiddenInputs) {
          inputHtml += '<input type="hidden" name="'+name+'" value="'+hiddenInputs[name]+'" />'
        }
        $("#crop-form").append(inputHtml);

        $("#save-modal").on({
          "show" : function () {
            $(this).find(".control-group").removeClass("error").find(".help-inline").remove();

            btnSuccess.click(function() {
              $("#crop-form").ajaxSubmit({
                url: location.href,
                dataType: "json",
                success:  function(data, statusText, xhr, $form) {
                  $form.find("div.control-group").removeClass("error").find(".help-inline").remove();
                  if(data.ok !== undefined) {
                    $(document).trigger("Filebrowser:crop:afterSave");
                    $("#save-modal").modal("hide");
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
            btnSuccess.unbind("click");
          }
        }).modal();

      },

       "Filebrowser:crop:afterSave": function() {
         var btnSuccess = $("#what-now-modal a.btn-success");
         $("#what-now-modal").on({
          "show" : function () {
            btnSuccess.click(function() {
              $(document).trigger("Filebrowser:crop:exit");
            });
          },

          "hide" : function() {
            btnSuccess.unbind("click");
          }
         }).modal();
       },

      // Close cropresize window
      "Filebrowser:crop:exit": function() {
        window.opener.jQuery(window.opener.document).trigger("Filebrowser:loadFiles");
        window.close();
      }
    });

    // Close cropresizer window on click to "Exit" button
    $("#button-close").click(function() {
      $(document).trigger("Filebrowser:crop:exit");
    });

  })
})(jQuery);