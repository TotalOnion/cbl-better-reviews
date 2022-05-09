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
class Cbl_Better_Reviews_Review_Collection {

    const ERROR_MISSING_OR_INVALID_CONFIG = 'ERROR_MISSING_OR_INVALID_CONFIG';

    /**
	* Fetch the options and settings for this review type
	*
	* @since    1.0.0
	* @access   public
	*/
    public function load( array $post_ids ) {
        $response = array();
        foreach ( $post_ids as $post_id ) {
            $post_id = (int)$post_id;
            if ( ! $post_id ) {
                continue;
            }

            $review_scores = $this->load_review( $post_id );
            if ( $review_scores ) {
                $response[ $post_id ] = $review_scores;
            }
        }

        return $response;
    }

    /**
	 * Load the averages for this post
	 *
	 * @since    1.0.0
	 * @access   public
	 */
    private function load_review( int $post_id ): array
    {
        $post_type = get_post_type( $post_id );
        $options = get_option(
            CBL_BETTER_REVIEWS_NAME . '_' . $post_type
        );

        if (
            ! $post_type
            || ! $options
            || ! is_array( $options['subtype'] )
            || empty( $options['subtype'] )
        ) {
            return array();
        }

        $response = array();
        $total = 0;
        $count = 0;
        foreach ( $options['subtype'] as $subtype ) {
            $subcriteria_total_key = 'total_' . $subtype['product_subtype_id'];
            $subcriteria_total = (float)get_post_meta( $post_id, $subcriteria_total_key, true );

            $subcriteria_count_key = 'count_' . $subtype['product_subtype_id'];
            $subcriteria_count = (int)get_post_meta( $post_id, $subcriteria_count_key, true );

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
