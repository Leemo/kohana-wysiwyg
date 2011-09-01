<?php defined('SYSPATH') or die('No direct access allowed.');

class Controller_Media extends Kohana_Controller_Media {

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

		// A little hook
		$this->_config['filters'] = array
		(
			'css' => $this->_config['filters']['css']
		);

		$this->_wysiwyg_config = Kohana::$config->load('wysiwyg')
			->as_array();

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

	public function action_wysiwyg()
	{
		$file = pathinfo(str_replace('wysiwyg/', '', $this->_file));
		$ext  = $file['extension'];

		$file = Kohana::find_file('vendor/'.$file['dirname'], $file['filename'], $ext);

		$this->_source(array($file), $ext);
	}

	public function action_js()
	{
		$files = array
		(
			Kohana::find_file('vendor/tiny_mce', 'jquery.tinymce', 'js'),
			Kohana::find_file('vendor/codemirror/lib', 'codemirror', 'js'),
			Kohana::find_file('vendor/codemirror/lib', 'overlay', 'js'),
			Kohana::find_file('vendor/codemirror/mode/xml', 'xml', 'js'),
			Kohana::find_file('media/wysiwyg', 'initEditors', 'js'),
		);

		$optional_content = array
		(
			'textAreaClass' => 'rte',
			'media_dir'     => $this->_config['public_directory'].'/wysiwyg',
			'lang'          => array(__('Rich text'), __('Source code'))
		);

		$optional_content = 'var editor = '.json_encode($optional_content).';';

		$source = $this->_source($files, 'js', $optional_content);
	}

	public function action_css()
	{
		$files = array
		(
			Kohana::find_file('media/wysiwyg', 'wysiwyg', 'css'),
			Kohana::find_file('vendor/codemirror/lib', 'codemirror', 'css'),
			Kohana::find_file('vendor/codemirror/mode/xml', 'xml', 'css')
		);

		$source = $this->_source($files, 'css');
	}

	protected function _source(array $files, $extension, $optional_content = '')
	{
		$source = '';

		if ( ! empty($optional_content))
		{
			if (isset($this->_config['filters'][$extension]))
			{
				foreach($this->_config['filters'][$extension] as $filter)
				{
					$filter = 'Media_'.$filter;

					if(class_exists($filter))
					{
						$source .= call_user_func($filter.'::filter', $source);
					}
				}
			}
			else
			{
				$source .= $optional_content;
			}
		}

		foreach ($files as $file)
		{
			$source .= $this->_minify($file);
		}

		if ($this->_config['cache'])
		{
			$this->_cache($this->_file, $source);
		}

		$this->response
			->headers('content-type', File::mime_by_ext($extension))
			->body($source);
	}

} // End Controller_WYSIWYG