<h1><?php echo __('Upload files') ?></h1>
<div id="upload">
	<div id="uploadprogress"></div>
	<!-- <div id="queue"></div> -->
	<input type="file" id="file_upload" name="file_upload" />
</div>
<div class="buttons">
	<?php echo HTML::anchor("#", __('Choose files'), array('class' => 'button gray medium choose')) ?>
	<?php echo HTML::anchor('#', __('Cancel'), array('class' => 'button gray medium close')) ?>
</div>