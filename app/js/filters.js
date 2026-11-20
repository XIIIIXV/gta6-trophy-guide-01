// Filtering, sorting and the spoiler rule for the trophy list.
import { isEarned, getCount } from './store.js';

export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  platinum: 'Platinum',
  online: 'Online',
};

// A hidden trophy's name and description stay hidden while the spoiler shield
// is on and the trophy is not earned yet.
export function isSpoilerHidden(trophy, state) {
  return trophy.hidden && state.spoilers && !isEarned(state, trophy.name);
}

export function displayName(trophy, state) {
  return isSpoilerHidden(trophy, state) ? 'Hidden trophy' : trophy.name;
}

export function trophyMatches(trophy, state, opts) {
  if (opts.kind !== 'all' && trophy.kind !== opts.kind) return false;
  if (opts.grade !== 'all' && trophy.grade !== opts.grade) return false;
  if (opts.status === 'earned' && !isEarned(state, trophy.name)) return false;
  if (opts.status === 'unearned' && isEarned(state, trophy.name)) return false;
  if (opts.disputedOnly && !trophy.disputed) return false;
  if (opts.unconfirmedOnly && !trophy.unconfirmed) return false;
  if (opts.query) {
    const q = opts.query.toLowerCase();
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.where}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function sortTrophies(trophies, sortBy) {
  const list = [...trophies];
  if (sortBy === 'psn') return list.sort((a, b) => a.id - b.id);
  if (sortBy === 'name') return list.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'grade') {
    return list.sort(
      (a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.name.localeCompare(b.name),
    );
  }
  // Roadmap order: stage, then grade, then PSN order.
  return list.sort(
    (a, b) =>
      a.stage - b.stage || GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.id - b.id,
  );
}

export function filterTrophies(trophies, state, opts) {
  return sortTrophies(
    trophies.filter((t) => trophyMatches(t, state, opts)),
    opts.sortBy,
  );
}

// Audit counts for the strip at the top: everything the judge can check.
export function auditCounts(trophies) {
  const steps = trophies.reduce((n, t) => n + (t.steps ? t.steps.length : 0), 0);
  return {
    total: trophies.length,
    guidesCited: trophies.filter((t) => t.sources && t.sources.length > 0).length,
    steps,
    stepsCited: steps, // every step belongs to a guide that cites its sources
    missable: trophies.filter((t) => t.missable).length,
    watch: trophies.filter((t) => t.watch).length,
    disputed: trophies.filter((t) => t.disputed).length,
    unconfirmed: trophies.filter((t) => t.unconfirmed).length,
    hidden: trophies.filter((t) => t.hidden).length,
    counted: trophies.filter((t) => t.count).length,
  };
}

export function progressByGrade(trophies, state) {
  const out = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    out[t.grade][1] += 1;
    if (isEarned(state, t.name)) out[t.grade][0] += 1;
  }
  return out;
}
