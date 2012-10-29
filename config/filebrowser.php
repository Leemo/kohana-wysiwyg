<?php

defined('SYSPATH') or die('No direct access allowed.');

$filebrowser = Route::get('wysiwyg/filebrowser');

return array
	(
	'public_directory' => 'media',
	'uploads_directory' => 'uploads',
	'thumbs' => array
		(
		'width' => 100,
		'height' => 75
	),
	'filters' => array
		(
		'images' => array('allowed' => array('jpeg', 'jpg', 'png', 'bmp', 'gif')),
		'flash' => array('allowed' => array('swf')),
		'browse' => array('disallowed' => array('htaccess', 'php'))
	),
// uploader options
	'mime_types' => array
		(
		'images' => array('image/jpeg', 'image/png', 'image/bmp', 'image/gif'),
		'flash' => array('application/x-shockwave-flash'),
		'document' => array
			(
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/pdf',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-powerpoint',
			'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
			'text/rtf',
			'text/xml',
			'application/x-rar-compressed',
			'application/zip'
		)
	),
	'max_upload_size' => 3000000,
	'upload_notes' => array(
		'ok'       => __('Loaded OK!'),
		'error'    => __('Upload error'),
		'file_err' => array(
			'size'          => __('file is too large'),
			'mime'          => __('forbidden file type'),
			'invalid'       => __('fnvalid file name'),
			'already_exist' => __('file already exist')
		)
	),
// end of uploader options

	'filebrowserBrowseUrl' => $filebrowser->uri(array('action' => 'browse')),
	'filebrowserImageBrowseUrl' => $filebrowser->uri(array('action' => 'images')),
	'filebrowserFlashBrowseUrl' => $filebrowser->uri(array('action' => 'flash')),
	'filebrowserUploadUrl' => $filebrowser->uri(array('action' => 'upload')),
	'filebrowserImageUploadUrl' => $filebrowser->uri(array('action' => 'upload')),
	'filebrowserFlashUploadUrl' => $filebrowser->uri(array('action' => 'upload')),
);
