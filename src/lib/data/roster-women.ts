import { f, L } from "./core";

// ============ WOMEN — STRAWWEIGHT / FLYWEIGHT / BANTAMWEIGHT ============
// Rankings & records as of Oct 17, 2026

export const WSW = [
  f("WSW", 0, "Mackenzie Dern", null, "US", 17, 5, 0, 2, 8, 33, `5'4"`, `63"`, "Paragon Jiu-Jitsu", "BJJ", 1670,
    68, 60, 55, 98, 55, 75, 78, [
      L("Yan Xiaonan", "UFC Fight Night", "Oct 1, 2023", "L", "UDEC", 5, "5:00"),
      L("Loopy Godinez", "UFC Fight Night", "Dec 7, 2024", "W", "SUB", 1, "1:52", "Armbar"),
      L("Virna Jandiroba", "UFC 325", "Oct 25, 2025", "W", "SUB", 2, "2:54", "Armbar", "V"),
      L("Gillian Robertson", "UFC 329", "Jun 14, 2026", "W", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("WSW", 1, "Zhang Weili", "Magnum", "CN", 26, 4, 0, 10, 7, 36, `5'4"`, `63"`, "Black Tiger", "Pressure", 1810,
    92, 88, 86, 84, 90, 88, 88, [
      L("Rose Namajunas", "UFC 268", "Nov 6, 2021", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Carla Esparza", "UFC 281", "Nov 12, 2022", "W", "SUB", 2, "1:52", "Rear Naked Choke", "T"),
      L("Amanda Lemos", "UFC 292", "Aug 19, 2023", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Yan Xiaonan", "UFC 300", "Apr 13, 2024", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Tatiana Suarez", "UFC 320", "Sep 13, 2025", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Manon Fiorot", "UFC 326", "Feb 21, 2026", "L", "UDEC", 5, "5:00"),
      L("Maycee Barber", "UFC Fight Night", "May 9, 2026", "W", "SUB", 2, "2:47", "Rear Naked Choke"),
    ]),
  f("WSW", 2, "Tatiana Suarez", "Tati", "US", 11, 2, 0, 3, 5, 35, `5'5"`, `64"`, "Millennium MMA", "Wrestler", 1600,
    68, 65, 92, 90, 88, 78, 76, [
      L("Zhang Weili", "UFC 320", "Sep 13, 2025", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Denise Gomes", "UFC Fight Night", "Mar 7, 2026", "W", "UDEC", 3, "5:00"),
    ]),
  f("WSW", 3, "Virna Jandiroba", "Cara de Sapato", "BR", 24, 4, 0, 1, 15, 38, `5'3"`, `62"`, "Kimura Nova União", "Grappler", 1650,
    62, 55, 76, 96, 72, 80, 82, [
      L("Mackenzie Dern", "UFC 325", "Oct 25, 2025", "L", "SUB", 2, "2:54", "Armbar", "V"),
      L("Yan Xiaonan", "UFC Fight Night", "May 2, 2026", "W", "SUB", 3, "2:19", "Rear Naked Choke"),
    ]),
  f("WSW", 4, "Denise Gomes", "Dede", "BR", 16, 3, 0, 8, 2, 27, `5'4"`, `63"`, "Constrictor Team", "Striker", 1555,
    82, 80, 45, 50, 58, 74, 76, [
      L("Tatiana Suarez", "UFC Fight Night", "Mar 7, 2026", "L", "UDEC", 3, "5:00"),
    ]),
  f("WSW", 5, "Gillian Robertson", "The Savage", "CA", 15, 9, 0, 4, 11, 31, `5'5"`, `64"`, "Sanford MMA", "Grappler", 1570,
    62, 55, 58, 96, 55, 78, 86, [
      L("Loopy Godinez", "UFC Fight Night", "Jun 2025", "W", "SUB", 3, "1:47", "Rear Naked Choke"),
      L("Mackenzie Dern", "UFC 329", "Jun 14, 2026", "L", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("WSW", 6, "Fatima Kline", "The Star", "US", 8, 1, 0, 3, 2, 24, `5'5"`, `65"`, "Kline Combat", "MMA", 1520,
    74, 68, 60, 74, 62, 74, 80, [
      L("Jaqueline Amorim", "UFC Fight Night", "Jul 2026", "W", "UDEC", 3, "5:00"),
    ]),
  f("WSW", 7, "Alexia Thainara", "T-Rex", "BR", 12, 2, 0, 7, 1, 27, `5'4"`, `62"`, "Brazilian Top Team", "Striker", 1515,
    80, 76, 45, 55, 55, 72, 78, [
      L("Piera Rodriguez", "UFC Fight Night", "Feb 2026", "W", "KO", 1, "4:02", "Punches"),
    ]),
  f("WSW", 8, "Yan Xiaonan", "Fury", "CN", 20, 6, 0, 8, 1, 37, `5'5"`, `63"`, "Buffalo MMA", "Striker", 1565,
    86, 76, 50, 45, 62, 80, 82, [
      L("Zhang Weili", "UFC 300", "Apr 13, 2024", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Virna Jandiroba", "UFC Fight Night", "May 2, 2026", "L", "SUB", 3, "2:19", "Rear Naked Choke"),
    ]),
  f("WSW", 9, "Loopy Godinez", "Luppy", "MX", 14, 6, 0, 3, 6, 32, `5'2"`, `61"`, "Entram Gym", "Pressure", 1525,
    74, 70, 55, 70, 55, 78, 90, [
      L("Mackenzie Dern", "UFC Fight Night", "Dec 7, 2024", "L", "SUB", 1, "1:52", "Armbar"),
    ]),
  f("WSW", 10, "Mizuki", "Mizuki", "JP", 16, 6, 0, 6, 6, 31, `5'3"`, `62"`, "K-Clan", "MMA", 1510,
    72, 62, 55, 84, 58, 74, 82, [
      L("Tabatha Ricci", "UFC Fight Night", "Mar 2026", "W", "SUB", 2, "3:11", "Armbar"),
    ]),
  f("WSW", 11, "Tabatha Ricci", "Baby Shark", "BR", 12, 9, 0, 2, 4, 30, `5'3"`, `62"`, "Kings MMA", "Grappler", 1475,
    68, 58, 60, 80, 58, 74, 84, [
      L("Mizuki", "UFC Fight Night", "Mar 2026", "L", "SUB", 2, "3:11", "Armbar"),
    ]),
  f("WSW", 12, "Jaqueline Amorim", "Jaque", "BR", 11, 2, 0, 4, 7, 29, `5'4"`, `63"`, "American Top Team", "Grappler", 1530,
    70, 62, 50, 94, 55, 72, 78, [
      L("Fatima Kline", "UFC Fight Night", "Jul 2026", "L", "UDEC", 3, "5:00"),
    ]),
  f("WSW", 13, "Talita Alencar", "Tali", "BR", 7, 1, 0, 1, 5, 37, `5'2"`, `60"`, "Kimura Nova União", "BJJ", 1490,
    58, 50, 55, 90, 55, 72, 76, [
      L("Piera Rodriguez", "UFC Fight Night", "Jun 2026", "W", "SUB", 2, "4:22", "Armbar"),
    ]),
  f("WSW", 14, "Amanda Lemos", "Amanda", "BR", 16, 6, 1, 9, 2, 37, `5'4"`, `63"`, "Marajo Brothers", "Striker", 1500,
    80, 84, 45, 40, 55, 74, 72, [
      L("Zhang Weili", "UFC 292", "Aug 19, 2023", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Jéssica Andrade", "UFC 296", "Dec 16, 2023", "W", "KO", 1, "2:41", "Punches"),
    ]),
  f("WSW", 15, "Jéssica Andrade", "Bate Estaca", "BR", 25, 14, 0, 11, 8, 34, `5'2"`, `62"`, "Paradigm", "Brawler", 1495,
    84, 88, 50, 55, 55, 78, 72, [
      L("Amanda Lemos", "UFC 296", "Dec 16, 2023", "L", "KO", 1, "2:41", "Punches"),
    ]),
];

export const WFLW = [
  f("WFLW", 0, "Natalia Silva", "Uncanny", "BR", 21, 5, 1, 7, 8, 28, `5'4"`, `64"`, "Chute Boxe Diego Lima", "Striker", 1710,
    90, 76, 62, 84, 74, 82, 84, [
      L("Andrea Lee", "UFC Fight Night", "May 13, 2023", "W", "UDEC", 3, "5:00"),
      L("Manon Fiorot", "UFC Fight Night", "May 4, 2024", "W", "UDEC", 3, "5:00"),
      L("Valentina Shevchenko", "UFC 328", "Mar 7, 2026", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Wang Cong", "UFC 332", "Oct 3, 2026", "W", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("WFLW", 1, "Valentina Shevchenko", "Bullet", "KG", 25, 5, 1, 9, 7, 38, `5'5"`, `67"`, "Tiger Muay Thai", "Counter Striker", 1755,
    94, 80, 70, 82, 84, 86, 86, [
      L("Amanda Nunes", "UFC 215", "Sep 9, 2017", "L", "SDEC", 5, "5:00"),
      L("Alexa Grasso", "UFC 285", "Mar 4, 2023", "L", "SUB", 4, "4:33", "Rear Naked Choke", "T"),
      L("Alexa Grasso", "UFC Fight Night", "Sep 16, 2023", "D", "SDEC", 5, "5:00", undefined, "T"),
      L("Alexa Grasso", "UFC 306", "Sep 14, 2024", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Maycee Barber", "UFC 323", "Dec 6, 2025", "W", "UDEC", 5, "5:00", undefined, "T"),
      L("Natalia Silva", "UFC 328", "Mar 7, 2026", "L", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("WFLW", 2, "Alexa Grasso", "La Pantera", "MX", 19, 4, 1, 5, 2, 32, `5'5"`, `65"`, "Lobo Gym", "Boxer", 1670,
    84, 76, 55, 70, 62, 80, 82, [
      L("Valentina Shevchenko", "UFC 285", "Mar 4, 2023", "W", "SUB", 4, "4:33", "Rear Naked Choke", "T"),
      L("Valentina Shevchenko", "UFC Fight Night", "Sep 16, 2023", "D", "SDEC", 5, "5:00", undefined, "T"),
      L("Valentina Shevchenko", "UFC 306", "Sep 14, 2024", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Karine Silva", "UFC Fight Night", "Sep 6, 2025", "W", "SUB", 2, "3:08", "Rear Naked Choke"),
    ]),
  f("WFLW", 3, "Manon Fiorot", "The Beast", "FR", 13, 2, 0, 6, 1, 36, `5'7"`, `65"`, "Toxik Team", "Kickboxer", 1685,
    92, 84, 62, 62, 82, 84, 82, [
      L("Rose Namajunas", "UFC Paris", "Sep 3, 2022", "W", "UDEC", 5, "5:00"),
      L("Natalia Silva", "UFC Fight Night", "May 4, 2024", "L", "UDEC", 3, "5:00"),
      L("Zhang Weili", "UFC 326", "Feb 21, 2026", "W", "UDEC", 5, "5:00"),
    ]),
  f("WFLW", 4, "Erin Blanchfield", "Cold Blooded", "US", 14, 2, 0, 3, 6, 27, `5'4"`, `66"`, "Kill Cliff FC", "Grappler", 1660,
    72, 62, 88, 92, 85, 80, 85, [
      L("Manon Fiorot", "UFC Fight Night", "Jan 25, 2025", "L", "UDEC", 5, "5:00"),
      L("Rose Namajunas", "UFC Fight Night", "Mar 2026", "W", "SUB", 2, "1:47", "Rear Naked Choke"),
    ]),
  f("WFLW", 5, "Rose Namajunas", "Thug Rose", "US", 15, 7, 0, 5, 3, 33, `5'5"`, `65"`, "Gracie Colorado", "Striker", 1575,
    84, 66, 50, 74, 62, 78, 80, [
      L("Carla Esparza", "UFC 274", "May 7, 2022", "L", "SDEC", 5, "5:00", undefined, "T"),
      L("Manon Fiorot", "UFC Paris", "Sep 3, 2022", "L", "UDEC", 5, "5:00"),
      L("Erin Blanchfield", "UFC Fight Night", "Mar 2026", "L", "SUB", 2, "1:47", "Rear Naked Choke"),
    ]),
  f("WFLW", 6, "Jasmine Jasudavicius", "Sliced Bread", "CA", 15, 4, 0, 4, 6, 36, `5'6"`, `68"`, "Niagara Top Team", "Grappler", 1600,
    74, 66, 62, 84, 62, 78, 88, [
      L("Casey O'Neill", "UFC Fight Night", "May 2, 2026", "W", "UDEC", 3, "5:00"),
    ]),
  f("WFLW", 7, "Maycee Barber", "The Future", "US", 15, 7, 0, 8, 2, 28, `5'5"`, `64"`, "Grudge Training Center", "Striker", 1555,
    84, 82, 45, 55, 58, 76, 78, [
      L("Valentina Shevchenko", "UFC 323", "Dec 6, 2025", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Zhang Weili", "UFC Fight Night", "May 9, 2026", "L", "SUB", 2, "2:47", "Rear Naked Choke"),
    ]),
  f("WFLW", 8, "Wang Cong", "The Mongolian Rose", "CN", 6, 1, 0, 4, 0, 30, `5'6"`, `66"`, "Zhao Zhong Zhao", "Striker", 1585,
    88, 82, 45, 40, 55, 72, 74, [
      L("Victoria Leonardo", "UFC Fight Night", "Feb 2025", "W", "KO", 1, "1:41", "Punches"),
      L("Gabriella Fernandes", "UFC Fight Night", "Aug 2025", "W", "KO", 1, "0:52", "Punches", undefined, "POTN"),
      L("Natalia Silva", "UFC 332", "Oct 3, 2026", "L", "UDEC", 5, "5:00", undefined, "T"),
    ]),
  f("WFLW", 9, "Tracy Cortez", "TC", "US", 13, 3, 0, 1, 4, 32, `5'5"`, `65"`, "Fight Ready", "Grappler", 1520,
    68, 60, 55, 74, 60, 78, 84, [
      L("Rose Namajunas", "UFC on ESPN", "Jul 13, 2024", "L", "UDEC", 5, "5:00"),
    ]),
  f("WFLW", 10, "Miranda Maverick", "Fear The Maverick", "US", 16, 6, 0, 4, 7, 28, `5'3"`, `64"`, "Maverick Training", "Grappler", 1500,
    70, 60, 62, 84, 58, 74, 82, [
      L("Maycee Barber", "UFC Fight Night", "Jul 2026", "W", "SUB", 3, "2:44", "Armbar"),
    ]),
  f("WFLW", 11, "Karine Silva", "Kaka", "BR", 19, 6, 0, 9, 6, 30, `5'4"`, `63"`, "Paradigm", "Grappler", 1515,
    72, 68, 50, 88, 55, 74, 76, [
      L("Alexa Grasso", "UFC Fight Night", "Sep 6, 2025", "L", "SUB", 2, "3:08", "Rear Naked Choke"),
    ]),
  f("WFLW", 12, "Casey O'Neill", "King", "AU", 11, 4, 0, 4, 5, 28, `5'6"`, `66"`, "Tiger Muay Thai", "Pressure", 1495,
    76, 66, 55, 70, 55, 72, 80, [
      L("Jasmine Jasudavicius", "UFC Fight Night", "May 2, 2026", "L", "UDEC", 3, "5:00"),
    ]),
  f("WFLW", 13, "Eduarda Moura", "Rafa", "BR", 11, 2, 0, 6, 3, 27, `5'4"`, `63"`, "Fighting Nerds", "Grappler", 1480,
    74, 68, 55, 78, 58, 72, 78, [
      L("Karine Silva", "UFC Fight Night", "Jun 2026", "W", "SUB", 1, "2:54", "Rear Naked Choke"),
    ]),
  f("WFLW", 14, "Carli Judice", "Bella", "US", 6, 1, 0, 5, 0, 27, `5'6"`, `66"`, "Sityodtong", "Striker", 1465,
    78, 84, 35, 40, 50, 68, 72, [
      L("Gabriella Fernandes", "UFC Fight Night", "Mar 2026", "W", "KO", 1, "2:18", "Punches"),
    ]),
  f("WFLW", 15, "Gabriella Fernandes", "Gabi", "BR", 9, 4, 0, 5, 2, 31, `5'5"`, `64"`, "Maringá Combat", "MMA", 1455,
    72, 70, 45, 55, 55, 70, 74, [
      L("Wang Cong", "UFC Fight Night", "Aug 2025", "L", "KO", 1, "0:52", "Punches"),
    ]),
];

export const WBW = [
  f("WBW", 0, "Kayla Harrison", null, "US", 19, 1, 0, 6, 9, 36, `5'7"`, `68"`, "American Top Team", "Judoka", 1755,
    74, 78, 96, 96, 94, 82, 80, [
      L("Larissa Pacheco", "PFL 2022 Championship", "Nov 25, 2022", "L", "UDEC", 3, "5:00"),
      L("Holly Holm", "UFC 300", "Apr 13, 2024", "W", "SUB", 2, "1:47", "Rear Naked Choke"),
      L("Ketlen Vieira", "UFC 307", "Oct 5, 2024", "W", "UDEC", 3, "5:00"),
      L("Julianna Peña", "UFC 316", "Jun 7, 2025", "W", "SUB", 2, "1:59", "Rear Naked Choke", "T"),
    ]),
  f("WBW", 1, "Julianna Peña", "The Venezuelan Vixen", "US", 13, 6, 0, 4, 5, 37, `5'7"`, `66"`, "Vancouver MMA", "Grappler", 1600,
    76, 68, 62, 74, 55, 84, 84, [
      L("Amanda Nunes", "UFC 277", "Jul 30, 2022", "L", "UDEC", 5, "5:00", undefined, "T"),
      L("Raquel Pennington", "UFC 307", "Oct 5, 2024", "W", "SDEC", 5, "5:00", undefined, "T"),
      L("Kayla Harrison", "UFC 316", "Jun 7, 2025", "L", "SUB", 2, "1:59", "Rear Naked Choke", "T"),
      L("Macy Chiasson", "UFC Fight Night", "Feb 21, 2026", "W", "SUB", 2, "3:26", "Guillotine"),
    ]),
  f("WBW", 2, "Joselyne Edwards", "La Diva", "PA", 18, 6, 0, 7, 5, 30, `5'8"`, `68"`, "Buffalo MMA", "Striker", 1555,
    78, 72, 50, 60, 55, 76, 80, [
      L("Ailin Perez", "UFC Fight Night", "Mar 2025", "W", "UDEC", 3, "5:00"),
      L("Norma Dumont", "UFC Fight Night", "Aug 2025", "W", "SDEC", 3, "5:00"),
    ]),
  f("WBW", 3, "Ailin Perez", "Fiona", "AR", 11, 3, 0, 4, 4, 31, `5'4"`, `65"`, "Tiger Muay Thai", "Wrestler", 1550,
    70, 62, 84, 70, 72, 76, 84, [
      L("Joselyne Edwards", "UFC Fight Night", "Mar 2025", "L", "UDEC", 3, "5:00"),
    ]),
  f("WBW", 4, "Norma Dumont", "The Lioness", "BR", 13, 2, 0, 3, 4, 35, `5'7"`, `66"`, "Gordin Fight Team", "Grappler", 1560,
    72, 62, 60, 78, 65, 78, 84, [
      L("Joselyne Edwards", "UFC Fight Night", "Aug 2025", "L", "SDEC", 3, "5:00"),
    ]),
  f("WBW", 5, "Luana Santos", "Dada", "BR", 11, 2, 0, 5, 3, 25, `5'6"`, `65"`, "Pitbull Brothers", "MMA", 1530,
    76, 74, 55, 65, 60, 74, 78, [
      L("Yana Santos", "UFC Fight Night", "Jun 2025", "W", "SUB", 1, "1:52", "Armbar"),
    ]),
  f("WBW", 6, "Yana Santos", "Foxy", "RU", 15, 9, 0, 5, 3, 35, `5'6"`, `65"`, "Tiger Muay Thai", "Striker", 1475,
    74, 68, 45, 50, 50, 72, 74, [
      L("Luana Santos", "UFC Fight Night", "Jun 2025", "L", "SUB", 1, "1:52", "Armbar"),
    ]),
  f("WBW", 7, "Jacqueline Cavalcanti", "Jackie", "PT", 10, 2, 0, 5, 2, 30, `5'8"`, `68"`, "Lisboa Combat", "Striker", 1520,
    78, 74, 45, 50, 55, 74, 78, [
      L("Joselyne Edwards", "UFC Fight Night", "Jul 2025", "W", "UDEC", 3, "5:00"),
    ]),
  f("WBW", 8, "Michelle Montague", "The Magnum", "US", 7, 0, 0, 3, 3, 29, `5'8"`, `69"`, "American Top Team", "Wrestler", 1500,
    62, 58, 92, 88, 85, 72, 82, [
      L("Gabriella Cavalcente", "UFC Fight Night", "Jun 2026", "W", "SUB", 1, "3:22", "Rear Naked Choke"),
    ]),
  f("WBW", 9, "Karol Rosa", "Rosa", "BR", 19, 7, 0, 7, 4, 30, `5'5"`, `64"`, "Kings MMA", "Volume", 1490,
    72, 62, 55, 58, 60, 80, 88, [
      L("Melissa Croden", "UFC Fight Night", "Aug 2025", "W", "UDEC", 3, "5:00"),
    ]),
  f("WBW", 10, "Bia Mesquita", "Bia", "BR", 8, 1, 0, 4, 3, 38, `5'4"`, `63"`, "American Top Team", "BJJ", 1525,
    68, 62, 55, 94, 55, 74, 78, [
      L("Karol Rosa", "UFC Fight Night", "Mar 2026", "W", "SUB", 2, "4:11", "Armbar"),
    ]),
  f("WBW", 11, "Nora Cornolle", "Lavigne", "FR", 10, 3, 0, 6, 2, 31, `5'7"`, `66"`, "Boxing Squad", "Striker", 1480,
    76, 76, 45, 40, 52, 70, 74, [
      L("Melissa Croden", "UFC Fight Night", "Jun 2025", "W", "KO", 1, "2:44", "Punches"),
    ]),
  f("WBW", 12, "Macy Chiasson", "The Iron Maiden", "US", 12, 5, 0, 4, 4, 34, `5'9"`, `70"`, "Fortis MMA", "Grappler", 1490,
    68, 62, 62, 78, 60, 74, 80, [
      L("Pannie Kianzad", "UFC Fight Night", "Mar 2024", "W", "SUB", 1, "1:41", "Guillotine"),
      L("Julianna Peña", "UFC Fight Night", "Feb 21, 2026", "L", "SUB", 2, "3:26", "Guillotine"),
    ]),
  f("WBW", 13, "Raquel Pennington", "Rocky", "US", 20, 10, 0, 4, 4, 38, `5'7"`, `67"`, "Sanford MMA", "Volume", 1535,
    76, 66, 50, 60, 58, 84, 84, [
      L("Mayra Bueno Silva", "UFC 297", "Jan 20, 2024", "W", "UDEC", 5, "5:00", undefined, "V"),
      L("Julianna Peña", "UFC 307", "Oct 5, 2024", "L", "SDEC", 5, "5:00", undefined, "T"),
      L("Daria Zhelezniakova", "UFC Fight Night", "Jun 2026", "W", "UDEC", 3, "5:00"),
    ]),
  f("WBW", 15, "Daria Zhelezniakova", "Daria", "FR", 8, 1, 0, 4, 2, 28, `5'7"`, `66"`, "Tiger Muay Thai", "Striker", 1460,
    72, 70, 45, 50, 50, 70, 72, [
      L("Melissa Croden", "UFC Fight Night", "Sep 2025", "W", "UDEC", 3, "5:00"),
      L("Raquel Pennington", "UFC Fight Night", "Jun 2026", "L", "UDEC", 3, "5:00"),
    ]),
];

// Extra: event-only fighters
export const WOMEN_EXTRA = [
  f("WBW", 99, "Melissa Croden", "Lionheart", "CA", 9, 3, 0, 5, 2, 35, `5'7"`, `66"`, "Niagara Top Team", "Striker", 1455,
    74, 72, 45, 48, 50, 70, 74, [
      L("Nora Cornolle", "UFC Fight Night", "Jun 2025", "L", "KO", 1, "2:44", "Punches"),
      L("Karol Rosa", "UFC Fight Night", "Aug 2025", "L", "UDEC", 3, "5:00"),
    ]),
];
