<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_WYSIWYG {

	/**
	 * Instance
	 *
	 * @var array
	 */
	protected static $_instance;

	/**
	 * Singletone
	 *
	 * @return  WYSIWYG
	 */
	public static function instance()
	{
		self::check_media();

		if (empty(self::$_instance))
		{
			self::$_instance = new WYSIWYG;
		}

		return self::$_instance;
	}

	/**
	 * Returns link to initial WYSIWYG javascript file
	 *
	 * @return string
	 */
	public function js()
	{
		return array
		(
			'wysiwyg/ckeditor/ckeditor.js',
			'wysiwyg/ckeditor/jquery.ckeditor.js',
			'wysiwyg/init.js'
		);
	}

	/**
	 * Returns link to initial WYSIWYG css file
	 *
	 * @return string
	 */
	public function css()
	{
		return 'wysiwyg/'.$this->_instance_name.'.css';
	}

	/**
	 * Checks a module media. If it doesn't exist - throws exception
	 *
	 * @throws Kohana_Exception
	 */
	protected static function check_media()
	{
		if ( ! class_exists('Media'))
		{
			throw new Kohana_Exception('Required module Media doesn\'t exist');
		}
	}

} // End Kohana_WYSIWYG