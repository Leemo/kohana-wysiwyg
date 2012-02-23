<?php defined('SYSPATH') or die('No direct access allowed.');

class Valid extends Kohana_Valid {

	/**
	 * Tests if a file with that name not exists.
	 *
	 * @param   string  File path
	 * @param   string  Filename without extension
	 * @param   string  File extension
	 * @return  boolean
	 */
	public static function fb_file_not_exists($path, $filename, $extension)
	{
		return ! file_exists($path.$filename.'.'.$extension);
	}

} // End Valid