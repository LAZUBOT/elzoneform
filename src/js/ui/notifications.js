export function showNotification(text) {
  const el = document.getElementById('notification');
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 3000);
}
