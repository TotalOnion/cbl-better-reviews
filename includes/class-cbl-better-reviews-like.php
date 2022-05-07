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
class Cbl_Better_Reviews_Like {

	private const POST_META_KEY = 'cbl-better-reviews_likes';

	private int $post_id;
	private int $likes = 0;

	public function __construct( int $post_id ) {
		$this->post_id = $post_id;
		$this->load();
	}

	/**
	* Fetch the total number of likes for a Post
	*
	* @since    1.0.0
	* @access   private
	*/
	private function load()
	{
		$this->likes = (int)get_post_meta( $this->post_id, self::POST_META_KEY, true );

		// **TODO**: We need to load the localisations of this post, and add the likes together
		// if we are on a multilingual site.
	}

	public function increment()
	{
		update_post_meta( $this->post_id, self::POST_META_KEY, ++$this->likes );
	}

	public function decrement()
	{
		if( $this->likes <= 0 ) {
			return;
		}
		update_post_meta( $this->post_id, self::POST_META_KEY, --$this->likes );
	}

	/**
	 * Return an associative array containing the ID and total likes
	 *
	 * @since    1.0.0
	 * @access   public
	 * @return   array
	 */
	public function to_array() {
		$object = new \StdClass;
		$object->id = '';
		$object->likes = $this->likes;
		return [
			'id'        => $this->post_id,
			'likes'     => $this->likes,
			'post_type' => get_post_type($this->post_id),
		];
	}
}
