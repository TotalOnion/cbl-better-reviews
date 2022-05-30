/* This section of the code registers a new block, sets an icon and a category, and indicates what type of fields it'll include. */
wp.blocks.registerBlockType('cbl-better-reviews/better-reviews', {
	title: 'BetterReviews',
	icon: 'dashicons dashicons-text',
	category: 'text',
	attributes: {
		//post_id: { type: 'string' },
		display_full: { type: 'boolean', default: true },
 		stars: { type: 'boolean', default: false },
		review_count: { type: 'boolean', default: false },
	},

	/*
	* The edit function describes the structure of your block in the context of the editor.
	* This represents what the editor will render when the block is used.
	* https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
	*/

	/* This configures how the content and color fields will work, and sets up the necessary elements */
	edit: function(props) {

		//var content = props.attributes.bazaarvoice_product_id;

		function onChangeCheckbox(e) {
			let attr_name = e.target.name,
			attr_key = attr_name.substring((attr_name.lastIndexOf('-')+1), attr_name.length);
			props.setAttributes({[attr_key]: e.target.checked});
		}

		/*
		function onChangeContent( e ) {
			props.setAttributes( { bazaarvoice_product_id: e.target.value } );
		}
		*/

		return React.createElement(
			'div',
			{ className: 'better-reviews-block' },
			'',
			React.createElement(
				'div',
				{ className: 'components-placeholder__label' },
				'BetterReviews',
			),
			/*
			React.createElement(
				'div',
				{ className: 'components-placeholder__instructions' },
				'Object to review',
			),
			
			React.createElement('p', {}),
			React.createElement(
			'input',
			{
				type: "text",
				value: props.attributes.post_id,
				onChange: onChangeContent,
				name:'bazaarvoice',
				placeholder: 'BazaarVoice Product Id',
				class: 'bazaarvoice-input'
			}),
			*/
			React.createElement('p', {}, 'Display Type'),
			React.createElement(
				'input',{
					type: 'checkbox',
					defaultChecked: props.attributes.display_full,
					label: 'Display full review block',
					name: 'display_full',
					id: 'display_full',
					onChange: onChangeCheckbox,
				}
			),
			React.createElement('label', {}, 'Display full'),
			
			React.createElement('p'),
			React.createElement(
				'input',{
					type: 'checkbox',
					defaultChecked: props.attributes.stars,
					label: 'Average stars',
					name: 'stars',
					id: 'stars',
					onChange: onChangeCheckbox,
				}
			),
			React.createElement('label', {}, 'Average stars'),

			React.createElement('p'),
			React.createElement(
				'input',{
					type: 'checkbox',
					defaultChecked: props.attributes.review_count,
					label: 'Review count',
					name: 'review_count',
					id: 'review_count',
					onChange: onChangeCheckbox,
				}
			),
			React.createElement('label', {}, 'Review count'),
			/*
			React.createElement('p'),
			React.createElement(
				'input',{
					type: 'checkbox',
					defaultChecked: props.attributes.reviews,
					label: 'Reviews',
					name: 'reviews',
					id: 'reviews',
					onChange: onChangeCheckbox,
				}
			),
			React.createElement('label', {}, 'Reviews'),
			React.createElement('p'),
			React.createElement(
				'input',{
					type: 'checkbox',
					defaultChecked: props.attributes.review_highlights,
					label: 'Review highlights',
					name: 'review_highlights',
					id: 'review_highlights',
					onChange: onChangeCheckbox,
				}
			),
			React.createElement('label', {}, 'Review highlights'),
			React.createElement('p'),
			React.createElement(
				'input',{
					type: 'checkbox',
					defaultChecked: props.attributes.inline_rating,
					label: 'Inline rating',
					name: 'inline_rating',
					id: 'inline_rating',
					onChange: onChangeCheckbox,
				}
			),
			React.createElement('label', {}, 'Inline rating'),
			*/
		);
	},

	/*
	* The save function defines the way in which the different
	* attributes should be combined into the final markup,
	* which is then serialized into post_content.
	* https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
	*/

	save: () => null
});
