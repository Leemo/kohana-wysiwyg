<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title><?php echo $title ?></title>
    <base href="<?php echo URL::base(TRUE, TRUE) ?>" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<?php $route = Route::get('media/wysiwyg') ?>
		<?php echo HTML::script($route->uri(array('file' => 'filebrowser/jquery-1.7.1.js'))) ?>
		<script type="text/javascript">jQuery.noConflict(); var global_config = <?php echo json_encode($global_config) ?></script>
<?php

	$js = array
	(
		'filebrowser/i18n/ru.js',
		'filebrowser/i18n.js',
		'filebrowser/fancyupload/mootools-1.3.2.js',
		'filebrowser/fancyupload/Fx.ProgressBar.js',
		'filebrowser/fancyupload/Swiff.Uploader.js',
		'filebrowser/fancyupload/FancyUpload3.Attach.js',
		'filebrowser/jquery.tmpl.js',
		'filebrowser/jquery.contextmenu.js',
		'filebrowser/jquery.form.js',
		'filebrowser/directories.js',
		'filebrowser/bootstrap/bootstrap-modal.js',
		'filebrowser/global.js'
	);

	$css = array
	(
		'filebrowser/bootstrap/bootstrap.css',
		'filebrowser/global.css',
		'filebrowser/directories.css',
		'filebrowser/contextmenu.css',
		'filebrowser/fancyupload/style.css',
		'filebrowser/fancybox.css'
	);
?>

<?php foreach($js as $file): ?>
		<?php echo HTML::script($route->uri(array('file' => $file))) ?>

<?php endforeach ?>
<?php foreach($css as $file): ?>
		<?php echo HTML::style($route->uri(array('file' => $file))) ?>

<?php endforeach ?>
	</head>
	<body>
		<?php echo $content ?>
	</body>
</html>