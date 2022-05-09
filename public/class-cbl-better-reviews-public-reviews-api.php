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
class Cbl_Better_Reviews_Public_Reviews_Api {

	const ERROR_MISSING_POST_ID = 'ERROR_MISSING_POST_ID';
    const ERROR_MISSING_INVALID_PAYLOAD = 'ERROR_MISSING_INVALID_PAYLOAD';

    /**
     * The review being submitted
     */
    private \Cbl_Better_Reviews_Review $review;

    /**
     * The new review data payload
     */
    private \stdClass $payload;

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
			'/review/(?P<id>\d+)',
			[
				'methods' => 'POST',
				'validate_callback' => [ $this, 'validate_review' ],
				'callback' => [ $this, 'review' ],
			]
		);
	}

	public function validate_review(\WP_REST_Request $request) {
		try {
			$post_id = (int)$request['id'] ?? false;
			if ( ! $post_id ) {
				return new \WP_Error(
					self::ERROR_MISSING_POST_ID,
					__( 'Missing or invalid Post ID.', 'CBL Better Reviews: API' )
				);
			}

            $this->payload = json_decode( $request->get_body() );
            if ( ! $this->payload ) {
                return new \WP_Error(
					self::ERROR_MISSING_INVALID_PAYLOAD,
					__( 'Missing or invalid review payload.', 'CBL Better Reviews: API' )
				);
            }

            $this->review = new \Cbl_Better_Reviews_Review( $post_id );
            $this->review->validate_payload( $this->payload );
		} catch (\Exception $e) {
			return new \WP_Error(
				$e->getCode(),
				$e->getMessage(),
			);
		}
	}

	public function review( \WP_REST_Request $request ) {
        try {
            return $this->review->save( $this->payload );
        } catch ( \Exception $e ) {
			return new \WP_Error(
				$e->getCode(),
				$e->getMessage(),
			);
		}
        /*
		try {
			$post_ids = json_decode( $request->get_body() );
			$likes = [];

			foreach( $post_ids as $post_id ) {
				$like = new Cbl_Better_Reviews_Like( (int)$post_id );
				$like->increment();
				$likes[] = $like->to_array();
			}

			return $likes;
		
        */
	}
}
