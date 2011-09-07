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

		$this->_directory = $this->_config['media_directory'].DIRECTORY_SEPARATOR
			.Kohana::$config->load('filebrowser.uploads_directory');

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

		$this->response->body('');
	}

	public function action_files()
	{
		$this->auto_render = FALSE;

		list($dirs, $files) = Filebrowser::list_files($this->_directory.DIRECTORY_SEPARATOR.$this->_path,
			Filebrowser::FILEBROWSER_LIST_FILES);

		return $this->response->body(json_encode(array('files' => $files)));
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
		list($dirs, $files) = Filebrowser::list_files($this->_directory.DIRECTORY_SEPARATOR.$this->_path);

		$this->template->content = View::factory('wysiwyg/filebrowser/browse')
			->bind('files', $files)
			->set('dirs', array_keys($dirs));
	}

	public function action_upload()
	{

	}

	protected function _upload()
	{

	}

	public function after()
	{
		parent::after();
	}

} // End Kohana_Controller_Filebrowser