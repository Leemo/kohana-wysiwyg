/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config)
{
  var custom = {
    toolbarGroups: [
      {name: 'clipboard', groups: [ 'clipboard', 'undo', 'mode' ]},
      {name: 'links'},
      {name: 'insert'},
      {name: 'tools'},
      '/',
      {name: 'basicstyles', groups: [ 'basicstyles', 'colors', 'cleanup' ]},
      {name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align' ]},
      {name: 'styles'}
    ],

    extraPlugins: 'youtube,teaser,autogrow,autosave,nbsp',
    removeButtons: 'Smiley,CreateDiv,PageBreak,Iframe,Font,Blockquote',
    removeDialogTabs: 'flash:Upload,image:Upload,link:upload',

    filebrowser: false,
    // Filebrowser settings
    filebrowserBrowseUrl: "wysiwyg/filebrowser/browse",
    filebrowserImageBrowseUrl: "wysiwyg/filebrowser/images",
    filebrowserFlashBrowseUrl: "wysiwyg/filebrowser/flash",
    filebrowserUploadUrl: "wysiwyg/filebrowser/upload",
    filebrowserImageUploadUrl: "wysiwyg/filebrowser/upload",
    filebrowserFlashUploadUrl: "wysiwyg/filebrowser/upload",

    autoGrow_maxHeight: 500
  }

  for(var property in custom) {
    config[property] = custom[property];
  }

}
