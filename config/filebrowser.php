<?php defined('SYSPATH') or die('No direct access allowed.');

$filebrowser = Route::get('wysiwyg/filebrowser');

return array
(
	'uploads_directory'         => 'uploads',
	'filebrowserBrowseUrl'      => $filebrowser->uri(array('action' => 'browse')),
	'filebrowserImageBrowseUrl' => $filebrowser->uri(array('action' => 'images')),
	'filebrowserFlashBrowseUrl' => $filebrowser->uri(array('action' => 'flash')),
	'filebrowserUploadUrl'      => $filebrowser->uri(array('action' => 'upload')),
	'filebrowserImageUploadUrl' => $filebrowser->uri(array('action' => 'upload')),
	'filebrowserFlashUploadUrl' => $filebrowser->uri(array('action' => 'upload')),
);
