window.addEventListener('DOMContentLoaded', () => {
    const adminPanel = document.querySelector('[data-better-review-settings]');
    if (!adminPanel) {
        return;
    }

    adminPanel
        .querySelectorAll('.nav-tab')
        .forEach((tabElement) => {
            tabElement.addEventListener('click', (event) => {
                event.preventDefault();

                if (event.target.classList.contains('nav-tab-active')) {
                    return;
                }

                const containerElement = event.target.closest('form');
                const targetIndex = [...event.target.parentElement.children].indexOf(event.target) + 1;

                // remove the active class from the nav tabs, and add it to this one
                containerElement.querySelectorAll('.nav-tab-active').forEach(tabElement => tabElement.classList.remove('nav-tab-active'));
                event.target.classList.add('nav-tab-active');

                // Hide all the tabs and unhide the one we want to now show
                containerElement.querySelectorAll('.tab-content').forEach(tabElement => tabElement.classList.add('hidden'));
                containerElement.querySelector(`.tab-content:nth-of-type(${targetIndex})`).classList.remove('hidden');
            });
        })
	;
});
