(function(){

  CKEDITOR.plugins.add('youtube',{
    lang: 'en,uk,ru',
    requires: 'dialog,fakeobjects',
    init: function(editor){

      CKEDITOR.addCss(
        'img.cke_fake_youtube'
        + '{'
        + 'background: #999 center center no-repeat url(' + CKEDITOR.getUrl( this.path + 'images/fake.png' ) + ');'
        + '}'
        );

      var commandName='youtube';
      editor.addCommand(commandName,new CKEDITOR.dialogCommand(commandName));

      editor.ui.addButton('Youtube',{
        label: editor.lang.youtube.button,
        command: commandName,
        icon: this.path+'images/youtube.png',
        toolbar: 'insert'
      });

      editor.on( 'doubleclick', function(evt) {
        var element = evt.data.element;
        if ( element.is('img')
          && element.data('cke-real-element-type') == 'iframe'
          && element.hasClass('cke_fake_youtube')
            )
          evt.data.dialog = 'youtube';
      });

      CKEDITOR.dialog.add(commandName,CKEDITOR.getUrl(this.path+'dialogs/youtube.js'));
    },

    afterInit: function(editor) {
      var dataProcessor = editor.dataProcessor,
      dataFilter = dataProcessor && dataProcessor.dataFilter;

      if (dataFilter) {
        dataFilter.addRules({
          elements: {
            iframe: function(element) {
              var fakeClass = element.attributes.src.indexOf('youtube') != -1 ? 'cke_fake_youtube' : 'cke_iframe'
              return editor.createFakeParserElement(element, fakeClass, 'iframe', true);
            }
          }
        });
      }
    }
  })
})();
