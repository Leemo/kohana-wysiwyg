<h1><?php echo __('Rename file') ?></h1>
<?php echo Form::open(Request::current()) ?>
<dl>
	<dt><?php echo Form::input('filename', $filename) ?>.<?php echo $extension ?></dt>
<?php if($error): ?>
	<dt><?php echo $error ?></dt>
<?php endif ?>
</dl>
<p><?php echo __('All external links on this file, if any, are unavailable.') ?></p>
<p><?php echo __('Are you sure?') ?></p>
<div class="buttons">
	<?php echo Form::submit(NULL, __('Yes, rename it'), array('class' => 'button gray medium choose')) ?>
	<?php echo HTML::anchor('#', __('No, I changed my mind'), array('class' => 'button gray medium close')) ?>
</div>
<?php echo Form::close() ?>