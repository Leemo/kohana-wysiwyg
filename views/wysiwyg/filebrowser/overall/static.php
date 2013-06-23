<?php $route = Route::get('media/wysiwyg') ?>
<?php echo HTML::script($route->uri(array('file' => 'filebrowser/jquery-1.7.1.js'))) ?>
    <script type="text/javascript">jQuery.noConflict(); var global_config = <?php echo json_encode($global_config) ?></script>
<?php

	$js = array
	(
		'filebrowser/i18n/ru.js',
		'filebrowser/i18n.js',
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
		'filebrowser/contextmenu.css',
	);
?>

<?php foreach($js as $file): ?>
    <?php echo HTML::script($route->uri(array('file' => $file))) ?>

<?php endforeach ?>
<?php foreach($css as $file): ?>
    <?php echo HTML::style($route->uri(array('file' => $file))) ?>

<?php endforeach ?>