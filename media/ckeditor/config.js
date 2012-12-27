/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function(config)
{
	config.toolbarGroups = [
		{name: 'clipboard',   groups: [ 'clipboard', 'undo' ]},
		{name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ]},
		{name: 'links'},
		{name: 'insert'},
		{name: 'forms'},
		{name: 'tools'},
		{name: 'document',	   groups: [ 'mode', 'document', 'doctools' ]},
		'/',
		{name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ]},
		{name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ]},
		{name: 'styles'},
		{name: 'colors'},
		{name: 'others', groups: ['Youtube', 'teaser']}
	];

    config.extraPlugins = 'youtube,teaser';

};
