import { f, L } from "./core";

// ============ MEN — HEAVYWEIGHT / LIGHT HEAVYWEIGHT / MIDDLEWEIGHT ============
// Rankings & records as of Oct 17, 2026

export const HW = [
  f("HW", 0, "Ciryl Gane", "Bon Gamin", "FR", 14, 2, 0, 6, 1, 36, `6'4"`, `81"`, "MMA Factory", "Kickboxer", 1685,
    88, 78, 55, 62, 70, 74, 80, [
      L("Francis Ngannou", "UFC 270", "Jan 22, 2022", "L", "UDEC", 5, "5:00"),
      L("Tai Tuivasa", "UFC Paris", "Sep 3, 2022", "W", "KO", 3, "4:23"),
      L("Jon Jones", "UFC 285", "Mar 4, 2023", "L", "SUB", 2, "2:04", "Guillotine", "T"),
      L("Alexander Volkov", "UFC Fight Night", "Mar 1, 2025", "W", "UDEC", 5, "5:00"),
      L("Serghei Spivac", "UFC Fight Night: Paris", "Sep 6, 2025", "W", "KO", 2, "1:49", "Ground & Pound"),
      L("Alex Pereira", "UFC 331", "Sep 14, 2026", "W", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("HW", 1, "Tom Aspinall", null, "GB", 16, 3, 0, 11, 3, 33, `6'5"`, `78"`, "Team Kaobon", "MMA", 1760,
    84, 91, 80, 82, 85, 80, 78, [
      L("Curtis Blaydes", "UFC Fight Night", "Jul 23, 2022", "L", "KO", 1, "0:59", "Knee Injury"),
      L("Marcin Tybura", "UFC Fight Night", "Jul 22, 2023", "W", "KO", 1, "1:07", "Right Hand"),
      L("Sergei Pavlovich", "UFC 295", "Nov 11, 2023", "W", "KO", 1, "1:09", "Right Hand", "I"),
      L("Curtis Blaydes", "UFC 304", "Jul 27, 2024", "W", "KO", 1, "0:51", "Right Hand", "I"),
      L("Alex Pereira", "UFC 326", "Feb 21, 2026", "L", "KO", 2, "1:38", "Left Hook", "T"),
    ]),
  f("HW", 2, "Alexander Volkov", "Drago", "RU", 40, 12, 0, 26, 6, 38, `6'7"`, `80"`, "Strela Team", "Striker", 1655,
    86, 80, 55, 60, 68, 72, 76, [
      L("Tom Aspinall", "UFC Fight Night", "Mar 19, 2022", "L", "SUB", 1, "1:00", "Straight Armlock"),
      L("Tai Tuivasa", "UFC 293", "Sep 9, 2023", "W", "SUB", 2, "4:07", "Arm-Triangle"),
      L("Rizvan Kuniev", "UFC Fight Night", "May 17, 2025", "W", "UDEC", 3, "5:00"),
      L("Jailton Almeida", "UFC 327", "Feb 7, 2026", "W", "UDEC", 5, "5:00"),
    ]),
  f("HW", 3, "Alex Pereira", "Poatan", "BR", 12, 3, 0, 10, 0, 39, `6'4"`, `79"`, "Teixeira MMA", "Striker", 1730,
    92, 96, 45, 50, 62, 82, 70, [
      L("Israel Adesanya", "UFC 287", "Apr 8, 2023", "L", "KO", 2, "4:21", "Right Hand"),
      L("Jiří Procházka", "UFC 295", "Nov 11, 2023", "W", "KO", 2, "2:10", "Elbows", "T"),
      L("Jamahal Hill", "UFC 300", "Apr 13, 2024", "W", "KO", 1, "2:12", "Left Hook", "T"),
      L("Khalil Rountree", "UFC 307", "Oct 5, 2024", "W", "KO", 4, "4:32", "Punches", "T"),
      L("Magomed Ankalaev", "UFC 313", "Mar 8, 2025", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Tom Aspinall", "UFC 326", "Feb 21, 2026", "W", "KO", 2, "1:38", "Left Hook", "T"),
      L("Ciryl Gane", "UFC 331", "Sep 14, 2026", "L", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("HW", 4, "Sergei Pavlovich", null, "RU", 19, 2, 0, 18, 0, 34, `6'3"`, `84"`, "Fight Nights Team", "Striker", 1660,
    85, 97, 55, 55, 65, 72, 62, [
      L("Alistair Overeem", "UFC Fight Night", "Mar 9, 2019", "L", "KO", 1, "4:21", "Punches"),
      L("Tom Aspinall", "UFC 295", "Nov 11, 2023", "L", "KO", 1, "1:09", "Right Hand", "I"),
      L("Curtis Blaydes", "UFC Fight Night", "Mar 14, 2026", "W", "KO", 1, "0:44", "Punches"),
    ]),
  f("HW", 5, "Josh Hokit", "Hitch", "US", 10, 0, 0, 6, 2, 30, `6'2"`, `78"`, "AKA", "Wrestler", 1560,
    72, 84, 88, 76, 84, 78, 82, [
      L("Karl Williams", "UFC Fight Night", "May 10, 2025", "W", "UDEC", 3, "5:00"),
      L("Hamdy Abdelwahab", "UFC Fight Night", "Jan 24, 2026", "W", "KO", 2, "3:05", "Punches"),
    ]),
  f("HW", 6, "Waldo Cortes-Acosta", "Samba", "DO", 14, 2, 0, 8, 0, 34, `6'4"`, `80"`, "MMA Masters", "Striker", 1555,
    80, 74, 55, 50, 68, 76, 80, [
      L("Ryan Spann", "UFC Fight Night", "May 17, 2025", "W", "UDEC", 3, "5:00"),
      L("Mario Pinto", "UFC Fight Night", "Aug 2, 2025", "W", "SDEC", 3, "5:00"),
    ]),
  f("HW", 7, "Curtis Blaydes", "Razor", "US", 20, 6, 0, 13, 1, 35, `6'2"`, `80"`, "Elevation Fight Team", "Wrestler", 1600,
    74, 85, 92, 78, 88, 74, 76, [
      L("Tom Aspinall", "UFC Fight Night", "Jul 23, 2022", "W", "KO", 1, "0:59", "Knee Injury"),
      L("Tom Aspinall", "UFC 304", "Jul 27, 2024", "L", "KO", 1, "0:51", "Right Hand", "I"),
      L("Valter Walker", "UFC Fight Night", "Aug 2, 2025", "W", "UDEC", 3, "5:00"),
      L("Sergei Pavlovich", "UFC Fight Night", "Mar 14, 2026", "L", "KO", 1, "0:44", "Punches"),
    ]),
  f("HW", 8, "Rizvan Kuniev", null, "RU", 16, 2, 0, 7, 5, 33, `6'2"`, `76"`, "Gorets FT", "Wrestler", 1545,
    68, 70, 88, 78, 82, 78, 84, [
      L("Alexander Volkov", "UFC Fight Night", "May 17, 2025", "L", "UDEC", 3, "5:00"),
      L("Anthony Wint", "UFC 330", "Apr 11, 2026", "W", "SUB", 2, "2:38", "Rear Naked Choke"),
    ]),
  f("HW", 9, "Vitor Petrino", null, "BR", 14, 2, 0, 9, 2, 29, `6'3"`, `79"`, "CM Systems", "MMA", 1560,
    82, 82, 70, 62, 72, 78, 82, [
      L("Alexander Volkov", "UFC Fight Night", "Jun 7, 2025", "L", "UDEC", 3, "5:00"),
      L("Serghei Spivac", "UFC Fight Night", "Jan 24, 2026", "W", "KO", 2, "4:02", "Left Hook"),
    ]),
  f("HW", 10, "Serghei Spivac", "Polar Bear", "MD", 18, 5, 0, 7, 7, 31, `6'3"`, `78"`, "Spivac Team", "Grappler", 1585,
    70, 74, 80, 88, 70, 78, 80, [
      L("Marcin Tybura", "UFC Fight Night", "Aug 12, 2023", "W", "SUB", 2, "1:57", "Armbar"),
      L("Ciryl Gane", "UFC Fight Night: Paris", "Sep 6, 2025", "L", "KO", 2, "1:49", "Ground & Pound"),
      L("Vitor Petrino", "UFC Fight Night", "Jan 24, 2026", "L", "KO", 2, "4:02", "Left Hook"),
    ]),
  f("HW", 11, "Ante Delija", null, "HR", 27, 6, 0, 15, 5, 36, `6'4"`, `80"`, "American Top Team", "MMA", 1530,
    76, 82, 70, 74, 72, 76, 78, [
      L("Brandon? Ivanov", "UFC Fight Night", "Jun 2026", "W", "KO", 2, "2:41", "Punches"),
    ]),
  f("HW", 12, "Valter Walker", "Big Walker", "BR", 13, 3, 0, 5, 6, 31, `6'5"`, `79"`, "SBG Ireland", "Grappler", 1500,
    62, 58, 70, 90, 68, 72, 74, [
      L("Curtis Blaydes", "UFC Fight Night", "Aug 2, 2025", "L", "UDEC", 3, "5:00"),
      L("Mick Parkin", "UFC 332", "Oct 3, 2026", "W", "SUB", 1, "4:44", "Armbar"),
    ]),
  f("HW", 13, "Derrick Lewis", "The Black Beast", "US", 29, 12, 0, 27, 0, 41, `6'3"`, `79"`, "MMA Mafia", "Striker", 1490,
    76, 98, 55, 48, 62, 70, 50, [
      L("Rodrigo Nascimento", "UFC Fight Night", "May 10, 2025", "W", "KO", 3, "4:15", "Punches"),
      L("Tallison Teixeira", "UFC Fight Night", "Jul 19, 2025", "L", "KO", 1, "0:48", "Punches"),
      L("Jhonata Diniz", "UFC 330", "Apr 11, 2026", "W", "KO", 2, "3:12", "Overhand Right", undefined, "POTN"),
    ]),
  f("HW", 14, "Aleksandar Rakić", "Rocket", "AT", 16, 6, 0, 10, 2, 34, `6'4"`, `80"`, "SBG Vienna", "Striker", 1515,
    84, 82, 55, 50, 70, 74, 76, [
      L("Magomed Ankalaev", "UFC 254", "Oct 24, 2020", "L", "SDEC", 3, "5:00"),
      L("Jiří Procházka", "UFC on ESPN", "Apr 29, 2023", "L", "KO", 2, "2:12", "Punches"),
      L("Carlos Ulberg", "UFC Fight Night", "May 3, 2025", "L", "KO", 1, "0:56", "Left Hook"),
      L("Mario Pinto", "UFC Fight Night", "Aug 2, 2025", "W", "KO", 1, "1:26", "Right Hand"),
    ]),
  f("HW", 15, "Mario Pinto", null, "PT", 10, 1, 0, 6, 1, 30, `6'5"`, `81"`, "Lisboa MMA", "Striker", 1495,
    80, 84, 55, 55, 65, 74, 78, [
      L("Waldo Cortes-Acosta", "UFC Fight Night", "Aug 2, 2025", "L", "SDEC", 3, "5:00"),
      L("Aleksandar Rakić", "UFC Fight Night", "Aug 2, 2025", "L", "KO", 1, "1:26", "Right Hand"),
    ]),
];

export const LHW = [
  f("LHW", 0, "Carlos Ulberg", "Black Jag", "NZ", 15, 1, 0, 9, 2, 35, `6'4"`, `77"`, "City Kickboxing", "Striker", 1690,
    89, 86, 62, 60, 72, 80, 78, [
      L("Paul Craig", "UFC Fight Night", "Feb 12, 2022", "L", "SUB", 1, "4:02", "Triangle Choke"),
      L("Da-un Jung", "UFC 293", "Sep 9, 2023", "W", "KO", 3, "3:35", "Punches"),
      L("Aleksandar Rakić", "UFC Fight Night", "May 3, 2025", "W", "KO", 1, "0:56", "Left Hook"),
      L("Jan Błachowicz", "UFC Fight Night", "Sep 6, 2025", "W", "UDEC", 5, "5:00"),
      L("Jiří Procházka", "UFC 330", "Apr 11, 2026", "W", "KO", 2, "2:47", "Right Hook", "V"),
    ]),
  f("LHW", 1, "Magomed Ankalaev", null, "RU", 22, 1, 1, 12, 3, 34, `6'3"`, `75"`, "Gorets FT", "Sambo", 1720,
    88, 82, 62, 70, 78, 84, 82, [
      L("Paul Craig", "UFC Fight Night", "Mar 17, 2018", "L", "SUB", 1, "4:40", "Triangle Choke"),
      L("Jan Błachowicz", "UFC Fight Night", "Jul 12, 2020", "D", "SDEC", 3, "5:00"),
      L("Johnny Walker", "UFC Fight Night", "Oct 22, 2022", "NC", "DQ", 1, "3:29"),
      L("Alex Pereira", "UFC 313", "Mar 8, 2025", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Khalil Rountree", "UFC Fight Night", "Feb 21, 2026", "W", "UDEC", 5, "5:00"),
    ]),
  f("LHW", 2, "Jiří Procházka", "Denisa", "CZ", 30, 5, 1, 25, 5, 34, `6'3"`, `80"`, "Jetsaam Gym", "Samurai", 1680,
    90, 88, 55, 62, 66, 78, 72, [
      L("Glover Teixeira", "UFC 275", "Jun 11, 2022", "W", "SUB", 3, "4:32", "Rear Naked Choke", "T"),
      L("Alex Pereira", "UFC 295", "Nov 11, 2023", "L", "KO", 2, "2:10", "Elbows", "T"),
      L("Dominick Reyes", "UFC 311", "Jan 18, 2025", "W", "KO", 3, "2:24", "Ground & Pound"),
      L("Carlos Ulberg", "UFC 330", "Apr 11, 2026", "L", "KO", 2, "2:47", "Right Hook", "V"),
    ]),
  f("LHW", 3, "Khalil Rountree", "The War Horse", "US", 16, 6, 1, 10, 0, 36, `6'1"`, `75"`, "Onx Sports", "Striker", 1595,
    86, 88, 50, 48, 60, 74, 74, [
      L("Chris Daukaus", "UFC Fight Night", "Dec 9, 2023", "W", "KO", 1, "1:06", "Punches"),
      L("Alex Pereira", "UFC 307", "Oct 5, 2024", "L", "KO", 4, "4:32", "Punches", "T"),
      L("Magomed Ankalaev", "UFC Fight Night", "Feb 21, 2026", "L", "UDEC", 5, "5:00"),
    ]),
  f("LHW", 4, "Navajo Stirling", "The Silverback", "NZ", 9, 0, 0, 4, 1, 29, `6'2"`, `77"`, "City Kickboxing", "Striker", 1565,
    78, 80, 62, 58, 68, 76, 80, [
      L("Tuco Tokkos", "UFC Fight Night", "Jan 18, 2025", "W", "UDEC", 3, "5:00"),
      L("Bogdan Guskov", "UFC Fight Night", "Jul 12, 2025", "W", "KO", 2, "2:58", "Punches"),
    ]),
  f("LHW", 5, "Paulo Costa", "Borrachinha", "BR", 23, 11, 0, 16, 2, 35, `6'0"`, `74"`, "XCIT Team", "Striker", 1560,
    86, 88, 55, 55, 62, 82, 72, [
      L("Sean Strickland", "UFC 302", "Jun 1, 2024", "L", "UDEC", 3, "5:00"),
      L("Jared Cannonier", "UFC Fight Night", "Mar 7, 2026", "W", "KO", 2, "3:41", "Punches"),
    ]),
  f("LHW", 6, "Azamat Murzakanov", "The Professional", "RU", 15, 0, 0, 10, 0, 38, `5'11"`, `75"`, "Fight Nights", "Striker", 1570,
    82, 84, 55, 55, 68, 78, 76, [
      L("Klidson Abreu", "UFC 283", "Jan 21, 2023", "W", "KO", 2, "0:47", "Punches"),
      L("Alonzo Menifield", "UFC Fight Night", "Jun 2025", "W", "UDEC", 3, "5:00"),
    ]),
  f("LHW", 7, "Dominick Reyes", "The Devastator", "US", 15, 6, 0, 7, 0, 37, `6'4"`, `77"`, "OC Boxing", "Striker", 1500,
    88, 84, 45, 48, 55, 70, 74, [
      L("Jan Błachowicz", "UFC 253", "Sep 26, 2020", "L", "KO", 2, "2:24", "Punches", "T"),
      L("Jiří Procházka", "UFC 311", "Jan 18, 2025", "L", "KO", 3, "2:24", "Ground & Pound"),
      L("Bogdan Guskov", "UFC Fight Night", "May 2026", "W", "KO", 1, "1:19", "Left Hook"),
    ]),
  f("LHW", 8, "Reinier de Ridder", "The Dutch Knight", "NL", 20, 2, 0, 7, 11, 36, `6'4"`, `78"`, "HIT Cardio", "Grappler", 1560,
    66, 62, 76, 94, 70, 76, 82, [
      L("Gerald Meerschaert", "UFC Fight Night", "Nov 9, 2024", "W", "SUB", 1, "2:56", "D'Arce Choke"),
      L("Johnny Walker", "UFC Fight Night", "May 17, 2025", "W", "SUB", 2, "3:48", "Rear Naked Choke"),
    ]),
  f("LHW", 9, "Bogdan Guskov", "Czarevich", "UZ", 18, 5, 0, 14, 0, 33, `6'3"`, `79"`, "Tiger Gym", "Striker", 1520,
    84, 92, 45, 42, 58, 70, 68, [
      L("Navajo Stirling", "UFC Fight Night", "Jul 12, 2025", "L", "KO", 2, "2:58", "Punches"),
      L("Dominick Reyes", "UFC Fight Night", "May 2026", "L", "KO", 1, "1:19", "Left Hook"),
    ]),
  f("LHW", 10, "Robert Whittaker", "The Reaper", "AU", 26, 8, 0, 10, 5, 35, `5'11"`, `73"`, "Gracie Smeaton Grange", "Striker", 1590,
    88, 76, 58, 60, 72, 82, 84, [
      L("Israel Adesanya", "UFC 243", "Oct 5, 2019", "W", "KO", 2, "3:33", "Punches", "T"),
      L("Khamzat Chimaev", "UFC 308", "Oct 26, 2024", "L", "SUB", 1, "4:15", "Face Crank"),
      L("Reinier de Ridder", "UFC Fight Night", "Sep 6, 2025", "W", "UDEC", 3, "5:00"),
    ]),
  f("LHW", 11, "Alonzo Menifield", "Atomic", "US", 17, 7, 1, 10, 4, 38, `6'0"`, `78"`, "VSK MMA", "Wrestler", 1500,
    74, 84, 72, 70, 70, 76, 72, [
      L("Azamat Murzakanov", "UFC Fight Night", "Jun 2025", "L", "UDEC", 3, "5:00"),
      L("Modestas Bukauskas", "UFC Fight Night", "Mar 2026", "W", "KO", 1, "1:52", "Punches"),
    ]),
  f("LHW", 12, "Muhammad Saidov", "Muhammad", "RU", 15, 2, 0, 9, 3, 31, `6'1"`, `76"`, "Eagles MMA", "Sambo", 1500,
    76, 74, 72, 76, 72, 74, 78, [
      L("Modestas Bukauskas", "UFC Fight Night", "Aug 2025", "W", "SUB", 2, "3:22", "Rear Naked Choke"),
    ]),
  f("LHW", 13, "Modestas Bukauskas", "The Baltic Gladiator", "LT", 17, 7, 0, 10, 1, 32, `6'3"`, `78"`, "MMA Factory", "Striker", 1490,
    78, 80, 52, 50, 62, 70, 74, [
      L("Alonzo Menifield", "UFC Fight Night", "Mar 2026", "L", "KO", 1, "1:52", "Punches"),
    ]),
  f("LHW", 15, "Nikita Krylov", "The Miner", "UA", 31, 10, 0, 18, 9, 34, `6'3"`, `78"`, "Gym Hammer", "MMA", 1520,
    80, 84, 60, 66, 66, 74, 76, [
      L("Azamat Murzakanov", "UFC Fight Night", "Feb 2025", "L", "KO", 3, "1:41", "Punches"),
      L("Johnny Walker", "UFC Fight Night", "Jul 2025", "W", "SUB", 1, "2:57", "Rear Naked Choke"),
    ]),
];

export const MW = [
  f("MW", 0, "Sean Strickland", "Tarzan", "US", 31, 7, 0, 12, 5, 35, `6'1"`, `76"`, "San Diego Combat Club", "Boxer", 1725,
    88, 74, 60, 62, 82, 92, 88, [
      L("Alex Pereira", "UFC 276", "Jul 2, 2022", "L", "KO", 1, "2:47", "Left Hook"),
      L("Israel Adesanya", "UFC 293", "Sep 9, 2023", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Dricus Du Plessis", "UFC 297", "Jan 20, 2024", "L", "SDEC", 5, "5:00", undefined, "T"),
      L("Paulo Costa", "UFC 302", "Jun 1, 2024", "W", "UDEC", 3, "5:00"),
      L("Dricus Du Plessis", "UFC 312", "Feb 8, 2025", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Jared Cannonier", "UFC Fight Night", "Aug 16, 2025", "W", "UDEC", 5, "5:00"),
      L("Khamzat Chimaev", "UFC 330", "May 9, 2026", "W", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("MW", 1, "Khamzat Chimaev", "Borz", "AE", 15, 1, 0, 6, 6, 32, `6'2"`, `75"`, "All Stars Training Center", "Wrestler", 1745,
    78, 88, 97, 94, 92, 84, 76, [
      L("Kevin Holland", "UFC 279", "Sep 10, 2022", "W", "SUB", 1, "2:22", "D'Arce Choke"),
      L("Kamaru Usman", "UFC 294", "Oct 21, 2023", "W", "MDEC", 3, "5:00"),
      L("Robert Whittaker", "UFC 308", "Oct 26, 2024", "W", "SUB", 1, "4:15", "Face Crank"),
      L("Dricus Du Plessis", "UFC 319", "Sep 13, 2025", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Sean Strickland", "UFC 330", "May 9, 2026", "L", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("MW", 2, "Dricus Du Plessis", "Stillknocks", "ZA", 22, 2, 0, 11, 8, 32, `6'1"`, `76"`, "CIT", "MMA", 1705,
    84, 88, 70, 82, 74, 92, 86, [
      L("Sean Strickland", "UFC 297", "Jan 20, 2024", "W", "SDEC", 5, "5:00", undefined, "T"),
      L("Israel Adesanya", "UFC 305", "Aug 17, 2024", "W", "SUB", 4, "3:34", "Rear Naked Choke", "T"),
      L("Sean Strickland", "UFC 312", "Feb 8, 2025", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Khamzat Chimaev", "UFC 319", "Sep 13, 2025", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Jared Cannonier", "UFC Fight Night", "Jul 18, 2026", "W", "KO", 2, "2:41", "Punches"),
    ]),
  f("MW", 3, "Nassourdine Imavov", "The Sniper", "FR", 17, 4, 0, 7, 4, 31, `6'3"`, `75"`, "MMA Factory", "Striker", 1675,
    84, 80, 55, 58, 72, 80, 80, [
      L("Sean Strickland", "UFC Fight Night", "Jan 14, 2023", "L", "MDEC", 5, "5:00"),
      L("Israel Adesanya", "UFC Fight Night", "Feb 1, 2025", "W", "KO", 2, "0:52", "Right Hook"),
      L("Caio Borralho", "UFC 328", "Mar 7, 2026", "W", "UDEC", 5, "5:00"),
    ]),
  f("MW", 4, "Joe Pyfer", "Bodybagz", "US", 16, 1, 0, 11, 3, 29, `6'2"`, `75"`, "Balance Studios", "Striker", 1620,
    86, 90, 58, 60, 68, 76, 78, [
      L("Abus Magomedov", "UFC Fight Night", "Jun 21, 2025", "W", "KO", 1, "3:08", "Right Hand"),
      L("Ikram Aliskerov", "UFC Fight Night", "Jan 24, 2026", "W", "KO", 2, "1:44", "Uppercut"),
    ]),
  f("MW", 5, "Brendan Allen", "All In", "US", 27, 7, 0, 6, 15, 30, `6'2"`, `75"`, "Kill Cliff FC", "Grappler", 1610,
    76, 70, 60, 92, 70, 80, 88, [
      L("Nassourdine Imavov", "UFC Fight Night", "Mar 1, 2025", "L", "KO", 4, "1:32", "Punches"),
      L("Christian Leroy Duncan", "UFC Fight Night: Allen vs Duncan", "Oct 10, 2026", "W", "SUB", 5, "4:52", "Rear Naked Choke"),
    ]),
  f("MW", 6, "Caio Borralho", "Borrachinha", "BR", 17, 1, 0, 6, 6, 33, `6'0"`, `74"`, "Fighting Nerds", "Grappler", 1615,
    78, 72, 72, 90, 76, 80, 86, [
      L("Jared Cannonier", "UFC Fight Night", "Aug 24, 2024", "W", "UDEC", 5, "5:00"),
      L("Nassourdine Imavov", "UFC 328", "Mar 7, 2026", "L", "UDEC", 5, "5:00"),
    ]),
  f("MW", 7, "Gregory Rodrigues", "Robocop", "BR", 19, 6, 0, 12, 3, 32, `6'3"`, `76"`, "Fighting Nerds", "Striker", 1590,
    88, 86, 55, 60, 62, 86, 80, [
      L("Christian Leroy Duncan", "UFC Fight Night", "Jul 12, 2025", "W", "KO", 2, "2:11", "Punches"),
      L("Jun Yong Park", "UFC Fight Night", "Mar 2026", "W", "SUB", 3, "1:24", "Rear Naked Choke"),
    ]),
  f("MW", 8, "Anthony Hernandez", "Fluffy", "US", 23, 9, 0, 5, 12, 33, `6'0"`, `74"`, "Kill Cliff FC", "Grappler", 1585,
    70, 62, 70, 94, 70, 80, 92, [
      L("Michel Pereira", "UFC Fight Night", "Oct 19, 2024", "W", "UDEC", 3, "5:00"),
      L("Roman Dolidze", "UFC 327", "Feb 7, 2026", "W", "SUB", 4, "2:17", "Rear Naked Choke"),
    ]),
  f("MW", 9, "Israel Adesanya", "The Last Stylebender", "NG", 25, 4, 0, 17, 0, 37, `6'4"`, `80"`, "City Kickboxing", "Kickboxer", 1580,
    91, 84, 42, 48, 74, 78, 76, [
      L("Alex Pereira", "UFC 287", "Apr 8, 2023", "W", "KO", 2, "4:21", "Right Hand", undefined, "POTN"),
      L("Sean Strickland", "UFC 293", "Sep 9, 2023", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Dricus Du Plessis", "UFC 305", "Aug 17, 2024", "L", "SUB", 4, "3:34", "Rear Naked Choke", "T"),
      L("Nassourdine Imavov", "UFC Fight Night", "Feb 1, 2025", "L", "KO", 2, "0:52", "Right Hook"),
      L("Roman Dolidze", "UFC 327", "Feb 7, 2026", "W", "UDEC", 3, "5:00"),
    ]),
  f("MW", 10, "Christian Leroy Duncan", "CLD", "GB", 14, 3, 0, 9, 1, 29, `6'3"`, `78"`, "Bristol Combat Athletics", "Striker", 1560,
    84, 80, 50, 55, 60, 74, 78, [
      L("Gregory Rodrigues", "UFC Fight Night", "Jul 12, 2025", "L", "KO", 2, "2:11", "Punches"),
      L("Brendan Allen", "UFC Fight Night: Allen vs Duncan", "Oct 10, 2026", "L", "SUB", 5, "4:52", "Rear Naked Choke"),
    ]),
  f("MW", 11, "Ikram Aliskerov", null, "RU", 18, 2, 0, 9, 7, 34, `6'1"`, `76"`, "Gorets FT", "Sambo", 1610,
    78, 82, 84, 88, 80, 78, 80, [
      L("Khamzat Chimaev", "Brave CF 23", "Sep 19, 2019", "L", "KO", 1, "2:13", "Punches"),
      L("Warlley Alves", "UFC Fight Night", "Jun 2025", "W", "KO", 1, "4:08", "Punches"),
      L("Joe Pyfer", "UFC Fight Night", "Jan 24, 2026", "L", "KO", 2, "1:44", "Uppercut"),
    ]),
  f("MW", 12, "Bo Nickal", "The Iron Eagle", "US", 8, 0, 0, 3, 4, 30, `6'1"`, `78"`, "American Top Team", "Wrestler", 1540,
    58, 66, 98, 92, 88, 74, 80, [
      L("Paul Craig", "UFC Fight Night", "Jul 5, 2025", "W", "UDEC", 3, "5:00"),
    ]),
  f("MW", 13, "Abus Magomedov", "Abus", "DE", 23, 7, 0, 16, 3, 39, `6'2"`, `76"`, "UFD Gym", "Striker", 1515,
    82, 84, 55, 58, 60, 70, 68, [
      L("Sean Strickland", "UFC Fight Night", "Jul 1, 2023", "L", "KO", 2, "4:42", "Punches"),
      L("Joe Pyfer", "UFC Fight Night", "Jun 21, 2025", "L", "KO", 1, "3:08", "Right Hand"),
      L("Jun Yong Park", "UFC Fight Night", "Aug 2025", "W", "KO", 1, "2:31", "Punches"),
    ]),
  f("MW", 14, "Roman Kopylov", "Siberian", "RU", 17, 5, 0, 13, 1, 34, `6'1"`, `74"`, "Tiger Gym", "Striker", 1525,
    84, 88, 45, 48, 58, 72, 74, [
      L("Cesar Almeida", "UFC Fight Night", "Jun 2026", "W", "KO", 2, "2:58", "Punches"),
      L("Ateba Gautier", "UFC 332", "Oct 3, 2026", "L", "KO", 1, "3:12", "Punches"),
    ]),
  f("MW", 15, "Edmen Shahbazyan", "The Golden Boy", "US", 15, 7, 0, 11, 2, 29, `6'2"`, `74"`, "Glendale Fighting Club", "Striker", 1460,
    84, 80, 45, 50, 55, 66, 70, [
      L("Ateba Gautier", "UFC Fight Night", "May 2026", "L", "KO", 1, "1:41", "Punches"),
      L("Dustin Stoltzfus", "UFC Fight Night", "Jul 2026", "W", "KO", 1, "2:12", "Punches"),
    ]),
];

// Unranked notable
export const MW_EXTRA = [
  f("MW", 99, "Ateba Gautier", "The Problem", "CM", 11, 1, 0, 10, 0, 25, `6'2"`, `78"`, "Team Ouali", "Striker", 1575,
    88, 94, 45, 42, 60, 80, 74, [
      L("Roman Kopylov", "UFC 332", "Oct 3, 2026", "W", "KO", 1, "3:12", "Punches", undefined, "POTN"),
      L("Edmen Shahbazyan", "UFC Fight Night", "May 2026", "W", "KO", 1, "1:41", "Punches"),
    ]),
];
