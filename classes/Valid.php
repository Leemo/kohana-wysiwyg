<?php defined('SYSPATH') or die('No direct access allowed.');

class Valid extends Kohana_Valid {

	/**
	 * Tests if a file or a directory with that name not exists.
	 *
	 * @param   string  File path
	 * @param   string  Filename without extension
	 * @param   string  File extension
	 * @return  boolean
	 */
	public static function fb_file_not_exists($path, $filename, $extension = NULL)
	{
		$file = $path.$filename;

		if( ! empty($extension))
			$file .= '.'.$extension;

		return ! file_exists($file);
	}

} // End Valid