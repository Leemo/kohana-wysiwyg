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

  $.fn.ckeditorStart = function() {
    this.each(function(){
      if($(this).hasClass("simple")) $(this).ckeditor($.wysiwyg_config.simple);
      else if($(this).hasClass("pure")) $(this).ckeditor($.wysiwyg_config.pure);
      else $(this).ckeditor($.wysiwyg_config.standart);
    });
  }

  $(function() {

    $(".rte").ckeditorStart();

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



  })
}(jQuery));