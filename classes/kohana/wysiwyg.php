<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_WYSIWYG {

	public static function instance($name = 'default')
	{
		$config = Kohana::config('wysiwyg');

		if ( ! isset($config[$name]))
		{
			throw new Kohana_Exception('Configuration for TinyMCE instance :name could not found', array(
				':name' => $name
			));
		}

		return new WYSIWYG($config[$name], $name);
	}

	public static function js()
	{
		return Route::get('wysiwyg')->uri(array('action' => 'static', 'file' => 'jquery.tinymce.js'));
	}

	/**
	 * @var array
	 */
	protected $_config;

	/**
	 * @var string
	 */
	protected $_instance_name;

	public function __construct(array $config, $name)
	{
		$this->_config = $config;
		$this->_instance_name = $name;
	}

	public function uri()
	{
		return Route::get('wysiwyg')->uri(array('action' => 'instance', 'file' => $this->_instance_name.'.js'));
	}

	public function get_js()
	{
		$json_config = array
		(
			'script_url' => Route::get('wysiwyg')->uri(array('action' => 'static', 'file' => 'tiny_mce.js')),
			'theme'      => $this->_config['theme']
		);

		return '$(document).ready(function(){'.$this->_get_instance_js($json_config).'});';
	}

	protected function _get_instance_js(array $config)
	{
		return '$("'.$this->_config['selector'].'").tinymce('.json_encode($config).');';
	}

	public function __toString()
	{
		try
		{
			$content = $this->get_js();
		}
		catch (Exception $e)
		{
			$content = '// '.$e->getMessage().' in file '.$e->getFile().':'.$e->getLine();
		}

		return $content;
	}

} // End Kohana_TinyMCE