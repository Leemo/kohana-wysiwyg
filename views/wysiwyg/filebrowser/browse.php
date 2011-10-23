
<div id="header">
	<div id="controls">
		<?php echo HTML::anchor(Route::get('wysiwyg/filebrowser')->uri(array('action' => 'upload')), __('Upload files...'), array('class' => 'button', 'rel' => 'boxed')) ?>
		<?php echo HTML::anchor('#', __('Refresh'), array('class' => 'button', 'id' => 'refresh')) ?>
	</div>
	<h2></h2>
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
						<em></em>
					</p>
				</div>
			<?php endforeach ?>
		</div>
	</div>
</div>
<div id="content">
  <em id="top_smog"></em>
	<em id="bottom_smog"></em>
	<div id="files">
		<div id="filesRow"></div>
	</div>
</div>

<script id="tpl-files" type="text/x-jquery-tmpl">
	{{each(key, value) files}}
	<a class="file" href="#" title="${key}"{{if value.width && value.height}} rel="{width:${value.width},height:${value.height}}"{{/if}}>
		<div class="icon{{if value.type}} ${value.type}{{/if}}">
			  {{if value.thumb}}<img src="/${value.thumb}" alt="${key}"/>{{/if}}
		</div>
		<p><span>${key}</span><i></i></p>
		<p class="size">${value.size}</p>
		{{if value.width && value.height}}<p class="img_size">img. size: ${value.width}×${value.height}</p>{{/if}}
	</a>
	{{/each}}
</script>