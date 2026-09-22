/**
 * teams.js — Team and bot roster derived from robots/AI/Teams.txt
 * AI behavior types map directly to the Python AI classes in robots/AI/*.py:
 *   'pusher'  → Pusher.py   (Charge + Shove tactics)
 *   'rammer'  → Rammer.py   (Charge only, full-speed)
 *   'spinner' → Spinner.py  (Engage + spin-up weapon on close range)
 *   'flipper' → Flipper.py  (Engage + fire when contact detected)
 *   'chopper' → Chopper.py  (overhead/axe strike on contact)
 *   'whipper' → Whipper.py  (circular strike weapon)
 */

export const TEAMS = [
  { index: 0,  name: 'RA1 Revenge',           motto: 'Did you miss us?',                          logo: 'robots/AI/robotarena.bmp' },
  { index: 1,  name: 'RA2 Revamped',           motto: 'Like Mega Man boss re-fights!',             logo: 'robots/AI/robotarena2.bmp' },
  { index: 2,  name: 'RFS Greatest Hits',      motto: 'Remixed RA2 tournament entries!',           logo: 'robots/AI/rfshits.bmp' },
  { index: 3,  name: 'Firepower 2000',         motto: 'Be prepared to get blown away.',            logo: 'robots/AI/firepower.bmp' },
  { index: 4,  name: 'Second Chance Team',     motto: 'Saved from the edge of oblivion.',          logo: 'robots/AI/second.bmp' },
  { index: 5,  name: 'The Blast Works',        motto: 'Turn up the heat!',                         logo: 'robots/AI/blastworks.bmp' },
  { index: 6,  name: 'Spare Partz',            motto: 'Think you can beat us??',                   logo: 'robots/AI/spareparts.bmp' },
  { index: 7,  name: 'Atari Age',              motto: 'Have you played Atari today?',              logo: 'robots/AI/atariage.bmp' },
  { index: 8,  name: 'Robotic Ruiners',        motto: 'Professional razers.',                      logo: 'robots/AI/ruiners.bmp' },
  { index: 9,  name: 'Team MegaSparkRiotStorm',motto: "What the fuck is a 'motto'?",              logo: 'robots/AI/megasparkriotstorm.bmp' },
  { index: 10, name: 'The Sparksters',         motto: "We'll fry you!",                            logo: 'robots/AI/sparks.bmp' },
  { index: 11, name: 'Retro Bits',             motto: 'Gonna take you back to the past...',        logo: 'robots/AI/retrobits.bmp' },
  { index: 12, name: 'Battle Clash Legends',   motto: 'Replicas from another era.',                logo: 'robots/AI/battleclash.bmp' },
  { index: 13, name: 'BattleBots Update',      motto: 'Memes and bots designed by fans.',          logo: 'robots/AI/bbu.bmp' },
  { index: 14, name: 'Too Much Head',          motto: 'Designed by a hydra!',                      logo: 'robots/AI/heads.bmp' },
  { index: 15, name: 'Sgt. Stone',             motto: 'Indestructable forces.',                    logo: 'robots/AI/red_zone.bmp' },
  { index: 16, name: 'Alien Research Team',    motto: 'The PROOF is out there!',                   logo: 'robots/AI/dino.bmp' },
  { index: 17, name: 'United Commoners',       motto: "We don't need the fancy crap to whoop your ASS!", logo: 'robots/AI/good_ol_boys.bmp' },
  { index: 18, name: 'Lethal Dosage',          motto: '100 Rads can kill you, 4000 Rads will make you suffer.', logo: 'robots/AI/dragon.bmp' },
  { index: 19, name: 'The Disturbed Ones',     motto: 'Oddly effective...',                        logo: 'robots/AI/black_storm.bmp' },
  { index: 20, name: 'United States Army',     motto: 'A ROBOT Army of one.',                      logo: 'robots/AI/spark.bmp' },
  { index: 21, name: 'Pyros',                  motto: 'All of our bots will make yours to explode and burn!', logo: 'robots/AI/spikeball.bmp' },
  { index: 22, name: 'Reptilian Team',         motto: 'Tough as nails. Deadly as a dragon.',       logo: 'robots/AI/northpolers.bmp' },
  { index: 23, name: 'Stoners',                motto: 'Dude we are so stoned right now.',          logo: 'robots/AI/high_voltage.bmp' },
  { index: 24, name: 'Mode II',                motto: 'Mortal robots beware!',                     logo: 'robots/AI/hex.bmp' },
  { index: 25, name: 'The rObO zOne',          motto: "You're going down!",                        logo: 'robots/AI/Z.bmp' },
  { index: 26, name: 'Brute Force',            motto: 'Pure Metal. Pure Force.',                   logo: 'robots/AI/steeldog.bmp' },
  { index: 27, name: 'Under Pressure',         motto: 'How good can your bots do, under Pressure?', logo: 'robots/AI/riot.bmp' },
  { index: 28, name: 'chAos',                  motto: 'Take no prisoners.',                        logo: 'robots/AI/megaton.bmp' },
  { index: 29, name: 'C0MPU73R H4CK3R5',       motto: 'Terminate.',                                logo: 'robots/AI/the_scrappers.bmp' },
  { index: 30, name: 'Pokemon Robotics',        motto: "Forget the kids' stuff.",                   logo: 'robots/AI/pokemon.bmp' },
  { index: 31, name: 'p0werh0use tw0',          motto: 'Full of it, power, that is.',               logo: 'robots/AI/powerhouse.bmp' },
  { index: 32, name: 'Aquas',                   motto: 'Water-proof, Robot-proof.',                 logo: 'robots/AI/aquas.bmp' },
  { index: 33, name: 'Team Plastic Fruit',      motto: 'You could say we are a bit fruity.',        logo: 'robots/AI/fruit.bmp' },
  { index: 34, name: 'Sinister Squad',          motto: "We would rather die on our feet than live on our knees!", logo: 'robots/AI/sinister.bmp' },
  { index: 35, name: 'New Island Technologies', motto: 'We use only the best stuff available.',     logo: 'robots/AI/nit.bmp' },
  { index: 36, name: 'Inventive Minds',         motto: 'We find ALL of the loopholes!',             logo: 'robots/AI/minds.bmp' },
  { index: 37, name: 'X-Force',                 motto: "If you think we're aggressive now, wait until mating season.", logo: 'robots/AI/xforce.bmp' },
  { index: 38, name: 'United States Navy',      motto: 'Our torpedoes will SINK your robots.',      logo: 'robots/AI/navy.bmp' },
  { index: 39, name: "r3v3ng3 0f t3h n00bz!",   motto: "OMG ur goin down!1!!one!1!eleven!!!",       logo: 'robots/AI/newbs.bmp' },
  { index: 40, name: 'People In The Basement',  motto: 'We all got bored one day...',               logo: 'robots/AI/ppl.bmp' },
  { index: 41, name: 'Maximum Resistance',       motto: "You're a wimp! You're going DOWN!",         logo: 'robots/AI/maxr.bmp' },
  { index: 42, name: 'toXic',                    motto: "This ain't no false alarm!",                logo: 'robots/AI/toxic.bmp' },
  { index: 43, name: 'Destruction 101',          motto: 'Now for a class in Destruction 101.',       logo: 'robots/AI/d101.bmp' },
  { index: 44, name: 'Radio F Software',         motto: 'You KNEW it was coming.',                   logo: 'robots/AI/rfs.bmp' },
];

/**
 * Bot configurations for each team's roster.
 * aiType maps to JavaScript AI behavior (inspired by the Python AI classes).
 *
 * aiType values:
 *   'rammer'  — full-speed straight charge, high damage on contact (Rammer.py: Charge only)
 *   'pusher'  — charges + tries to shove player toward walls (Pusher.py: Charge + Shove)
 *   'spinner' — circles player, spins up, rushes when close (Spinner.py: Engage + spin-up)
 *   'flipper' — closes in carefully, fires on contact (Flipper.py: Engage + fire on contact)
 *   'chopper' — overhead strike: charges + fires weapon at close range (Chopper.py behavior)
 *   'evader'  — keeps distance, strafe-fires; weapon-focused (SimpleWeapon.py style)
 */
export const BOT_ROSTER = [
  // Team 0 — RA1 Revenge
  { teamIndex: 0, name: 'MATADOR',   color: 0xb84432, size: 'medium', gun: 'cannon',  engine: 'standard', aiType: 'rammer'  },
  { teamIndex: 0, name: 'THE WEDGE', color: 0x8a2a1e, size: 'small',  gun: 'shotgun', engine: 'sprint',   aiType: 'pusher'  },
  // Team 1 — RA2 Revamped
  { teamIndex: 1, name: 'NOVA',      color: 0x3b7199, size: 'small',  gun: 'laser',   engine: 'sprint',   aiType: 'evader'  },
  { teamIndex: 1, name: 'SIEGE',     color: 0x1e4d66, size: 'large',  gun: 'cannon',  engine: 'tank',     aiType: 'pusher'  },
  // Team 3 — Firepower 2000
  { teamIndex: 3, name: 'INFERNO',   color: 0xff5500, size: 'medium', gun: 'cannon',  engine: 'standard', aiType: 'rammer'  },
  { teamIndex: 3, name: 'BLAZE',     color: 0xe03010, size: 'small',  gun: 'laser',   engine: 'hover',    aiType: 'evader'  },
  // Team 8 — Robotic Ruiners
  { teamIndex: 8, name: 'SHREDDER',  color: 0x445544, size: 'large',  gun: 'shotgun', engine: 'tank',     aiType: 'spinner' },
  { teamIndex: 8, name: 'GRINDER',   color: 0x556655, size: 'medium', gun: 'cannon',  engine: 'standard', aiType: 'spinner' },
  // Team 10 — The Sparksters
  { teamIndex: 10, name: 'SHOCK',    color: 0xd4a820, size: 'small',  gun: 'laser',   engine: 'sprint',   aiType: 'evader'  },
  { teamIndex: 10, name: 'STATIC',   color: 0xb88800, size: 'medium', gun: 'cannon',  engine: 'hover',    aiType: 'spinner' },
  // Team 15 — Sgt. Stone
  { teamIndex: 15, name: 'IRONWALL', color: 0x6a3a2a, size: 'large',  gun: 'shotgun', engine: 'tank',     aiType: 'pusher'  },
  { teamIndex: 15, name: 'FORTIFY',  color: 0x553020, size: 'medium', gun: 'cannon',  engine: 'tank',     aiType: 'rammer'  },
  // Team 26 — Brute Force
  { teamIndex: 26, name: 'CRUSHER',  color: 0x556655, size: 'large',  gun: 'shotgun', engine: 'tank',     aiType: 'rammer'  },
  { teamIndex: 26, name: 'SMASHER',  color: 0x3d4d3d, size: 'medium', gun: 'cannon',  engine: 'standard', aiType: 'pusher'  },
  // Team 28 — chAos
  { teamIndex: 28, name: 'MAYHEM',   color: 0x7a1a7a, size: 'medium', gun: 'laser',   engine: 'hover',    aiType: 'flipper' },
  { teamIndex: 28, name: 'PANDEMONIUM', color: 0x5a0a5a, size: 'small', gun: 'laser', engine: 'sprint',   aiType: 'evader'  },
  // Team 34 — Sinister Squad
  { teamIndex: 34, name: 'SINISTER', color: 0x1a1a4a, size: 'large',  gun: 'cannon',  engine: 'standard', aiType: 'chopper' },
  { teamIndex: 34, name: 'MALICE',   color: 0x2a2a6a, size: 'medium', gun: 'shotgun', engine: 'tank',     aiType: 'rammer'  },
  // Team 44 — Radio F Software (the "final boss" team)
  { teamIndex: 44, name: 'VULCAN',   color: 0xb84432, size: 'medium', gun: 'cannon',  engine: 'standard', aiType: 'pusher'  },
  { teamIndex: 44, name: 'ION',      color: 0x3b7199, size: 'small',  gun: 'laser',   engine: 'sprint',   aiType: 'evader'  },
  { teamIndex: 44, name: 'BULL',     color: 0xc35b31, size: 'large',  gun: 'shotgun', engine: 'tank',     aiType: 'rammer'  },
  { teamIndex: 44, name: 'WRAITH',   color: 0xa44b34, size: 'medium', gun: 'laser',   engine: 'hover',    aiType: 'spinner' },
];

/**
 * Get all bots belonging to a specific team.
 */
export function getTeamBots(teamIndex) {
  return BOT_ROSTER.filter(b => b.teamIndex === teamIndex);
}

/**
 * Pick N random opponents from a specific team (or any team if teamIndex is null).
 * Falls back to first N bots in roster if team has fewer than N bots.
 */
export function pickOpponents(teamIndex, count = 3) {
  const pool = teamIndex !== null
    ? BOT_ROSTER.filter(b => b.teamIndex === teamIndex)
    : BOT_ROSTER;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  // If team is small, pad with random bots from any team
  const result = shuffled.slice(0, count);
  if (result.length < count) {
    const extras = BOT_ROSTER
      .filter(b => !result.includes(b))
      .sort(() => Math.random() - 0.5)
      .slice(0, count - result.length);
    result.push(...extras);
  }
  return result;
}
