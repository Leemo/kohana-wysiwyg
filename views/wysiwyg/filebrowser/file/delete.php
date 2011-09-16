<h1><?php echo __('Delete file') ?></h1>
<p><?php echo __('You are trying to delete a file :filename.', array(':filename' => '<strong>'.$filename.'</strong>')) ?></p>
<p><?php echo __('Would be impossible to restore it, and all external links on this file, if any, are unavailable.') ?></p>
<p><?php echo __('Are you sure?') ?></p>
<div class="buttons">
	<?php echo HTML::anchor("#", __('Yes, delete it'), array('class' => 'button gray medium choose')) ?>
	<?php echo HTML::anchor('#', __('No, I changed my mind'), array('class' => 'button gray medium close')) ?>
</div>