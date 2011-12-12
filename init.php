<?php defined('SYSPATH') or die('No direct script access.');

$public_directory = Kohana::$config->load('media')->media_directory;

Route::set('media/wysiwyg', $public_directory.'/wysiwyg/<file>(?<mtime>)', array('file' => '.+', 'mtime' => '%d'))
	->defaults(array(
		'controller' => 'wysiwyg',
		'action'     => 'plain'
	));

Route::set('wysiwyg/filebrowser', 'wysiwyg/filebrowser/<action>(/<path>)', array('action' => '(browse|crop|delete|dirs|download|flash|images|move|rename|resize|rotate_left|rotate_right|thumb|upload)', 'path' => '.*'))
	->defaults(array(
		'controller' => 'filebrowser',
		'action'     => 'browse'
	));
