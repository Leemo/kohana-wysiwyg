<div id="dirs">
	<div class="header"><span></span></div>
	<ul class="treeview">
		<?php foreach ($dirs as $dir): ?>
			<li><span></span><a href=""><?php echo $dir ?></a></li>
		<?php endforeach ?>
		</ul>

<div class="footer"><span></span></div>
	</div>
	<div id="content">
		<div class="header">
			<div id="controls" class="rounded">
			Здесь контролы
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
		<?php echo 'Инфо сколько файлов в папке и суммарный размер, если пустая, то написать'; ?>
	</div>
</div>

<script id="tpl-files" type="text/x-jquery-tmpl">
	{{each(key, value) files}}
	<a class="file" href="">
		<div class="icon"></div>
		<p>${key}</p>
		<p class="size">${value.size} bytes</p>
	</a>
	{{/each}}
</script>