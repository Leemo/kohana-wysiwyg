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
			->add_file('filebrowser/cropresizer/global.css')
			->add_file('filebrowser/fancybox.css')
			->add_file('filebrowser/tipsy.css');

		echo Media::instance('js')
			->add_file('filebrowser/jquery-1.6.2.js')
			->add_file('filebrowser/jquery.tipsy.js')
			->add_file('filebrowser/cropresizer/jquery.cropresizer.js')
			->add_file('filebrowser/jquery.fancybox.js')
			->add_file('filebrowser/jquery.form.js')
			->add_file('filebrowser/cropresizer/global.js')
			->add_source('$(function(){$("#img").cropResize({"width":'.$width.', "height":'.$height.'})});');
		?>
	</head>
	<body>
		<div id="crop-form"><?php echo View::factory('wysiwyg/filebrowser/crop/form', Arr::extract(array(), array('image_width', 'image_height', 'crop_width', 'crop_height', 'offset_x', 'offset_y')))->set('filename', pathinfo($path, PATHINFO_FILENAME).'_crop') ?></div>
		<div id="area">
			<div id="img" <?php echo HTML::attributes(array('style' => "width: ".$width."px; height: ".$height."px;")); ?>> <!-- server should parse {} position, calculated for put image to center -->
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
	</body>
</html>