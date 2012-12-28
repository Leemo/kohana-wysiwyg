(function(){

  function c(b){
    b.hasAttribute(this.id) && (b = b.getAttribute(this.id), this.setValue(b));
  }

  function d(b){
    if('' === this.getValue()) b.removeAttribute(this.att || this.id);
    else {
      var d = this.getValue();
      if(this.id == 'src' && d.indexOf('embed') == -1) {
        var lnk = d.split('/');
        d = 'http://www.youtube.com/embed/' + lnk[lnk.length -1] + '?rel=0'
      }
      b.setAttribute(this.att || this.id, d);
    }
  }

  CKEDITOR.dialog.add('youtube', function(editor) {
    var lng = editor.lang.common;

    return {
      title: editor.lang.youtube.title,
      minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks?368:350,
      minHeight: 240,

      onShow:function(){
        this.fakeImage = this.iframeNode = null;
        var a = this.getSelectedElement();
        a && (a.data('cke-real-element-type') && 'iframe' == a.data('cke-real-element-type')) && (this.fakeImage = a, this.iframeNode = a = editor.restoreRealElement(a), this.setupContent(a));
      },

      onOk:function(){
        var a;
        a = this.fakeImage ? this.iframeNode : new CKEDITOR.dom.element('iframe');
        var c = {},d = {};

        this.commitContent(a,c,d);
        a = editor.createFakeElement(a,'cke_fake_youtube', 'iframe', true);
        a.setAttributes(d);
        a.setStyles(c);
        this.fakeImage ? (a.replace(this.fakeImage), editor.getSelection().selectElement(a)) : editor.insertElement(a);
      },

      contents:[
      { // single tab w/o title
        label:editor.lang.common.generalTab,
        id:'general',
        elements: [

        {
          type:'html',
          html: '<img style="margin: -20px 0 10px 0; width: 200px" src="' + CKEDITOR.getUrl(CKEDITOR.plugins.getPath('youtube')) + 'images/youtube_large.png" />'
        },

        {
          type: 'text',
          id: 'src',
          label: editor.lang.youtube.pasteMsg,
          validate: CKEDITOR.dialog.validate.notEmpty( 'Field cannot be empty' ),
          required:!0,
          setup:c,
          commit:d
        },

        {
          type:'hbox',

          children:[

          {
            id:'width',
            type:'text',
            'default': '480',
            style:'width:130px',
            labelLayout:'vertical',
            label:lng.width,
            validate:CKEDITOR.dialog.validate.htmlLength(lng.invalidHtmlLength.replace('%1',lng.width)),
            setup:c,
            commit:d
          },

          {
            id:'height',
            type:'text',
            'default': '390',
            style:'width:130px',
            labelLayout:'vertical',
            label:lng.height,
            validate:CKEDITOR.dialog.validate.htmlLength(lng.invalidHtmlLength.replace('%1',lng.height)),
            setup:c,
            commit:d
          },

          {
            id:'align',
            type:'select',
            'default':'',
            items:[[lng.notSet,''],[lng.alignLeft,'left'],[lng.alignRight,'right'],[lng.alignTop,'top'],[lng.alignMiddle,'middle'],[lng.alignBottom,'bottom']],
            style:'width:100%',
            labelLayout:'vertical',
            label:lng.align,
            setup:function(a,b){
              c.apply(this,arguments);
              if(b){
                var d = b.getAttribute('align');
                this.setValue(d && d.toLowerCase() || '')
              }
            },
            commit:function(a,b,c){
              d.apply(this,arguments);
              this.getValue()&&(c.align = this.getValue())
            }
          }
         ]
        }
       ]
      }
      ]
    }
  })

})();
