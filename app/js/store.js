// Progress store: earned ticks, counted-trophy steppers and notes, saved in localStorage.
// Export writes a JSON file; import reads one back. Nothing leaves the browser.
export const STORE_KEY = 'leonida-platinum-log-v1';

// The demo seed used for screenshots (?seed=13): the 12 story trophies plus
// Master of None, with a few counters part way. It only applies when the URL
// carries ?seed= — a plain open of index.html starts empty.
export const SEED_EARNED = [
  'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!',
  'Top Of The World, Ma', 'You Gotta Know When to Get Off', 'Trust', 'Break the Bank',
  'Family Matters', 'DWNFALL', 'Hi-Jacked', 'Snow Storm', 'Master of None',
];
export const SEED_COUNTS = {
  'Cunning Stunts': 120,
  'You WAiNKer!': 45,
  'Whip It Good': 60,
  'One Last Thing': 22,
  'Actions Speak Louder': 180,
};

export function blankState() {
  return { earned: [], counts: {}, notes: {}, spoilers: true };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
      spoilers: parsed.spoilers !== false,
    };
  } catch {
    return blankState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function seedDemo(state) {
  state.earned = [...SEED_EARNED];
  state.counts = { ...SEED_COUNTS };
  state.spoilers = true;
  saveState(state);
  return state;
}

export function isEarned(state, name) {
  return state.earned.includes(name);
}

export function setEarned(state, name, earned) {
  if (earned) {
    if (!state.earned.includes(name)) state.earned.push(name);
  } else {
    state.earned = state.earned.filter((n) => n !== name);
  }
  saveState(state);
}

export function getCount(state, name) {
  return state.counts[name] || 0;
}

export function setCount(state, name, value, max) {
  const clamped = Math.max(0, Math.min(max, Math.floor(value) || 0));
  if (clamped === 0) delete state.counts[name];
  else state.counts[name] = clamped;
  saveState(state);
  return clamped;
}

export function exportProgress(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-platinum-log-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importProgressFile(file) {
  const parsed = JSON.parse(await file.text());
  const state = {
    earned: Array.isArray(parsed.earned) ? parsed.earned.filter((n) => typeof n === 'string') : [],
    counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
    notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
    spoilers: parsed.spoilers !== false,
  };
  saveState(state);
  return state;
}
