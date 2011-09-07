<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title><?php echo $title ?></title>
    <base href="<?php echo URL::base(TRUE, TRUE) ?>" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
<?php
	echo $css
		->add_file('filebrowser/global.css')
		->add_file('filebrowser/treeview.css')
?>
<?php
	echo $js
		->add_file('filebrowser/jquery-1.6.2.js')
		->add_file('filebrowser/jquery.tmpl.js')
		->add_file('filebrowser/jquery.treeview.js')
		->add_file('filebrowser/global.js');
?>
	</head>
	<body>
		<?php echo $content ?>
	</body>
</html>