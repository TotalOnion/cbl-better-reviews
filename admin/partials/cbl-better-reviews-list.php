<div>
	<input
		type="button"
		class="button-secondary"
		value="<?php _e('Add a Quality', 'cbl-better-reviews') ?>"
		onclick="<?php echo $type; ?>_add_field();"
	/>
	<table class="table" id="<?php echo $type; ?>_field_container">
		<?php $this->renderSubtypes( $type, $section_name, $subtypes ); ?>
	</table>
</div>


<script>
function <?php echo $type; ?>_add_field() {
	const parent = document.getElementById("<?php echo $type; ?>_field_container");
	const total_text = parent.querySelectorAll("tr").length;

	const row = document.createElement('tr');
	parent.appendChild(row);

	const input1 = document.createElement('input');
	input1.setAttribute("type", "text");
	input1.setAttribute("name", "<?php echo $section_name; ?>[subtype]["+total_text+"][<?php echo $type; ?>_subtype]");
	input1.setAttribute("class", "regular-text");
	input1.setAttribute("placeholder", "Label, eg 'Quality'");
	const cell1 = document.createElement('td');
	cell1.appendChild(input1);

	const input2 = document.createElement('input');
	input2.setAttribute("type", "text");
	input2.setAttribute("name", "<?php echo $section_name; ?>[subtype]["+total_text+"][<?php echo $type; ?>_subtype_name]");
	input2.setAttribute("class", "regular-text");
	input2.setAttribute("placeholder", "Description, eg 'How would you rate the quality?'");
	const cell2 = document.createElement('td');
	cell2.appendChild(input2);

	const label = document.createElement('label');
	label.setAttribute("for", "<?php echo $section_name; ?>[subtype]["+total_text+"][<?php echo $type; ?>_subtype_required]");
	label.textContent = 'Required';

	const input3 = document.createElement('input');
	input3.setAttribute("type", "checkbox");
	input3.setAttribute("name", "<?php echo $section_name; ?>[subtype]["+total_text+"][<?php echo $type; ?>_subtype_required]");
	input3.setAttribute("value", 1);

	const cell3 = document.createElement('td');
	cell3.appendChild(label);
	cell3.appendChild(input3);

	const button = document.createElement('BUTTON');
	var button_text = document.createTextNode("Remove");
  	button.appendChild(button_text);
	button.classList.add("button-secondary");
    button.addEventListener('click', (event) => {
		const rowToRemove = event.target.closest('tr');
		rowToRemove.parentNode.removeChild(rowToRemove);
	});
	const cell4 = document.createElement('td');
	cell4.appendChild(button);

	row.appendChild(cell1);
	row.appendChild(cell2);
	row.appendChild(cell3);
	row.appendChild(cell4);
}

function cblbr_remove_field(targetId) {
	const rowToRemove = document.getElementById(targetId);
	rowToRemove.parentNode.removeChild(rowToRemove);
}
</script>
