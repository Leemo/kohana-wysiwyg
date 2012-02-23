<?php defined('SYSPATH') or die('No direct access allowed.');

class Response extends Kohana_Response {

	public function json(array $json)
	{
		$this
			->headers('content-type', 'application/json')
			->body(json_encode($json));
	}

	public function ok()
	{
		$this->json(array('ok' => TRUE));
	}

} // End Kohana_Response