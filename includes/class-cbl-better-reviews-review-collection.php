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

            $review = new \Cbl_Better_Reviews_Review( $post_id );
            $review_scores = $review->load();
            if ( $review_scores ) {
                $response[ $post_id ] = $review_scores;
            }
        }

        return $response;
    }
}
