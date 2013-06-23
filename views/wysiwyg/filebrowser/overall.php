<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title><?php echo $title ?></title>
    <base href="<?php echo URL::base(TRUE, TRUE) ?>" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <?php echo View::factory('wysiwyg/filebrowser/overall/static')->bind('global_config', $global_config) ?>
	</head>
	<body>
		<?php echo $content ?>
	</body>
</html>