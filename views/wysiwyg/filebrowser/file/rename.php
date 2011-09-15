<h1><?php echo __('Rename file') ?></h1>
<?php echo Form::open() ?>
<dl>
	<dt><?php echo Form::input('filename', $filename) ?>.<?php echo $extension ?></dt>
<?php if($error): ?>
	<dt><?php echo $error ?></dt>
<?php endif ?>
</dl>
<p><?php echo __('All external links on this file, if any, are unavailable.') ?></p>
<p><?php echo __('Are you sure?') ?></p>
<div class="buttons">
	<?php echo Form::submit(NULL, __('Yes, rename it'), array('class' => 'medium red awesome choose')) ?>
	<?php echo HTML::anchor('#', __('No, I changed my mind'), array('class' => 'medium green awesome close')) ?>
</div>
<?php echo Form::close() ?>