<h1><?php echo __('Upload files') ?></h1>
<div id="upload">
	<div id="uploadprogress"></div>
	<div id="queue"></div>
	<input type="file" id="file_upload" name="file_upload" />
	<div class="buttons">
		<?php echo HTML::anchor("#", __('Choose files'), array('class' => 'medium green awesome choose')) ?>
		<?php echo HTML::anchor('#', __('Cancel'), array('class' => 'medium red awesome close')) ?>
	</div>
</div>