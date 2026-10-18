import { lg, d } from "./depth";

// ============ JON "BONES" JONES — COMPLETE UFC RECORD ============
// Every UFC fight of his career (UFC-only — his 6 pre-UFC wins are counted
// in the header record but not logged, exactly like the broadcast shows it).
// 22-1 (1 NC) inside the Octagon across two weight classes; vacated the
// heavyweight title in 2025 and rode off into the sunset.

export const JONES = lg("HW", 99, "Jon Jones", "Bones", "US", 28, 1, 0, 10, 7, 1, 39, `6'4"`, `85"`, "Jackson Wink MMA", "MMA", 1790,
  92, 82, 94, 90, 96, 90, 88, [
    { op: "André Gusmão", ev: "UFC 87", date: "Aug 9, 2008", res: "W", m: "UDEC", r: 3, t: "5:00", det: "UFC Debut — Taken on 8 Days' Notice", wc: "LHW" },
    { op: "Stephan Bonnar", ev: "UFC 94", date: "Jan 31, 2009", res: "W", m: "UDEC", r: 3, t: "5:00", det: "Spinning Elbow in the Third", wc: "LHW", bonus: "FOTN" },
    { op: "Jake O'Brien", ev: "UFC 100", date: "Jul 11, 2009", res: "W", m: "SUB", r: 2, t: "2:43", det: "Guillotine", wc: "LHW" },
    { op: "Matt Hamill", ev: "TUF 10 Finale", date: "Dec 5, 2009", res: "L", m: "DQ", r: 1, t: "4:14", det: "Illegal 12-6 Elbows — Dominated Before the Ruling", wc: "LHW" },
    { op: "Brandon Vera", ev: "UFC on Versus 1", date: "Mar 21, 2010", res: "W", m: "KO", r: 3, t: "4:19", det: "Elbows", wc: "LHW" },
    { op: "Vladimir Matyushenko", ev: "UFC on Versus 2", date: "Aug 1, 2010", res: "W", m: "KO", r: 2, t: "1:56", det: "Elbows", wc: "LHW" },
    { op: "Ryan Bader", ev: "UFC 126", date: "Feb 5, 2011", res: "W", m: "SUB", r: 2, t: "4:20", det: "Guillotine", wc: "LHW" },
    { op: "Maurício Rua", ev: "UFC 128", date: "Mar 19, 2011", res: "W", m: "KO", r: 3, t: "2:37", det: "Punches & Knee — Youngest Champion in UFC History", title: "T", wc: "LHW" },
    { op: "Quinton Jackson", ev: "UFC 135", date: "Sep 24, 2011", res: "W", m: "SUB", r: 4, t: "1:14", det: "Rear Naked Choke", title: "T", wc: "LHW" },
    { op: "Lyoto Machida", ev: "UFC 140", date: "Dec 10, 2011", res: "W", m: "SUB", r: 2, t: "4:26", det: "Standing Guillotine", title: "T", wc: "LHW" },
    { op: "Rashad Evans", ev: "UFC 145", date: "Apr 21, 2012", res: "W", m: "UDEC", r: 5, t: "5:00", det: "Bad Blood Settled", title: "T", wc: "LHW" },
    { op: "Vitor Belfort", ev: "UFC 152", date: "Sep 22, 2012", res: "W", m: "SUB", r: 4, t: "1:00", det: "Americana — Caught in a Deep Armbar First", title: "T", wc: "LHW" },
    { op: "Chael Sonnen", ev: "UFC 159", date: "Apr 27, 2013", res: "W", m: "KO", r: 1, t: "4:33", det: "Ground & Pound — Toe Broke on the Takedown", title: "T", wc: "LHW" },
    { op: "Alexander Gustafsson", ev: "UFC 165", date: "Sep 21, 2013", res: "W", m: "UDEC", r: 5, t: "5:00", det: "The War of 2013 — The Closest Anyone Came", title: "T", wc: "LHW", bonus: "FOTN" },
    { op: "Glover Teixeira", ev: "UFC 172", date: "Apr 26, 2014", res: "W", m: "UDEC", r: 5, t: "5:00", det: "Bloody Elbows & Eye Pokes", title: "T", wc: "LHW" },
    { op: "Daniel Cormier", ev: "UFC 182", date: "Jan 3, 2015", res: "W", m: "UDEC", r: 5, t: "5:00", det: "Grudge Match of the Era", title: "T", wc: "LHW" },
    { op: "Ovince Saint Preux", ev: "UFC 197", date: "Apr 23, 2016", res: "W", m: "UDEC", r: 5, t: "5:00", det: "Off the Couch — Short-Notice Interim Clash", title: "I", wc: "LHW" },
    { op: "Daniel Cormier", ev: "UFC 214", date: "Jul 29, 2017", res: "NC", m: "KO", r: 2, t: "3:01", det: "Head Kick — Overturned to No Contest (USADA)", title: "T", wc: "LHW" },
    { op: "Alexander Gustafsson", ev: "UFC 232", date: "Dec 29, 2018", res: "W", m: "KO", r: 3, t: "2:02", det: "Body Kick & Punches — Return From Exile", title: "V", wc: "LHW" },
    { op: "Anthony Smith", ev: "UFC 235", date: "Mar 2, 2019", res: "W", m: "UDEC", r: 5, t: "5:00", det: "Point Deducted, Belt Retained", title: "T", wc: "LHW" },
    { op: "Thiago Santos", ev: "UFC 239", date: "Jul 6, 2019", res: "W", m: "SDEC", r: 5, t: "5:00", det: "Lionheart's Knee Gave Out", title: "T", wc: "LHW" },
    { op: "Dominick Reyes", ev: "UFC 247", date: "Feb 8, 2020", res: "W", m: "UDEC", r: 5, t: "5:00", det: "The Closest Call in Reign History", title: "T", wc: "LHW" },
    { op: "Ciryl Gane", ev: "UFC 285", date: "Mar 4, 2023", res: "W", m: "SUB", r: 3, t: "2:04", det: "Guillotine — Heavyweight Debut, Three Years in the Making", title: "V", wc: "HW" },
    { op: "Stipe Miocic", ev: "UFC 309", date: "Nov 16, 2024", res: "W", m: "KO", r: 3, t: "4:19", det: "Spinning Back Kick & Ground Punches — The Last Dance", title: "T", wc: "HW", bonus: "POTN" },
  ]);

// ---------- Jones-era opponents who weren't yet on file — full profiles ----------
// (Complete records generated deterministically from their real UFC runs.)
export const JONES_PEERS = [
  // UFC 1-2-fight novelties
  d("LHW", 99, "André Gusmão", null, "BR", 1, 2, 0, 0, 1, 48, `6'2"`, `78"`, "Brazilian Top Team", "Karate", 1400, { retired: true }),
  // TUF 1 immortal — Griffin vs Bonnar built the sport
  d("LHW", 99, "Stephan Bonnar", "The American Psycho", "US", 8, 7, 0, 2, 2, 49, `6'4"`, `80"`, "Xtreme Couture", "Boxer", 1520, { retired: true }),
  // Wrestler who never got going at HW
  d("HW", 99, "Jake O'Brien", "Irish", "US", 4, 3, 0, 1, 0, 41, `6'2"`, `75"`, "Purdue Wrestling", "Wrestler", 1450, { retired: true }),
  // The Hammer — deaf wrestling pioneer, author of Jones' lone loss
  d("LHW", 99, "Matt Hamill", "The Hammer", "US", 9, 4, 0, 5, 1, 50, `6'2"`, `75"`, "Militech Fighting Systems", "Wrestler", 1520, { retired: true }),
  // The Truth — Filipino-American veteran of two divisions
  d("LHW", 99, "Brandon Vera", "The Truth", "PH", 12, 9, 0, 7, 1, 48, `6'3"`, `77"`, "San Diego Combat Academy", "Muay Thai", 1520, { retired: true }),
  // The Janitor — Belarusian wrestler from the Zuffa dark ages
  d("LHW", 99, "Vladimir Matyushenko", "The Janitor", "BY", 7, 3, 0, 2, 0, 55, `6'0"`, `72"`, "LA Boxing", "Wrestler", 1500, { retired: true }),
  // Darth Bader — All-American who went on to conquer Bellator
  d("LHW", 99, "Ryan Bader", "Darth", "US", 14, 5, 0, 6, 3, 43, `6'2"`, `74"`, "Power MMA", "Wrestler", 1600, { retired: true }),
  // The Devastator — the man who nearly ended the streak
  d("LHW", 99, "Dominick Reyes", "The Devastator", "US", 7, 4, 0, 5, 0, 36, `6'4"`, `77"`, "CMS MMA", "Striker", 1560),
];
