<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_Controller_WYSIWYG extends Controller_Media {

	/**
	 * WYSIWYG configuration array
	 *
	 * @var array
	 */
	protected $_wysiwyg_config = array();

	/**
	 * WYSIWYG filebrowser configuration array
	 *
	 * @var array
	 */
	protected $_filebrowser_config = array();

	/**
	 * Environment name
	 *
	 * @var string
	 */
	protected $_environment;

	public function before()
	{
		parent::before();

		$this->_wysiwyg_config = Kohana::$config->load('wysiwyg')
			->as_array();

		$this->_filebrowser_config = Kohana::$config->load('filebrowser')
			->as_array();

		// Be cause minimized WYSIWYG editor does not work...
		// I don't know why... I add this problem in my TODO
		// Alexey Popov :)
		$this->_config['filters'] = array
		(
			'css' => $this->_config['filters']['css']
		);

		$file = pathinfo($this->_file, PATHINFO_FILENAME);

		if ($file == 'init')
		{
			$ext = pathinfo($this->_file, PATHINFO_EXTENSION);

			if (in_array($ext, array('js', 'css')))
			{
				$this->_environment = $file;

				$this->request->action($ext);
			}
		}
	}

	public function action_plain()
	{
		$this->_source(array($this->_check_path($this->_file)));
	}

	public function action_js()
	{
		$files = array
		(
			Kohana::find_file('media/wysiwyg', 'init', 'js')
		);

		$optional_content  = 'var wysiwyg_config = '.json_encode($this->_wysiwyg_config).'; ';
		$optional_content .= 'var filebrowser_config = '.json_encode($this->_filebrowser_config).';';

		$source = $this->_source($files, $optional_content);
	}

} // End Kohana_Controller_WYSIWYG