import { APP_STATE, COORD_REGEX, TABLE_IDS } from '../core/constants.js';

function updateRowNumbers(tbody) {
  tbody.querySelectorAll('.row-num').forEach((cell, idx) => {
    cell.textContent = idx + 1;
  });
}

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

function contractorForZone(zoneName, fallback = '') {
  return APP_STATE.zoneContractorMap.get(zoneName) || fallback;
}

export function validateCoord(input) {
  const value = input.value.trim();
  input.style.color = value && !COORD_REGEX.test(value) ? '#ef4444' : 'inherit';
}

export function removeRow(iconElement) {
  const row = iconElement.closest('tr');
  const tbody = row.parentElement;
  row.remove();
  updateRowNumbers(tbody);
}

export function addRow(tableId, data = {}) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  const tr = document.createElement('tr');
  const rowIndex = tbody.rows.length + 1;
  const selectedZone = data.cab || APP_STATE.zones[0]?.ZoneName || '';
  const contractor = contractorForZone(selectedZone, data.contractor || '');

  if (tableId === TABLE_IDS.expansion) {
    tr.innerHTML = `
      <td class="row-num">${rowIndex}</td>
      <td><select class="zone-select">${zoneOptionsMarkup(selectedZone)}</select></td>
      <td><input type="text" class="contractor-input readonly-input" value="${contractor}" readonly /></td>
      <td><select>${fatOptionsMarkup(data.fat || APP_STATE.fatNames[0] || '')}</select></td>
      <td><input type="number" value="${data.cables || ''}" /></td>
      <td><input type="number" value="${data.users || ''}" /></td>
      <td class="btn-remove"><i class="fas fa-times row-remove" title="حذف"></i></td>
    `;
  } else {
    tr.innerHTML = `
      <td class="row-num">${rowIndex}</td>
      <td><select class="zone-select">${zoneOptionsMarkup(selectedZone)}</select></td>
      <td><input type="text" class="contractor-input readonly-input" value="${contractor}" readonly /></td>
      <td><input type="number" value="${data.users || ''}" /></td>
      <td><input type="text" value="${data.coords || ''}" placeholder="33.2, 44.1" /></td>
      <td class="btn-remove"><i class="fas fa-times row-remove" title="حذف"></i></td>
    `;
  }

  tbody.appendChild(tr);
}

export function collectTableData() {
  const expansion = [];
  const poles = [];

  document.querySelectorAll(`#${TABLE_IDS.expansion} tbody tr`).forEach((row) => {
    const zoneSelect = row.querySelector('select.zone-select');
    const otherSelects = row.querySelectorAll('select:not(.zone-select)');
    const inputs = row.querySelectorAll('input');

    expansion.push({
      cab: zoneSelect.value,
      contractor: inputs[0].value,
      fat: otherSelects[0].value,
      cables: inputs[1].value,
      users: inputs[2].value
    });
  });

  document.querySelectorAll(`#${TABLE_IDS.poles} tbody tr`).forEach((row) => {
    const zoneSelect = row.querySelector('select.zone-select');
    const inputs = row.querySelectorAll('input');

    poles.push({
      cab: zoneSelect.value,
      contractor: inputs[0].value,
      users: inputs[1].value,
      coords: inputs[2].value
    });
  });

  return { expansion, poles };
}

export function bindTableEvents() {
  document.addEventListener('click', (event) => {
    const removeIcon = event.target.closest('.row-remove');
    if (removeIcon) {
      removeRow(removeIcon);
    }
  });

  document.addEventListener('change', (event) => {
    const zoneSelect = event.target.closest('select.zone-select');
    if (!zoneSelect) {
      return;
    }

    const row = zoneSelect.closest('tr');
    const contractorInput = row.querySelector('.contractor-input');
    contractorInput.value = contractorForZone(zoneSelect.value, '');
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.closest(`#${TABLE_IDS.poles}`) && target.placeholder === '33.2, 44.1') {
      validateCoord(target);
    }
  });
}
