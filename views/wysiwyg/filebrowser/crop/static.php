		<?php $route = Route::get('media/wysiwyg') ?>
<?php

	$js = array
	(
		'filebrowser/jquery-1.7.1.js',
		'filebrowser/jquery.form.js',
		'filebrowser/cropresizer/jquery.cropresizer.js',
		'filebrowser/bootstrap/bootstrap-modal.js',
		'filebrowser/bootstrap/bootstrap-dropdown.js',
		'filebrowser/cropresizer/global.js'
	);

	$css = array
	(
		'filebrowser/bootstrap/bootstrap.css',
		'filebrowser/cropresizer/global.css'
	);
?>
<?php foreach($js as $file): ?>
		<?php echo HTML::script($route->uri(array('file' => $file))) ?>

<?php endforeach ?>
<?php foreach($css as $file): ?>
		<?php echo HTML::style($route->uri(array('file' => $file))) ?>

<?php endforeach ?>
		<script type="text/javascript">$(function(){$("#img").cropResize({width:<?php echo $width ?>, height:<?php echo $height ?>})});</script>