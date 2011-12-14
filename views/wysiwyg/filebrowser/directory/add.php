<h1><?php echo __('Add new directory') ?></h1>
<?php echo Form::open(Request::current()) ?>
<dl>
	<dt><?php echo Form::input('dirname', $dirname) ?></dt>
<?php if($error): ?>
	<dt><?php echo $error ?></dt>
<?php endif ?>
</dl>
<div class="buttons">
	<?php echo Form::submit(NULL, __('Add'), array('class' => 'button gray medium choose')) ?>
	<?php echo HTML::anchor('#', __('Cancel'), array('class' => 'button gray medium close')) ?>
</div>
<?php echo Form::close() ?>