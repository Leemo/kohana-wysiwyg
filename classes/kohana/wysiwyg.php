<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_WYSIWYG {

	/**
	 * Instances array
	 *
	 * @var array
	 */
	protected static $_instances = array();

	/**
	 * Singletone
	 *
	 * @param   string  $instance_name  Instance name
	 * @return  WYSIWYG
	 */
	public static function instance($instance_name)
	{
		self::check_media();

		if ( ! isset(self::$_instances[$instance_name]))
		{
			self::$_instances[$instance_name] = new WYSIWYG($instance_name);
		}

		return self::$_instances[$instance_name];
	}

	/**
	 * Config array
	 *
	 * @var array
	 */
	protected $_config = array();

	/**
	 * Current instane name
	 *
	 * @var string
	 */
	protected $_instance_name;

	/**
	 * Class constructor
	 *
	 * @param  string  $instance_name  Instance name
	 */
	public function __construct($instance_name)
	{
		$config = Kohana::$config->load('wysiwyg')
			->as_array();

		if ( ! isset($config[$instance_name]))
		{
			throw new Kohana_Exception('Can\'t find config for instance :instance', array(
				':instance' => $instance_name
				));
		}

		$this->_instance_name = $instance_name;
		$this->_config        = $config[$instance_name];
	}

	/**
	 * Returns link to initial WYSIWYG javascript file
	 *
	 * @return string
	 */
	public function js()
	{
		return 'wysiwyg/'.$this->_instance_name.'.js';
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