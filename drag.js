const tableContainer = document.querySelector('.records');

let isDragging = false;
let startX, scrollLeft;

// Start dragging
tableContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - tableContainer.offsetLeft;
  scrollLeft = tableContainer.scrollLeft;
  tableContainer.style.cursor = 'grabbing';
});

// Stop dragging
tableContainer.addEventListener('mouseup', () => {
  isDragging = false;
  tableContainer.style.cursor = 'grab';
});

// Prevent mouse leaving while dragging
tableContainer.addEventListener('mouseleave', () => {
  isDragging = false;
  tableContainer.style.cursor = 'grab';
});

// Dragging movement
tableContainer.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault(); // Prevent text selection

  const x = e.pageX - tableContainer.offsetLeft;
  const scrollDistance = (x - startX) * 1.5; // Adjust speed
  tableContainer.scrollLeft = scrollLeft - scrollDistance;
});
