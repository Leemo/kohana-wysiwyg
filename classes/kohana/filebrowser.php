<?php defined('SYSPATH') or die('No direct access allowed.');

class Kohana_Filebrowser {

	/**
	 * Constants for Filebrowser::list_files()
	 */
	const FILEBROWSER_LIST_FILES = 1;
	const FILEBROWSER_LIST_DIRS  = 2;
	const FILEBROWSER_LIST_BOTH  = 3;

	/**
	 * Returns content of directory (not recursive)
	 *
	 * @param   string   $directory  Directory path
	 * @param   integer  $list       Flags
	 * @return  array  Directory contents
	 */
	public static function list_files($directory, $list = Filebrowser::FILEBROWSER_LIST_BOTH)
	{
		$directory = APPPATH.DIRECTORY_SEPARATOR.$directory;

		$files = $dirs = array();

		$iterator = new DirectoryIterator($directory);

		foreach ($iterator as $fileinfo)
		{
			if ( ! $fileinfo->isDot())
			{
				// Read directories
				if (($list == Filebrowser::FILEBROWSER_LIST_BOTH OR
					$list == Filebrowser::FILEBROWSER_LIST_DIRS) AND
						$fileinfo->isDir())
				{
					$dirs[$fileinfo->getFilename()] = array();
				}

				// Read files
				if (($list == Filebrowser::FILEBROWSER_LIST_BOTH OR
					$list == Filebrowser::FILEBROWSER_LIST_FILES) AND
						$fileinfo->isFile())
				{
					$files[$fileinfo->getFilename()] = array
					(
						'type' => pathinfo($fileinfo->getFilename(), PATHINFO_EXTENSION),
						'size' => $fileinfo->getSize()
					);
				}
			}
		}

		return array($dirs, $files);
	}

} // End Kohana_Filebrowser