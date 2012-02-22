<!-- File upload modal window -->
<div id="upload-modal" class="modal hide fade">
	<div class="modal-header">
		<a class="close" data-dismiss="modal">&times;</a>
		<h3><?php echo __('Upload files') ?></h3>
	</div>
	<div class="modal-body">
		<p></p>
	</div>
	<div class="modal-footer">
		<?php echo HTML::anchor("#", __('Attach file'), array('class' => 'btn btn-success', 'data-dismiss' => 'modal')) ?>
		<?php echo HTML::anchor("#", __('Attach another file'), array('class' => 'btn btn-success', 'data-dismiss' => 'modal')) ?>
		<?php echo HTML::anchor('#', __('Cancel'), array('class' => 'btn', 'data-dismiss' => 'modal')) ?>
	</div>
</div>
<!-- /File upload modal window -->

<!-- Navigation bar -->
<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container-fluid">
			<div class="nav-collapse">
				<ul class="nav pull-right">
					<li><?php echo HTML::anchor('#', '<i class="icon-upload icon-white"></i>&nbsp;'.__('Upload files'), array('id' => 'upload-link')) ?></li>
					<li class="divider-vertical"></li>
					<li><?php echo HTML::anchor('#', '<i class="icon-refresh icon-white"></i>&nbsp;'.__('Refresh'), array('id' => 'refresh-link')) ?></li>
				</ul>
			</div>
		</div>
	</div>
</div>
<!-- /Navigation bar -->

<!--
<div id="header">
	<div id="controls">
<?php echo HTML::anchor(Route::get('wysiwyg/filebrowser')->uri(array('action' => 'upload')), __('Upload files...'), array('class' => 'button', 'rel' => 'boxed')) ?>
<?php echo HTML::anchor('#', __('Refresh'), array('class' => 'button', 'id' => 'refresh')) ?>
	</div>
	<h2><?php echo Kohana::$config->load('filebrowser.uploads_directory') ?></h2>
</div>
-->
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
	<div class="file {{if value.type}}non_{{/if}}picture" title="${key}"{{if value.width && value.height}} rel="{width:${value.width},height:${value.height}}"{{/if}}>
			 <div class="icon{{if value.type}} ${value.type}{{/if}}">
			{{if value.thumb}}<img src="/${value.thumb}" alt="${key}"/>{{/if}}
			<div class="fileOverlay"></div>
		</div>
		<p class="fileName"><span>${key}</span><i></i></p>
		<p class="size">${value.size}</p>
		{{if value.width && value.height}}<p class="img_size">img. size: ${value.width}×${value.height}</p>{{/if}}
	</div>
	{{/each}}
</script>