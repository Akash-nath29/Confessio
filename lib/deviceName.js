import * as SecureStore from 'expo-secure-store';

const STORE_KEY = 'ANON_DEVICE_NAME_V1';

// Small word lists to create friendly, non-identifiable codenames
const ADJECTIVES = [
  'calm',
  'bright',
  'quiet',
  'brisk',
  'kind',
  'soft',
  'lucky',
  'brave',
  'gentle',
  'mellow',
];
const ANIMALS = [
  'otter',
  'panda',
  'sparrow',
  'koala',
  'fox',
  'lynx',
  'whale',
  'badger',
  'owl',
  'seal',
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSuffix(length = 4) {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateCodename() {
  const adj = randomChoice(ADJECTIVES);
  const animal = randomChoice(ANIMALS);
  const suffix = randomSuffix(4);
  return `anon-${adj}-${animal}-${suffix}`;
}

export async function getAnonDeviceName() {
  try {
    const existing = await SecureStore.getItemAsync(STORE_KEY);
    if (existing) return existing;
    const codename = generateCodename();
    await SecureStore.setItemAsync(STORE_KEY, codename, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return codename;
  } catch (e) {
    // Fallback to a volatile codename if secure store is unavailable
    return generateCodename();
  }
}

export async function resetAnonDeviceName() {
  try {
    await SecureStore.deleteItemAsync(STORE_KEY);
  } catch {}
}
