export async function loadZones() {
  const response = await fetch('./src/js/data/zones.json');
  if (!response.ok) {
    throw new Error('Failed to load zone settings');
  }
  return response.json();
}

export function buildZoneContractorMap(zones) {
  return new Map(zones.map((zone) => [zone.ZoneName, zone.ZoneContractor]));
}

export const FAT_NAMES = Array.from({ length: 48 }, (_, index) => `FAT${index + 1}`);
