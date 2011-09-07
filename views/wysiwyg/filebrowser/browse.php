<div id="dirs">
	<div class="rounded">
		<ul class="treeview">
<?php foreach($dirs as $dir): ?>
			<li><?php echo $dir ?></li>
<?php endforeach ?>
		</ul>
	</div>
</div>
<div id="content">
	<div id="controls">
		<div class="rounded">

		</div>
	</div>
	<div id="files">
		<div class="rounded">
			<?php echo '&nbsp;'; ?>
		</div>
	</div>
	<div id="info">
		<div class="rounded">
			<?php echo '&nbsp;'; ?>
		</div>
	</div>
</div>
<script id="tpl-files" type="text/x-jquery-tmpl">
{{each(key, value) files}}
	<div class="file">
		<div class="icon"></div>
		<div class="name">${key}</div>
		<div class="size">${value.size}</div>
	</div>
{{/each}}
</script>