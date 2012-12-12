<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_Controller_WYSIWYG extends Controller {

	/**
	 * Filebrowser configuration array
	 *
	 * @var array
	 */
	protected $_config = array();

	public function before()
	{
		parent::before();

		$this->_config = Kohana::$config
			->load('filebrowser')
			->as_array();
	}

	/**
	 * Requested filename
	 *
	 * @var string
	 */
	protected $_file;

	/**
	 * Requested file extension
	 *
	 * @var string
	 */
	protected $_ext;

	public function action_media()
	{
		$file = $this->request->param('file');

		// Get the file info
		$this->_ext  = pathinfo($file, PATHINFO_EXTENSION);
		$this->_file = str_replace('.'.$this->_ext, '', $file);

		// Find requested file
		$file = Kohana::find_file('media', $this->_file, $this->_ext);

		if ($file)
		{
			// Check if the browser sent an "if-none-match: <etag>" header, and tell if the file hasn't changed
			$this->check_cache(sha1($this->request->uri()).filemtime($file));

			// Set the proper headers to allow caching
			// and send the file content as the response
			$this->response
				->body(file_get_contents($file))
				->headers('content-type',  File::mime_by_ext($this->_ext))
				->headers('last-modified', date('r', filemtime($file)));
		}
		else
		{
			// Return a 404 status
			$this->response->status(404);
		}
	}

} // End Kohana_Controller_WYSIWYG