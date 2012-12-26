<?php

defined('SYSPATH') or die('No direct access allowed.');

return array
(
	/**
	 * Directory that stores static files
	 */
	'public_directory' => 'media',

	/**
	 * Directory in public directory that stores uploaded files
	 */
	'uploads_directory' => 'uploads',

	/**
	 * Thumbnails dimensions
	 */
	'thumbs' => array
	(
		'width' => 100,
		'height' => 75
	),

	/**
	 * Files filters (todo: refactoring)
	 */
	'filters' => array
	(
		'images' => array
		(
			'allowed' => array
			(
				'jpeg',
				'jpg',
				'png',
				'bmp',
				'gif'
			)
		),

		'flash'  => array
		(
			'allowed' => array
			(
				'swf'
			)
		),

		'browse' => array
		(
			'disallowed' => array
			(
				'htaccess',
				'php'
			)
		)
	)
);
