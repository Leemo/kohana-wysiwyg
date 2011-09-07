<?php defined('SYSPATH') or die('No direct script access.');

$public_directory = Kohana::$config->load('media')->media_directory;

Route::set('media/wysiwyg', $public_directory.'/wysiwyg/<file>(?<mtime>)', array('file' => '.+', 'mtime' => '%d'))
	->defaults(array(
		'controller' => 'wysiwyg',
		'action'     => 'plain'
	));

Route::set('wysiwyg/filebrowser', 'wysiwyg/filebrowser/<action>(/<path>)', array('path' => '.+'))
	->defaults(array(
		'controller' => 'filebrowser',
		'action'     => 'browse'
	));
