<?php defined('SYSPATH') or die('No direct script access.');

Route::set('wysiwyg', 'wysiwyg/(<action>(/<file>))', array('file' => '.*'))
	->defaults(array(
		'controller' => 'wysiwyg',
		'action'     => 'js'
	));
