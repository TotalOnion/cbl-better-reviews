<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://heavyweightagency.co.uk/
 * @since      1.0.0
 *
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/public
 * @author     Heavyweight <enquiries@heavyweightagency.co.uk>
 */
class Cbl_Better_Reviews_Public {

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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script(
			$this->plugin_name,
			plugin_dir_url( __FILE__ ) . 'dist/main.js',
			[],
			$this->version,
			true
		);
	}

	

	/**
	* Br_likes totoal shortcode
	*/
	public function brlikestotal_shortcode($atts = []) {
		$type_array = array();
		$output = '';
		$post_id = get_the_ID();

		// Get the attributes, if id not passed in use current post id
		$attributes = shortcode_atts([
			'id' => null
		], $atts, 'brlikestotal');

		if (empty($attributes['id'])) {
			$id = $post_id;
		} else {
			$id = $attributes['id'];
		}

		// Return likes code
		return apply_filters('brlikestotal_filter', $id);

	}

	/**
	* Br_likes filter to modify html
	* called via apply_filters('brlikes_filter');
	*/
	public function brlikes_filter($id) {
		$new_output = '';
		$no_of_likes = $this->get_number_likes($id);

		// This will return the html for the br_likes block
  		$new_output .= '<div>';
		$new_output .= '
			<label>Like the post here</label>
			<input type="hidden" id="br-likes-postid" name="post_id" value="'.$id.'">
			<button id="br-likes-likebutton" data-id="'.$id.'" data-task="like">Like</button>

		';

		/* if ($no_of_likes > 0) {
			$new_output .= '<div>';
			$new_output .= 'Number of likes ';
			$new_output .= $no_of_likes;
			$new_output .= '</div>';
		} */

		$new_output .= '</div>';

		return $new_output;
	}

	/**
	* Br_likes filter to modify html
	* called via apply_filters('brlikestotal_filter');
	*/
	public function brlikestotal_filter($id) {
		$new_output = '';
		$no_of_likes = $this->get_number_likes($id);

		//if ($no_of_likes > 0) {
			$new_output .= 'Number of likes ';
			$new_output .= '<div id="br-likes-total">';
			$new_output .= $no_of_likes;
			$new_output .= '</div>';
		//}

		$new_output .= '</div>';

		return $new_output;
	}

	/**
	* Br_likes update like
	*/
	public function brlikes_update() {
		global $wpdb;

		// Get the variables passed in by form
		if (isset($_REQUEST['post_id'])) {
			$post_id = (int)$_REQUEST['post_id'];
		}

		if (isset($_REQUEST['task'])) {
			$task = $_REQUEST['task'];
		}

		// Set the variables
		$ip_address = $this->br_likes_ipaddress();
		$date = date( 'Y-m-d H:i:s' );

		if (!empty($task)) {
			if ( $task == "like" ) {
				$success = $wpdb->query(
					$wpdb->prepare(
						"INSERT INTO {$wpdb->prefix}br_likes (`post_id`,`date_time`, `ip`)
						VALUES (%d, %s, %s)",
						$post_id, $date, $ip_address
					)
				);
			}

			if ( $task == "unlike" ) {
				$success = $wpdb->query(
					$wpdb->prepare(
						"DELETE from {$wpdb->prefix}br_likes WHERE post_id = '%s' LIMIT 1",
						$post_id
					)
				);
			}

			if ( $task == "likedata" ) {
				$likenumber = $this->get_number_likes($post_id);
				echo $likenumber;
				die();
			}
		}
	}

	/**
	* Br_likes get numer of likes
	*/
	public function get_number_likes($post_id) {
		global $wpdb;

		$posts = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT id FROM {$wpdb->prefix}br_likes
				WHERE post_id = %d",
				$post_id
			)
		);

		$post_count = count($posts);

		return $post_count;
	}

	/**
	* Br_ratings shortcode
	*/
	public function brratting_shortcode($atts = []) {
		$type_array = array();
		$output = '';
		$post_id = get_the_ID();

		// Get the attributes, not sure what we need here yet
		$attributes = shortcode_atts([
			'id' => null
		], $atts, 'brratings');

		// Return likes code
		return apply_filters('brratings_filter', $post_id);

	}

	/**
	* Br_rating filter to modify html
	* called via apply_filters('brratings_filter');
	*/
	public function brratings_filter($id) {
		$new_output = '';
		$average_rating = $this->get_average_rating($id);
		$post_id = get_the_ID();
		$post_type = get_post_type($post_id);
		$section_name = $this->plugin_name. '_posts_settings';
		$options = get_option($section_name);

		// If the shortcode is allowed on this posttype
		if ($options[$post_type] == 'on') {

			// Get the settings for the postype
			$options_type = $this->plugin_name.'_'.$post_type;
			$option_settings = get_option($options_type);

		} else {
			echo 'You cannot use this shortcode on this page';
		}


		// This will return the html for the br_likes block
		$new_output .= '<div>';
		$new_output .= '

			<h2>'.$option_settings['review_label'].'</h2>
			<form name="" action="/" method="post">
				<div style="margin-bottom:20px;">
				<label>'.$option_settings['subtype_quality'].'</label>
				<input type="hidden" name="post_id" value="'.$id.'">
				<input type="hidden" name="task" value="rate">
				<input type="text" name="quality_value" value="">
				</div>

				<div style="margin-bottom:20px;">
				<label>'.$option_settings['subtype_value'].'</label>
				<input type="hidden" name="post_id" value="'.$id.'">
				<input type="hidden" name="task" value="rate">
				<input type="text" name="value_value" value="">
				</div>

				<div style="margin-bottom:20px;">
				<label>'.$option_settings['subtype_taste'].'</label>
				<input type="hidden" name="post_id" value="'.$id.'">
				<input type="hidden" name="task" value="rate">
				<input type="text" name="taste_value" value="">
				</div>

				<input type="submit">
			</form>

		';
		if ($average_rating > 0) {
			$new_output .= '<div>';
			$new_output .= $option_settings['average_score_label'].'<br />';
			$new_output .= $this->get_average_rating($id);
			$new_output .= '</div>';
		}

		$new_output .= '</div>';

		return $new_output;
	}

	/**
	* Br_ratings update rating
	*/
	public function brratings_update() {
		global $wpdb;

		// Get the variables passed in by form
		if (isset($_REQUEST['post_id'])) {
			$post_id = (int)$_REQUEST['post_id'];
		}

		if (isset($_REQUEST['quality_value'])) {
			$quality_value = (int)$_REQUEST['quality_value'];
		}

		if (isset($_REQUEST['value_value'])) {
			$value_value = (int)$_REQUEST['value_value'];
		}

		if (isset($_REQUEST['taste_value'])) {
			$taste_value = (int)$_REQUEST['taste_value'];
		}

		if (isset($_REQUEST['task'])) {
			$task = $_REQUEST['task'];
		}

		// Set the variables
		$date = date( 'Y-m-d H:i:s' );

		if (!empty($task)) {
			if ( $task == "rate" ) {
				$success = $wpdb->query(
					$wpdb->prepare(
						"INSERT INTO {$wpdb->prefix}br_ratings (`post_id`, `score`, `rating_type_id`, `date_time`)
						VALUES (%d, %d, %d, %s)",
						$post_id, $quality_value, 1, $date
					)
				);

				$success = $wpdb->query(
					$wpdb->prepare(
						"INSERT INTO {$wpdb->prefix}br_ratings (`post_id`, `score`, `rating_type_id`, `date_time`)
						VALUES (%d, %d, %d, %s)",
						$post_id, $value_value, 2, $date
					)
				);

				$success = $wpdb->query(
					$wpdb->prepare(
						"INSERT INTO {$wpdb->prefix}br_ratings (`post_id`, `score`, `rating_type_id`, `date_time`)
						VALUES (%d, %d, %d, %s)",
						$post_id, $taste_value, 3, $date
					)
				);
			}
		}
	}

	/**
	* Br_likes get average rating
	*/
	public function get_average_rating($post_id) {
		global $wpdb;

		$posts = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT score FROM {$wpdb->prefix}br_ratings
				WHERE post_id = %d",
				$post_id
			)
		);

		$post_count = count($posts);

		$score = 0;
		foreach ($posts as $post) {
			$score = $score+$post->score;
		}

		if ($score > 0) {
			return round($score/$post_count);
		}

		return 0;
	}

	public function br_likes_ipaddress() {
		if (getenv('HTTP_CLIENT_IP')) {
			$ip = getenv('HTTP_CLIENT_IP');
		} elseif (getenv('HTTP_X_FORWARDED_FOR')) {
			$ip = getenv('HTTP_X_FORWARDED_FOR');
		} elseif (getenv('HTTP_X_FORWARDED')) {
			$ip = getenv('HTTP_X_FORWARDED');
		} elseif (getenv('HTTP_FORWARDED_FOR')) {
			$ip = getenv('HTTP_FORWARDED_FOR');
		} elseif (getenv('HTTP_FORWARDED')) {
			$ip = getenv('HTTP_FORWARDED');
		} else {
			$ip = $_SERVER['REMOTE_ADDR'];
		}

		return $ip;
	}
}
