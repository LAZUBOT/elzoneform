export function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const icon = document.querySelector('#themeBtn i');
  if (document.body.classList.contains('dark')) {
    icon.className = 'fas fa-sun';
    return;
  }
  icon.className = 'fas fa-moon';
}
