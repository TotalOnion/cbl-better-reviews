<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://heavyweightagency.co.uk/
 * @since      1.0.0
 *
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/includes
 * @author     Heavyweight <enquiries@heavyweightagency.co.uk>
 */
class Cbl_Better_Reviews {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Cbl_Better_Reviews_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'CBL_BETTER_REVIEWS_VERSION' ) ) {
			$this->version = CBL_BETTER_REVIEWS_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'cbl-better-reviews';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Cbl_Better_Reviews_Loader. Orchestrates the hooks of the plugin.
	 * - Cbl_Better_Reviews_i18n. Defines internationalization functionality.
	 * - Cbl_Better_Reviews_Admin. Defines all hooks for the admin area.
	 * - Cbl_Better_Reviews_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-cbl-better-reviews-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-cbl-better-reviews-i18n.php';

		/**
		 * Classes defining the Like and Review objects
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-cbl-better-reviews-like.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-cbl-better-reviews-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-cbl-better-reviews-public.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-cbl-better-reviews-public-api.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-cbl-better-reviews-public-likes-shortcodes.php';

		$this->loader = new Cbl_Better_Reviews_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Cbl_Better_Reviews_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Cbl_Better_Reviews_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$admin = new Cbl_Better_Reviews_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_menu', $admin, 'add_admin_menu' );

		// Register settings
		$this->loader->add_action( 'admin_init', $admin, 'register_settings' );

		// Save/Update our plugin options
		$this->loader->add_action('admin_init', $admin, 'update_settings');

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public    = new Cbl_Better_Reviews_Public( $this->get_plugin_name(), $this->get_version() );
		$likes_api        = new Cbl_Better_Reviews_Public_Api( $this->get_plugin_name(), $this->get_version() );
		$likes_shortcodes = new Cbl_Better_Reviews_Public_Likes_Shortcodes( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		$this->loader->add_action( 'rest_api_init', $likes_api, 'register_endpoints' );
		$this->loader->add_action( 'init', $likes_shortcodes, 'register_shortcodes' );

		// Likes

		// Add shortcode
		

		// Add filter to shortcode
		add_filter('brlikes_filter', array($plugin_public, 'brlikes_filter'), 10);

		// Add filter to shortcode
		add_filter('brlikestotal_filter', array($plugin_public, 'brlikestotal_filter'), 10);

		// Define function to update likes
		$this->loader->add_action( 'init', $plugin_public, 'brlikes_update', 10 );

		// Ratings
		// Add shortcode
		add_shortcode('brratings', array($plugin_public, 'brratting_shortcode'));

		// Add filter to shortcode
		add_filter('brratings_filter', array($plugin_public, 'brratings_filter'), 10);

		// Define function to update likes
		$this->loader->add_action( 'init', $plugin_public, 'brratings_update', 10 );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Cbl_Better_Reviews_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
