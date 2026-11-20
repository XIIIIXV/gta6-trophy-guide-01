// Roadmap stages and the 100% completion checklist, from the cited guides
// (PowerPyx roadmap + KeenGamer checklist numbers, sources 1 and 2).
export const STAGES = [
  {
    n: 1,
    title: 'Stage 1 — The story',
    hours: '60–80 hours',
    text: 'Play the story and enjoy it — no mission gold medals, no mission replay, so keep a manual save at the start and end of each chapter (15 slots). Do the Chapter 1 balcony meditation for Positive Mental Attitude, the only thing that can be missed. Scan vehicles (WAiNK) and study animals (binoculars) as you go; both count toward 100% later. Take optional missions as they appear — they introduce robberies, fishing, hunting and the other systems.',
    trophies: [
      'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!',
      'Top Of The World, Ma', 'You Gotta Know When to Get Off', 'Trust', 'Break the Bank',
      'Family Matters', 'DWNFALL', 'Hi-Jacked', 'Snow Storm', 'Master of None',
      'Baited My Tackle', 'Stick Fiddler', 'Road to Rehabilitation',
      'This Was No Boat Accident', 'The Lone Rider', 'Supply & Demand', 'Spin On This!',
      'Positive Mental Attitude', 'Whip It Good', 'The Goodtime State',
    ],
  },
  {
    n: 2,
    title: 'Stage 2 — 100% completion',
    hours: 'About 100 hours',
    text: 'After the story, the 100% Completion Checklist unlocks under Progress > Stats > 100% Completion. It is lenient — roughly 60% true completion — and everything on it is still doable in free-roam. Only robberies, underwater discoveries, shooting ranges, drone races and Bret quests need completing in full; most collectibles need only a share. You need 70 of 80 challenges, so the 10 hardest can be skipped.',
    trophies: [
      'A Long Road', 'Cunning Stunts', 'The Shootist', 'Top Fun', 'Earn Cash, Not Kudos',
      "Don't Touch My Deck", 'You WAiNKer!', 'One Last Thing', 'Hot Together',
      'Retail Therapy', 'Gunslinger', 'Catch Me If You Can', 'Challenging Tank',
      'Sneakthief', 'Maximum Withdrawal', 'A Classic Blitz Play', 'Pest Control',
      "Let's Go Bowling", 'Personal Best', 'Dime on the Dollar', 'Treat Yo Self',
      'Little Boxes', 'On the Spot',
    ],
  },
  {
    n: 3,
    title: 'Stage 3 — Strangers & Freaks and the last cleanups',
    hours: '10–20 hours',
    text: 'Finish the 8 qualifying stranger strands (Kirk, Kyle, Yago, Pilot Pete and the rest still being found) and the last questlines. Sweep up the hidden miscellaneous trophies — the bowling alley, the showroom, the UFO — and check the one unconfirmed trophy, Bad Luck, I Guess, against the newest guides. The platinum pops when the last trophy does.',
    trophies: [
      'Vice Got a Price!', 'Strangers & Freaks', 'Fair Game', 'In The Beginning…',
      'Capital Offense', 'Actions Speak Louder', 'Bad Luck, I Guess',
      'The Truth Is Out There', 'Ten Pin',
    ],
  },
];

// The 100% checklist, grouped, with the required share of each total.
export const CHECKLIST = [
  {
    group: 'Robberies & fencing',
    rows: [
      ['Main story', 'Finish all chapters'],
      ['Optional tasks', '100 completed'],
      ['Gang Operations', '39 of 39'],
      ['Bank Jobs', '22 of 22'],
      ['Payday Loan Jobs', '7 of 7'],
      ["Smash 'N' Grabs", '34 of 35'],
      ['Stick Ups', '50 of 91'],
      ['Bank Vaults', '8 of 8'],
      ['Narcotics fenced', '$100,000'],
      ['Jewelry fenced', '$100,000'],
      ['Marked Bills fenced', '$250,000'],
      ['Vehicles fenced', '$200,000'],
    ],
  },
  {
    group: 'Collectibles & exploration',
    rows: [
      ["Kenton's Treasure Sets", '5 of 7'],
      ['Collectible Card Sets', '15 of 18'],
      ['WAiNK Locations', '100 scans'],
      ['Underwater Discoveries', '33 of 33'],
      ['Magazines, Books and Comics', '30 of 34'],
      ['Meditations', '15 of 18 (18 for the trophy)'],
      ['Cocaine Flamingos', '100 of 125'],
      ['Unique Playlists', '2 of 2'],
      ['Discovered Styles', '70 of 79'],
      ['Base-Model Vehicles', '200 of 277'],
      ['Standard Issue Weapons', '50 of 66'],
      ['Animals Studied', '100 of 255'],
    ],
  },
  {
    group: 'Activities',
    rows: [
      ['Unique Races won', '30 of 40'],
      ['Race Challenge Gold Medals', '10 of 13'],
      ['Shooting Range Gold Medals', '42 of 42'],
      ['Video Games', 'Play all 4'],
      ['Pool Opponents defeated', '5 of 7'],
      ['Mini Golf', 'Play at 2 of 3 locations'],
      ['Basketball Hoops scored', '90 of 100'],
      ['Drone Time Trials', '42 of 42'],
      ['Stunts', '300 of 397'],
      ['Challenges', '70 of 80'],
      ["Bret's Target Decks", '15 of 15'],
    ],
  },
];
