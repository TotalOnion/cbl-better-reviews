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
class Cbl_Better_Reviews_Public_Likes_Shortcodes {

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

    public function register_shortcodes() {
        add_shortcode( 'better-reviews-likes', array( $this, 'render_likes_icon' ) );

		//add_shortcode('brlikestotal', array($plugin_public, 'brlikestotal_shortcode'));
    }

    public function display_like_icon() {

    }

    /**
	* Br_likes shortcode
	*/
	public function render_likes_icon( $atts = [] ) {
        return '<div data-better-reviews-like class="better-reviews__like></div>';
        /*
		$type_array = array();
		$output = '';
		$post_id = get_the_ID();

		// Get the attributes, not sure what we need here yet
		$attributes = shortcode_atts([
			'id' => null
		], $atts, 'brlikes');

		// Return likes code
		return apply_filters('brlikes_filter', $post_id);
        */
	}
}
