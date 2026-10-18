import { f, L } from "./core";
import { d } from "./depth";

// ============ DEPTH ROSTER I — HW / LHW / MW ============
// Journeymen, prospects & notable actives. Bout histories are generated
// deterministically from each fighter's real record & win-method split.

export const HW_DEPTH = [
  // --- hand-written notables (cross-referenced with existing logs) ---
  f("HW", 99, "Jailton Almeida", "Malvadeza", "BR", 23, 4, 0, 8, 13, 28, `6'0"`, `76"`, "Fighting Nerds", "Grappler", 1600,
    68, 62, 88, 94, 82, 76, 88, [
      L("Anton Turkalj", "UFC Fight Night", "Sep 2023", "W", "SUB", 1, "2:00", "Rear Naked Choke"),
      L("Shamil Abdurakhimov", "UFC Fight Night", "Jan 2024", "W", "SUB", 2, "4:10", "Rear Naked Choke"),
      L("Derrick Lewis", "UFC Fight Night: Louisville", "Jun 2024", "W", "UDEC", 5, "5:00"),
      L("Alexander Volkov", "UFC 327", "Feb 7, 2026", "L", "UDEC", 5, "5:00"),
    ]),
  f("HW", 99, "Tai Tuivasa", "Bam Bam", "AU", 15, 9, 0, 14, 0, 33, `6'2"`, `75"`, "Soma Fight Club", "Boxer", 1520,
    80, 95, 40, 35, 50, 74, 62, [
      L("Greg Hardy", "UFC 271", "Feb 12, 2022", "W", "KO", 1, "1:07", "Punches"),
      L("Ciryl Gane", "UFC Paris", "Sep 3, 2022", "L", "KO", 3, "4:23", "Overhand Right"),
      L("Alexander Volkov", "UFC 293", "Sep 9, 2023", "L", "SUB", 2, "4:07", "Arm-Triangle"),
      L("Marcin Tybura", "UFC Fight Night", "Mar 2024", "L", "UDEC", 5, "5:00"),
    ]),
  f("HW", 99, "Blagoy Ivanov", "Bagata", "BG", 24, 6, 1, 8, 6, 40, `5'11"`, `73"`, "Sofia MMA", "Sambo", 1510,
    74, 72, 84, 78, 82, 84, 78, [
      L("Marcin Tybura", "UFC 268", "Nov 6, 2021", "L", "SDEC", 3, "5:00"),
      L("Augusto Sakai", "UFC Fight Night", "May 2022", "W", "KO", 2, "3:40", "Punches"),
      L("Ante Delija", "UFC Fight Night", "Jun 2026", "L", "KO", 2, "2:41", "Punches"),
    ]),
  f("HW", 99, "Marcin Tybura", "Tybur", "PL", 27, 11, 0, 12, 7, 40, `6'3"`, `78"`, "Ankos MMA", "Wrestler", 1540,
    72, 68, 86, 78, 80, 78, 84, [
      L("Walt Harris", "UFC Fight Night", "Jun 2022", "W", "KO", 1, "4:06", "Punches"),
      L("Blagoy Ivanov", "UFC 268", "Nov 6, 2021", "W", "SDEC", 3, "5:00"),
      L("Tai Tuivasa", "UFC Fight Night", "Mar 2024", "W", "UDEC", 5, "5:00"),
      L("Alexander Volkov", "UFC 267", "Oct 30, 2021", "L", "UDEC", 5, "5:00"),
      L("Tom Aspinall", "UFC Fight Night", "Mar 19, 2022", "L", "SUB", 1, "1:00", "Straight Armlock"),
    ]),
  // --- generated depth ---
  d("HW", 99, "Denis Goltsov", null, "RU", 26, 8, 0, 14, 6, 34, `6'4"`, `80"`, "K.Dojo", "Sambo", 1560),
  d("HW", 99, "Tallison Teixeira", "Xodó", "BR", 10, 1, 0, 7, 1, 27, `6'7"`, `84"`, "Nick Catone MMA", "Striker", 1530),
  d("HW", 99, "Karl Williams", "Barcode", "US", 14, 3, 0, 3, 6, 35, `6'3"`, `79"`, "MMA Factory", "Wrestler", 1510),
  d("HW", 99, "Mick Parkin", "The Bounty Hunter", "GB", 13, 1, 0, 6, 3, 30, `6'4"`, `78"`, "Team Kaobon", "Boxer", 1500),
  d("HW", 99, "Hamdy Abdelwahab", "The Hammer", "EG", 8, 3, 0, 3, 4, 33, `6'2"`, `77"`, "Tristar Gym", "Wrestler", 1470),
  d("HW", 99, "Mohammed Usman", "The Motor", "NG", 10, 4, 0, 5, 2, 35, `6'2"`, `76"`, "Jackson Wink MMA", "Wrestler", 1480),
  d("HW", 99, "Justin Tafa", "Bad Blood", "NZ", 10, 4, 1, 8, 0, 31, `6'0"`, `75"`, "City Kickboxing", "Striker", 1490),
  d("HW", 99, "Austen Lane", "The Paintbrush", "US", 14, 6, 0, 10, 1, 36, `6'4"`, `80"`, "Combat Club", "Striker", 1460),
  d("HW", 99, "Don'Tale Mayes", "The Crochet King", "US", 12, 6, 0, 7, 1, 33, `6'6"`, `81"`, "SF Fitness & Boxing", "Striker", 1450),
  d("HW", 99, "Alexandr Romanov", "King Kong", "MD", 18, 3, 0, 7, 8, 34, `6'2"`, `76"`, "Gorets FT", "Wrestler", 1520),
  d("HW", 99, "Marcos Rogério de Lima", "Pezão", "BR", 24, 10, 1, 14, 3, 39, `6'1"`, `77"`, "Tata Fight Team", "Striker", 1490),
  d("HW", 99, "Augusto Sakai", null, "BR", 16, 7, 1, 11, 0, 33, `6'3"`, `77"`, "Kimura Nova União", "Striker", 1490, { retired: true }),
  d("HW", 99, "Rodrigo Nascimento", "Yogi Bear", "BR", 13, 4, 0, 4, 7, 33, `6'2"`, `76"`, "Dias BJJ", "Grappler", 1490, { retired: true }),
  d("HW", 99, "Stefan Struve", "The Skyscraper", "NL", 33, 13, 0, 17, 8, 38, `7'0"`, `85"`, "SBG Ireland", "Striker", 1500, { retired: true }),
  d("HW", 99, "Ben Rothwell", "Big Ben", "US", 39, 15, 0, 30, 2, 44, `6'4"`, `80"`, "Roufusport", "Striker", 1500, { retired: true }),
  d("HW", 99, "Juan Espino", "El Guapo", "ES", 11, 2, 0, 2, 8, 43, `6'3"`, `78"`, "Canary Islands MMA", "Grappler", 1460, { retired: true }),
  d("HW", 99, "Chase Sherman", "The Vanilla Gorilla", "US", 17, 12, 0, 11, 2, 35, `6'4"`, `78"`, "Jackson Wink MMA", "Striker", 1430, { retired: true }),
  d("HW", 99, "Jake Collier", "Bear", "US", 15, 11, 0, 6, 6, 37, `6'3"`, `76"`, "Grudge Training Center", "MMA", 1420, { retired: true }),
  d("HW", 99, "Josh Parisian", "Big Pretty", "US", 17, 7, 0, 10, 3, 35, `6'4"`, `79"`, "Alpha Dog MMA", "Striker", 1430),
  d("HW", 99, "Parker Porter", "Team Pork Chop", "US", 14, 8, 0, 6, 4, 40, `5'11"`, `74"`, "Underground MMA & Fitness", "Wrestler", 1410),
  d("HW", 99, "Yorgan De Castro", "The Mad Ox", "CV", 10, 5, 0, 6, 1, 34, `5'11"`, `74"`, "Cape Verde MMA", "Striker", 1430),
  d("HW", 99, "Jared Vanderaa", "The Mountain", "US", 13, 9, 0, 8, 4, 33, `6'4"`, `79"`, "Team Quest", "MMA", 1420, { retired: true }),
  d("HW", 99, "Walt Harris", "The Big Ticket", "US", 16, 11, 0, 12, 2, 42, `6'5"`, `80"`, "American Top Team", "Striker", 1450, { retired: true }),
  d("HW", 99, "Chris Daukaus", "Houdini", "US", 15, 8, 0, 10, 3, 36, `6'2"`, `76"`, "Martinez BJJ", "Striker", 1440, { retired: true }),
  d("HW", 99, "Anton Turkalj", "The Pleasure Man", "SE", 10, 3, 0, 6, 3, 30, `6'4"`, `79"`, "Allstars Training Center", "MMA", 1460),
];

export const LHW_DEPTH = [
  // --- hand-written notables ---
  f("LHW", 99, "Jamahal Hill", "Sweet Dreams", "US", 12, 2, 0, 7, 0, 35, `6'4"`, `79"`, "Detroit Underground MMA", "Boxer", 1620,
    86, 92, 55, 50, 66, 82, 76, [
      L("Paul Craig", "UFC Fight Night", "Mar 2022", "W", "KO", 1, "3:57", "Punches"),
      L("Johnny Walker", "UFC Fight Night", "May 2023", "W", "KO", 1, "2:55", "Punches"),
      L("Glover Teixeira", "UFC 283", "Jan 21, 2023", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Alex Pereira", "UFC 300", "Apr 13, 2024", "L", "KO", 1, "2:12", "Left Hook", "T"),
      L("Jiří Procházka", "UFC 311", "Jan 18, 2025", "L", "KO", 3, "4:20", "Punches"),
    ]),
  f("LHW", 99, "Thiago Santos", "Marreta", "BR", 23, 13, 0, 16, 3, 42, `6'2"`, `75"`, "Tata Fight Team", "Striker", 1580,
    82, 90, 58, 60, 64, 74, 70, [
      L("Jan Błachowicz", "UFC on ESPN", "Feb 2019", "W", "KO", 3, "0:40", "Body Kick"),
      L("Jon Jones", "UFC 239", "Jul 6, 2019", "L", "SDEC", 5, "5:00", undefined, "T"),
      L("Glover Teixeira", "UFC Fight Night", "Nov 7, 2020", "L", "SUB", 3, "4:33", "Rear Naked Choke"),
    ]),
  f("LHW", 99, "Ryan Spann", "Superman", "US", 23, 8, 0, 12, 8, 34, `6'5"`, `81"`, "Fortis MMA", "MMA", 1540,
    76, 78, 74, 80, 74, 74, 76, [
      L("Ion Cuțelaba", "UFC on ESPN 14", "Sep 2020", "W", "KO", 1, "0:26", "Punches"),
      L("Nikita Krylov", "UFC Fight Night", "Mar 2023", "L", "SUB", 3, "1:12", "Triangle Choke"),
      L("Waldo Cortes-Acosta", "UFC Fight Night", "May 17, 2025", "L", "UDEC", 3, "5:00"),
    ]),
  // --- generated depth ---
  d("LHW", 99, "Johnny Walker", null, "BR", 22, 9, 0, 17, 3, 34, `6'6"`, `82"`, "Tristar Gym", "Striker", 1520),
  d("LHW", 99, "Volkan Oezdemir", "No Time", "CH", 21, 8, 0, 13, 3, 36, `6'2"`, `75"`, "SMT Bagnères", "Striker", 1530),
  d("LHW", 99, "Paul Craig", "Bearjew", "GB", 19, 10, 1, 5, 14, 37, `6'3"`, `78"`, "Higher Level MMA", "Grappler", 1500),
  d("LHW", 99, "Jimmy Crute", "The Brute", "AU", 14, 5, 1, 6, 6, 28, `6'2"`, `77"`, "Gracie Smeaton Grange", "MMA", 1490),
  d("LHW", 99, "Ion Cuțelaba", "The Hulk", "MD", 19, 8, 1, 11, 4, 32, `6'1"`, `75"`, "Xtreme Couture", "Wrestler", 1490),
  d("LHW", 99, "Da Un Jung", "Slick", "KR", 16, 5, 1, 11, 2, 31, `6'3"`, `78"`, "Korean Zombie MMA", "Striker", 1480, { retired: true }),
  d("LHW", 99, "Misha Cirkunov", "The Wolf", "LV", 16, 8, 0, 8, 7, 39, `6'3"`, `77"`, "Toronto BJJ", "Grappler", 1460, { retired: true }),
  d("LHW", 99, "Ovince Saint Preux", "OSP", "HT", 30, 18, 0, 14, 11, 43, `6'3"`, `80"`, "Knoxville MMA", "MMA", 1470, { retired: true }),
  d("LHW", 99, "Anthony Smith", "Lionheart", "US", 39, 22, 0, 21, 13, 38, `6'4"`, `78"`, "Factory X", "MMA", 1530, { retired: true }),
  d("LHW", 99, "Ibo Aslan", "The Last Ottoman", "TR", 15, 2, 0, 12, 1, 30, `6'3"`, `79"`, "Istanbul Fight Club", "Striker", 1490),
  d("LHW", 99, "Gian Villante", null, "US", 20, 12, 0, 10, 3, 40, `6'3"`, `78"`, "Serra-Longo Fight Team", "Wrestler", 1430, { retired: true }),
  d("LHW", 99, "Ed Herman", "Short Fuse", "US", 27, 14, 0, 11, 11, 45, `6'3"`, `76"`, "Team Quest", "MMA", 1420, { retired: true }),
  d("LHW", 99, "Caio Machado", null, "BR", 12, 4, 0, 7, 2, 31, `6'4"`, `78"`, "CM Systems", "Striker", 1450),
];

export const MW_DEPTH = [
  d("MW", 99, "Jared Cannonier", "The Killa Gorilla", "US", 19, 8, 0, 11, 3, 42, `6'0"`, `77"`, "AKA", "Striker", 1600),
  d("MW", 99, "Marvin Vettori", "The Italian Dream", "IT", 21, 6, 1, 3, 9, 33, `6'0"`, `74"`, "Kings MMA", "Boxer", 1610),
  d("MW", 99, "Jack Hermansson", "The Joker", "NO", 25, 8, 0, 12, 8, 38, `6'1"`, `77"`, "Frontline Academy", "MMA", 1570),
  d("MW", 99, "Shara Magomedov", "Shara Bullet", "RU", 16, 1, 0, 11, 0, 32, `6'2"`, `78"`, "Gorets FT", "Striker", 1560),
  d("MW", 99, "Gegard Mousasi", "The Dreamcatcher", "NL", 49, 9, 2, 28, 12, 41, `6'1"`, `76"`, "American Top Team", "Kickboxer", 1690, { retired: true }),
  d("MW", 99, "Derek Brunson", "The One", "US", 25, 10, 0, 11, 6, 41, `6'0"`, `73"`, "Sanford MMA", "Wrestler", 1540, { retired: true }),
  d("MW", 99, "Uriah Hall", "Prime Time", "JM", 19, 11, 0, 14, 3, 41, `6'0"`, `76"`, "Serra-Longo Fight Team", "Striker", 1520, { retired: true }),
  d("MW", 99, "Darren Till", "The Gorilla", "GB", 20, 6, 1, 11, 4, 33, `6'0"`, `74"`, "Team Kaobon", "Striker", 1560, { retired: true }),
  d("MW", 99, "Brunno Ferreira", "Brucutu", "BR", 14, 1, 0, 8, 5, 30, `5'11"`, `75"`, "CM Systems", "Grappler", 1520),
  d("MW", 99, "Rodolfo Vieira", "The Black Belt Hunter", "BR", 12, 2, 0, 2, 9, 36, `6'2"`, `77"`, "American Top Team", "BJJ", 1510),
  d("MW", 99, "Jun Yong Park", "The Iron Turtle", "KR", 19, 6, 0, 7, 7, 33, `6'0"`, `75"`, "Korean Zombie MMA", "MMA", 1490),
  d("MW", 99, "Eryk Anders", "Ya Boi", "US", 18, 9, 1, 12, 2, 38, `6'1"`, `75"`, "Spartan Fitness", "Wrestler", 1460),
  d("MW", 99, "Chris Curtis", "The Action Man", "US", 32, 13, 0, 12, 7, 38, `5'10"`, `73"`, "Xtreme Couture", "Boxer", 1500),
  d("MW", 99, "Brad Tavares", "The Wolverine", "US", 23, 10, 0, 10, 2, 38, `6'1"`, `74"`, "Xtreme Couture", "Striker", 1470, { retired: true }),
  d("MW", 99, "Jacob Malkoun", "Bruiser", "AU", 10, 5, 0, 1, 6, 30, `5'11"`, `73"`, "AKA Thailand", "Wrestler", 1470),
  d("MW", 99, "Armen Petrosyan", "Superman", "IT", 12, 3, 0, 8, 1, 31, `6'2"`, `77"`, "Gloria Gym", "Kickboxer", 1480),
  d("MW", 99, "Sam Alvey", "Smile'N", "US", 37, 20, 1, 20, 4, 40, `6'2"`, `75"`, "Victory MMA", "Boxer", 1400, { retired: true }),
  d("MW", 99, "Denis Tiuliulin", "Tuli", "KG", 12, 9, 0, 8, 2, 38, `6'0"`, `75"`, "Tiger Muay Thai", "Striker", 1420),
  d("MW", 99, "Cody Brundage", "One Shot", "US", 13, 8, 0, 8, 4, 31, `6'0"`, `74"`, "Kill Cliff FC", "Wrestler", 1430),
  d("MW", 99, "Andre Petroski", null, "US", 15, 4, 0, 8, 4, 33, `6'0"`, `75"`, "Round Tap MMA", "Wrestler", 1490),
  d("MW", 99, "Josh Fremd", "Pretty Boi", "US", 12, 6, 0, 6, 3, 31, `6'2"`, `77"`, "The Academy", "Striker", 1450),
  d("MW", 99, "Zach Reese", "A-Train", "US", 9, 3, 0, 5, 2, 27, `6'3"`, `78"`, "MMA Trained", "Striker", 1440),
];
