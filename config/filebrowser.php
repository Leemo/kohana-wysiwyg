<?php defined('SYSPATH') or die('No direct access allowed.');

$filebrowser = Route::get('wysiwyg/filebrowser');

return array
(
	'public_directory'  => 'media',
	'uploads_directory' => 'uploads',

	'thumbs' => array
	(
		'width'  => 100,
		'height' => 75
	),

	'filters' => array
	(
		'images' => array('allowed' => array('jpg', 'jpeg', 'png', 'bmp', 'gif')),
		'flash'  => array('allowed' => array('swf')),
		'browse' => array('disallowed' => array('htaccess', 'php'))
	),

	'filebrowserBrowseUrl'      => $filebrowser->uri(array('action' => 'browse')),
	'filebrowserImageBrowseUrl' => $filebrowser->uri(array('action' => 'images')),
	'filebrowserFlashBrowseUrl' => $filebrowser->uri(array('action' => 'flash')),
	'filebrowserUploadUrl'      => $filebrowser->uri(array('action' => 'upload')),
	'filebrowserImageUploadUrl' => $filebrowser->uri(array('action' => 'upload')),
	'filebrowserFlashUploadUrl' => $filebrowser->uri(array('action' => 'upload')),
);
