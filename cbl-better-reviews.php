<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://heavyweightagency.co.uk/
 * @since             1.0.0
 * @package           Cbl_Better_Reviews
 *
 * @wordpress-plugin
 * Plugin Name:       CBL Better Reviews
 * Plugin URI:        https://github.com/TotalOnion/cbl-better-reviews
 * Description:       Plugin to add likes and reviews to posts
 * Version:           1.0.0
 * Author:            Heavyweight
 * Author URI:        https://heavyweightagency.co.uk/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       cbl-better-reviews
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'CBL_BETTER_REVIEWS_VERSION', '1.0.0' );
define( 'CBL_BETTER_REVIEWS_NAME', 'cbl-better-reviews' );
define( 'CBL_BETTER_REVIEWS_SLUG', 'cbl-better-reviews' );
define( 'CBL_BETTER_REVIEWS_TEXT_DOMAIN', 'cbl-better-reviews' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-cbl-better-reviews-activator.php
 */
function activate_cbl_better_reviews() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-cbl-better-reviews-activator.php';
	Cbl_Better_Reviews_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-cbl-better-reviews-deactivator.php
 */
function deactivate_cbl_better_reviews() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-cbl-better-reviews-deactivator.php';
	Cbl_Better_Reviews_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_cbl_better_reviews' );
register_deactivation_hook( __FILE__, 'deactivate_cbl_better_reviews' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-cbl-better-reviews.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_cbl_better_reviews() {

	$plugin = new Cbl_Better_Reviews();
	$plugin->run();

}
run_cbl_better_reviews();
