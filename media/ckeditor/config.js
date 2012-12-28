/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config)
{
	config.toolbarGroups = [
		{name: 'clipboard',   groups: [ 'clipboard', 'undo', 'mode' ]},
		{name: 'links'},
		{name: 'insert'},
		{name: 'tools'},
		'/',
		{name: 'basicstyles', groups: [ 'basicstyles', 'colors', 'cleanup' ]},
		{name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ]},
		{name: 'styles'}
	];

    config.extraPlugins = 'youtube,teaser,autogrow';
    config.removeButtons = 'Smiley,CreateDiv,PageBreak,Iframe,Font,Blockquote';
    config.removeDialogTabs = 'flash:Upload;image:Upload;link:upload;link:Advanced'

};
