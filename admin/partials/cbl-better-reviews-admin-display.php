<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://heavyweightagency.co.uk/
 * @since      1.0.0
 *
 * @package    Cbl_Better_Reviews
 * @subpackage Cbl_Better_Reviews/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap" data-better-review-settings>
    <h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
	<form method="post" action="options.php">
		<?php
			settings_fields($this->plugin_name);
			do_settings_sections($this->plugin_name);
			submit_button();
		?>
	</form>

	<h2>Review settings for each Post Type</h2>
	<form method="post" action="options.php">
		<?php
			$post_section_group = $this->plugin_name.'_settings';
			settings_fields($post_section_group);
			do_settings_sections($post_section_group);
			submit_button();
		?>
	</form>
</div>
