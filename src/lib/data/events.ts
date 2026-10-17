import { f, L } from "./core";
import { FightEvent } from "../types";

// ============ UPCOMING EVENTS — as of Oct 17, 2026 ============

// Edmonton card fighters not in the ranked roster
export const EVENT_FIGHTERS = [
  f("MW", 99, "Marc-André Barriault", "The Powerbar", "CA", 17, 11, 0, 10, 3, 36, `6'1"`, `74"`, "Jackson-Wink", "Boxer", 1490,
    78, 76, 45, 50, 55, 78, 84, [
      L("Dustin Stoltzfus", "UFC Fight Night", "Jun 2025", "W", "KO", 1, "1:41", "Punches"),
    ]),
  f("MW", 99, "Kyle Daukaus", "K.D.", "US", 17, 5, 0, 8, 7, 32, `6'2"`, `75"`, "Renzo Gracie Philly", "Grappler", 1515,
    66, 60, 62, 88, 62, 74, 82, [
      L("Eryk Anders", "UFC Fight Night", "Aug 2025", "W", "SUB", 1, "4:02", "Rear Naked Choke"),
    ]),
  f("LW", 99, "Mike Nallo", "Sick Nasty", "CA", 14, 4, 0, 6, 5, 30, `5'11"`, `73"`, "Niagara Top Team", "MMA", 1505,
    76, 74, 60, 74, 62, 72, 80, [
      L("Jordan Leavitt", "UFC Fight Night", "Nov 2025", "W", "KO", 2, "2:41", "Punches"),
    ]),
  f("LW", 99, "Nate Landwehr", "The Train", "US", 18, 8, 0, 10, 4, 37, `5'9"`, `70"`, "Mies Martial Arts", "Brawler", 1490,
    78, 78, 42, 60, 48, 88, 90, [
      L("Léo Santos", "UFC Fight Night", "Mar 2025", "W", "KO", 1, "4:11", "Punches"),
    ]),
  f("HW", 99, "Tanner Boser", "The Bulldozer", "CA", 22, 11, 1, 11, 4, 34, `6'2"`, `75"`, "Morrison MMA", "Boxer", 1485,
    78, 78, 45, 42, 52, 72, 82, [
      L("Alejandro Escamilla", "UFC Fight Night", "Jun 2025", "W", "KO", 2, "1:52", "Punches"),
    ]),
  f("HW", 99, "Jhonata Diniz", "Mad Dog", "BR", 9, 2, 0, 7, 0, 29, `6'3"`, `78"`, "Fighting Nerds", "Kickboxer", 1540,
    84, 88, 40, 38, 52, 70, 72, [
      L("Derrick Lewis", "UFC 330", "Apr 11, 2026", "L", "KO", 2, "3:12", "Overhand Right"),
    ]),
];

export const EVENTS: FightEvent[] = [
  {
    id: "ufn-edmonton-2026",
    name: "UFC Fight Night: Buckley vs. Malott",
    tagline: "Live from Rogers Place",
    date: "2026-10-18",
    venue: "Rogers Place",
    city: "Edmonton",
    country: "Canada",
    broadcaster: "Paramount+",
    status: "upcoming",
    bouts: [
      {
        aId: "joaquin-buckley", bId: "mike-malott", order: 1,
        label: "Main Event", rounds: 5,
        oddsA: 114, oddsB: -135,
      },
      {
        aId: "erin-blanchfield", bId: "jasmine-jasudavicius", order: 2,
        label: "Co-Main · Women's Flyweight", rounds: 3,
        oddsA: -340, oddsB: 270,
      },
      {
        aId: "kyle-daukaus", bId: "marc-andr-barriault", order: 3,
        label: "Main Card · Middleweight", rounds: 3,
        oddsA: -205, oddsB: 170,
      },
      {
        aId: "mike-nallo", bId: "nate-landwehr", order: 4,
        label: "Main Card · Lightweight", rounds: 3,
        oddsA: -305, oddsB: 245,
      },
      {
        aId: "jhonata-diniz", bId: "tanner-boser", order: 5,
        label: "Main Card · Heavyweight", rounds: 3,
        oddsA: -218, oddsB: 180,
      },
      {
        aId: "charles-jourdain", bId: "thomas-cuamba", order: 6,
        label: "Main Card · Bantamweight", rounds: 3,
        oddsA: -175, oddsB: 145,
      },
    ],
  },
  {
    id: "ufc-333",
    name: "UFC 333: Volkanovski vs. Evloev",
    tagline: "Featherweight title · Etihad Arena",
    date: "2026-10-24",
    venue: "Etihad Arena",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    broadcaster: "Paramount+ PPV",
    status: "upcoming",
    bouts: [
      {
        aId: "alexander-volkanovski", bId: "movsar-evloev", order: 1,
        label: "Main Event · UFC Featherweight Title", title: "UFC Featherweight Championship", rounds: 5,
      },
      {
        aId: "mackenzie-dern", bId: "zhang-weili", order: 2,
        label: "Co-Main · UFC Women's Strawweight Title", title: "UFC Women's Strawweight Championship", rounds: 5,
      },
      {
        aId: "tom-aspinall", bId: "sergei-pavlovich", order: 3,
        label: "Main Card · Heavyweight", rounds: 3,
      },
      {
        aId: "paddy-pimblett", bId: "charles-oliveira", order: 4,
        label: "Main Card · Lightweight", rounds: 3,
      },
      {
        aId: "song-yadong", bId: "umar-nurmagomedov", order: 5,
        label: "Main Card · Bantamweight", rounds: 3,
      },
      {
        aId: "michael-morales", bId: "carlos-prates", order: 6,
        label: "Main Card · Welterweight", rounds: 3,
      },
      {
        aId: "manel-kape", bId: "brandon-royval", order: 7,
        label: "Prelims · Flyweight", rounds: 3,
      },
    ],
  },
  {
    id: "ufn-nov7-2026",
    name: "UFC Fight Night: Allen vs. Imavov",
    tagline: "Middleweight title eliminator",
    date: "2026-11-07",
    venue: "UFC Apex",
    city: "Las Vegas",
    country: "United States",
    broadcaster: "Paramount+",
    status: "upcoming",
    bouts: [
      {
        aId: "nassourdine-imavov", bId: "brendan-allen", order: 1,
        label: "Main Event · Middleweight", rounds: 5,
      },
      {
        aId: "jack-della-maddalena", bId: "sean-brady", order: 2,
        label: "Co-Main · Welterweight", rounds: 3,
      },
      {
        aId: "bo-nickal", bId: "ateba-gautier", order: 3,
        label: "Main Card · Middleweight", rounds: 3,
      },
      {
        aId: "tatsuro-taira", bId: "brandon-royval", order: 4,
        label: "Main Card · Flyweight", rounds: 3,
      },
      {
        aId: "leon-edwards", bId: "kevin-holland", order: 5,
        label: "Main Card · Welterweight", rounds: 3,
      },
      {
        aId: "maycee-barber", bId: "karine-silva", order: 6,
        label: "Main Card · Women's Flyweight", rounds: 3,
      },
    ],
  },
];
