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

	/**
	 * Requested file info
	 *
	 * @var array
	 */
	protected $_file = array();

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

		try
		{
			$this->_file = Filebrowser::parse_path($this->_directory, $this->_path);
		}
		catch (Filebrowser_Exception $e)
		{
			throw new HTTP_Exception_404;
		}
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

		$dirs = Filebrowser::list_dirs($this->_file['path']);

		foreach($dirs as $key => $val)
		{
			$dir = Filebrowser::parse_path($this->_directory, $this->_path.DIRECTORY_SEPARATOR.$key);

			$dirs[$key] = array
			(
				'directories' => sizeof(Filebrowser::list_dirs($dir['path'])),
				'files'       => sizeof(Filebrowser::list_files($dir['path']))
			);
		}

		return $this->response->json(array(
			'dirs' => $dirs
			));
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

		if ($this->request->is_ajax())
		{
			$this->auto_render = FALSE;

			return $this->response->json(array(
				'files' => Filebrowser::list_files($this->_file['path'], $filter)
				));
		}
		else
		{
			if ( ! empty($this->_path))
			{
				return HTTP::redirect(Route::get('wysiwyg/filebrowser')->uri(array(
						'action' => $this->request->action()
						)));
			}
		}

		$dirs  = Filebrowser::list_dirs($this->_file['path']);
		$files = Filebrowser::list_files($this->_file['path'], $filter);

		foreach($dirs as $key => $val)
		{
			$dirs[$key] = sizeof(Filebrowser::list_dirs($this->_file['path'].DIRECTORY_SEPARATOR.$key));
		}

		if ( ! isset($filter['allowed']))
		{
			$filter['allowed'] = NULL;
		}

		$this->template->content = View::factory('wysiwyg/filebrowser/browse')
			->bind('files', $files)
			->set('dirs', $dirs)
			->set('accept', $filter['allowed']);
	}

	public function action_upload()
	{
		$this->auto_render = FALSE;

		if ($_FILES)
		{
			//
			$filename  = pathinfo($_FILES['Filedata']['name'], PATHINFO_FILENAME);
			$extension = strtolower(pathinfo($_FILES['Filedata']['name'], PATHINFO_EXTENSION));

			$file = $filename.'.'.$extension;

			// Check if file already exists
			if (is_file($this->_file['path'].$file))
			{
				return $this->response->json(array('errors' => array(
					'filename' => __('FIle :file already exists in :path', array(
						':file' => $file,
						':path' => $this->_path
						)))));
			}

			// Then we need to check filename
			$validation = $this
				->_files_validation(array('filename' => $filename), $this->_file['path'], $extension);

			if ( ! $validation->check())
			{
				return $this->response->json(array(
					'errors' => $validation->errors('wysiwyg')
					));
			}

			try
			{

				Upload::save($_FILES['Filedata'], $file, $this->_file['path']);
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

	/**
	 * Sending a file into browser
	 */
	public function action_download()
	{
		$this->auto_render = FALSE;

		$this->response
			->send_file($this->_file['path']);
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

		$_POST = Arr::extract($_POST, array('filename'));

		$current_fname = $this->_file['path'];
		$new_fname     = $this->_file['dir'].DIRECTORY_SEPARATOR
			.$_POST['filename'].( ! empty($this->_file['ext']) ? '.'.$this->_file['ext'] : '');

		// This means that the user doesn't enter anything,
		// and we just need to pretend that everything's OK
		if ($current_fname == $new_fname)
		{
			return $this->response->ok();
		}

		// Then we need to check filename
		$validation = $this->_files_validation($_POST, $this->_file['dir'], $this->_file['ext'])
			->label('filename', (is_dir($current_fname) ? 'Directory name' : 'File name'));

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

	/**
	 * File move.
	 *
	 * If everything's ok,
	 * returns JSON `{ok: true}`.
	 *
	 * If something's wrong,
	 * returns JSON `{error: <error message>}`.
	 */
	public function action_move()
	{
		$this->auto_render = FALSE;

		// We can't move directories
		if ( ! is_file($this->_file['path']))
		{
			return $this->response->json(array(
				'error' => __('Desired file :file doesn\'t exist', array(':file' => $file))
				));
		}

		$from_dir = $this->_file['dir'].DIRECTORY_SEPARATOR;

		$to_dir = realpath(rtrim(DOCROOT.$this->_directory
			.pathinfo(ltrim(Arr::get($_POST, 'path'), '/'), PATHINFO_DIRNAME), '.'))
			.DIRECTORY_SEPARATOR;

		$file = $this->_file['name'].'.'.$this->_file['ext'];

		// Public directory protection
		if ( ! strstr(realpath($to_dir), realpath(DOCROOT.$this->_directory)))
		{
			throw new HTTP_Exception_403;
		}

		if (is_file($to_dir.$file))
		{
			return $this->response->json(array(
				'error' => __('File :file already exists in target directory', array(':file' => $file))
				));
		}

		if ($from_dir.$file != $to_dir.$file)
		{
			// If everything's ok
			try
			{
				// Try to rename a file
				rename($from_dir.$file, $to_dir.$file);
			}
			catch (Exception $e)
			{ echo $from_dir.$file, "\n", $to_dir.$file;
				// If something's wrong,
				// return error message
				return $this->response->json(array(
					'error' => $e->getMessage()
					));
			}
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
		if ( ! ($dimensions = Filebrowser::is_image($this->_file['path'])))
		{
			throw new HTTP_Exception_403;
		}

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

			// Validate fle
			$validation = $this
				->_files_validation($_POST, $this->_file['dir'], $this->_file['ext'])
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
				{
					$message[] = $row.': '.$error;
				}

				// Send message
				throw new HTTP_Exception_400(implode("\n", $message));
			}


			try
			{
				// Crop and resize an image
				Image::factory($this->_file['path'])
					->resize($_POST['image_width'], $_POST['image_height'])
					->crop($_POST['crop_width'], $_POST['crop_height'],
						$_POST['offset_x'], $_POST['offset_y'])
					->save($this->_file['dir'].DIRECTORY_SEPARATOR.$_POST['filename'].'.'.$this->_file['ext']);
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
			->bind('image',  $file)
			->set('path',    $path)
			->bind('width',  $dimensions[0])
			->bind('height', $dimensions[1]);
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
		$this->auto_render = FALSE;

		if ( ! Filebrowser::is_image($this->_file['path']))
		{
			throw new HTTP_Exception_403;
		}

		if ($_POST)
		{
			$_POST = Arr::extract($_POST, array(
				'filename',
				'width',
				'height'
				));

			// Validate fle
			$validation = $this
				->_files_validation($_POST, $this->_file['dir'], $this->_file['ext'])
				->label('filename', __('Filename'));

			if ( ! $validation->check())
			{
				return $this->response->json(array(
					'errors' => $validation->errors('wysiwyg')
					));
			}

			// Validate dimentions
			$validation = Validation::factory($_POST);

			// If crop-parameters isn't valid
			if ( ! $validation->check())
			{
				$message = array();

				foreach($validation->errors('wysiwyg') as $row => $error)
				{
					$message[] = $row.': '.$error;
				}

				// Send message
				throw new HTTP_Exception_400(implode("\n", $message));
			}


			try
			{
				// Crop and resize an image
				Image::factory($this->_file['path'])
					->resize($_POST['width'], $_POST['height'])
					->save($this->_file['dir'].DIRECTORY_SEPARATOR.$_POST['filename'].'.'.$this->_file['ext']);
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
			->bind('image',  $file)
			->set('path',    $path)
			->bind('width',  $dimensions[0])
			->bind('height', $dimensions[1]);
	}

	protected function _rotate($degrees)
	{
		$this->auto_render = FALSE;

		if ( ! is_file($this->_file['path']) OR
			! Filebrowser::is_image($this->_file['path']))
		{
			return $this->response
				->status(404);
		}

		Image::factory($this->_file['path'])
			->rotate($degrees)
			->save($this->_file['path']);
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
				if (is_file($this->_file['path']))
				{
					unlink($this->_file['path']);
				}
				else if ( ! empty($this->_path))
				{
					if (sizeof(Filebrowser::list_dirs($this->_file['path'])) > 0 OR
						sizeof(Filebrowser::list_files($this->_file['path'])) > 0)
					{
						return $this->response->json(array(
							'error' => __('You can\'t delete non-empty directory, you must first remove its contents')
							));
					}

					rmdir($this->_file['path']);
				}
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

		if ( ! is_file($this->_file['path']) OR
			! ($dimentions = Filebrowser::is_image($this->_file['path'])))
		{
			// Return a 404 status
			return $this->response
				->status(404);
		}

		$lastmod = filemtime($this->_file['path']);

		// Check if the browser sent an "if-none-match: <etag>" header,
		// and tell if the file hasn't changed
		$this->check_cache(sha1($this->request->uri()).$lastmod);

		// If the image is smaller than the thumbnail, stretch, it is not necessary
		if ($dimentions[0] <= $config['width'] AND $dimentions[1] <= $config['height'])
		{
			// Do nothing - return original image
			$image = file_get_contents($this->_file['path']);
		}
		else
		{
			// Resize image
			$image = Image::factory($this->_file['path'])
				->resize($config['width'], $config['height'])
				->render();
		}

		// Send headers
		$this->response
			->headers('content-type', File::mime_by_ext($this->_file['ext']))
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
					array('regex', array(':value', '/^[a-zA-Z0-9_-]*$/i')), //
					array('Filebrowser::file_not_exists', array($path, ':value', $extension))
					));
	}

	public function after()
	{
		if ($this->auto_render)
		{
			$route = Route::get('wysiwyg/filebrowser');

			$this->template->global_config = array
			(
				'root'      => $this->_config['public_directory'].'/'.$this->_config['uploads_directory'],
				'dirs_url'  => $route->uri(array('action' => 'dirs')),
				'files_url' => $route->uri(array('action' => $this->request->action()))
			);
		}

		parent::after();
	}

} // End Kohana_Controller_Filebrowser