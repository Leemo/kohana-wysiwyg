<?php defined('SYSPATH') or die('No direct script access.');

Route::set('tinymce', 'tinymce/(<action>(/<file>))', array('file' => '.*')
	->defaults(array(
		'controller' => 'tinymce',
		'action'     => 'index'
	));
