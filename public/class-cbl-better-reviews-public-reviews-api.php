<?php

/**
 * Api for a submitting a single review
 *
 * @link       https://heavyweightagency.co.uk/
 * @since      1.0.0
 *
 * @package	Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/public
 * @author	 Heavyweight <enquiries@heavyweightagency.co.uk>
 */
class Cbl_Better_Reviews_Public_Reviews_Api {

	const ERROR_MISSING_POST_IDS = 'ERROR_MISSING_POST_IDS';

    /**
     * The review being submitted
     */
    private \Cbl_Better_Reviews_Review $review;

    /**
     * The post_ids we need to load
     */
    private array $post_ids;

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
			'/reviews/(?P<ids>[0-9,]+)',
			[
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'validate_callback'   => [ $this, 'validate' ],
				'callback'            => [ $this, 'load' ],
			]
		);
	}

	public function validate(\WP_REST_Request $request) {
		try {
			$this->post_ids = explode(',',$request['ids']);

			if ( ! $this->post_ids ) {
				return new \WP_Error(
					self::ERROR_MISSING_POST_IDS,
					__( 'Missing or invalid Post ID.', 'cbl-better-reviews-api' )
				);
			}
		} catch (\Exception $e) {
			return new \WP_Error(
				$e->getCode(),
				$e->getMessage(),
			);
		}
	}

	public function load( \WP_REST_Request $request )
    {
        try {
            $review_collection = new \Cbl_Better_Reviews_Review_Collection;
            return $review_collection->load( $this->post_ids );
        } catch ( \Exception $e ) {
			return new \WP_Error(
				$e->getCode(),
				$e->getMessage(),
			);
		}
	}
}
