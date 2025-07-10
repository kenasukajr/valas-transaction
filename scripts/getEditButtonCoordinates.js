/**
 * This script can be run in the browser console on the nasabah page.
 * It finds all Edit buttons by their data-testid attribute and logs their bounding rectangle coordinates.
 */

function getEditButtonCoordinates() {
  const buttons = document.querySelectorAll('button[data-testid^="edit-button-"]');
  const coords = [];
  buttons.forEach(button => {
    const rect = button.getBoundingClientRect();
    coords.push({
      id: button.getAttribute('data-testid'),
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY + rect.height / 2
    });
  });
  console.table(coords);
  return coords;
}

// Run the function and get coordinates
getEditButtonCoordinates();
