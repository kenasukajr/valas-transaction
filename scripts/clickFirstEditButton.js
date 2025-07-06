/**
 * Run this script in the browser console on the nasabah page.
 * It clicks the first Edit button found by data-testid attribute.
 */
(function clickFirstEditButton() {
  const button = document.querySelector('button[data-testid^="edit-button-"]');
  if (button) {
    button.click();
    console.log('Clicked first Edit button:', button.getAttribute('data-testid'));
  } else {
    console.warn('No Edit button found');
  }
})();
