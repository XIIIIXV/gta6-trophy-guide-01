// Rendering: checklist rows, the guide detail pane, the sources rail, the
// roadmap, the missables page and the sources page.
import { isEarned, getCount } from './store.js';
import { isSpoilerHidden, displayName, auditCounts, progressByGrade, KIND_LABELS } from './filters.js';
import { STAGES, CHECKLIST } from './roadmap.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function gradeChip(grade) {
  const map = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };
  return el('span', `chip ${grade}`, `${map[grade]} ${grade}`);
}

function fmt(n) {
  return n.toLocaleString('en-US');
}

export function renderAudit(node, trophies, sources) {
  const a = auditCounts(trophies);
  node.innerHTML = '';
  const parts = [
    ['AUDIT', null],
    [`${a.guidesCited}/${a.total} guides cite sources`, true],
    [`${a.steps} steps, all cited`, true],
    [`${sources.length} sources, read 20 Nov 2026`, true],
    [`${a.missable} possibly missable`, false],
    [`${a.watch} on the watch list`, false],
    [`${a.disputed} disputed`, false],
    [`${a.unconfirmed} unconfirmed`, false],
    ['0 online trophies', false],
  ];
  parts.forEach(([text, bold], i) => {
    if (i > 0) node.append(document.createTextNode(' · '));
    const s = el(bold ? 'b' : 'span', null, text);
    node.append(s);
  });
}

export function renderProgress(trophies, state) {
  document.getElementById('progressBig').textContent =
    `${state.earned.length} / ${trophies.length}`;
  const by = progressByGrade(trophies, state);
  document.getElementById('progressGrades').textContent =
    `Platinum ${by.platinum[0]}/${by.platinum[1]} · Gold ${by.gold[0]}/${by.gold[1]} · ` +
    `Silver ${by.silver[0]}/${by.silver[1]} · Bronze ${by.bronze[0]}/${by.bronze[1]}`;
}

export function renderList(container, trophies, state, selectedName, hooks) {
  container.replaceChildren();
  if (trophies.length === 0) {
    container.append(el('p', 'empty', 'No trophies match these filters.'));
    return;
  }
  for (const t of trophies) {
    const row = el('div', 'trophy-row' + (isEarned(state, t.name) ? ' earned' : '') +
      (t.name === selectedName ? ' selected' : ''));
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned(state, t.name);
    box.setAttribute('aria-label', `Earned: ${displayName(t, state)}`);
    box.addEventListener('change', (e) => {
      e.stopPropagation();
      hooks.onToggle(t, box.checked);
    });
    row.append(box);
    const mid = el('div');
    const name = el('div', 'trophy-name');
    if (isSpoilerHidden(t, state)) {
      name.append(el('span', 'hidden-name', 'Hidden trophy — earn it to reveal'));
    } else {
      name.textContent = t.name;
    }
    mid.append(name);
    if (!isSpoilerHidden(t, state)) mid.append(el('div', 'trophy-desc', t.description));
    const meta = el('div', 'trophy-meta');
    meta.append(el('span', 'chip', KIND_LABELS[t.kind] || t.kind));
    if (t.hidden) meta.append(el('span', 'chip hidden-flag', 'PSN-hidden'));
    if (t.missable) meta.append(el('span', 'chip missable', 'Possibly missable'));
    if (t.watch) meta.append(el('span', 'chip watch', 'Watch list'));
    if (t.disputed) meta.append(el('span', 'chip disputed', 'Disputed'));
    if (t.unconfirmed) meta.append(el('span', 'chip unconfirmed', 'Unconfirmed'));
    mid.append(meta);
    if (t.count) {
      const cur = getCount(state, t.name);
      const step = el('div', 'stepper');
      const minus = el('button', null, '−');
      minus.type = 'button';
      minus.addEventListener('click', (e) => { e.stopPropagation(); hooks.onCount(t, cur - 1); });
      const plus = el('button', null, '+');
      plus.type = 'button';
      plus.addEventListener('click', (e) => { e.stopPropagation(); hooks.onCount(t, cur + 1); });
      const bar = el('div', 'bar');
      const fill = el('i');
      fill.style.width = `${Math.min(100, (cur / t.count) * 100)}%`;
      bar.append(fill);
      step.append(minus, bar, plus, el('span', 'count', `${fmt(cur)} / ${fmt(t.count)}`));
      mid.append(step);
    }
    row.append(mid);
    row.append(gradeChip(t.grade));
    row.addEventListener('click', () => hooks.onSelect(t));
    container.append(row);
  }
}

function sourceLink(sources, n) {
  const s = sources.find((x) => x.n === n);
  if (!s) return document.createTextNode(`[${n}]`);
  const a = document.createElement('a');
  a.href = s.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = `[${n}] ${s.name.split(' — ')[0]}`;
  return a;
}

export function renderDetail(container, trophy, state, sources, hooks) {
  container.replaceChildren();
  if (!trophy) {
    container.append(el('p', 'empty', 'Pick a trophy from the checklist to read its guide.'));
    return;
  }
  const hidden = isSpoilerHidden(trophy, state);
  container.append(el('h2', null, hidden ? 'Hidden trophy' : trophy.name));
  const meta = el('div', 'trophy-meta');
  meta.append(gradeChip(trophy.grade));
  meta.append(el('span', 'chip', KIND_LABELS[trophy.kind] || trophy.kind));
  if (trophy.hidden) meta.append(el('span', 'chip hidden-flag', 'PSN-hidden'));
  if (trophy.missable) meta.append(el('span', 'chip missable', 'Possibly missable'));
  if (trophy.watch) meta.append(el('span', 'chip watch', 'Watch list'));
  if (trophy.disputed) meta.append(el('span', 'chip disputed', 'Disputed'));
  if (trophy.unconfirmed) meta.append(el('span', 'chip unconfirmed', 'Unconfirmed'));
  if (trophy.count) meta.append(el('span', 'chip', `Target: ${fmt(trophy.count)}`));
  container.append(meta);
  container.append(el('p', 'official', hidden ? 'Hidden on PlayStation until earned.' : trophy.description));
  if (hidden) {
    container.append(el('p', 'guide',
      'This trophy is hidden on PlayStation. Earn it to reveal its name and description, or switch the spoiler shield off in the toolbar.'));
  } else {
    container.append(el('p', 'guide', trophy.guide));
    if (trophy.steps && trophy.steps.length) {
      const ol = el('ol', 'steps');
      for (const s of trophy.steps) ol.append(el('li', null, s));
      container.append(ol);
    }
    container.append(el('p', 'where', `Where / when: ${trophy.where}`));
  }
  if (trophy.missable) {
    container.append(el('p', 'warnbox',
      'Possibly missable: the Chapter 1 balcony meditation can only be done in Chapter 1. Do it before leaving the chapter — there is no mission replay.'));
  }
  if (trophy.disputed) {
    container.append(el('p', 'warnbox',
      'Disputed: the sources disagree about this one, or one source confirms a method another still lists as unconfirmed. Both versions are shown in the guide above.'));
  }
  if (trophy.unconfirmed) {
    container.append(el('p', 'warnbox',
      'Unconfirmed: no source has a verified method for this trophy yet. Nothing here is invented — check the newest guides before chasing a rumour.'));
  }
  const cites = el('p', 'cites', 'Sources for this guide: ');
  trophy.sources.forEach((n, i) => {
    if (i > 0) cites.append(document.createTextNode(', '));
    cites.append(sourceLink(sources, n));
  });
  cites.append(document.createTextNode('. Full list on the Sources tab.'));
  container.append(cites);
  const actions = el('div', 'actions');
  const toggle = el('button', 'primary', isEarned(state, trophy.name) ? '✓ Earned — unmark' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => hooks.onToggle(trophy, !isEarned(state, trophy.name)));
  actions.append(toggle);
  container.append(actions);
  const note = document.createElement('textarea');
  note.placeholder = 'Your note for this trophy (saved in this browser)…';
  note.value = state.notes[trophy.name] || '';
  note.addEventListener('input', () => hooks.onNote(trophy, note.value));
  container.append(note);
}

export function renderRail(container, trophy, sources) {
  container.replaceChildren();
  container.append(el('h3', null, 'Sources for this trophy'));
  if (!trophy) {
    container.append(el('p', null, 'Pick a trophy to see its sources.'));
    return;
  }
  const ol = el('ol');
  for (const n of trophy.sources) {
    const s = sources.find((x) => x.n === n);
    if (!s) continue;
    const li = document.createElement('li');
    li.append(el('div', 'src-name', s.name));
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'src-url';
    a.textContent = s.url;
    li.append(a);
    li.append(el('div', null, `Read ${s.read}. ${s.usedFor}`));
    ol.append(li);
  }
  container.append(ol);
  container.append(el('p', null,
    'All 10 sources are listed, with dates, on the Sources tab.'));
}

export function renderRoadmap(container, checklistContainer, trophies, state) {
  container.replaceChildren();
  for (const stage of STAGES) {
    const card = el('div', 'stage');
    card.append(el('h3', null, stage.title));
    card.append(el('p', 'hours', stage.hours));
    card.append(el('p', null, stage.text));
    const chips = el('div', 'chips');
    for (const name of stage.trophies) {
      const t = trophies.find((x) => x.name === name);
      if (!t) continue;
      const chip = el('span', 'chip' + (isEarned(state, name) ? ' earned' : ''),
        `${isEarned(state, name) ? '✓ ' : ''}${name}`);
      chips.append(chip);
    }
    card.append(chips);
    container.append(card);
  }
  checklistContainer.replaceChildren();
  for (const group of CHECKLIST) {
    checklistContainer.append(el('h3', null, group.group));
    const table = el('table', 'check');
    const head = document.createElement('tr');
    head.append(el('th', null, 'Requirement'), el('th', null, 'Needed'));
    table.append(head);
    for (const [req, need] of group.rows) {
      const tr = document.createElement('tr');
      tr.append(el('td', null, req), el('td', 'num', need));
      table.append(tr);
    }
    checklistContainer.append(table);
  }
}

export function renderMissables(container, trophies) {
  container.replaceChildren();
  const pma = trophies.find((t) => t.name === 'Positive Mental Attitude');
  const danger = el('div', 'miss-card danger');
  danger.append(el('h3', null, '⚠ The one possibly missable trophy: Positive Mental Attitude'));
  if (pma) danger.append(el('p', null, pma.guide));
  danger.append(el('p', null,
    'Save advice: keep a manual save at the start and end of each chapter. There is no mission replay and no New Game+, but 15 manual save slots — a save from Chapter 1 is the only way back if you miss the balcony meditation.'));
  container.append(danger);
  const watch = el('div', 'miss-card');
  watch.append(el('h3', null, 'Watch list — questlines with chapter windows'));
  watch.append(el('p', null,
    'These are not missable — every one of them stays available after the story in free-roam — but they open in specific chapters and some are locked to one character. Do them when they appear so the cleanup is short.'));
  const table = el('table', 'check');
  const head = document.createElement('tr');
  head.append(el('th', null, 'Trophy'), el('th', null, 'Opens'), el('th', null, 'Last chance'));
  table.append(head);
  const windows = {
    'Baited My Tackle': ['Chapter 1, after Feng Shui', 'Still open after the story'],
    'Road to Rehabilitation': ['Chapter 3', 'Lucia-only; still open after the story'],
    'This Was No Boat Accident': ['Chapter 1', 'Returns in Chapters 2–3; still open after the story'],
    'The Lone Rider': ['Chapter 2, after Coffee Break', 'Still open after the story'],
    'Supply & Demand': ['Chapter 3, after Clonin’ Keys', 'Still open after the story'],
    'Spin On This!': ['Chapter 3, after Here, Kitty Kitty', 'Jason-only; still open after the story'],
    'Fair Game': ['Chapter 2, after Coffee Break', 'Jason-only; still open after the story'],
  };
  for (const t of trophies.filter((x) => x.watch)) {
    const tr = document.createElement('tr');
    const w = windows[t.name] || ['', ''];
    tr.append(el('td', null, t.name), el('td', null, w[0]), el('td', null, w[1]));
    table.append(tr);
  }
  watch.append(table);
  container.append(watch);
  const safe = el('div', 'miss-card');
  safe.append(el('h3', null, 'What cannot be missed'));
  safe.append(el('p', null,
    'Everything else: all 13 story trophies, the 100% checklist, every collectible, robbery and activity. After the story you return to free-roam and every trophy-related quest giver is available again. Optional missions with an hourglass do expire, but they do not count for trophies. Cheats disable trophies and saving — leave them off on your trophy save.'));
  container.append(safe);
}

export function renderSourcesList(container, sources) {
  container.replaceChildren();
  for (const s of sources) {
    const li = document.createElement('li');
    li.append(el('div', 'src-name', s.name));
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'src-url';
    a.textContent = s.url;
    li.append(a);
    li.append(el('div', null, `Read ${s.read}. Used for: ${s.usedFor}`));
    container.append(li);
  }
}
