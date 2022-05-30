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

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			$this->plugin_name . '/likes.js',
			plugins_url( 'js/likes.js', __DIR__ . '..' ),
			[],
			$this->version,
			true
		);
	}

    public function register_shortcodes() {
        add_shortcode( 'better-reviews-like', array( $this, 'render_like_icon' ) );
		add_shortcode( 'better-reviews-personal-likes', array( $this, 'render_personal_likes_icon' ) );
    }

    public function register_filters() {
		add_filter(
			'better_reviews_like_icon_filter',
			array( $this, 'like_icon_filter' ),
			10,
			3
		);

		add_filter(
			'better_reviews_personal_likes_icon_filter',
			array( $this, 'personal_likes_icon_filter' ),
			10,
			3
		);
    }

    /**
	 * Render a single Like icon. If no 'id' attribute is passed in then the current page ID is used
	 */
	public function render_like_icon( $attributes )
    {
        // If attributes are not set they come in as an empty string when using twig.
        if ( ! is_array( $attributes ) ) {
            $attributes = [];
        }

        $attributes[ 'id' ] = $attributes[ 'id' ] ?? get_the_ID();

        return apply_filters(
			'better_reviews_like_icon_filter',
			'',
			$attributes
		);
	}

	/**
	 * Filter for the [render_like_icon] shortcode
	 */
	public function like_icon_filter(
		string $content,
		array $attributes
	): string {
		return <<<EOS
            <div class="better-reviews__like" data-better-reviews-like="{$attributes['id']}">
                <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5 0C12.76 0 11.09 0.81 10 2.09C8.91 0.81 7.24 0 5.5 0C2.42 0 0 2.42 0 5.5C0 9.28 3.4 12.36 8.55 17.04L10 18.35L11.45 17.03C16.6 12.36 20 9.28 20 5.5C20 2.42 17.58 0 14.5 0ZM10.1 15.55L10 15.65L9.9 15.55C5.14 11.24 2 8.39 2 5.5C2 3.5 3.5 2 5.5 2C7.04 2 8.54 2.99 9.07 4.36H10.94C11.46 2.99 12.96 2 14.5 2C16.5 2 18 3.5 18 5.5C18 8.39 14.86 11.24 10.1 15.55Z" fill="white"></path>
                </svg>
            </div>
EOS;
	}

	/**
	 * Render a single Like icon. If no 'id' attribute is passed in then the current page ID is used
	 */
	public function render_personal_likes_icon( $attributes )
    {
        // If attributes are not set they come in as an empty string when using twig.
        if ( ! is_array( $attributes ) ) {
            $attributes = [];
        }

        $attributes[ 'id' ] = $attributes[ 'id' ] ?? get_the_ID();

        return apply_filters(
			'better_reviews_personal_likes_icon_filter',
			'',
			$attributes
		);
	}

	/**
	 * Filter for the [render_like_icon] shortcode
	 */
	public function personal_likes_icon_filter(
		string $content,
		array $attributes
	): string {
		if ( ( $attributes['display'] ?? '' ) == 'totalLikes' ) {
			$personalLikesTotalHtml = '<span class="better-reviews__personal-likes__count" data-better-reviews-personal-likes-total></span>';
		} else {
			$personalLikesTotalHtml = '';
		}

		return <<<EOS
            <div class="better-reviews__personal-likes" data-better-reviews-personal-likes>
				{$personalLikesTotalHtml}
                <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5 0C12.76 0 11.09 0.81 10 2.09C8.91 0.81 7.24 0 5.5 0C2.42 0 0 2.42 0 5.5C0 9.28 3.4 12.36 8.55 17.04L10 18.35L11.45 17.03C16.6 12.36 20 9.28 20 5.5C20 2.42 17.58 0 14.5 0ZM10.1 15.55L10 15.65L9.9 15.55C5.14 11.24 2 8.39 2 5.5C2 3.5 3.5 2 5.5 2C7.04 2 8.54 2.99 9.07 4.36H10.94C11.46 2.99 12.96 2 14.5 2C16.5 2 18 3.5 18 5.5C18 8.39 14.86 11.24 10.1 15.55Z" fill="white"></path>
                </svg>
            </div>
EOS;
	}

}
