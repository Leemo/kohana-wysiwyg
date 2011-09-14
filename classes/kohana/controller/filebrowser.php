<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_Controller_Filebrowser extends Controller_Template {

	/**
	 * View  page template
	 *
	 * @var View
	 */
	public $template = 'wysiwyg/filebrowser/overall';

	/**
	 * Config array
	 *
	 * @var array
	 */
	protected $_config = array();

	/**
	 * Path
	 *
	 * @var string
	 */
	protected $_path;

	/**
	 * Local directory that store static files
	 *
	 * @var string
	 */
	protected $_directory;

	public function before()
	{
		parent::before();

		$this->template
			->set('js',      Media::instance('js'))
			->set('css',     Media::instance('css'))
			->set('title',   '')
			->set('content', '');

		/**
		 * Load config
		 */
		$this->_config = Arr::merge(Kohana::$config->load('media')->as_array(),
			Kohana::$config->load('wysiwyg.default'));

		$this->_directory = $this->_config['media_directory']
			.DIRECTORY_SEPARATOR
			.Kohana::$config->load('filebrowser.uploads_directory')
			.DIRECTORY_SEPARATOR;

		$this->_path = $this->request->param('path');
	}

	public function action_browse()
	{
		$this->template->title = __('Files :path', array(
			':path' => '/'.$this->_path
			));

		$this->_filebrowser();
	}

	public function action_dirs()
	{
		$this->auto_render = FALSE;

		$dirs = Filebrowser::list_dirs($this->_directory.$this->_path);

		foreach($dirs as $key => $val)
		{
			$dirname = $this->_directory.$this->_path.DIRECTORY_SEPARATOR.$key;

			$subdirs = Filebrowser::list_dirs($dirname);

			$dirs[$key] = sizeof($subdirs);
		}

		return $this->response->body(json_encode(array('dirs' => $dirs)));
	}

	public function action_files()
	{
		$this->auto_render = FALSE;

		return $this->response->body(json_encode(array(
			'files' => Filebrowser::list_files($this->_directory.$this->_path)
			)));
	}

	public function action_images()
	{
		$this->template->title = __('Images :path', array(
			':path' => '/'.$this->_path
			));

		$this->_filebrowser();
	}

	public function action_flash()
	{
		$this->template->title = __('Flash :path', array(
			':path' => '/'.$this->_path
			));

		$this->_filebrowser();
	}

	protected function _filebrowser(array $allowed_types = NULL, array $disallowed_types = NULL)
	{
		$dirs  = Filebrowser::list_dirs($this->_directory.$this->_path);
		$files = Filebrowser::list_files($this->_directory.$this->_path);

		foreach($dirs as $key => $val)
		{
			$dirname = $this->_directory.$this->_path.DIRECTORY_SEPARATOR.$key;

			$dirs[$key] = sizeof(Filebrowser::list_dirs($dirname));
		}

		$this->template->content = View::factory('wysiwyg/filebrowser/browse')
			->bind('files', $files)
			->set('dirs', $dirs);
	}

	public function action_upload()
	{
		$this->auto_render = FALSE;

		if ($_POST)
		{
			Kohana::$log
				->add(Log::INFO, serialize($_POST))
				->add(Log::INFO, serialize($_FILES))
				->write();

			$this->response->body('Ok');

			return;
		}

		$content = View::factory('wysiwyg/filebrowser/upload');

		return $this->response->body($content);
	}

	/**
	 * Generates a thumbnail of a image
	 *
	 * @return void
	 */
	public function action_thumb()
	{
		$this->auto_render = FALSE;

		$config = Kohana::$config->load('filebrowser.thumbs');

		$image = APPPATH.$this->_directory.$this->_path;

		if ( ! Filebrowser::is_image($image))
		{
			return;
		}

		$image = Image::factory($image)
			->resize($config['width'], $config['height'])
			->render();

		$this->response
			->headers('content-type', File::mime_by_ext(pathinfo($this->_path, PATHINFO_EXTENSION)));

		$this->response
			->body($image);
	}

	protected function _upload()
	{

	}

	public function after()
	{
		parent::after();
	}

} // End Kohana_Controller_Filebrowser