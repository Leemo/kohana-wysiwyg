<?php defined('SYSPATH') or die('No direct access allowed.');

class Response extends Kohana_Response {

	public function json(array $json)
	{
		$this
			->headers('content-type', 'application/json')
			->headers('cache-control', 'no-store, no-cache, must-revalidate')
			->headers('pragma', 'no-cache')
			->body(json_encode($json));
	}

	public function ok()
	{
		$this->json(array('ok' => TRUE));
	}

} // End Kohana_Response