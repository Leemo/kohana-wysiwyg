<h1><?php echo __('Save selection') ?></h1>
<?php echo Form::open() ?>
	<?php echo Form::hidden('image_width', NULL) ?>
	<?php echo Form::hidden('image_height', NULL) ?>
	<?php echo Form::hidden('crop_width', NULL) ?>
	<?php echo Form::hidden('crop_height', NULL) ?>
	<?php echo Form::hidden('offset_x', NULL) ?>
	<?php echo Form::hidden('offset_y', NULL) ?>
	<dl>
		<dt><?php echo Form::label('filename', __('Save selection as')) ?>:</dt>
		<dt><?php echo Form::input('filename', pathinfo($path, PATHINFO_FILENAME).'_crop') ?></dt>
	</dl>
	<dl>
		<dt class="submit">
			<?php echo Form::button('save', __('Save')) ?>
			<?php echo Form::button('cancel', __('Cancel'), array('class' => 'close')) ?>
		</dt>
	</dl>
<?php echo Form::close() ?>