// This is where it all goes :)
var scrollSpy = new bootstrap.ScrollSpy(document.getElementById('content'), {
  target: document.getElementById('playbook_menu'),
  method: 'position'
});

const backToTopButton = document.querySelector('[data-js-hook="back-to-top-button"]');
const focusableElements = document.querySelectorAll('a');

const scrollOptions = {
  top: 0,
  left: 0,
  behavior: 'smooth'
};

const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;

function moveToTop(event) {
  event.preventDefault();

  // Scroll to top.
  supportsNativeSmoothScroll ? window.scrollTo(scrollOptions) : window.scrollTo(scrollOptions.left, scrollOptions.top);

  // Focus the first focusable element.
  focusableElements[0].focus({
    preventScroll: true,
  });
  focusableElements[0].blur();
  return false;
}
backToTopButton.addEventListener('click', moveToTop);