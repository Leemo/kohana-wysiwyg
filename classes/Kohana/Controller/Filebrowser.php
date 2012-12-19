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
			->set('global_config', array())
			->set('title',         '')
			->set('content',       '');

		/**
		 * Load config
		 */
		$this->_config = Kohana::$config
			->load('filebrowser')
			->as_array();

		$this->_directory = $this->_config['public_directory']
			.DIRECTORY_SEPARATOR
			.$this->_config['uploads_directory']
			.DIRECTORY_SEPARATOR;

		$this->_path = str_replace('/', DIRECTORY_SEPARATOR, $this->request->param('path'));
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

		return $this->response->json(array('dirs' => $dirs));
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

	protected function _filebrowser()
	{
		$filter = $this->_config['filters'][$this->request->action()];
		$path   = $this->_directory.$this->_path;

		if ($this->request->is_ajax())
		{
			$this->auto_render = FALSE;

			return $this->response->json(array(
				'files' => Filebrowser::list_files($path, $filter)
				));
		}
		else
		{
			if ( ! empty($this->_path))
			{
				return $this->request
					->redirect(Route::get('wysiwyg/filebrowser')->uri(array(
						'action' => $this->request->action()
						)));
			}
		}

		$dirs  = Filebrowser::list_dirs($path);
		$files = Filebrowser::list_files($path, $filter);

		foreach($dirs as $key => $val)
		{
			$dirname = $this->_directory.$this->_path.DIRECTORY_SEPARATOR.$key;

			$dirs[$key] = sizeof(Filebrowser::list_dirs($dirname));
		}

		$this->template->content = View::factory('wysiwyg/filebrowser/browse')
			->bind('files', $files)
			->set('dirs', $dirs)
			->set('accept', $filter['allowed']);
	}

	public function action_upload()
	{
		$this->auto_render = FALSE;

		$path  = rtrim(DOCROOT.$this->_directory
			.pathinfo($this->_path, PATHINFO_DIRNAME), '.')
			.DIRECTORY_SEPARATOR;

		if ($_FILES)
		{
			// Check if file already exists
			if (is_file($path.$_FILES['Filedata']['name']))
			{
				return $this->response->json(array('errors' => array(
					'filename' => __('FIle :file already exists in :path', array(
						':file' => $_FILES['Filedata']['name'],
						':path' => $this->_path
						)))));
			}

			$extension = strtolower(pathinfo($_FILES['Filedata']['name'], PATHINFO_EXTENSION));

			$filename = pathinfo($_FILES['Filedata']['name'], PATHINFO_FILENAME);

			// Then we need to check filename
			$validation = $this->_files_validation(array('filename' => $filename), $path, $extension);

			if ( ! $validation->check())
			{
				return $this->response->json(array(
					'errors' => $validation->errors('wysiwyg')
					));
			}

			try
			{
				// Normalize file extensions
				$filename = $filename.'.'.$extension;

				Upload::save($_FILES['Filedata'], $filename, DOCROOT.$this->_directory.$this->_path);
			}
			catch(Kohana_Exception $e)
			{
				return $this->response->json(array(
					'error' => $e->getMessage()
					));
			}

			$this->response->body('Ok');
		}
	}

	public function action_move()
	{
		$this->auto_render = FALSE;

		$response = array();

		// TODO: file checking

		if (isset($_POST['to']))
		{
			$from = DOCROOT.$this->_directory.$this->_path;
			$to   = DOCROOT.$this->_directory.$_POST['to'].DIRECTORY_SEPARATOR.pathinfo($this->_path, PATHINFO_BASENAME);

			try
			{
				copy($from, $to);
				unlink($from);

				$response['result'] = 'ok';
			}
			catch(Exception $e)
			{
				$response['error'] = __('Something\'s wrong');
			}
		}

		return $this
			->response
			->body(json_encode($response));
	}

	public function action_download()
	{
		$this->auto_render = FALSE;

		$file = DOCROOT.$this->_directory.$this->_path;

		if ( ! file_exists($file) OR ! is_file($file))
		{
			return $this->response
				->status(404);
		}

		$this->response
			->send_file($file);
	}

	/**
	 * File or directory rename action.
	 * There is processing POST array, validation and renaming.
	 *
	 * If everything's ok,
	 * returns JSON `{ok: true}`.
	 *
	 * If something's wrong,
	 * returns JSON `{errors: {filename: <error message>}}`.
	 */
	public function action_rename()
	{
		$this->auto_render = FALSE;

		$path  = rtrim(DOCROOT.$this->_directory
			.pathinfo($this->_path, PATHINFO_DIRNAME), '.')
			.DIRECTORY_SEPARATOR;

		$extension = pathinfo($this->_path, PATHINFO_EXTENSION);

		$_POST = Arr::extract($_POST, array('filename'));

		$current_fname = DOCROOT.$this->_directory.$this->_path;
		$new_fname     = $path.DIRECTORY_SEPARATOR.$_POST['filename']
			.( ! empty($extension) ? '.'.$extension : '');

		$is_directory = is_dir($current_fname);

		// This means that the user doesn't enter anything,
		// and we just need to pretend that everything's OK
		if ($current_fname == $new_fname)
		{
			return $this->response->ok();
		}

		// Then we need to check filename
		$validation = $this->_files_validation($_POST, $path, $extension)
			->label('filename', ($is_directory ? 'Directory name' : 'File name'));

		if ( ! $validation->check())
		{
			return $this->response->json(array(
				'errors' => $validation->errors('wysiwyg')
				));
		}

		// If everything's ok
		try
		{
			// Try to rename a file
			rename($current_fname, $new_fname);
		}
		catch (Exception $e)
		{
			// If something's wrong,
			// return error message
			return $this->response->json(array(
				'errors' => array(
					'filename' => __('Server error. Message: :message', array(
						':message' => $e->getMessage()
						)))));
		}

		return $this->response->ok();
	}

	public function action_rotate_right()
	{
		return $this->_rotate(90);
	}

	public function action_rotate_left()
	{
		return $this->_rotate(-90);
	}

	public function action_crop()
	{
		$file = DOCROOT.$this->_directory.$this->_path;

		if ( ! is_file($file) OR ! $dimentions = Filebrowser::is_image($file))
			throw new HTTP_Exception_404;

		if ($_POST)
		{
			$this->auto_render = FALSE;

			$_POST = Arr::extract($_POST, array(
				'filename',
				'image_width',
				'image_height',
				'crop_width',
				'crop_height',
				'offset_x',
				'offset_y'
				));

			$path  = rtrim(DOCROOT.$this->_directory
				.pathinfo($this->_path, PATHINFO_DIRNAME), '.')
				.DIRECTORY_SEPARATOR;

			$extension = pathinfo($this->_path, PATHINFO_EXTENSION);

			// Validate fle
			$validation = $this
				->_files_validation($_POST, $path, $extension)
				->label('filename', __('Filename'));

			if ( ! $validation->check())
			{
				return $this->response->json(array(
					'errors' => $validation->errors('wysiwyg')
					));
			}

			// Validate dimentions
			$validation = Validation::factory($_POST);

			foreach(array_keys($_POST) as $field)
			{
				if ($field != 'filename')
				{
					$validation->rules($field, array(
						array('not_empty'),
						array('digit', array(':value', TRUE))
						));
				}
			}

			// If crop-parameters isn't valid
			if ( ! $validation->check())
			{
				$message = array();

				foreach($validation->errors('wysiwyg') as $row => $error)
					$message[] = $row.': '.$error;

				// Send message
				throw new HTTP_Exception_400(implode("\n", $message));
			}


			try
			{
				// Crop and resize an image
				Image::factory($file)
					->resize($_POST['image_width'], $_POST['image_height'])
					->crop($_POST['crop_width'], $_POST['crop_height'],
						$_POST['offset_x'], $_POST['offset_y'])
					->save($path.$_POST['filename'].'.'.$extension);
			}
			catch(Exception $e)
			{
				// If something's wrong,
				// return error message
				$message = explode(':', $e->getMessage());

				return $this->response->json(array(
					'errors' => array(
						'filename' => __('Server error. Message: :message', array(
							':message' => $message[sizeof($message) - 1]
							)))));
			}

			return $this->response->ok();
		}
    $path = str_replace(DIRECTORY_SEPARATOR, '/', $this->_path);
		$file = $this->_config['public_directory'].'/'
			.$this->_config['uploads_directory'].'/'
			.$path;


		$this->template = View::factory('wysiwyg/filebrowser/crop')
			->bind('image', $file)
			->set('path', $path)
			->bind('width', $dimentions[0])
			->bind('height', $dimentions[1]);
	}

	/**
	 * Add new directory action.
	 * There is processing POST array, validation and renaming.
	 *
	 * If everything's ok,
	 * returns JSON `{ok: true}`.
	 *
	 * If something's wrong,
	 * returns JSON `{errors: {filename: <error message>}}`.
	 */
	public function action_add()
	{
		$this->auto_render = FALSE;

		$directory = DOCROOT.$this->_directory.$this->_path;

		if ( ! is_dir($directory))
			return $this->response->status(404);

		$path  = rtrim(DOCROOT.$this->_directory
			.pathinfo($this->_path, PATHINFO_DIRNAME), '.')
			.DIRECTORY_SEPARATOR;

		if ($_POST)
		{
			// Then we need to check filename
			$validation = $this->
				_files_validation($_POST, $path)
				->label('filename', 'Directory name');

			if ( ! $validation->check())
			{
				return $this->response->json(array(
					'errors' => $validation->errors('wysiwyg')
					));
			}

			// Ok, let's try to create a new directory
			try
			{
				mkdir($directory.DIRECTORY_SEPARATOR.$_POST['filename']);
			}
			catch(Exception $e)
			{
				// If something's wrong,
				// return error message
				return $this->response->json(array(
					'errors' => array(
						'filename' => __('Server error. Message: :message', array(
							':message' => $e->getMessage()
							)))));
			}
		}

		$this->response->ok();
	}

	public function action_resize()
	{

	}

	protected function _rotate($degrees)
	{
		$this->auto_render = FALSE;

		$file = DOCROOT.$this->_directory.$this->_path;

		if ( ! is_file($file) OR ! Filebrowser::is_image($file))
		{
			return $this->response
				->status(404);
		}

		Image::factory($file)
			->rotate($degrees)
			->save($file);
	}

	/**
	 * File delete action.
	 *
	 * If everything's ok,
	 * returns JSON `{ok: true}`.
	 *
	 * If something's wrong,
	 * returns JSON `{error: <error message>}`.
	 */
	public function action_delete()
	{
		$this->auto_render = FALSE;

		if (Arr::get($_POST, 'agree'))
		{
			try
			{
				unlink(DOCROOT.$this->_directory.$this->_path);
			}
			catch(Exception $e)
			{
				$message = explode(':', $e->getMessage());
				$message = trim($message[sizeof($message) - 1]);

				return $this->response->json(array(
					'error' => __('Server error. Message: :message', array(
						':message' => $message
						))));
			}
		}

		$this->response->ok();
	}

	/**
	 * Generates a thumbnail of a image
	 *
	 * @return void
	 */
	public function action_thumb()
	{
		$this->auto_render = FALSE;

		$config = $this->_config['thumbs'];

		$image = DOCROOT.$this->_directory.$this->_path;

		if ( ! is_file($image) OR ! ($dimentions = Filebrowser::is_image($image)))
		{
			// Return a 404 status
			return $this->response
				->status(404);
		}

		$lastmod = filemtime($image);

		// Check if the browser sent an "if-none-match: <etag>" header,
		// and tell if the file hasn't changed
		$this->check_cache(sha1($this->request->uri()).$lastmod);

		// If the image is smaller than the thumbnail, stretch, it is not necessary
		if ($dimentions[0] <= $config['width'] AND $dimentions[1] <= $config['height'])
		{
			// Do nothing - return original image
			$image = file_get_contents($image);
		}
		else
		{
			// Resize image
			$image = Image::factory($image)
				->resize($config['width'], $config['height'])
				->render();
		}

		// Send headers
		$this->response
			->headers('content-type', File::mime_by_ext(pathinfo($this->_path, PATHINFO_EXTENSION)))
			->headers('last-modified', date('r', $lastmod));

		// Send thumbnail content
		$this->response
			->body($image);
	}

	/**
	 * Returns basic files validation
	 *
	 * @param   array  Array to use for validation
	 * @param   type   Path
	 * @param   type   Extension
	 * @return  Validation
	 */
	protected function _files_validation(array $array, $path, $extension = NULL)
	{
		return Validation::factory($array)
			->rules('filename', array(
					array('not_empty'),
					array('regex', array(':value', '/[a-zA-Z0-9_\-]/')),
					array('Filebrowser::file_not_exists', array($path, ':value', $extension))
					));
	}

	/**
	 * Optional GET params (like session_id etc)
	 *
	 * @var array
	 */
	protected $_optional_params = array();

	public function after()
	{
		if ($this->auto_render)
		{
			$route = Route::get('wysiwyg/filebrowser');
			$mime = array();
			// TODO: make types array depended of opener dialog (for ex. only images, docs...).
			// for provide this mime-types in config already selected to arrays by type of files
			// Now using all allowed types
			foreach($this->_config['mime_types'] as $m) {
				$mime = array_merge($mime, $m);
			}

			$this->template->global_config = array
			(
				'root'       => $this->_config['public_directory'].'/'.$this->_config['uploads_directory'],
				'dirs_url'   => $route->uri(array('action' => 'dirs')),
				'files_url'  => $route->uri(array('action' => $this->request->action())),
				'move_url'   => $route->uri(array('action' => 'move')),
				'params'     => $this->_optional_params,
				'mime_types' => $mime,
				'max_upload_size' => $this->_config['max_upload_size'],
				'upload_notes' => $this->_config['upload_notes'],
			);
		}

		parent::after();
	}

} // End Kohana_Controller_Filebrowser