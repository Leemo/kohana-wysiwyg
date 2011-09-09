<div id="upload">
	<div id="queue">
	<input type="file" id="file_upload" name="file_upload" />
	</div>
	<div class="buttons">
		<?php echo HTML::anchor("#", __('Choose files...'), array('class' => 'medium green awesome upload')) ?>
		<?php echo HTML::anchor('#', __('Close'), array('class' => 'medium red awesome close')) ?>
	</div>
</div>