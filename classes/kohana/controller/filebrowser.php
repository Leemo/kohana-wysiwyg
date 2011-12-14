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
			->set('js',            Media::instance('js'))
			->set('css',           Media::instance('css'))
			->set('global_config', array())
			->set('title',         '')
			->set('content',       '');

		/**
		 * Load config
		 */
		$this->_config = Arr::merge(Kohana::$config->load('media')->as_array(),
			Kohana::$config->load('wysiwyg.default'));

		$this->_directory = $this->_config['media_directory']
			.DIRECTORY_SEPARATOR
			.Kohana::$config->load('filebrowser.uploads_directory')
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

		return $this->response->body(json_encode(array('dirs' => $dirs)));
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
		$filter = Kohana::$config->load('filebrowser.filters.'.$this->request->action());
		$path   = $this->_directory.$this->_path;

		if ($this->request->is_ajax())
		{
			$this->auto_render = FALSE;

			return $this->response->body(json_encode(array(
				'files' => Filebrowser::list_files($path, $filter)
				)));
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
			->set('dirs', $dirs);
	}

	public function action_upload()
	{
		$this->auto_render = FALSE;

		if ($_FILES)
		{
			Upload::save($_FILES['Filedata'], $_FILES['Filedata']['name'], APPPATH.$this->_directory.$this->_path);

			$this->response->body('Ok');

			return;
		}

		$content = View::factory('wysiwyg/filebrowser/upload');

		return $this
			->response
			->body($content);
	}

	public function action_move()
	{
		$this->auto_render = FALSE;

		$response = array();

		// TODO: file checking

		if (isset($_POST['to']))
		{
			$from = APPPATH.$this->_directory.$this->_path;
			$to   = APPPATH.$this->_directory.$_POST['to'].DIRECTORY_SEPARATOR.pathinfo($this->_path, PATHINFO_BASENAME);

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

		$file = APPPATH.$this->_directory.$this->_path;

		if ( ! file_exists($file) OR ! is_file($file))
		{
			return $this->response
				->status(404);
		}

		$this->response
			->send_file($file);
	}

	public function action_rename()
	{
		$this->auto_render = FALSE;

		$file = APPPATH.$this->_directory.$this->_path;

		if ( ! file_exists($file))
		{
			return $this->response
				->status(404);
		}

		$filename  = pathinfo($file, PATHINFO_FILENAME);
		$extension = pathinfo($file, PATHINFO_EXTENSION);

		$is_file = is_file($file);

		if ($_POST)
		{
			// TODO: path checking
			rename($file, str_replace($filename, $_POST['filename'], $file));

			return;
		}

		$template = ($is_file) ? 'wysiwyg/filebrowser/file/rename' : 'wysiwyg/filebrowser/directory/rename';

		$content = View::factory($template)
			->bind('filename', $filename)
			->bind('extension', $extension)
			->bind('error', $error);

		$this->response
			->body($content);
	}

	public function action_rotate_right()
	{
		$this->_rotate(90);
	}

	public function action_rotate_left()
	{
		$this->_rotate(-90);
	}

	public function action_crop()
	{
		$file = APPPATH.$this->_directory.$this->_path;

		if ( ! is_file($file) OR
			! (list($width, $height) = getimagesize($file)))
		{
			return $this
				->request
				->redirect(Route::get('wysiwyg/filebrowser')->uri());
		}

		if ($_POST)
		{
			$_POST = Arr::extract($_POST, array(
				'filename',
				'image_width',
				'image_height',
				'crop_width',
				'crop_height',
				'offset_x',
				'offset_y'
				));

			$validation = Validation::factory($_POST)
				->rules('filename', array(
					array('not_empty'),
					array('regex', array(':value', '=^[^/?*;:\.{}\\\\]+$='))
				))
				->label('filename', __('Filename'));

			if ( ! $validation->check())
			{
				$errors = $validation
					->errors('feedback');

				$errors =
					array_merge($errors, (isset($errors['_external']) ? $errors['_external'] : array()));

				return $this->template->content =
					View::factory('wysiwyg/filebrowser/crop/form', $_POST)
						->bind('errors', $errors);
			}

			$extension = pathinfo($file, PATHINFO_EXTENSION);
/*
			Image::factory($file)
				->resize($_POST['image_width'], $_POST['image_height'])
				->crop($_POST['crop_width'], $_POST['crop_height'], $_POST['offset_x'], $_POST['offset_y'])
				->save($_POST['filename'].'.'.$extension);
*/
			return $this->template->content =
				View::factory('wysiwyg/filebrowser/crop/choise', $_POST);
		}

		$file = Route::get('media')
			->uri(array(
				'file' => Kohana::$config->load('filebrowser.uploads_directory').'/'.$this->_path
				));

		$this->template = View::factory('wysiwyg/filebrowser/crop')
			->bind('file', $file)
			->bind('path', $this->_path)
			->bind('width', $width)
			->bind('height', $height);
	}

	public function action_add()
	{
		$this->auto_render = FALSE;

		$directory = APPPATH.$this->_directory.$this->_path;

		if ( ! is_dir($directory))
		{
			return $this->response
				->status(404);
		}

		if ($_POST)
		{
			return;
		}

		$content = View::factory('wysiwyg/filebrowser/directory/add')
			->bind('dirname', $dirname)
			->bind('error', $error);

		$this->response
			->body($content);
	}

	public function action_resize()
	{

	}

	protected function _rotate($degrees)
	{
		$this->auto_render = FALSE;

		$file = APPPATH.$this->_directory.$this->_path;

		if ( ! is_file($file) OR ! Filebrowser::is_image($file))
		{
			return $this->response
				->status(404);
		}

		Image::factory($file)
			->rotate($degrees)
			->save($file);
	}

	public function action_delete()
	{
		$this->auto_render = FALSE;

		$file = APPPATH.$this->_directory.$this->_path;

		$filename = pathinfo($file, PATHINFO_BASENAME);

		if (Arr::get($_GET, 'agree', FALSE))
		{
			unlink($file);

			return;
		}

		$content = View::factory('wysiwyg/filebrowser/file/delete')
			->bind('filename', $filename);

		$this->response->body($content);
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

		if ( ! is_file($image) OR ! ($dimentions = Filebrowser::is_image($image)))
		{
			// Return a 404 status
			return $this->response
				->status(404);
		}

		$lastmod = filemtime($image);

		// Check if the browser sent an "if-none-match: <etag>" header,
		// and tell if the file hasn't changed
		$this->response
			->check_cache(sha1($this->request->uri()).$lastmod, $this->request);

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

	protected function _upload()
	{

	}

	public function after()
	{
		if ($this->auto_render)
		{
			$route = Route::get('wysiwyg/filebrowser');

			$this->template->global_config = array
			(
				'dirs_url'  => $route->uri(array('action' => 'dirs')),
				'files_url' => $route->uri(array('action' => $this->request->action())),
				'move_url'  => $route->uri(array('action' => 'move'))
			);
		}

		parent::after();
	}

} // End Kohana_Controller_Filebrowser