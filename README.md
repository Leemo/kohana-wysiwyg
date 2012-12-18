[WYSIWYG](http://ckeditor.com/) integration module
for [Kohana PHP framework](http://kohanaframework.org).

This module allows you to:
* Use a visual editor to work with HTML hypertext
* Upload and manage uploaded files on your server (such as images, videos, etc.)
using filebrowser
* Edit images: resize and crop using specialized tools

# Installation

## Enable WYSIWYG module

Edit your bootstrap file `APPPATH/bootstrap.php` and enable WYSIWYG module:

~~~
Kohana::modules(array(
  // Some modules
  'wysiwyg' => MODPATH.'wysiwyg',
  // Some other modules
  ));
~~~

## Edit config file:

Copy config file `MODPATH/wysiwyg/config/filebrowser.php`
to `APPPATH/config/filebrowser.php` and open it:

~~~
	'public_directory'  => 'media',
	'uploads_directory' => 'uploads',
~~~

`public_directory` - directory, which contains all the static files, in this case
it `DOCROOT/media`.

`uploads_directory` - directory, which contains all uploaded files. This
directory is always in `public directory`. In this case it `DOCROOT/media/uploads`.
This directory must be writable.

Create these two directories.

## Extend filebrowser controller

It assumes that you are familiar with [template driven site](http://ckeditor.com)
conception.

Create a new controller file in `APPPATH/classes/Controller/Filebrowser.php`:

~~~
<?php defined('SYSPATH') or die('No direct access allowed.');

class Controller_Filebrowser extends Kohana_Controller_Filebrowser {

	/**
	 * Controls access for the whole controller, if not set to FALSE we will only allow user roles specified
	 *
	 * Can be set to a string or an array, for example array('login', 'admin') or 'login'
	 */
	public $auth_required = array('admin');

	public function before()
	{
		if ( ! Auth::instance()->logged_in($this->auth_required))
		{
			throw new HTTP_Exception_403;
		}

		parent::before();
	}

}
~~~

## Insert scripts into the page

Keep in mind that the Jquery is mandatory and must be inserted into the page
in front of these instructions:

~~~
<script type="text/javascript" src="/media/wysiwyg/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="/media/wysiwyg/ckeditor/jquery.ckeditor.js"></script>
<script type="text/javascript" src="/media/wysiwyg/environment/default.js"></script>
~~~

## All as though, is ready

Now you can assign a class to rte one or more text fields, and they are converted
into a visual editor automatically:

~~~
<textarea class="rte" name="somename"></textarea>
~~~