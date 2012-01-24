/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
  config.toolbar_Basic =
[
	{name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
  { name: 'document', items : [ 'Source','-','RemoveFormat'] },
  { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] },
//	{ name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
	'/',
	{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
	{ name: 'colors', items : [ 'TextColor','BGColor' ] },
  { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','Teaser'] },
	'/',
	{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
  { name: 'insert', items : [ 'Image','Flash','Youtube','Table','HorizontalRule','SpecialChar'] },
  { name: 'links', items : [ 'Link','Unlink','Anchor'] }

];
config.toolbar = 'Basic';
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
config.extraPlugins = 'youtube,teaser';

};
