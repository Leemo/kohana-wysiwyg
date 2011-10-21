(function($){
  $(function(){

    // Modal dialog window settings
    var fancyboxSettings = {
      "overlayOpacity":     0.4,
      "hideOnOverlayClick": false,
      "showCloseButton":    false,
      "speedIn":            0,
      "speedOut":           0,
      "onComplete":         function(){
        $(document).trigger("fancybox_ready")
      }
    };

    // Tooltips on buttons
    $(".tip-sw").tipsy({
      "gravity": "sw",
      "fade":    true,
      "delayIn": 1000
    });

    // Save croped image
    $(document).bind("savecrop", function(e){
      $("#crop-form input[name=image_width]").val(e.resize.w);
      $("#crop-form input[name=image_height]").val(e.resize.h);
      $("#crop-form input[name=crop_width]").val(e.selection.right-e.selection.left);
      $("#crop-form input[name=crop_height]").val(e.selection.bottom-e.selection.top);
      $("#crop-form input[name=offset_x]").val(e.selection.left);
      $("#crop-form input[name=offset_y]").val(e.selection.top);

      $.fancybox($("#crop-form").html(), fancyboxSettings)
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
            data = $.parseJSON(responseText);
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
  })
})(jQuery);