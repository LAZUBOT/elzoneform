import { APP_STATE, COORD_REGEX, TABLE_IDS } from '../core/constants.js';

function zoneOptionsMarkup(selectedValue = '') {
  return APP_STATE.zones
    .map((zone) => `<option value="${zone.ZoneName}" ${selectedValue === zone.ZoneName ? 'selected' : ''}>${zone.ZoneName}</option>`)
    .join('');
}

function fatOptionsMarkup(selectedValue = '') {
  return APP_STATE.fatNames
    .map((fat) => `<option value="${fat}" ${selectedValue === fat ? 'selected' : ''}>${fat}</option>`)
    .join('');
}

export function validateCoord(input) {
  const value = input.value.trim();
  input.style.color = value && !COORD_REGEX.test(value) ? '#d83a3a' : 'inherit';
}

export function removeRow(iconElement) {
  iconElement.closest('tr').remove();
}

export function addRow(tableId, data = {}) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  const tr = document.createElement('tr');
  const selectedZone = data.cab || APP_STATE.zones[0]?.ZoneName || '';

  if (tableId === TABLE_IDS.expansion) {
    tr.innerHTML = `
      <td><select class="zone-select">${zoneOptionsMarkup(selectedZone)}</select></td>
      <td><select>${fatOptionsMarkup(data.fat || APP_STATE.fatNames[0] || '')}</select></td>
      <td><input type="number" value="${data.cables || ''}" /></td>
      <td><input type="number" value="${data.users || ''}" /></td>
      <td class="btn-remove print-hidden"><i class="fas fa-times row-remove" title="حذف"></i></td>
    `;
  } else {
    tr.innerHTML = `
      <td><select class="zone-select">${zoneOptionsMarkup(selectedZone)}</select></td>
      <td><input type="number" value="${data.users || ''}" /></td>
      <td><input type="text" value="${data.coords || ''}" placeholder="33.2, 44.1" /></td>
      <td class="btn-remove print-hidden"><i class="fas fa-times row-remove" title="حذف"></i></td>
    `;
  }

  tbody.appendChild(tr);
}

export function collectTableData() {
  const expansion = [];
  const poles = [];

  document.querySelectorAll(`#${TABLE_IDS.expansion} tbody tr`).forEach((row) => {
    const zoneSelect = row.querySelector('select.zone-select');
    const selects = row.querySelectorAll('select:not(.zone-select)');
    const inputs = row.querySelectorAll('input');

    expansion.push({
      cab: zoneSelect.value,
      fat: selects[0].value,
      cables: inputs[0].value,
      users: inputs[1].value
    });
  });

  document.querySelectorAll(`#${TABLE_IDS.poles} tbody tr`).forEach((row) => {
    const zoneSelect = row.querySelector('select.zone-select');
    const inputs = row.querySelectorAll('input');

    poles.push({
      cab: zoneSelect.value,
      users: inputs[0].value,
      coords: inputs[1].value
    });
  });

  return { expansion, poles };
}

export function bindTableEvents() {
  document.addEventListener('click', (event) => {
    const removeIcon = event.target.closest('.row-remove');
    if (removeIcon) removeRow(removeIcon);
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.closest(`#${TABLE_IDS.poles}`) && target.placeholder === '33.2, 44.1') {
      validateCoord(target);
    }
  });
}
