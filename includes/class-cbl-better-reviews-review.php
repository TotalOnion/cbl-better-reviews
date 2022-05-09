<?php

/**
 * An object defining the likes on a Post
 *
 * @link       https://heavyweightagency.co.uk/
 * @since      1.0.0
 *
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/includes
 * @author     Heavyweight <enquiries@heavyweightagency.co.uk>
 */
class Cbl_Better_Reviews_Review {

    const ERROR_MISSING_OR_INVALID_CONFIG = 'ERROR_MISSING_OR_INVALID_CONFIG';
    const ERROR_MISSING_OR_UNKNOWN_SUBCRITERIA_KEY = 'ERROR_MISSING_OR_UNKNOWN_SUBCRITERIA_KEY';

	private int $post_id;

	public function __construct( int $post_id ) {
		$this->post_id = $post_id;
		$this->init();
	}

    /**
	* Fetch the options and settings for this review type
	*
	* @since    1.0.0
	* @access   private
	*/
    private function init() {
        $this->post_type = get_post_type( $this->post_id );
        $this->options = get_option(
            CBL_BETTER_REVIEWS_NAME . '_' . $this->post_type
        );

        if (
            ! $this->post_type
            || ! $this->options
            || ! is_array( $this->options['subtype'] )
            || empty( $this->options['subtype'] )
        ) {
            throw new \Exception(
                __( 'Missing or invalid configuration.', 'CBL Better Reviews: API' ),
                self::ERROR_MISSING_OR_INVALID_CONFIG
            );
        }
    }

    /**
	* Fetch the total number of likes for a Post
	*
	* @since    1.0.0
	* @access   private
	*/
	public function validate_payload( \stdClass $payload )
	{
        foreach ( $this->options['subtype'] as $subtype ) {
            if (
                ! array_key_exists( 'product_subtype_id', $subtype )
                || ! property_exists( $payload, $subtype['product_subtype_id'] )
            ) {
                throw new \Exception(
                    __( 'The subcriteria key submitted to the review does not match any known key for this review type.', 'CBL Better Reviews: API' ),
                    self::ERROR_MISSING_OR_UNKNOWN_SUBCRITERIA_KEY
                );
            }
        }
	}

	/**
	 * Submit a review
	 *
	 * @since    1.0.0
	 * @access   public
	 */
	public function save( \stdClass $payload )
	{
        foreach ( $this->options['subtype'] as $subtype ) {
            // Check if this subcriteria has been sent
            if ( $payload->{$subtype['product_subtype_id']} ?? false) {
                // Update the total value
                $subcriteria_total_key     = 'total_' . $subtype['product_subtype_id'];
                $current_subcriteria_total = (float)get_post_meta( $this->post_id, $subcriteria_total_key, true );
                update_post_meta(
                    $this->post_id,
                    $subcriteria_total_key,
                    $current_subcriteria_total + (float)$payload->{$subtype['product_subtype_id']}
                );

                // Update the number of votes
                $subcriteria_count_key     = 'count_' . $subtype['product_subtype_id'];
                $current_subcriteria_count = (int)get_post_meta( $this->post_id, $subcriteria_count_key, true );
                update_post_meta(
                    $this->post_id,
                    $subcriteria_count_key,
                    $current_subcriteria_count + 1
                );
            }
        }

        return $this->load();
	}

    /**
	 * Load the averages for this post
	 *
	 * @since    1.0.0
	 * @access   public
	 */
    public function load(): array
    {
        $response = array();
        foreach ( $this->options['subtype'] as $subtype ) {
            $subcriteria_total_key = 'total_' . $subtype['product_subtype_id'];
            $subcriteria_total = (float)get_post_meta( $this->post_id, $subcriteria_total_key, true );

            $subcriteria_count_key = 'count_' . $subtype['product_subtype_id'];
            $subcriteria_count = (int)get_post_meta( $this->post_id, $subcriteria_count_key, true );

            $response[$subtype['product_subtype_id']] = array(
                'total' => (float)$subcriteria_total,
                'count' => (int)$subcriteria_count,
            );
        }

        return $response;
    }
}
