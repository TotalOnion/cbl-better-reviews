<div class="tab-content<?php echo $is_first_tab ? '' : ' hidden'; ?>">
    <table class="table">
		<?php foreach ( $fieldset as $field_value => $field_options ): ?>
            <tr>
                <td>
                    <label for="<?php echo $section_name;?>[<?php echo $field_value; ?>]">
                        <?php echo $field_options['label']; ?>
                    </label>
                </td>
                <td>
                    <?php if( $field_options['type'] == 'textarea' ): ?>
                        <?php 
                            wp_editor(
                                $options[ $field_value ] ?? '',
                                sprintf( '%s[%s]', $section_name, $field_value ),
                                array(
                                    'media_buttons' => false
                                )
                            );
                        ?>
					<?php elseif(  $field_options['type'] == 'text' ): ?>
						<input
							type="text"
							class="regular-text"
							name="<?php echo $section_name; ?>[<?php echo $field_value; ?>]"
							value="<?php echo $options[ $field_value ] ?? ''; ?>"
							placeholder="<?php echo $field_options['placeholder']; ?>"
						/>
                    <?php endif; ?>

                    <?php if( $field_options['explanation'] ?? false ): ?>
                        <p><?php echo $field_options['explanation']; ?></p>
                    <?php endif; ?>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
</div>
