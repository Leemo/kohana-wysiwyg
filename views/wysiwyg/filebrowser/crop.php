<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <base href="<?php echo URL::base(TRUE, TRUE) ?>" />
    <title><?php echo __('Crop and resize image :path', array(':path' => $path)) ?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<?php
		echo Media::instance('css')
			->add_file('filebrowser/cropresizer/style.css')
			->add_file('filebrowser/tipsy.css');

		echo Media::instance('js')
			->add_file('filebrowser/jquery-1.6.2.js')
			->add_file('filebrowser/cropresizer/jquery.cropresizer.js')
			->add_file('filebrowser/jquery.tipsy.js')
			->add_file('filebrowser/cropresizer/jquery.cropresizer.js')
			->add_source('$(function(){$("#img").cropResize({width:'.$width.', height:'.$height.'});  $(".tip-sw").tipsy({"gravity": "sw", "fade": true, "delayIn": 1000}); });');

		?>
	</head>
	<body>
		  <div id="area">
        <div id="img" <?php echo HTML::attributes(array('style' => "width: " . $width . "px; height: " . $height . "px; left: " . (900-$width)/2 . "px; top: " . (580-$height)/2 . "px")); ?>> <!-- server should parse {} position, calculated for put image to center -->
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
              <input id="crop_w" type="text" name="w" value="0" size="3" />×<input id="crop_h" type="text" name="h" value="0" size="3" />
            </div>
          </div>
        </div>
      </div>
      <div id="tools">
        <span id="drag" class="tip-sw" original-title="<?php echo __('It\'s for moving your entire image within a window') ?>">&nbsp;</span>
        <span id="crop" original-title="<?php echo __('Allows you to select an area of an image and discard everything outside this area') ?>" class="active tip-sw">&nbsp;</span>
        <label for="croptype"><?php echo __('Proportions') ?>:</label>
        <select id="croptype">
          <option value="0"><?php echo __('Arbitrary') ?></option>
          <option value="1"><?php echo __('Square') ?></option>
          <option value="2">3 : 4</option>
          <option value="3">16 : 9</option>
          <option value="4">1 : 2</option>
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