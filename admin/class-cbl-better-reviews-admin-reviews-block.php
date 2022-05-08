<?php

/**
 * The class that powers the gutenberg block
 *
 * @link       https://heavyweightagency.co.uk/
 * @since      1.0.0
 *
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/public
 */

use Hamcrest\Type\IsCallable;

/**
 * The class that powers the gutenberg block
 *
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/public
 * @author     Heavyweight <enquiries@heavyweightagency.co.uk>
 */
class Cbl_Better_Reviews_Admin_Reviews_Block {

	const JS_SCRIPT_LOCATION = 'js/better-reviews-block.js';
	
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Reference to the plugin that's used in multiple places
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $block_name    The block's internal name
	 */
	private $block_name;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{
		$this->plugin_name             = $plugin_name;
		$this->version                 = $version;
		$this->block_name              = $this->plugin_name . '/better-reviews';
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts()
	{
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Pr_Bazaarvoice_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Pr_Bazaarvoice_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		wp_enqueue_script(
			self::JS_SCRIPT_LOCATION,
			plugin_dir_url(__FILE__) . self::JS_SCRIPT_LOCATION,
			array('wp-blocks', 'wp-editor', 'wp-components', 'wp-i18n'),
			true
		);
	}
	
	/**
	 * Register the block for the gutenberg editor
	 */
	public function register_block()
	{
		if (!function_exists('register_block_type')) {
			echo 'Gutenberg is not active.';
			return;
		}

		// Register the script
		wp_register_script(
			self::JS_SCRIPT_LOCATION,
			plugins_url( self::JS_SCRIPT_LOCATION, __FILE__ ),
			array('wp-blocks', 'wp-editor', 'wp-components', 'wp-i18n')
		);

		// Register the block
		$block_public = new Cbl_Better_Reviews_Public_Reviews_Block( $this->plugin_name, $this->version );
		
		register_block_type(
			$this->block_name,
			array(
				'editor_script'   => self::JS_SCRIPT_LOCATION,
				'render_callback' => array( $block_public, 'render_block' )
			)
		);
	}

	/**
	 * Common blocks are commonly filtered and removed. This function ensures
	 * that the Better Reviews block is added back in after that point.
	 */
	public function filter_allowed_block_types( $allowed_block_types, $post )
	{
		if (
			is_array( $allowed_block_types )
			&& !in_array( $this->block_name, $allowed_block_types )
		) {
			$allowed_block_types[] = $this->block_name;
		}

		return $allowed_block_types;
	}
}
