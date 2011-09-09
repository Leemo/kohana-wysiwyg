<div id="dirs">
	<div class="header"><span></span></div>

	<div class="directories">
			<?php foreach ($dirs as $dir): ?>
			<div>
				<p>
					<b><span></span></b><a href=""><?php echo $dir ?></a>
				</p>
			</div>
		<?php endforeach ?>
	</div>

	<div class="footer"><span></span></div>
</div>
<div id="content">
	<div class="header">
		<div id="controls" class="rounded">
			<?php echo HTML::anchor(Route::get('wysiwyg/filebrowser')->uri(array('action' => 'upload')), __('Upload files...'), array('class' => 'medium green awesome', 'rel' => 'boxed')) ?>
			<?php echo HTML::anchor('#', __('Refresh'), array('class' => 'medium blue awesome', 'id' => 'refresh')) ?>
		</div>
		<span></span>
	</div>
	<div id="files">
		<?php echo '&nbsp;'; ?>
	</div>
</div>
<div id="info_wrap">
	<span></span>
	<div id="info" class="rounded">
		&nbsp;
	</div>
</div>

<script id="tpl-files" type="text/x-jquery-tmpl">
{{each(key, value) files}}
	<a class="file" href="">
		<div class="icon"></div>
		<p>${key}</p>
		<p class="size">${value.size}</p>
	</a>
{{/each}}
</script>