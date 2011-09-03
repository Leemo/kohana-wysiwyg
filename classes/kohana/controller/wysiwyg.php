<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_Controller_WYSIWYG extends Controller_Media {

	/**
	 * WYSIWYG configuration array
	 *
	 * @var array
	 */
	protected $_wysiwyg_config = array();

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

		$this->_config['filters'] = array
		(
			'css' => $this->_config['filters']['css']
		);

		$file = pathinfo($this->_file, PATHINFO_FILENAME);

		if (isset($this->_wysiwyg_config[$file]))
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
			Kohana::find_file('media/tiny_mce', 'jquery.tinymce', 'js'),
			Kohana::find_file('media/codemirror/lib', 'codemirror', 'js'),
			Kohana::find_file('media/codemirror/lib', 'overlay', 'js'),
			Kohana::find_file('media/codemirror/mode/xml', 'xml', 'js'),
			Kohana::find_file('media/wysiwyg', 'initEditors', 'js'),
		);

		$optional_content = array
		(
			'textAreaClass' => 'rte',
			'media_dir'     => $this->_config['media_directory'].'/wysiwyg',
			'lang'          => array(__('Rich text'), __('Source code'))
		);

		$optional_content = 'var editor = '.json_encode($optional_content).';';

		$source = $this->_source($files, $optional_content);
	}

	public function action_css()
	{
		$files = array
		(
			Kohana::find_file('media/wysiwyg', 'wysiwyg', 'css'),
			Kohana::find_file('media/codemirror/lib', 'codemirror', 'css'),
			Kohana::find_file('media/codemirror/mode/xml', 'xml', 'css')
		);

		$source = $this->_source($files);
	}

} // End Kohana_Controller_WYSIWYG