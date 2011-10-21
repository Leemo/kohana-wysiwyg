<div id="controls">
		<?php echo HTML::anchor(Route::get('wysiwyg/filebrowser')->uri(array('action' => 'upload')), __('Upload files...'), array('class' => 'button', 'rel' => 'boxed')) ?>
		<?php echo HTML::anchor('#', __('Refresh'), array('class' => 'button', 'id' => 'refresh')) ?>
</div>
<div id="dirs">
 	<div class="directories">
		<div id="root" class="open">
			<p>
				<a href=""><?php echo Kohana::$config->load('filebrowser.uploads_directory') ?></a>
			</p>
			<?php foreach ($dirs as $dir => $parents): ?>
				<div name="<?php echo $parents ?>">
					<p>
						<b><span></span></b><a href=""><?php echo $dir ?></a>
					</p>
				</div>
			<?php endforeach ?>
			</div>
		</div>
	</div>
	<div id="content">

	<div id="files">
		<div id="filesRow"></div>
	</div>
</div>
<div id="info_wrap">
ВОТ ОН КАКОЙ
</div>

<script id="tpl-files" type="text/x-jquery-tmpl">
	{{each(key, value) files}}
	<a class="file" href="#" title="${key}">
		<div class="icon{{if value.type}} ${value.type}{{/if}}">{{if value.thumb}}<img src="/${value.thumb}" alt="${key}"/>{{/if}}</div>
		<p><span>${key}</span><i></i></p>
		<p class="size">${value.size}</p>
	</a>
	{{/each}}
</script>