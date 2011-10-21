<h1><?php echo __('Save selection') ?></h1>
<?php echo Form::open() ?>
	<?php echo Form::hidden('image_width', $image_width) ?>
	<?php echo Form::hidden('image_height', $image_height) ?>
	<?php echo Form::hidden('crop_width', $crop_width) ?>
	<?php echo Form::hidden('crop_height', $crop_height) ?>
	<?php echo Form::hidden('offset_x', $offset_x) ?>
	<?php echo Form::hidden('offset_y', $offset_y) ?>
	<dl>
		<dt><?php echo Form::label('filename', __('Save selection as')) ?>:</dt>
		<dt>
			<?php echo Form::input('filename', $filename) ?>
<?php if ( ! empty($errors['filename'])): ?>
			<div class="error"><?php echo $errors['filename'] ?></div>
<?php endif ?>
		</dt>
	</dl>
	<dl>
		<dt class="submit">
			<?php echo Form::button('save', __('Save')) ?>
			<?php echo Form::button('cancel', __('Cancel'), array('class' => 'close')) ?>
		</dt>
	</dl>
<?php echo Form::close() ?>