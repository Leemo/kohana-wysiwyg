<?php defined('SYSPATH') or die('No direct access allowed.');

class Controller_WYSIWYG extends Controller {

	public function action_static($file)
	{
		// Find the file extension
		$ext = pathinfo($file, PATHINFO_EXTENSION);

		// Remove the extension from the filename
		$file = substr($file, 0, - (strlen($ext) + 1));

		if ($file = Kohana::find_file('vendor', 'wysiwyg/'.$file, $ext))
		{
			// Check if the browser sent an "if-none-match: <etag>" header, and tell if the file hasn't changed
			$this->response->check_cache(sha1($this->request->uri()).filemtime($file), $this->request);

			// Send the file content as the response
			$this->response->body(file_get_contents($file));

			// Set the proper headers to allow caching
			$this->response->headers('content-type',  File::mime_by_ext($ext));
			$this->response->headers('last-modified', date('r', filemtime($file)));
		}
		else
		{
			// Return a 404 status
			$this->response->status(404);
		}
	}

	public function action_instance($file)
	{
		// Find the file extension
		$ext = pathinfo($file, PATHINFO_EXTENSION);

		// Remove the extension from the filename
		$instance = substr($file, 0, - (strlen($ext) + 1));

		$config = Kohana::config('wysiwyg');

		if ( ! isset($config[$instance]))
		{
			// Return a 404 status
			return $this->response->status(404);
		}

		$this->response->headers('content-type',  File::mime_by_ext($ext));
		$this->response->body(TinyMCE::instance($instance));
	}

} // End Controller_TinyMCE