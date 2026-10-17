import { f, L } from "./core";

// ============ MEN — FEATHERWEIGHT / BANTAMWEIGHT / FLYWEIGHT ============
// Rankings & records as of Oct 17, 2026

export const FW = [
  f("FW", 0, "Alexander Volkanovski", "The Great", "AU", 28, 4, 0, 13, 3, 37, `5'6"`, `71"`, "Freestyle Fighting Gym", "Volume Striker", 1810,
    96, 80, 68, 74, 88, 88, 94, [
      L("Islam Makhachev", "UFC 284", "Feb 11, 2023", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Yair Rodríguez", "UFC 290", "Jul 8, 2023", "W", "KO", 3, "4:19", "Punches", "T"),
      L("Islam Makhachev", "UFC 294", "Oct 21, 2023", "L", "KO", 1, "3:06", "Head Kick", "T"),
      L("Ilia Topuria", "UFC 298", "Feb 17, 2024", "L", "KO", 2, "3:32", "Right Hand", "T"),
      L("Diego Lopes", "UFC 314", "Apr 12, 2025", "W", "UDEC", 5, "5:00", undefined, "V"),
      L("Yair Rodríguez", "UFC 327", "Feb 7, 2026", "W", "KO", 3, "2:57", "Punches", "T"),
    ]),
  f("FW", 1, "Movsar Evloev", "Tiger", "RU", 20, 0, 0, 4, 4, 31, `5'7"`, `68"`, "KHK Eagles", "Wrestler", 1740,
    78, 66, 92, 88, 93, 84, 88, [
      L("Arnold Allen", "UFC Fight Night", "Feb 2025", "W", "UDEC", 3, "5:00"),
      L("Lerone Murphy", "UFC Fight Night", "Feb 2026", "W", "UDEC", 3, "5:00"),
    ]),
  f("FW", 2, "Diego Lopes", "DLM3", "BR", 27, 7, 0, 11, 7, 31, `5'11"`, `73"`, "Lopes Brothers", "MMA", 1680,
    88, 86, 55, 88, 60, 78, 80, [
      L("Alexander Volkanovski", "UFC 314", "Apr 12, 2025", "L", "UDEC", 5, "5:00", undefined, "V"),
      L("Pat Sabatini", "UFC Fight Night", "Sep 6, 2025", "W", "SUB", 1, "1:54", "Guillotine"),
      L("Youssef Zalal", "UFC 328", "Mar 7, 2026", "W", "KO", 2, "4:02", "Left Hook"),
    ]),
  f("FW", 3, "Lerone Murphy", "The Iceman", "GB", 17, 0, 1, 7, 1, 33, `5'9"`, `73"`, "Manchester Top Team", "Striker", 1645,
    82, 76, 62, 58, 72, 82, 86, [
      L("Zabit Magomedsharipov", "UFC Fight Night", "Sep 7, 2019", "D", "MDEC", 3, "5:00"),
      L("Movsar Evloev", "UFC Fight Night", "Feb 2026", "L", "UDEC", 3, "5:00"),
    ]),
  f("FW", 4, "Aljamain Sterling", "Funk Master", "US", 24, 5, 0, 2, 8, 36, `5'7"`, `71"`, "Serra-Longo", "Wrestler", 1620,
    72, 58, 88, 90, 84, 78, 84, [
      L("Sean O'Malley", "UFC 292", "Aug 19, 2023", "L", "KO", 2, "0:51", "Right Hand", "T"),
      L("Calvin Kattar", "UFC 300", "Apr 13, 2024", "W", "UDEC", 3, "5:00"),
      L("Movsar Evloev", "UFC Fight Night", "Feb 2025", "L", "UDEC", 3, "5:00"),
    ]),
  f("FW", 5, "Jean Silva", "God's Son", "BR", 17, 4, 0, 11, 3, 28, `5'8"`, `70"`, "Fighting Nerds", "Striker", 1625,
    88, 88, 50, 68, 62, 82, 78, [
      L("Bryce Mitchell", "UFC Fight Night", "Sep 6, 2025", "W", "SUB", 2, "3:41", "Rear Naked Choke"),
      L("Joanderson Brito", "UFC 331", "Sep 12, 2026", "W", "KO", 1, "2:26", "Left Hook", undefined, "POTN"),
    ]),
  f("FW", 6, "Yair Rodríguez", "El Pantera", "MX", 20, 5, 0, 9, 2, 33, `5'11"`, `73"`, "Entram Gym", "Creative Striker", 1600,
    92, 80, 45, 55, 62, 76, 80, [
      L("Alexander Volkanovski", "UFC 290", "Jul 8, 2023", "L", "KO", 3, "4:19", "Punches", "T"),
      L("Patricio Pitbull", "UFC Fight Night", "Jul 12, 2025", "W", "KO", 3, "2:58", "Punches"),
      L("Alexander Volkanovski", "UFC 327", "Feb 7, 2026", "L", "KO", 3, "2:57", "Punches", "T"),
    ]),
  f("FW", 7, "Arnold Allen", "Almighty", "GB", 21, 6, 0, 9, 2, 32, `5'8"`, `70"`, "BKK Fighters", "Striker", 1575,
    84, 76, 58, 60, 70, 78, 82, [
      L("Max Holloway", "UFC Fight Night", "Apr 15, 2023", "L", "UDEC", 5, "5:00"),
      L("Movsar Evloev", "UFC Fight Night", "Feb 2025", "L", "UDEC", 3, "5:00"),
      L("Melquizael Costa", "UFC Fight Night", "Jun 2026", "W", "KO", 2, "3:41", "Punches"),
    ]),
  f("FW", 8, "Youssef Zalal", "The Moroccan Devil", "MA", 18, 6, 1, 6, 7, 29, `5'10"`, `72"`, "FactoryX", "MMA", 1565,
    78, 70, 55, 88, 62, 78, 84, [
      L("Diego Lopes", "UFC 328", "Mar 7, 2026", "L", "KO", 2, "4:02", "Left Hook"),
    ]),
  f("FW", 9, "Kevin Vallejos", "El Gallo", "AR", 15, 2, 0, 11, 1, 24, `5'9"`, `71"`, "Rosario Training Center", "Striker", 1510,
    84, 86, 45, 42, 55, 70, 72, [
      L("Jamall Emmers", "UFC Fight Night", "Jul 2025", "W", "KO", 1, "2:04", "Punches"),
    ]),
  f("FW", 10, "Joanderson Brito", "Tubarão", "BR", 20, 6, 0, 9, 7, 30, `5'8"`, `70"`, "Gorilla Fight Team", "Grappler", 1570,
    80, 78, 62, 86, 64, 76, 80, [
      L("Jean Silva", "UFC 331", "Sep 12, 2026", "L", "KO", 1, "2:26", "Left Hook"),
    ]),
  f("FW", 11, "Aaron Pico", null, "US", 14, 1, 0, 8, 1, 30, `5'6"`, `68"`, "Jackson-Wink", "Wrestler", 1535,
    76, 84, 90, 60, 78, 74, 76, [
      L("Henry Corrales", "Bellator 269", "Oct 2025", "W", "KO", 1, "1:47", "Punches"),
    ]),
  f("FW", 12, "Melquizael Costa", "Melq", "BR", 23, 6, 0, 10, 6, 26, `5'8"`, `69"`, "Gorilla Fight Team", "MMA", 1520,
    78, 72, 55, 80, 60, 74, 82, [
      L("Arnold Allen", "UFC Fight Night", "Jun 2026", "L", "KO", 2, "3:41", "Punches"),
    ]),
  f("FW", 13, "Steve Garcia", "The Weigh-In", "US", 22, 6, 0, 18, 0, 33, `6'0"`, `74"`, "Jackson-Wink", "Striker", 1500,
    84, 92, 42, 40, 55, 68, 70, [
      L("Kyle Nelson", "UFC Fight Night", "Aug 2025", "W", "KO", 1, "1:26", "Punches"),
    ]),
  f("FW", 14, "Patricio Pitbull", "Pitbull", "BR", 38, 8, 0, 13, 12, 39, `5'6"`, `69"`, "Pitbull Brothers", "Striker", 1520,
    88, 84, 45, 90, 62, 76, 78, [
      L("Yair Rodríguez", "UFC Fight Night", "Jul 12, 2025", "L", "KO", 3, "2:58", "Punches"),
    ]),
  f("FW", 15, "Brian Ortega", "T-City", "US", 17, 5, 0, 4, 8, 34, `5'8"`, `69"`, "Blackhouse", "Grappler", 1515,
    72, 60, 50, 96, 55, 78, 82, [
      L("Movsar Evloev", "UFC Fight Night", "Aug 2024", "L", "UDEC", 3, "5:00"),
    ]),
];

export const BW = [
  f("BW", 0, "Petr Yan", "No Mercy", "RU", 20, 5, 0, 7, 1, 33, `5'7"`, `69"`, "Tiger Muay Thai", "Boxer", 1750,
    92, 84, 62, 66, 82, 86, 86, [
      L("Aljamain Sterling", "UFC 259", "Mar 6, 2021", "L", "DQ", 4, "4:51", "Illegal Knee", "T"),
      L("Aljamain Sterling", "UFC 273", "Apr 9, 2022", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Sean O'Malley", "UFC 280", "Oct 22, 2022", "L", "SDEC", 3, "5:00"),
      L("Deiveson Figueiredo", "UFC Macau", "Nov 23, 2024", "W", "UDEC", 3, "5:00"),
      L("Merab Dvalishvili", "UFC 323", "Dec 6, 2025", "W", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("BW", 1, "Merab Dvalishvili", "The Machine", "GE", 20, 5, 0, 3, 1, 35, `5'6"`, `68"`, "Serra-Longo", "Pressure Wrestler", 1715,
    78, 62, 96, 84, 92, 88, 97, [
      L("Sean O'Malley", "UFC 306", "Sep 14, 2024", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Umar Nurmagomedov", "UFC 311", "Jan 18, 2025", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Petr Yan", "UFC 323", "Dec 6, 2025", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Song Yadong", "UFC Fight Night", "Mar 7, 2026", "W", "UDEC", 5, "5:00"),
    ]),
  f("BW", 2, "Song Yadong", "The Kung Fu Monkey", "CN", 22, 5, 1, 12, 2, 28, `5'8"`, `70"`, "Enbo Fight Club", "Striker", 1670,
    86, 84, 55, 58, 68, 78, 80, [
      L("Petr Yan", "UFC 299", "Mar 9, 2024", "L", "UDEC", 5, "5:00"),
      L("Mario Bautista", "UFC Fight Night", "Mar 1, 2025", "W", "UDEC", 3, "5:00"),
      L("Merab Dvalishvili", "UFC Fight Night", "Mar 7, 2026", "L", "UDEC", 5, "5:00"),
    ]),
  f("BW", 3, "Sean O'Malley", "Suga", "US", 19, 3, 0, 13, 2, 31, `5'10"`, `72"`, "MMA Lab", "Striker", 1675,
    92, 88, 50, 55, 62, 74, 80, [
      L("Petr Yan", "UFC 280", "Oct 22, 2022", "W", "SDEC", 3, "5:00"),
      L("Aljamain Sterling", "UFC 292", "Aug 19, 2023", "W", "KO", 2, "0:51", "Right Hand", "T"),
      L("Merab Dvalishvili", "UFC 306", "Sep 14, 2024", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Cory Sandhagen", "UFC 328", "Mar 7, 2026", "W", "KO", 2, "1:44", "Right Hand"),
    ]),
  f("BW", 4, "Umar Nurmagomedov", "Young Eagle", "RU", 19, 1, 0, 2, 7, 30, `5'8"`, `69"`, "Eagles MMA", "Wrestler", 1665,
    74, 62, 90, 92, 88, 82, 86, [
      L("Merab Dvalishvili", "UFC 311", "Jan 18, 2025", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Montel Jackson", "UFC Fight Night", "Jun 2026", "W", "SUB", 2, "3:12", "Rear Naked Choke"),
    ]),
  f("BW", 5, "Mario Bautista", "Baby Face", "US", 15, 2, 0, 6, 6, 32, `5'9"`, `70"`, "MMA Lab", "MMA", 1580,
    74, 70, 62, 88, 68, 74, 84, [
      L("Song Yadong", "UFC Fight Night", "Mar 1, 2025", "L", "UDEC", 3, "5:00"),
    ]),
  f("BW", 6, "Cory Sandhagen", "The Sandman", "US", 18, 5, 0, 9, 4, 34, `5'11"`, `70"`, "Elevation Fight Team", "Striker", 1630,
    88, 78, 55, 68, 72, 78, 84, [
      L("Petr Yan", "UFC 267", "Oct 30, 2021", "L", "UDEC", 5, "5:00", undefined, "I"),
      L("Rob Font", "UFC Fight Night", "May 4, 2024", "W", "SUB", 2, "2:01", "Front Choke"),
      L("Deiveson Figueiredo", "UFC Fight Night", "Oct 2024", "W", "UDEC", 3, "5:00"),
      L("Sean O'Malley", "UFC 328", "Mar 7, 2026", "L", "KO", 2, "1:44", "Right Hand"),
    ]),
  f("BW", 7, "David Martinez", "D-Mart", "MX", 13, 1, 0, 9, 2, 25, `5'6"`, `67"`, "Entram Gym", "Striker", 1540,
    82, 84, 50, 55, 60, 72, 76, [
      L("Marcus McGhee", "UFC Fight Night", "May 2026", "W", "KO", 2, "3:58", "Punches"),
    ]),
  f("BW", 8, "Raul Rosas Jr.", "El Nino Problema", "MX", 12, 2, 0, 4, 5, 21, `5'9"`, `69"`, "Rosas Training", "Grappler", 1520,
    62, 58, 82, 90, 70, 74, 80, [
      L("Christian Rodriguez", "UFC 287", "Apr 8, 2023", "L", "UDEC", 3, "5:00"),
    ]),
  f("BW", 9, "Farid Basharat", "Ferocious", "GB", 13, 0, 0, 3, 6, 26, `5'8"`, `70"`, "American Top Team", "MMA", 1560,
    74, 66, 72, 88, 74, 76, 84, [
      L("Taylor Lapilus", "UFC Fight Night", "Mar 2025", "W", "UDEC", 3, "5:00"),
    ]),
  f("BW", 10, "Marcus McGhee", "The Maniac", "US", 12, 2, 0, 10, 0, 28, `5'8"`, `70"`, "MMA Lab", "Striker", 1555,
    86, 90, 45, 48, 58, 74, 74, [
      L("Anthony Romero", "UFC 332", "Oct 3, 2026", "W", "KO", 1, "4:58", "Punches", undefined, "POTN"),
    ]),
  f("BW", 11, "Payton Talbott", "The Choice", "US", 10, 1, 0, 7, 2, 27, `5'10"`, `70"`, "Saucy Boxing", "Striker", 1560,
    84, 82, 50, 62, 60, 76, 78, [
      L("Deiveson Figueiredo", "UFC 332", "Oct 3, 2026", "W", "KO", 1, "2:09", "Right Hand"),
    ]),
  f("BW", 12, "Montel Jackson", "Quik", "US", 13, 3, 0, 8, 1, 33, `5'10"`, `73"`, "Milwaukee MMA", "Striker", 1510,
    82, 86, 55, 50, 62, 74, 76, [
      L("Umar Nurmagomedov", "UFC Fight Night", "Jun 2026", "L", "SUB", 2, "3:12", "Rear Naked Choke"),
    ]),
  f("BW", 13, "Aiemann Zahabi", null, "CA", 12, 2, 0, 6, 1, 38, `5'8"`, `70"`, "Tristar Gym", "Striker", 1495,
    80, 74, 55, 58, 68, 76, 80, [
      L("Javid Basharat", "UFC Fight Night", "Mar 2025", "W", "KO", 1, "1:47", "Left Hook"),
    ]),
  f("BW", 14, "Marlon Vera", "Chito", "EC", 24, 10, 1, 8, 1, 33, `5'8"`, `69"`, "Kings MMA", "Striker", 1545,
    82, 78, 50, 60, 65, 86, 84, [
      L("Sean O'Malley", "UFC 299", "Mar 9, 2024", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Davey Grant", "UFC Fight Night", "Mar 2025", "W", "KO", 1, "4:02", "Punches"),
    ]),
  f("BW", 15, "Bryce Mitchell", "Thug Nasty", "US", 19, 3, 0, 4, 11, 31, `5'10"`, `71"`, "Westside MMA", "Grappler", 1500,
    70, 62, 70, 92, 68, 76, 82, [
      L("Movsar Evloev", "UFC Fight Night", "Nov 12, 2022", "L", "SUB", 3, "4:37", "Neck Crank"),
      L("Josh Emmett", "UFC 296", "Dec 16, 2023", "L", "KO", 1, "1:05", "Ground & Pound"),
      L("Jean Silva", "UFC Fight Night", "Sep 6, 2025", "L", "SUB", 2, "3:41", "Rear Naked Choke"),
    ]),
  f("BW", 16, "Deiveson Figueiredo", "Deus da Guerra", "BR", 25, 10, 1, 10, 9, 38, `5'5"`, `68"`, "Fighting Nerds", "MMA", 1515,
    84, 84, 55, 86, 62, 80, 76, [
      L("Brandon Moreno", "UFC 283", "Jan 21, 2023", "L", "SUB", 3, "4:34", "Doctor Stoppage", "T"),
      L("Petr Yan", "UFC Macau", "Nov 23, 2024", "L", "UDEC", 3, "5:00"),
      L("Payton Talbott", "UFC 332", "Oct 3, 2026", "L", "KO", 1, "2:09", "Right Hand"),
    ]),
  f("BW", 17, "Charles Jourdain", "Air", "CA", 20, 10, 0, 8, 5, 30, `5'9"`, `71"`, "Tristar Gym", "Striker", 1500,
    82, 74, 50, 62, 60, 74, 80, [
      L("Jean Silva", "UFC 303", "Jun 29, 2024", "L", "KO", 2, "3:02", "Punches"),
    ]),
  f("BW", 18, "Thomas Cuamba", "The Sniper", "US", 10, 4, 0, 6, 1, 26, `5'8"`, `69"`, "Fargo MMA", "Striker", 1480,
    78, 76, 45, 55, 58, 70, 74, [
      L("Bogdan Grad", "UFC Fight Night", "Jun 2025", "W", "KO", 1, "3:11", "Punches"),
    ]),
];

export const FLW = [
  f("FLW", 0, "Joshua Van", "The Fearless", "MM", 18, 2, 0, 13, 2, 24, `5'6"`, `68"`, "Elevation Fight Team", "Striker", 1735,
    88, 90, 70, 70, 78, 80, 82, [
      L("Bruno Silva", "UFC Fight Night", "Apr 2024", "L", "KO", 2, "1:41", "Punches"),
      L("Alexandre Pantoja", "UFC 323", "Dec 6, 2025", "W", "KO", 3, "2:26", "Body Punches", "T"),
      L("Manel Kape", "UFC 328", "Mar 7, 2026", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Tatsuro Taira", "UFC 331", "Sep 12, 2026", "W", "KO", 2, "1:38", "Right Hand", "T"),
    ]),
  f("FLW", 1, "Alexandre Pantoja", "The Cannibal", "BR", 30, 6, 0, 9, 11, 36, `5'5"`, `67"`, "American Top Team", "BJJ", 1680,
    80, 74, 62, 94, 62, 84, 86, [
      L("Brandon Royval", "UFC 296", "Dec 16, 2023", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Steve Erceg", "UFC 301", "May 4, 2024", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Asu Almabayev", "UFC Fight Night", "Jun 2025", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Joshua Van", "UFC 323", "Dec 6, 2025", "L", "KO", 3, "2:26", "Body Punches", "T"),
    ]),
  f("FLW", 2, "Manel Kape", "Starboy", "AO", 24, 7, 0, 14, 2, 33, `5'8"`, `68"`, "American Top Team", "Striker", 1660,
    92, 88, 45, 55, 60, 76, 78, [
      L("Muhammad Mokaev", "UFC 304", "Jul 27, 2024", "W", "UDEC", 3, "5:00"),
      L("Amir Albazi", "UFC Fight Night", "Sep 6, 2025", "W", "KO", 3, "2:47", "Punches"),
      L("Joshua Van", "UFC 328", "Mar 7, 2026", "L", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("FLW", 3, "Brandon Royval", "Raw Dawg", "US", 18, 9, 0, 6, 8, 33, `5'6"`, `68"`, "FactoryX", "Chaos Striker", 1630,
    88, 72, 45, 78, 55, 78, 88, [
      L("Alexandre Pantoja", "UFC 296", "Dec 16, 2023", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Tatsuro Taira", "UFC Fight Night", "Oct 2024", "L", "UDEC", 5, "5:00"),
      L("Alex Perez", "UFC Fight Night", "Apr 2025", "W", "SUB", 1, "1:48", "Arm-Triangle Choke"),
    ]),
  f("FLW", 4, "Tatsuro Taira", "The Good Boy", "JP", 15, 1, 0, 5, 7, 26, `5'6"`, `68"`, "SDS Osaka", "Grappler", 1655,
    76, 66, 78, 92, 74, 78, 86, [
      L("Alex Perez", "UFC Fight Night", "Jun 2025", "W", "UDEC", 3, "5:00"),
      L("Joshua Van", "UFC 331", "Sep 12, 2026", "L", "KO", 2, "1:38", "Right Hand", "T"),
    ]),
  f("FLW", 5, "Asu Almabayev", "Zulfikar", "KZ", 23, 2, 0, 4, 10, 29, `5'5"`, `66"`, "Konsoil Team", "Grappler", 1600,
    70, 60, 70, 92, 72, 78, 88, [
      L("Alexandre Pantoja", "UFC Fight Night", "Jun 2025", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Amir Albazi", "UFC Fight Night", "Nov 2025", "W", "SUB", 2, "3:26", "Rear Naked Choke"),
    ]),
  f("FLW", 6, "Lone'er Kavanagh", "The Show Stealer", "GB", 12, 0, 0, 7, 0, 26, `5'6"`, `67"`, "Bristol Combat Athletics", "Striker", 1575,
    82, 84, 45, 50, 60, 74, 78, [
      L("Jose Ochoa", "UFC Fight Night", "Jul 2025", "W", "KO", 2, "4:11", "Punches"),
    ]),
  f("FLW", 7, "Ramazan Temirov", "The Pitbull", "KZ", 12, 3, 0, 9, 1, 27, `5'5"`, `66"`, "Saratov Team", "Striker", 1545,
    82, 88, 45, 42, 55, 70, 72, [
      L("Charles Johnson", "UFC Fight Night", "Feb 2026", "W", "KO", 1, "2:44", "Punches"),
    ]),
  f("FLW", 8, "Kyoji Horiguchi", "The Phantom", "JP", 31, 9, 0, 19, 7, 35, `5'6"`, `67"`, "American Top Team", "Striker", 1580,
    86, 78, 50, 60, 62, 76, 78, [
      L("Demetrious Johnson", "UFC 186", "Apr 25, 2015", "L", "SUB", 2, "4:52", "Armbar", "T"),
      L("Alexandre Pantoja", "UFC Fight Night", "May 2025", "W", "UDEC", 3, "5:00"),
    ]),
  f("FLW", 9, "Amir Albazi", "The Prince", "IQ", 19, 2, 0, 7, 9, 32, `5'6"`, `68"`, "London Shootfighters", "Grappler", 1585,
    76, 68, 55, 92, 60, 78, 82, [
      L("Kai Kara-France", "UFC Fight Night", "Mar 2024", "W", "UDEC", 3, "5:00"),
      L("Manel Kape", "UFC Fight Night", "Sep 6, 2025", "L", "KO", 3, "2:47", "Punches"),
    ]),
  f("FLW", 10, "Brandon Moreno", "The Assassin Baby", "MX", 24, 10, 2, 8, 9, 32, `5'7"`, `70"`, "Entram Gym", "Grappler", 1560,
    84, 74, 50, 88, 58, 84, 88, [
      L("Deiveson Figueiredo", "UFC 283", "Jan 21, 2023", "W", "SUB", 3, "4:34", "Doctor Stoppage", "T"),
      L("Asu Almabayev", "UFC Fight Night", "Mar 2025", "L", "UDEC", 3, "5:00"),
      L("Steve Erceg", "UFC Fight Night", "Jul 2025", "W", "SUB", 2, "2:57", "Rear Naked Choke"),
    ]),
  f("FLW", 11, "Mitch Raposo", "The Sniper", "US", 10, 1, 0, 4, 4, 27, `5'7"`, `69"`, "Sityodtong", "Wrestler", 1500,
    70, 62, 76, 82, 72, 72, 82, [
      L("Andre Lima", "UFC Fight Night", "Jun 2026", "W", "SUB", 1, "2:41", "Guillotine"),
    ]),
  f("FLW", 12, "Imanol Rodriguez", "El Toro", "MX", 9, 0, 0, 7, 0, 26, `5'6"`, `67"`, "Guadalajara MMA", "Striker", 1530,
    84, 90, 45, 40, 55, 72, 74, [
      L("Alden Coria", "UFC 332", "Oct 3, 2026", "W", "KO", 1, "3:11", "Punches", undefined, "POTN"),
    ]),
  f("FLW", 13, "Rei Tsuruya", null, "JP", 11, 1, 0, 5, 3, 25, `5'5"`, `66"`, "Tribe Tokyo", "Grappler", 1495,
    70, 62, 70, 84, 70, 72, 84, [
      L("Joshua Van", "UFC Fight Night", "Jun 2025", "L", "KO", 1, "2:26", "Punches"),
    ]),
  f("FLW", 14, "Sumudaerji", "The Tibetan Eagle", "CN", 21, 7, 0, 13, 0, 30, `5'9"`, `70"`, "Enbo Fight Club", "Striker", 1475,
    84, 88, 40, 35, 50, 68, 70, [
      L("Manel Kape", "UFC Fight Night", "Mar 2024", "L", "KO", 1, "1:52", "Punches"),
    ]),
  f("FLW", 15, "Charles Johnson", "Chuckie", "US", 16, 8, 0, 7, 5, 35, `5'9"`, `71"`, "MMA Masters", "MMA", 1465,
    74, 70, 55, 70, 58, 72, 80, [
      L("Ramazan Temirov", "UFC Fight Night", "Feb 2026", "L", "KO", 1, "2:44", "Punches"),
    ]),
  f("FLW", 16, "Steve Erceg", "Suplex Kid", "AU", 12, 4, 0, 5, 4, 30, `5'8"`, `68"`, "Wilkes MMA", "Grappler", 1500,
    76, 66, 62, 84, 62, 72, 80, [
      L("Alexandre Pantoja", "UFC 301", "May 4, 2024", "L", "KO", 2, "1:52", "Punches", "T"),
      L("Brandon Moreno", "UFC Fight Night", "Jul 2025", "L", "SUB", 2, "2:57", "Rear Naked Choke"),
    ]),
  f("FLW", 17, "Alex Perez", null, "US", 25, 9, 0, 7, 7, 33, `5'6"`, `68"`, "Team Oyama", "Wrestler", 1505,
    72, 66, 80, 70, 74, 74, 82, [
      L("Brandon Royval", "UFC Fight Night", "Apr 2025", "L", "SUB", 1, "1:48", "Arm-Triangle Choke"),
      L("Tatsuro Taira", "UFC Fight Night", "Jun 2025", "L", "UDEC", 3, "5:00"),
    ]),
  f("FLW", 18, "Tim Elliott", "The Dirty Bird", "US", 20, 12, 1, 8, 8, 39, `5'7"`, `68"`, "Kill Cliff FC", "Wrestler", 1455,
    68, 62, 72, 70, 62, 70, 78, [
      L("Tatsuro Taira", "UFC Fight Night", "May 2024", "L", "SUB", 1, "4:07", "Armbar"),
    ]),
];
