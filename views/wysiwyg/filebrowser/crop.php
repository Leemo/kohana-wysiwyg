<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <base href="<?php echo URL::base(TRUE, TRUE) ?>" />
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9" />
    <title><?php echo __('Crop and resize image :path', array(':path' => $path)) ?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<?php
		echo Media::instance('css')
			->add_file('filebrowser/bootstrap/bootstrap.css')
			->add_file('filebrowser/cropresizer/global.css');

		echo Media::instance('js')
			->add_file('filebrowser/jquery-1.7.1.js')
			->add_file('filebrowser/jquery.form.js')
			->add_file('filebrowser/cropresizer/jquery.cropresizer.js')
			->add_file('filebrowser/bootstrap/bootstrap-modal.js')
			->add_file('filebrowser/bootstrap/bootstrap-dropdown.js')
			->add_file('filebrowser/cropresizer/global.js')
			->add_source('$(function(){$("#img").cropResize({width:'.$width.', height:'.$height.'})});');
		?>
	</head>
	<body>
		<!-- Modal windows -->
		<!-- Save dialog -->
		<div id="save-modal" class="modal hide fade">
			<div class="modal-header">
				<a class="close" data-dismiss="modal">&times;</a>
				<h3><?php echo __('Save file') ?></h3>
			</div>
			<div class="modal-body">
				<?php echo View::factory('wysiwyg/filebrowser/crop/form', Arr::extract(array(), array('image_width', 'image_height', 'crop_width', 'crop_height', 'offset_x', 'offset_y')))
					->set('filename', pathinfo($path, PATHINFO_FILENAME).'_crop')->set('extension', '.'.pathinfo($path, PATHINFO_EXTENSION)); ?>
			</div>
		<!-- /Save dialog -->

		<!-- What's now -->
		<div id="what_s_now" class="modal hide fade">
			<div class="modal-header">
				<a class="close" data-dismiss="modal">&times;</a>
				<h3><?php echo __('What\'s now') ?></h3>
			</div>
			<div class="modal-body">
				<p><?php echo __('') ?></p>
			</div>
			<div class="modal-footer">
				<?php echo HTML::anchor("#", __('Close window'), array('class' => 'btn btn-success', 'data-dismiss' => 'modal')) ?>
				<?php echo HTML::anchor('#', __('Continue'), array('class' => 'btn', 'data-dismiss' => 'modal')) ?>
			</div>
		</div>

		<!-- /What's now -->
		<!-- /Modal windows -->

		<!-- Navigation bar -->
		<div class="navbar" id="tools">
			<div class="navbar-inner">
				<div class="container-fluid">
						<ul class="nav pull-left">
							<li><?php echo HTML::anchor('#', '<i class="icon-move icon-white"></i>&nbsp;'.__('Drag'), array('id' => 'button-drag', 'class' => 'drag', 'rel' => '&nbsp;'.__('Crop'))) ?></li>
							<li class="divider-vertical"></li>
<!-- Temporary unavailable -->
<!--
							<li><p class="navbar-text"><?php echo '<i class="icon-resize-full icon-white"></i>&nbsp;'.__('Proportions') ?>:</p></li>
							<li class="dropdown">
								<?php echo HTML::anchor('#', __('Arbitrary').'&nbsp;<b class="caret"></b>', array('class' => 'dropdown-toggle', 'data-toggle' => 'dropdown')) ?>
								<ul class="dropdown-menu">
									<li><?php echo HTML::anchor('#', __('Arbitrary')) ?></li>
									<li><?php echo HTML::anchor('#', __('Square')) ?></li>
									<li><?php echo HTML::anchor('#', __('4 : 3')) ?></li>
									<li><?php echo HTML::anchor('#', __('2 : 1')) ?></li>
								</ul>
							</li>
							<li class="divider-vertical"></li>
-->
							<li><?php echo HTML::anchor('#', '<i class="icon-move icon-white"></i>&nbsp;'.__('Reset'), array('id' => 'button-reset')) ?></li>
							<li class="divider-vertical"></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-move icon-white"></i>&nbsp;'.__('Center'), array('id' => 'button-center')) ?></li>
							<li class="divider-vertical"></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-minus icon-white"></i>', array('id' => 'button-minus')) ?></li>
							<li><?php echo Form::input('zoom', '100', array('id' => 'input-ratio')) ?></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-plus icon-white"></i>', array('id' => 'button-plus')) ?></li>
							<li class="divider-vertical"></li>
						</ul>
						<ul class="nav pull-right">
							<li class="divider-vertical"></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-ok icon-white"></i>&nbsp;'.__('Save'), array('id' => 'button-save')) ?></li>
							<li class="divider-vertical"></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-remove icon-white"></i>&nbsp;'.__('Exit'), array('id' => 'button-close')) ?></li>
						</ul>
				</div>
			</div>
		</div>
		<!-- /Navigation bar -->

		<!-- Crop tool -->
		<div id="area">
			<div id="img" <?php echo HTML::attributes(array('style' => "width: ".$width."px; height: ".$height."px;")); ?>>
				<img alt="" src="<?php echo $file ?>"/>
				<div id="overlay"></div>
				<div></div>
				<div id="cropper">
					<b id="lt"><em></em></b>
					<b id="mt"><em></em></b>
					<b id="rt"><em></em></b>
					<b id="rm"><em></em></b>
					<b id="rb"><em></em></b>
					<b id="mb"><em></em></b>
					<b id="lb"><em></em></b>
					<b id="lm"><em></em></b>
					<div id="cropsize">
							<input type="text" id="crop_w" name="w" value="" size="4" />
							<i>×</i>
							<input type="text" id="crop_h" name="h" value="" size="4"/>
							<i id="setSize" class="icon-play icon-white"></i>
					</div>
				</div>
			</div>
		</div>
		<!-- /Crop tool -->
	</body>
</html>