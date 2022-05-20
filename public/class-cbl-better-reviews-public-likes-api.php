<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://heavyweightagency.co.uk/
 * @since      1.0.0
 *
 * @package	Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/public
 * @author	 Heavyweight <enquiries@heavyweightagency.co.uk>
 */
class Cbl_Better_Reviews_Public_Likes_Api {

	const ERROR_MISSING_POST_IDS = 'ERROR_MISSING_POST_IDS';

	/**
	 * The ID of this plugin.
	 *
	 * @since	1.0.0
	 * @access   private
	 * @var	  string	$plugin_name	The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    string  $version	The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 1.0.0
	 * @param string	$plugin_name	   The name of the plugin.
	 * @param string	$version	The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the endpoints for the Likes API
	 *
	 * @since	1.0.0
	 */
	public function register_endpoints() {

		register_rest_route(
			'cbl-better-reviews/v1',
			'/like',
			[
				'methods' => 'POST',
				'validate_callback' => [ $this, 'validate_like' ],
				'callback' => [ $this, 'like' ],
			]
		);

		register_rest_route(
			'cbl-better-reviews/v1',
			'/unlike',
			[
				'methods' => 'POST',
				'validate_callback' => [ $this, 'validate_like' ],
				'callback' => [ $this, 'unlike' ],
			]
		);
	}

	public function validate_like(\WP_REST_Request $request) {
		try {
			$post_ids = json_decode( $request->get_body() );
			if ( !is_array( $post_ids ) ) {
				return new \WP_Error(
					self::ERROR_MISSING_POST_IDS,
					__( 'Unexpected data type. Expected a array of Post IDs.', 'CBL Better Reviews: API' )
				);
			}

			if ( empty( $post_ids ) ) {
				return new \WP_Error(
					self::ERROR_MISSING_POST_IDS,
					__( 'Array of Post IDs received was empty.', 'CBL Better Reviews: API' )
				);
			}
		} catch (\Exception $e) {
			return new \WP_Error(
				$e->getCode(),
				$e->getMessage(),
			);
		}
	}

	public function like(\WP_REST_Request $request) {
		try {
			$post_ids = json_decode( $request->get_body() );
			$likes = [];

			foreach( $post_ids as $post_id ) {
				$like = new Cbl_Better_Reviews_Like( (int)$post_id );
				$like->increment();
				$likes[] = $like->to_array();
			}

			return $likes;
		} catch ( \Exception $e ) {
			return new \WP_Error(
				$e->getCode(),
				$e->getMessage(),
			);
		}
	}

	public function unlike(\WP_REST_Request $request) {
		try {
			$post_ids = json_decode( $request->get_body() );
			$likes = [];

			foreach( $post_ids as $post_id ) {
				$like = new Cbl_Better_Reviews_Like( (int)$post_id );
				$like->decrement();
				$likes[] = $like->to_array();
			}

			return $likes;
		} catch ( \Exception $e ) {
			return new \WP_Error(
				$e->getCode(),
				$e->getMessage(),
			);
		}
	}
}
