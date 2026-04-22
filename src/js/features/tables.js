import { APP_STATE, COORD_REGEX, TABLE_IDS } from '../core/constants.js';

function escapeAttr(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeText(value = '') {
  return escapeAttr(String(value).trim());
}

function zoneOptionsMarkup(selectedValue = '') {
  return APP_STATE.zones
    .map((zone) => `<option value="${escapeAttr(zone.ZoneName)}" ${selectedValue === zone.ZoneName ? 'selected' : ''}>${escapeAttr(zone.ZoneName)}</option>`)
    .join('');
}

function fatOptionsMarkup(selectedValue = '') {
  return APP_STATE.fatNames
    .map((fat) => `<option value="${escapeAttr(fat)}" ${selectedValue === fat ? 'selected' : ''}>${escapeAttr(fat)}</option>`)
    .join('');
}


function contractorForZone(zoneName) {
  return APP_STATE.zoneContractorMap.get(zoneName) || '';
}

function setupSignatureImage(imgElement, fallbackElement, srcPath, fallbackText) {
  if (!imgElement || !fallbackElement) return;

  imgElement.style.display = 'block';
  fallbackElement.style.display = 'none';
  fallbackElement.textContent = fallbackText;
  imgElement.src = srcPath;
  imgElement.onerror = () => {
    imgElement.style.display = 'none';
    fallbackElement.style.display = 'inline-block';
  };
}

function syncAgentByZone(zoneName) {
  const contractor = contractorForZone(zoneName);
  const agentInput = document.getElementById('agent-name');
  const creationDate = document.getElementById('creation-date')?.textContent || '';
  const agentDate = document.getElementById('agent-date');
  const salesDate = document.getElementById('sales-date');

  if (agentInput) {
    agentInput.value = contractor;
  }
  if (agentDate) {
    agentDate.value = creationDate;
  }
  if (salesDate) {
    salesDate.value = creationDate;
  }

  const encodedContractor = encodeURIComponent(contractor);
  const agentSign = document.getElementById('agent-signature');
  const agentSignFallback = document.getElementById('agent-signature-fallback');
  const salesSign = document.getElementById('sales-signature');
  const salesSignFallback = document.getElementById('sales-signature-fallback');

  setupSignatureImage(agentSign, agentSignFallback, `./src/img/sing/${encodedContractor}.png`, contractor || '');
  setupSignatureImage(salesSign, salesSignFallback, './src/img/sing/wz.png', 'wz');
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
      <td><input type="number" value="${safeText(data.cables || '')}" /></td>
      <td><input type="number" value="${safeText(data.users || '')}" /></td>
      <td class="btn-remove print-hidden"><i class="fas fa-times row-remove" title="حذف"></i></td>
    `;
  } else {
    tr.innerHTML = `
      <td><select class="zone-select">${zoneOptionsMarkup(selectedZone)}</select></td>
      <td><input type="number" value="${safeText(data.users || '')}" /></td>
      <td><input type="text" value="${safeText(data.coords || '')}" placeholder="33.2, 44.1" /></td>
      <td class="btn-remove print-hidden"><i class="fas fa-times row-remove" title="حذف"></i></td>
    `;
  }

  tbody.appendChild(tr);
  if (!document.getElementById('agent-name')?.value && selectedZone) {
    syncAgentByZone(selectedZone);
  }
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

  document.addEventListener('change', (event) => {
    const zoneSelect = event.target.closest('select.zone-select');
    if (zoneSelect) {
      syncAgentByZone(zoneSelect.value);
    }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.closest(`#${TABLE_IDS.poles}`) && target.placeholder === '33.2, 44.1') {
      validateCoord(target);
    }
  });
}
