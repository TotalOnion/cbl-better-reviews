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

    const ERROR_NO_VALID_SUBCRITERIA_DATA          = 10002;

	private int $post_id;

	public function __construct( int $post_id ) {
		$this->post_id = $post_id;
		$this->init();
	}

    public function get_post_id(): int
    {
        return $this->post_id;
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
    }

    /**
	* Fetch the total number of likes for a Post
	*
	* @since    1.0.0
	* @access   private
	*/
	public function validate_payload( \stdClass $payload )
	{
        $hasAtLeastOneValidSubcriteria = false;

        foreach ( $this->options['subtype'] as $subtype ) {
            if ( property_exists( $payload, $subtype['product_subtype_id'] ) ) {
                $hasAtLeastOneValidSubcriteria = true;
            }
        }

        if ( ! $hasAtLeastOneValidSubcriteria ) {
            throw new \Exception(
                __( 'Either no subcriteria data has been sent, or the subcriteria keys did not match the config for this Entity', 'CBL Better Reviews: API' ),
                self::ERROR_NO_VALID_SUBCRITERIA_DATA
            );
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
        $total = 0;
        $count = 0;
        foreach ( $this->options['subtype'] ?? [] as $subtype ) {
            $subcriteria_total_key = 'total_' . $subtype['product_subtype_id'];
            $subcriteria_total = (float)get_post_meta( $this->post_id, $subcriteria_total_key, true );

            $subcriteria_count_key = 'count_' . $subtype['product_subtype_id'];
            $subcriteria_count = (int)get_post_meta( $this->post_id, $subcriteria_count_key, true );

            $total += $subcriteria_total;
            $count += $subcriteria_count;

            $response[$subtype['product_subtype_id']] = array(
                'total' => (float)$subcriteria_total,
                'count' => (int)$subcriteria_count,
            );
        }

        $response['totals'] = array(
            'total' => $total,
            'count' => $count,
        );

        return $response;
    }
}
