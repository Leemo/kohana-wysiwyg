(function($){
  $(function(){

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

      $.fancybox($("#crop-form").html(), {
        "overlayOpacity":     0.4,
        "hideOnOverlayClick": false,
        "showCloseButton":    false,
        "speedIn":            100,
        "speedOut":           100,
        "onComplete": function(){
          $(document).trigger("fancybox_ready")
        }
      })
    }).bind("fancybox_ready", function(){
      $("#fancybox-content .close").click(function(){
        $.fancybox.close();
        return false;
      });
    })
  })
})(jQuery);