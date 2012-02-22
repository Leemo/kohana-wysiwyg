<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title><?php echo $title ?></title>
    <base href="<?php echo URL::base(TRUE, TRUE) ?>" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
<?php
	echo $css
		->add_file('filebrowser/bootstrap/bootstrap.css')
		->add_file('filebrowser/bootstrap/bootstrap-responsive.css')
		->add_file('filebrowser/global.css')
		->add_file('filebrowser/directories.css')
		->add_file('filebrowser/contextmenu.css')
		->add_file('filebrowser/fancyupload/style.css')
		->add_file('filebrowser/fancybox.css');
?>
<?php
	echo $js
		->add_file('filebrowser/jquery-1.7.1.js')
		->add_source('jQuery.noConflict();')
		->add_source('var global_config = '.json_encode($global_config).';');

	echo $js
		->add_file('filebrowser/i18n/ru.js')
		->add_file('filebrowser/i18n.js')
		->add_file('filebrowser/fancyupload/mootools-1.3.2.js')
		->add_file('filebrowser/fancyupload/Fx.ProgressBar.js')
		->add_file('filebrowser/fancyupload/Swiff.Uploader.js')
		->add_file('filebrowser/fancyupload/FancyUpload3.Attach.js')
		->add_file('filebrowser/jquery.tmpl.js')
		->add_file('filebrowser/jquery.contextmenu.js')
		->add_file('filebrowser/jquery.form.js')
		->add_file('filebrowser/directories.js')
		->add_file('filebrowser/bootstrap/bootstrap.js')
		->add_file('filebrowser/bootstrap/bootstrap-modal.js')
		->add_file('filebrowser/global.js');
?>
	</head>
	<body>
		<?php echo $content ?>
	</body>
</html>