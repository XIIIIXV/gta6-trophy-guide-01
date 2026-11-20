// Boot: load the trophy list and the numbered sources, wire the toolbar and
// tabs, and render. Deep links: ?tab=tracker|roadmap|missables|sources,
// ?trophy=<name> to open a guide, ?seed=13 to seed demo progress for
// screenshots, ?spoilers=off to open with the spoiler shield off.
import {
  loadState, saveState, seedDemo, setEarned, setCount,
  exportProgress, importProgressFile,
} from './store.js';
import { filterTrophies } from './filters.js';
import {
  renderAudit, renderProgress, renderList, renderDetail, renderRail,
  renderRoadmap, renderMissables, renderSourcesList,
} from './views.js';

const params = new URLSearchParams(location.search);
let state = loadState();
if (params.get('seed')) state = seedDemo(state);
if (params.get('spoilers') === 'off') {
  state.spoilers = false;
  saveState(state);
}

const doc = await (await fetch('data/trophies.json')).json();
const srcDoc = await (await fetch('data/sources.json')).json();
const trophies = doc.trophies;
const sources = srcDoc.sources;

const listEl = document.getElementById('list');
const detailEl = document.getElementById('detail');
const railEl = document.getElementById('sourcesRail');
const listCountEl = document.getElementById('listCount');

let selectedName = params.get('trophy') || 'A Long Road';
if (!trophies.some((t) => t.name === selectedName)) selectedName = trophies[0].name;

function currentOpts() {
  return {
    query: document.getElementById('search').value.trim(),
    kind: document.getElementById('kindFilter').value,
    grade: document.getElementById('gradeFilter').value,
    status: document.getElementById('statusFilter').value,
    disputedOnly: document.getElementById('disputedOnly').checked,
    unconfirmedOnly: document.getElementById('unconfirmedOnly').checked,
    sortBy: document.getElementById('sortBy').value,
  };
}

function renderAll() {
  renderAudit(document.getElementById('audit'), trophies, sources);
  renderProgress(trophies, state);
  const filtered = filterTrophies(trophies, state, currentOpts());
  listCountEl.textContent =
    `Showing ${filtered.length} of ${trophies.length} trophies` +
    (state.earned.length ? ` — ${state.earned.length} earned` : '');
  const selected = trophies.find((t) => t.name === selectedName) || filtered[0];
  renderList(listEl, filtered, state, selected ? selected.name : null, {
    onSelect: (t) => {
      selectedName = t.name;
      renderAll();
    },
    onToggle: (t, earned) => {
      setEarned(state, t.name, earned);
      renderAll();
    },
    onCount: (t, value) => {
      setCount(state, t.name, value, t.count);
      renderAll();
    },
  });
  renderDetail(detailEl, selected, state, sources, {
    onToggle: (t, earned) => {
      setEarned(state, t.name, earned);
      renderAll();
    },
    onNote: (t, text) => {
      state.notes[t.name] = text;
      saveState(state);
    },
  });
  renderRail(railEl, selected, sources);
  renderRoadmap(
    document.getElementById('roadmapBody'),
    document.getElementById('checklistBody'),
    trophies,
    state,
  );
  renderMissables(document.getElementById('missablesBody'), trophies);
  renderSourcesList(document.getElementById('sourcesBody'), sources);
  document.getElementById('spoilerToggle').checked = state.spoilers;
}

function showTab(tab) {
  for (const btn of document.querySelectorAll('.tabs button')) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  }
  for (const id of ['tracker', 'roadmap', 'missables', 'sources']) {
    document.getElementById(`view-${id}`).hidden = id !== tab;
  }
}

for (const btn of document.querySelectorAll('.tabs button')) {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
}

for (const id of ['search', 'kindFilter', 'gradeFilter', 'statusFilter', 'sortBy']) {
  document.getElementById(id).addEventListener('input', renderAll);
}
for (const id of ['disputedOnly', 'unconfirmedOnly']) {
  document.getElementById(id).addEventListener('change', renderAll);
}
document.getElementById('spoilerToggle').addEventListener('change', (e) => {
  state.spoilers = e.target.checked;
  saveState(state);
  renderAll();
});
document.getElementById('exportBtn').addEventListener('click', () => exportProgress(state));
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    state = await importProgressFile(file);
    renderAll();
  } catch {
    alert('That file is not a Leonida Platinum Log progress export.');
  }
  e.target.value = '';
});

showTab(params.get('tab') || 'tracker');
renderAll();
