<?php defined('SYSPATH') or die('No direct script access.');

Route::set('wysiwyg/filebrowser', 'wysiwyg/filebrowser/<action>(/<path>)', array('action' => '(add|browse|crop|delete|dirs|download|flash|images|move|rename|resize|rotate_left|rotate_right|status|thumb|upload)', 'path' => '.*'))
	->defaults(array(
		'controller' => 'filebrowser',
		'action'     => 'browse'
	));

$public_directory = Kohana::$config
	->load('filebrowser.public_directory');

Route::set('media/wysiwyg', $public_directory.'/wysiwyg/<file>', array('file' => '.*'))
	->defaults(array(
		'controller' => 'wysiwyg',
		'action'     => 'media'
	));