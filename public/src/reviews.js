import reviews from './modules/reviews';
import reviewModal from './modules/review-modal';

window.addEventListener('DOMContentLoaded', () => {
	reviewModal.init();
	reviews.init();
});
