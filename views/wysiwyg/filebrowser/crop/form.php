<?php echo Form::open(NULL, array('id' => 'crop-form', 'class' => 'form-horizontal')) ?>
<div class="control-group">
	<?php echo Form::label('filename', __('Save as').':') ?>
	<div class="input-append">
		<?php echo Form::input('filename', $filename) ?>
		<span class="add-on" id="file-extension"><?php echo $extension; ?></span>
	</div>
</div>
<?php echo Form::close() ?>
</div>
<div class="modal-footer">
	<?php echo HTML::anchor("#", __('Save file'), array('class' => 'btn btn-success', 'data-dismiss' => 'modal')) ?>
	<?php echo HTML::anchor('#', __('Cancel'), array('class' => 'btn', 'data-dismiss' => 'modal')) ?>
</div>
