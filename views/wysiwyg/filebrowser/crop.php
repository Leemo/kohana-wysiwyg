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
			->add_file('filebrowser/bootstrap/bootstrap-responsive.css')
			->add_file('filebrowser/cropresizer/global.css');

		echo Media::instance('js')
			->add_file('filebrowser/jquery-1.7.1.js')
			->add_file('filebrowser/jquery.form.js')
			->add_file('filebrowser/cropresizer/jquery.cropresizer.js')
			->add_file('filebrowser/bootstrap/bootstrap.js')
			->add_file('filebrowser/bootstrap/bootstrap-modal.js')
			->add_file('filebrowser/bootstrap/bootstrap-dropdown.js')
			->add_file('filebrowser/cropresizer/global.js')
			->add_source('$(function(){$("#img").cropResize({"width":'.$width.', "height":'.$height.'}); })');
		?>
	</head>
	<body>
<!-- Modal windows -->
		<!-- Save dialog -->
		<div id="save-modal" class="modal hide fade">
			<div class="modal-header">
				<a class="close" data-dismiss="modal">&times;</a>
				<h3><?php echo __('Rename file') ?></h3>
			</div>
			<div class="modal-body">
				<?php echo Form::open(NULL, array('class' => 'form-horizontal')) ?>
				<div class="control-group">
					<?php echo Form::label('filename', __('File name').':') ?>
					<div class="input-append">
						<?php echo Form::input('filename') ?>
						<span class="add-on" id="file-extension">.jpg</span>
					</div>
				</div>
				<?php echo Form::close() ?>
			</div>
			<div class="modal-footer">
				<?php echo HTML::anchor("#", __('Save file'), array('class' => 'btn btn-success', 'data-dismiss' => 'modal')) ?>
				<?php echo HTML::anchor('#', __('Cancel'), array('class' => 'btn', 'data-dismiss' => 'modal')) ?>
			</div>
		</div>
		<!-- /Save dialog -->

		<!-- What's now -->
		<div id="save-modal" class="modal hide fade">
			<div class="modal-header">
				<a class="close" data-dismiss="modal">&times;</a>
				<h3><?php echo __('What\'s now') ?></h3>
			</div>
			<div class="modal-body">
			</div>
			<div class="modal-footer">
				<?php echo HTML::anchor("#", __('Close window'), array('class' => 'btn', 'data-dismiss' => 'modal')) ?>
				<?php echo HTML::anchor('#', __('Return'), array('class' => 'btn', 'data-dismiss' => 'modal')) ?>
			</div>
		</div>
		<!-- /What's now -->
<!-- /Modal windows -->

		<!-- Navigation bar -->
		<div class="navbar navbar-fixed-top">
			<div class="navbar-inner">
				<div class="container-fluid">
					<div class="nav-collapse">
						<ul class="nav pull-left">
							<li class="divider-vertical"></li>
							<li><?php echo HTML::anchor('#', __('Upload files')) ?></li>
							<li class="divider-vertical"></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-refresh icon-white"></i>&nbsp;'.__('Refresh'), array('id' => 'refresh-link')) ?></li>
						</ul>
						<ul class="nav pull-right">
							<li class="divider-vertical"></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-refresh icon-white"></i>&nbsp;'.__('Reset')) ?></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-ok icon-white"></i>&nbsp;'.__('Save')) ?></li>
							<li class="divider-vertical"></li>
							<li><?php echo HTML::anchor('#', '<i class="icon-remove icon-white"></i>&nbsp;'.__('Exit')) ?></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<!-- /Navigation bar -->



<!--
		<div id="crop-form"><?php echo View::factory('wysiwyg/filebrowser/crop/form', Arr::extract(array(), array('image_width', 'image_height', 'crop_width', 'crop_height', 'offset_x', 'offset_y')))->set('filename', pathinfo($path, PATHINFO_FILENAME).'_crop') ?></div>
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
						<em><ins></ins></em>
						<div>
							<input type="text" id="crop_w" name="w" value="" size="4" />
							<i>×</i>
							<input type="text" id="crop_h" name="h" value="" size="4"/>
            </div>
          </div>
        </div>
      </div>
		</div>
		<div id="tools">
			<span id="drag" class="tip-sw" original-title="<?php echo __('It\'s for moving your entire image within a window') ?>">&nbsp;</span>
			<span id="crop" original-title="<?php echo __('Allows you to select an area of an image and discard everything outside this area') ?>" class="active tip-sw">&nbsp;</span>
			<label contenteditable="true" for="croptype"><?php echo __('Proportions') ?>:</label>
			<select id="proportion">
				<option value="0" selected="selected"><?php echo __('Arbitrary') ?></option>
				<option value="1"><?php echo __('Square') ?></option>
				<option value="0.75">4 : 3</option>
				<option value="0.5625">16 : 9</option>
				<option value="0.5">2 : 1</option>
			</select>

			<button id="plus">+</button>
			<input type="text" id="ratio" value="100" size="3" /><b>%</b>
			<button id="minus">−</button>
			<button id="center">&nbsp;</button>
			<button id="reset"><?php echo __('Reset') ?></button>
			<button id="save"><?php echo __('Save') ?></button>
			<button id="close"><?php echo __('Exit') ?></button>
		</div>
-->
	</body>
</html>