(function($){
  $(function(){

    // Initialize dropdown menus
    $(".dropdown-toggle").dropdown();

    // Bind global actions
    $(document).bind({
      // Save croped file
      "Filebrowser:crop:save": function(e) {
        $("#crop-form input[name=image_width]").val(e.resize.w);
        $("#crop-form input[name=image_height]").val(e.resize.h);
        $("#crop-form input[name=crop_width]").val(e.selection.right-e.selection.left);
        $("#crop-form input[name=crop_height]").val(e.selection.bottom-e.selection.top);
        $("#crop-form input[name=offset_x]").val(e.selection.left);
        $("#crop-form input[name=offset_y]").val(e.selection.top);
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