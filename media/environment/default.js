(function($) {
  $.wysiwyg_config = {
    // replace some settings of default configuration in config.js

    // default
    standart: {

    },

    // add second class "simple" to element to get this config.
    simple: {
     toolbarGroups: [
      {name: 'clipboard', groups: [ 'clipboard', 'undo', 'mode' ]},
      {name: 'links'},
      {name: 'insert'},
      {name: 'tools'},
      '/',
      {name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ]},
      {name: 'paragraph', groups: [ 'list', 'align' ]},
      {name: 'styles'}
    ],
    extraPlugins: 'autogrow',
    removeButtons: 'Smiley,CreateDiv,PageBreak,Iframe,Font,Blockquote,Youtube,Flash,Subscript,Superscript,Anchor,HorizontalRule,Styles',
    width: 550

    },

    // add second class "pure" to element to get this config.
    pure: {
     toolbarGroups: [
      {name: 'clipboard', groups: [ 'clipboard', 'undo', 'mode' ]},
      {name: 'links'},
      {name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ]}
    ],
      filebrowser: false,
      extraPlugins: 'autogrow',
      removeButtons: 'Subscript,Superscript,Anchor,Strike,Undo,Redo',
      width: 450
    }
  };

  // jQuery method for init CKEditor with required configuration detect by class name "simple" or "pure"
  // Use this method to init CKEditor in all cases variable editor configuration

  $.fn.ckeditorInit = function(options, callback) {
    this.each(function(){
      var element = $(this),
      resultConfig = $.wysiwyg_config.standart;
      $.each(["simple", "pure"], function(i, item){
        if(element.hasClass(item)) resultConfig = $.wysiwyg_config[item];
      });
      $(this).ckeditor($.extend(resultConfig, options), callback);
    });
  }

  $(function() {

    $(".rte").ckeditorInit();

    CKEDITOR.on( 'instanceReady', function(ev) {
      var editor = ev.editor,
      writer = editor.dataProcessor.writer,
      tags = ['p','h1','h2','h3','h4','h5','h6','dl','dt','dd','div','ul','li'];

      // html output format
      writer.indentationChars = '   ';
      for (var i=0; i<tags.length; i++) {
        writer.setRules(tags[i],
        {
          indent : true,
          breakBeforeOpen : true,
          breakAfterOpen : true,
          breakBeforeClose : true,
          breakAfterClose : true
        });
      }
    });
  });
}(jQuery));