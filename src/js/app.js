import { APP_STATE, TABLE_IDS } from './core/constants.js';
import { addRow, bindTableEvents } from './features/tables.js';
import { saveForm, exportJSON, loadSavedForm } from './features/storage.js';
import { toggleDarkMode } from './features/theme.js';
import { confirmReset } from './features/reset.js';
import { FAT_NAMES, buildZoneContractorMap, loadZones } from './data/zones.js';
import { showNotification } from './ui/notifications.js';

function initMetadata() {
  const creationDate = new Date().toLocaleDateString('ar-EG');
  const formId = `TEL-${Math.floor(Math.random() * 90000 + 10000)}`;

  document.getElementById('creation-date').textContent = creationDate;
  document.getElementById('form-id').textContent = formId;

  return { creationDate, formId };
}

function initDefaults() {
  for (let i = 0; i < 6; i += 1) {
    addRow(TABLE_IDS.expansion);
  }

  for (let i = 0; i < 4; i += 1) {
    addRow(TABLE_IDS.poles);
  }
}

function hydrateFromStorage(defaultMeta) {
  const savedData = loadSavedForm();
  if (!savedData) {
    initDefaults();
    return;
  }

  if (Array.isArray(savedData.expansion) && savedData.expansion.length > 0) {
    savedData.expansion.forEach((row) => addRow(TABLE_IDS.expansion, row));
  } else {
    for (let i = 0; i < 6; i += 1) {
      addRow(TABLE_IDS.expansion);
    }
  }

  if (Array.isArray(savedData.poles) && savedData.poles.length > 0) {
    savedData.poles.forEach((row) => addRow(TABLE_IDS.poles, row));
  } else {
    for (let i = 0; i < 4; i += 1) {
      addRow(TABLE_IDS.poles);
    }
  }

  const metadata = savedData.metadata || {};
  document.getElementById('creation-date').textContent = metadata.date || defaultMeta.creationDate;
  document.getElementById('form-id').textContent = metadata.id || defaultMeta.formId;
}

function bindActions() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }

    const { action } = button.dataset;

    switch (action) {
      case 'print':
        window.print();
        break;
      case 'save':
        saveForm();
        break;
      case 'export':
        exportJSON();
        break;
      case 'theme':
        toggleDarkMode();
        break;
      case 'reset':
        confirmReset();
        break;
      case 'add-expansion':
        addRow(TABLE_IDS.expansion);
        break;
      case 'add-pole':
        addRow(TABLE_IDS.poles);
        break;
      default:
        break;
    }
  });
}

async function initSettings() {
  APP_STATE.fatNames = FAT_NAMES;
  APP_STATE.zones = await loadZones();
  APP_STATE.zoneContractorMap = buildZoneContractorMap(APP_STATE.zones);
}

window.addEventListener('DOMContentLoaded', async () => {
  const defaults = initMetadata();

  try {
    await initSettings();
    hydrateFromStorage(defaults);
  } catch (error) {
    showNotification('تعذر تحميل اعدادات المناطق');
    initDefaults();
  }

  bindActions();
  bindTableEvents();
});
