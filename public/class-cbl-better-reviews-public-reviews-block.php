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

/**
 * The class that powers the gutenberg block
 *
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/public
 * @author     Heavyweight <enquiries@heavyweightagency.co.uk>
 */
class Cbl_Better_Reviews_Public_Reviews_Block {
	
		const FORCE_ADD_JS_TO_PAGE = true;
		const JS_SCRIPT_LOCATION   = 'js/reviews.js';
	
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
		public function __construct($plugin_name, $version)
		{
			$this->plugin_name = $plugin_name;
			$this->version     = $version;
			$this->script_url  = plugins_url( self::JS_SCRIPT_LOCATION, __DIR__ . '..' );
		}

		public function setup()
		{
			// Add shortcodes
			add_shortcode(
				'better-reviews',
				array( $this, 'render_shortcode' )
			);

			add_shortcode(
				'better-reviews-page-title',
				array( $this, 'render_page_title' )
			);

			// Add filters for the main shortcode
			add_filter(
				'better_reviews_review_block_filter',
				array( $this, 'review_block_filter' ),
				10,
				3
			);
		}
	
		/**
		 * Enqueue the js
		 *
		 * @since    1.0.0
		 */
		public function enqueue_scripts()
		{
			$this->add_js_to_footer();
		}
	
		/**
		 * Add the local js to footer, if there is a block on the page, or the shortcode is used
		 */
		public function add_js_to_footer(bool $force_add_to_page = false)
		{
			// don't bother doing the checks below if the script has already been enqueued
			if ( wp_script_is( self::JS_SCRIPT_LOCATION, 'enqueued' ) ) {
				return;
			}
	
			// If we're not forcing the js to be added to the page (via a shortcode),
			// make sure there is a BetterReviews gutenberg block. If there isn't one,
			// we don't need the script
			if (!$force_add_to_page) {
				$block_found = false;
	
				// If better-reviews block is not in the block then don't include the js
				if ( ! is_admin() ) {
					$post = get_post();
					if (has_blocks($post->post_content)) {
						$blocks = parse_blocks( $post->post_content );
						foreach ( $blocks as $block ) {
							if ( in_array( $this->plugin_name . '/better-reviews', $block ) ) {
								$block_found = true;
								break;
							}
						}
					}
				}
	
				if ( ! $block_found ) {
					return;
				}
			}

			// If a value is set we print the javascript in the footer
			wp_enqueue_script(
				self::JS_SCRIPT_LOCATION,
				$this->script_url,
				array(),
				$this->version,
				true
			);

			wp_localize_script(
				self::JS_SCRIPT_LOCATION,
				'betterReviewsConfig',
				array(
					'currentPageId' => get_the_id() ?? false
				)
			);
		}
	
		public function render_block( $attributes, $content ): string
		{
			$attributes = $this->parse_attributes( $attributes );
			if ( is_wp_error($attributes) ) {
				throw new \Exception( $attributes->get_error_code() );
			}

			// TODO; the attributes are not getting pulled through from gutenberg for some reason
			// this sets the default back.
			if ( ! $attributes['display_full'] && ! $attributes['stars'] ) {
				$attributes['display_full'] = true;
			}

			if ( is_wp_error($attributes) ) {
				return '';
			}

			return apply_filters(
				'better_reviews_review_block_filter',
				$content,
				$attributes
			);
		}

		/**
		 * Add in default values for the params, and hydrate the $attributes with
		 * the settings from the plugin.
		 */
		private function parse_attributes( array $attributes = array() )
		{
			$attributes = shortcode_atts(
				array(
					'post_id'       => get_the_ID(),
					'display_full'  => false,
					'stars'         => false,
					'review_count'  => false,
				),
				$attributes,
				'better-reviews'
			);

			$attributes['post_type'] = get_post_type( $attributes['post_id'] );
			if (!$attributes['post_type']) {
				return new WP_Error('Bad post_id. No matching post_type');
			}

			$attributes['options'] = get_option( $this->plugin_name . '_' . $attributes['post_type'] );
			if (!$attributes['options']) {
				return new WP_Error(
					sprintf( 'Bad or missing Better Reviews config for post_type %s', $attributes['post_type'] )
				);
			}

			return $attributes;
		}
	
		/**
		 * BetterReviews shortcode in the form:
		 * [better-reviews post_id="44508001" display="full"]
		 * @since 1.0.0
		 * @param array $attributes
		 * @return string
		 */
		public function render_shortcode( array $attributes = array() ): string
		{
			// move the display array into the attributes proper
			$types = array_map(
				function ( $type ) {
					return trim( strtolower( $type ) );
				},
				explode( ',', $attributes['display'] )
			);
	
			foreach ($types as $type) {
				$attributes[$type] = true;
			}
			unset($attributes['display']);

			// hydrate the attributes with the config from the admin
			$attributes = $this->parse_attributes( $attributes );
			if ( is_wp_error($attributes) ) {
				return __(
					'Better Reviews is installed and the block or shortcode has been added to the page, but the criteria have not been setup for this post type. Please configure the plugin in the admin',
					'cbl-better-reviews-admin'
				);
			}

			$this->add_js_to_footer(self::FORCE_ADD_JS_TO_PAGE);
	
			// Return the bazaar voice code if we have an id
			return apply_filters(
				'better_reviews_review_block_filter',
				'',
				$attributes
			);
		}
	
		/**
		 * Filter for the shortcode and Gutenberg block output
		 */
		public function review_block_filter(
			string $content,
			array $attributes
		): string {
			
			$title = __( $attributes['options']['review_label'], 'cbl-better-reviews' );

			if ($attributes['display_full']) {
				$criteria_html  = $this->render_review_criteria( $attributes );
				$averages_html     = $this->render_review_averages( $attributes );
				$cta_label         = __( $attributes['options']['cta_label'], 'cbl-better-reviews' );
				$review_modal_html = $this->render_review_modal_template( $attributes );

				return <<<EOS
					<section
						class="better-reviews__review better-reviews__review-{$attributes['post_type']}"
						data-better-reviews-review-id="{$attributes['post_id']}"
					>
						<h2 class="better-reviews__review-title">{$title}</h2>
						<div class="better-reviews__review-breakdown">
							<div class="better-reviews__criterias">
								$criteria_html
							</div>
							<div class="better-reviews__average">
								$averages_html
							</div>
						</div>
						<div class="better-reviews__cta-container">
							<button
								class="better-reviews__cta"
								data-better-reviews-modal-toggle="open"
							>{$cta_label}</button>
						</div>
						{$review_modal_html}
					</section>
EOS;
			}



			$starsHtml = '';
			if ( $attributes['stars'] ) {
				$starsHtml = '<div class="better-reviews__criteria-stars" data-better-reviews-review-average-stars></div>';
			}

			$reviewCountHtml = '';
			if ( $attributes['review_count'] ) {
				$review_count_label = __(
					$attributes['options']['review_count'],
					'cbl-better-reviews'
				);
				$reviewCountHtml = '<div class="better-reviews__criteria-review-count"><span data-better-reviews-average-review-count></span> ' . $review_count_label . '</div>';
			}

			return <<<EOS
				<div
					class="better-reviews__review  better-reviews__review-{$attributes['post_type']}"
					data-better-reviews-review-id="{$attributes['post_id']}"
				>
					<div class="better-reviews__average" data-better-reviews-review-average>
						$starsHtml
						$reviewCountHtml
					</div>
				</div>
EOS;
	}

	private function render_review_criteria( array $attributes ): string
	{
		$html = '';
		$criteria_not_yet_reviewed_label = addslashes(
			__(
				$attributes['options']['criteria_not_yet_reviewed'] ?? '',
				'cbl-better-reviews'
			)
		);

		if ( is_array( $attributes['options']['subtype'] ?? false ) ) {
			foreach ( $attributes['options']['subtype'] as $criteria ) {
				$criteria_label = __(
					$criteria[ $attributes['post_type'] . '_subtype' ] ?? '',
					'cbl-better-reviews'
				);

				$criteria_id = $criteria[ $attributes['post_type'] . '_subtype_id' ];
				$review_count_label = __(
					$attributes['options']['review_count'] ?? '',
					'cbl-better-reviews'
				);

				$html .= <<<EOS
					<div
						class="better-reviews__criteria"
						data-better-reviews-criteria-id="{$criteria_id}"
						data-better-reviews-criteria-not-yet-reviewed-label="{$criteria_not_yet_reviewed_label}"
					>
						<h4
							class="better-reviews__criteria-label"
						>
							{$criteria_label}
						</h4>
						<h3
							class="better-reviews__criteria-score"
							data-better-reviews-criteria-score
						></h3>
						<div
							class="better-reviews__criteria-stars"
							data-better-reviews-criteria-stars
						></div>
						<h5
							class="better-reviews__criteria-review-count"
						>
							(<span data-better-reviews-criteria-review-count>0</span> {$review_count_label})
						</h5>
					</div>
	EOS;
			}
		} else {
			$setup_error_message = __(
				'There are no criteria setup. Please configure the reviews plugin for this post type.',
				'cbl-better-reviews-admin'
			);

			$html = '<div class="better-reviews__setup-error">' . $setup_error_message . '</div>';
		}

		return $html;
	}

	private function render_review_averages( array $attributes ): string
	{
		$html = '';
		$criteria_not_yet_reviewed_label = addslashes(
			__(
				$attributes['options']['criteria_not_yet_reviewed'] ?? '',
				'cbl-better-reviews'
			)
		);
		$label = __(
			$attributes['options']['average_score_label'] ?? '',
			'cbl-better-reviews'
		);
		$review_count_label = __(
			$attributes['options']['review_count'] ?? '',
			'cbl-better-reviews'
		);

		$html .= <<<EOS
			<div
				class="better-reviews__averages"
				data-better-reviews-criteria-not-yet-reviewed-label="{$criteria_not_yet_reviewed_label}"
				data-better-reviews-review-average
			>
				<h4
					class="better-reviews__criteria-label"
				>
					{$label}
				</h4>
				<h3
					class="better-reviews__criteria-score"
					data-better-reviews-review-average-score
				></h3>
				<div
					class="better-reviews__criteria-stars"
					data-better-reviews-review-average-stars
				></div>
				<h5
					class="better-reviews__criteria-review-count"
				>
					(<span data-better-reviews-average-review-count>0</span> {$review_count_label})
				</h5>
			</div>
EOS;

		return $html;
	}

	private function render_review_modal_template( array $attributes ): string
	{
		$modal_title = __(
			$attributes['options']['review_modal_title'] ?? '',
			'cbl-better-reviews'
		);

		$error_message = __(
			$attributes['options']['review_error_message'] ?? '',
			'cbl-better-reviews'
		);

		$submit_label = __(
			$attributes['options']['review_submit_label'] ?? '',
			'cbl-better-reviews'
		);

		$criteria_html = '';
		if ( is_array($attributes['options']['subtype'] ?? false) ) {
			foreach ( $attributes['options']['subtype'] ?? [] as $criteria ) {
				$criteria_label = __(
					$criteria[ $attributes['post_type'] . '_subtype' ],
					'cbl-better-reviews'
				);
				$criteria_description = __(
					$criteria[ $attributes['post_type'] . '_subtype_name' ],
					'cbl-better-reviews'
				);

				$criteria_id = $criteria[ $attributes['post_type'] . '_subtype_id' ];
				$field_name = $criteria_id;

				$criteria_html .= <<<EOS
					<div class="better-reviews__modal-criteria">
						<h4 class="better-reviews__criteria-label">
							{$criteria_label}
						</h4>
						<div class="better-reviews__criteria-stars" data-better-reviews-modal-criteria-stars>
							<label aria-label="0.5 stars" class="rating__label rating__label--half" for="{$field_name}-05"><i class="rating__icon rating__icon--star fa fa-star-half"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-05" value="0.5" type="radio">
							<label aria-label="1 star" class="rating__label" for="{$field_name}-10"><i class="rating__icon rating__icon--star fa fa-star"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-10" value="1" type="radio">
							<label aria-label="1.5 stars" class="rating__label rating__label--half" for="{$field_name}-15"><i class="rating__icon rating__icon--star fa fa-star-half"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-15" value="1.5" type="radio">
							<label aria-label="2 stars" class="rating__label" for="{$field_name}-20"><i class="rating__icon rating__icon--star fa fa-star"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-20" value="2" type="radio">
							<label aria-label="2.5 stars" class="rating__label rating__label--half" for="{$field_name}-25"><i class="rating__icon rating__icon--star fa fa-star-half"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-25" value="2.5" type="radio">
							<label aria-label="3 stars" class="rating__label" for="{$field_name}-30"><i class="rating__icon rating__icon--star fa fa-star"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-30" value="3" type="radio">
							<label aria-label="3.5 stars" class="rating__label rating__label--half" for="{$field_name}-35"><i class="rating__icon rating__icon--star fa fa-star-half"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-35" value="3.5" type="radio">
							<label aria-label="4 stars" class="rating__label" for="{$field_name}-40"><i class="rating__icon rating__icon--star fa fa-star"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-40" value="4" type="radio">
							<label aria-label="4.5 stars" class="rating__label rating__label--half" for="{$field_name}-45"><i class="rating__icon rating__icon--star fa fa-star-half"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-45" value="4.5" type="radio">
							<label aria-label="5 stars" class="rating__label" for="{$field_name}-50"><i class="rating__icon rating__icon--star fa fa-star"></i></label>
							<input data-better-reviews-modal-star-rating-input class="rating__input" name="{$field_name}" id="{$field_name}-50" value="5" type="radio">
						</div>
						<p class="better-reviews__criteria-description">
							{$criteria_description}
						</p>
					</div>
EOS;
			}
		} else {
			$setup_error_message = __(
				'There are no criteria setup. Please configure the reviews plugin for this post type.',
				'cbl-better-reviews-admin'
			);

			$criteria_html = '<div class="better-reviews__setup-error">' . $setup_error_message . '</div>';
		}

		$thank_you_message = __(
			$attributes['options']['review_thank_you'] ?? '',
			'cbl-better-reviews'
		);

		$close_label = __(
			$attributes['options']['review_modal_close_label'] ?? '',
			'cbl-better-reviews'
		);

		$html = <<<EOS
			<template>
				<div class="better-reviews__modal" data-better-reviews-modal-review-id="{$attributes['post_id']}">
					<form class="better-reviews__modal-inner better-reviews__modal-form">
						<span class="better-reviews__modal-close" data-better-reviews-modal-toggle="close">x</span>
						<div class="better-reviews__modal-content">
							<div class="better-reviews__modal-error">$error_message</div>
							<h3 class="better-reviews__modal-title">$modal_title</h3>
							{$criteria_html}
							<button class="better-reviews__modal-submit" data-better-reviews-modal-submit disabled>
								{$submit_label}
							</button>
						</div>
					</form>
					<div class="better-reviews__modal-inner better-reviews__modal-thank-you">
						<span class="better-reviews__modal-close" data-better-reviews-modal-toggle="close">x</span>
						<div class="better-reviews__modal-content">
							{$thank_you_message}
							<button class="better-reviews__modal-submit" data-better-reviews-modal-toggle="close">
								{$close_label}
							</button>
						</div>
					</div>
				</div>
			</template>
EOS;

		return $html;
	}

	public function render_page_title()
	{
		return get_the_title();
	}
}
