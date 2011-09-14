<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_Filebrowser {

	/**
	 * Returns subdirs of directory (not recursive)
	 *
	 * @param   string   $directory  Directory path
	 * @return  array  Subdirs
	 */
	public static function list_files($directory)
	{
		return self::_list($directory, FALSE, TRUE);
	}

	/**
	 * Returns files of directory (not recursive)
	 *
	 * @param   string   $directory  Directory path
	 * @return  array  Files
	 */
	public static function list_dirs($directory)
	{
		return self::_list($directory, TRUE, FALSE);
	}

	/**
	 * Returns files of directory (not recursive)
	 *
	 * @param   string   $directory  Directory path
	 * @return  array  Files
	 */
	public static function list_all($directory)
	{
		return self::_list($directory, TRUE, TRUE);
	}

	/**
	 * Returns contents of directory
	 *
	 * @param string $directory
	 * @param type $dirs
	 * @return type
	 */
	protected static function _list($directory, $dirs, $files)
	{
		$directory = APPPATH.$directory;

		$return = array();

		$iterator = new DirectoryIterator($directory);

		foreach ($iterator as $fileinfo)
		{
			if ( ! $fileinfo->isDot())
			{
				// Read directories
				if ($dirs AND $fileinfo->isDir())
				{
					$return[$fileinfo->getFilename()] = array();
				}

				// Read files
				if ($files AND $fileinfo->isFile())
				{
					$return[$fileinfo->getFilename()] = array
					(
						'type' => pathinfo($fileinfo->getFilename(), PATHINFO_EXTENSION),
						'size' => $fileinfo->getSize()
					);

					$filename = $directory.$fileinfo->getFilename();

					if (self::is_image($filename))
					{
						$dir = APPPATH
							.Kohana::$config->load('media.media_directory')
							.DIRECTORY_SEPARATOR
							.Kohana::$config->load('filebrowser.uploads_directory')
							.DIRECTORY_SEPARATOR;

						$return[$fileinfo->getFilename()]['thumb'] = Route::get('wysiwyg/filebrowser')
							->uri(array(
								'action' => 'thumb',
								'path'   => str_replace(array($dir, DIRECTORY_SEPARATOR), array('', '/'), $filename)
								));
					}
				}
			}
		}

		return $return;
	}

	/**
	 * Checks whether the image file
	 *
	 * @param   string  $path  Path to file
	 * @return  boolean
	 */
	public static function is_image($path)
	{
		try
		{
			// If it's image file - get dimentions
			$dimentions = getimagesize($path);
		}
		catch (Exception $e)
		{
			// If isn't - do nothing
		}

		return ! empty($dimentions);
	}

} // End Kohana_Filebrowser