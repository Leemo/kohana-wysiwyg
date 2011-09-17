<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_Filebrowser {

	/**
	 * Returns subdirs of directory (not recursive)
	 *
	 * @param   string   $directory  Directory path
	 * @param   array    $filter     Filter array
	 * @return  array  Subdirs
	 */
	public static function list_files($directory, array $filter = NULL)
	{
		return self::_list($directory, FALSE, TRUE, $filter);
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
	protected static function _list($directory, $dirs, $files, array $filter = NULL)
	{
		$directory = APPPATH.$directory;

		$return = array();

		$allowed_extensions = $disallowed_extensions = FALSE;

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
					if (Filebrowser::is_allowed($fileinfo->getFilename(), $filter))
					{
						$return[$fileinfo->getFilename()] = array
						(
							'size' => self::prepare_size($fileinfo->getSize())
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
						else
						{
							$return[$fileinfo->getFilename()]['type'] =
								self::type_by_ext(pathinfo($fileinfo->getFilename(), PATHINFO_EXTENSION));
						}
					}
				}
			}
		}

		return $return;
	}

	/**
	 * Array of file extensions for which you want to generate thumbnails
	 * @var array
	 */
	protected static $_image_extensions = array
	(
		'png',
		'jpg',
		'jpeg',
		'bmp',
		'gif',
		'tif',
		'tiff'
	);

	/**
	 * Checks whether the image file.
	 * If it's image - returns dimentions, if isn't - returns FALSE
	 *
	 * @param   string  $path  Path to file
	 * @return  mixed
	 */
	public static function is_image($path)
	{
		$extension = pathinfo($path, PATHINFO_EXTENSION);

		// Because we don't know what type of image supports GD
		if ( ! in_array($extension, self::$_image_extensions))
		{
			return FALSE;
		}

		try
		{
			// If it's image file - get dimentions
			$dimentions = getimagesize($path);
		}
		catch (Exception $e)
		{
			// If isn't - do nothing
			$dimentions = FALSE;
		}

		return $dimentions;
	}

	/**
	 * Checks whether a file to the given extensions filter
	 *
	 * For example:
	 * ~~~
	 * $images      = array('allowed' => array('jpg', 'jpeg', 'gif', 'png'));
	 * $documents   = array('allowed' => array('doc', 'docx', 'pdf'));
	 * $some_filter = array('allowed' => array('jpg', 'doc'), 'disallowed' => array('png'));
	 * $yet_another = array('disallowed' => array('php'));
	 *
	 * Filebrowser::is_allowed('image.jpg', $images);           // Returns TRUE
	 * Filebrowser::is_allowed('document.docx', $documents);    // Returns TRUE
	 * Filebrowser::is_allowed('some/image.png', $some_filter); // Returns FALSE
	 * Filebrowser::is_allowed('some/file.php', $yet_another);  // Returns FALSE
	 * ~~~
	 *
	 * @param   string  $filename  Filename
	 * @param   array   $filter    Filter array
	 * @return  boolean  Allowed or not
	 */
	public static function is_allowed($filename, array $filter = NULL)
	{
		$filter = Arr::extract($filter, array('allowed', 'disallowed'));

		$extension = pathinfo($filename, PATHINFO_EXTENSION);

		$allowed = $disallowed = FALSE;

		foreach ($filter as $key => $val)
		{
			$$key = $val;
		}

		return ( ! $allowed OR in_array($extension, $allowed)) AND
			( ! $disallowed OR ! in_array($extension, $disallowed));
	}

	protected static $_types = array
	(
		'archive'  => array
		(
			'7z',
			'bz',
			'bzip',
			'bz2',
			'bzip2',
			'gz',
			'gzip',
			'rar',
			'sfx',
			'tar',
			'tar.gz',
			'zip',
			'zipx'
		),

		'document' => array
		(
			'doc',
			'docm',
			'docx',
			'fb2',
			'latex',
			'pdf',
			'txt',
			'xps'
		),

		'music'    => array
		(
			'aa3',
			'aac',
			'ac3',
			'amf',
			'amr',
			'cmf',
			'm3u',
			'mid',
			'midi',
			'mp2',
			'mp3',
			'mpa',
			'mpga',
			'smf',
			'vmf',
			'wav',
			'wma'
		),

		'text'     => array
		(
			'txt'
		),

		'video'    => array
		(
			'asf',
			'asx',
			'avi',
			'dv-avi',
			'dvx',
			'flv',
			'm2v',
			'm4v',
			'mkv',
			'mov',
			'moovie',
			'mp4',
			'mp4v',
			'mpeg',
			'mpeg4',
			'swf',
			'wm',
			'wmv',
			'wmx',
			'xvid'
		)
	);

	public static function type_by_ext($ext)
	{
		foreach (self::$_types as $type => $extensions)
		{
			if (in_array($ext, $extensions))
			{
				return $type;
			}
		}

		return 'unknown';
	}

	/**
	 * Prepares file size to human readable type
	 *
	 * @param   integer  $size  File size in bytes
	 * @return  string Formatted file size
	 */
	public static function prepare_size($size)
	{
		$offset = 'bytes';

		$offsets = array
		(
			'Kb',
			'Mb',
			'Gb'
		);

		foreach ($offsets as $curr_offset)
		{
			if ($size > 500)
			{
				$size   = $size / 1024;
				$offset = $curr_offset;
			}
		}

		return sprintf('%01.2f', $size).' '.__($offset);
	}

} // End Kohana_Filebrowser