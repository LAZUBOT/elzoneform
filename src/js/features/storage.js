import { STORAGE_KEY } from '../core/constants.js';
import { collectTableData } from './tables.js';
import { showNotification } from '../ui/notifications.js';

function currentMeta() {
  return {
    date: document.getElementById('creation-date').textContent,
    id: document.getElementById('form-id').textContent
  };
}

export function saveForm() {
  const { expansion, poles } = collectTableData();
  const payload = {
    expansion,
    poles,
    metadata: currentMeta()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  showNotification('تم حفظ المسودة في المتصفح');
}

export function exportJSON() {
  saveForm();
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) {
    return;
  }

  const blob = new Blob([rawData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Telecom_Expansion_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function loadSavedForm() {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) {
    return null;
  }

  try {
    return JSON.parse(rawData);
  } catch {
    return null;
  }
}
