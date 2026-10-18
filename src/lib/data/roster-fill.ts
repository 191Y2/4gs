import { d } from "./depth";

// ============ FILL ROSTER — "every name in every record is a fighter" ============
// Every opponent referenced across the database's bout histories gets a full
// profile here: complete generated UFC careers, ratings, title arcs for the
// elites. Adds ~140 fighters including a stack of Hall-of-Fame legends.

export const FILL_LEGENDS = [
  // two-division great & TUF 1 icon
  d("LW", 99, "BJ Penn", "The Prodigy", "US", 16, 14, 2, 9, 6, 47, `5'9"`, `70"`, "BJJ Penn", "BJJ", 1760, { retired: true, legend: true }),
  // Stockton's finest
  d("LW", 99, "Nate Diaz", null, "US", 21, 13, 0, 5, 12, 41, `6'0"`, `76"`, "Cesar Gracie Jiu-Jitsu", "Boxer", 1630, { retired: true, legend: true }),
  // The Natural — five-time champion across two divisions
  d("HW", 99, "Randy Couture", "The Natural", "US", 19, 11, 0, 8, 4, 62, `6'1"`, `74"`, "Team Quest", "Wrestler", 1755, { retired: true, legend: true }),
  // The first householdSubmission artist of the heavyweight division
  d("HW", 99, "Frank Mir", null, "US", 19, 13, 0, 5, 14, 46, `6'3"`, `77"`, "Fortis MMA… years ago", "BJJ", 1650, { retired: true, legend: true }),
  // Rumble
  d("LHW", 99, "Anthony Johnson", "Rumble", "US", 23, 6, 0, 17, 0, 42, `6'2"`, `78"`, "Hard Knocks 365", "Boxer", 1690, { retired: true, legend: true }),
  // The Super Samoan
  d("HW", 99, "Mark Hunt", "The Super Samoan", "NZ", 13, 14, 1, 10, 0, 52, `5'10"`, `74"`, "Sidney MMA", "Boxer", 1560, { retired: true, legend: true }),
  // The Last Emperor — the reference everyone reaches for
  d("HW", 99, "Fedor Emelianenko", "The Last Emperor", "RU", 40, 7, 1, 16, 15, 49, `6'0"`, `74"`, "Red Devil Sport Club", "Sambo", 1760, { retired: true, legend: true }),
  // Gracie Jiu-Jitsu, the origin
  d("WW", 99, "Royce Gracie", null, "BR", 15, 2, 3, 2, 12, 59, `6'1"`, `74"`, "Gracie Academy", "BJJ", 1610, { retired: true, legend: true }),
  // the first light heavyweight king
  d("MW", 99, "Frank Shamrock", "The Legend", "US", 23, 10, 2, 7, 10, 53, `5'10"`, `72"`, "Shamrock MMA", "MMA", 1620, { retired: true, legend: true }),
  // Minotouro
  d("LHW", 99, "Antônio Rogerio Nogueira", "Minotouro", "BR", 23, 10, 0, 10, 6, 50, `6'2"`, `75"`, "Team Nogueira", "Boxer", 1580, { retired: true, legend: true }),
  // Polish Power — the hammer-fisted former light heavyweight champion
  d("LHW", 99, "Jan Błachowicz", "Polish Power", "PL", 25, 10, 0, 12, 9, 43, `6'2"`, `76"`, "Ankos Zapasy", "MMA", 1755, { retired: true, legend: true }),
  // former bantamweight champion
  d("BW", 99, "Marlon Moraes", "Magic", "BR", 23, 12, 1, 11, 6, 38, `5'6"`, `68"`, "Kings MMA", "Striker", 1600, { retired: true }),
  // Ace — former middleweight champion
  d("MW", 99, "Rich Franklin", "Ace", "US", 29, 7, 0, 14, 8, 51, `6'1"`, `75"`, "Team Jorge Gurgel", "Striker", 1620, { retired: true, legend: true }),
  // the Strikeforce shark
  d("WW", 99, "Jake Shields", null, "US", 33, 11, 1, 4, 19, 47, `5'10"`, `72"`, "Cesar Gracie Jiu-Jitsu", "Grappler", 1620, { retired: true }),
  // Venom in the UFC
  d("WW", 99, "Michael Page", "Venom", "GB", 23, 3, 0, 13, 1, 38, `6'3"`, `78"`, "Team GB Taekwondo", "Karate", 1610, {}),
  // Judo silver + submissions
  d("LW", 99, "Demian Maia", null, "BR", 28, 12, 0, 2, 21, 47, `6'0"`, `74"`, "Demian Maia Jiu-Jitsu", "BJJ", 1650, { retired: true }),
];

export const FILL_MEN = [
  // ---- HEAVYWEIGHT ----
  d("HW", 99, "Shamil Abdurakhimov", null, "RU", 16, 6, 0, 7, 3, 41, `6'3"`, `77"`, "Eagles MMA", "Sambo", 1520, { retired: true }),
  d("HW", 99, "Greg Hardy", "The Prince of War", "US", 10, 5, 0, 8, 0, 37, `6'4"`, `80"`, "American Top Team", "Boxer", 1460, { retired: true }),
  d("HW", 99, "Yusuf Nazarov", null, "RU", 8, 5, 0, 6, 0, 31, `6'2"`, `76"`, "Eagles MMA", "Striker", 1440, {}),
  d("HW", 99, "Duncan French", null, "US", 9, 4, 0, 4, 2, 34, `6'3"`, `78"`, "Elevation Fight Team", "Wrestler", 1440, {}),
  d("HW", 99, "Jairzinho Rozenstruik", "Bigi Boy", "SR", 14, 6, 0, 13, 0, 38, `6'2"`, `78"`, "Martial Arts Club Zeist", "Kickboxer", 1560, {}),
  d("HW", 99, "Antônio Silva", "Bigfoot", "BR", 19, 13, 1, 11, 4, 46, `6'4"`, `81"`, "Black House", "Brawler", 1520, { retired: true }),
  d("HW", 99, "Tim Sylvia", "The Maine-iac", "US", 31, 10, 0, 21, 1, 50, `6'8"`, `80"`, "Team Miletich", "Boxer", 1520, { retired: true }),
  d("HW", 99, "Travis Browne", null, "US", 18, 4, 1, 13, 3, 43, `6'7"`, `79"`, "Jackson Wink MMA", "MMA", 1560, { retired: true }),
  d("HW", 99, "Shane Carwin", "The Engineer", "US", 12, 2, 0, 9, 3, 50, `6'2"`, `80"`, "Grudge Training Center", "Wrestler", 1560, { retired: true }),
  d("HW", 99, "Brendan Schaub", "Big Brown", "US", 10, 5, 0, 5, 4, 43, `6'4"`, `79"`, "Grudge Training Center", "BJJ", 1480, { retired: true }),
  d("HW", 99, "Renan Ferreira", "Problema", "BR", 15, 5, 0, 10, 3, 35, `6'8"`, `81"`, "Tata Fight Team", "BJJ", 1540, {}),
  d("HW", 99, "Heath Herring", "The Texas Crazy Horse", "US", 28, 14, 0, 17, 2, 47, `6'3"`, `78"`, "Team Bison", "Wrestler", 1500, { retired: true }),
  d("HW", 99, "Aleksei Oleinik", "The Boa Constrictor", "UA", 62, 17, 0, 10, 47, 48, `6'2"`, `75"`, "K Dojo Warrior Tribe", "Sambo", 1520, { retired: true }),
  d("HW", 99, "Stefan Struve", "The Skyscraper", "NL", 33, 13, 0, 16, 14, 38, `7'0"`, `85"`, "Becskan MMA", "Kickboxer", 1540, { retired: true }),
  d("HW", 99, "Matt Mitrione", null, "US", 13, 6, 0, 9, 3, 47, `6'3"`, `80"`, "American Top Team", "Boxer", 1520, { retired: true }),
  d("HW", 99, "Alejandro Escamilla", null, "US", 6, 4, 0, 3, 1, 32, `6'1"`, `75"`, "Jackson Wink MMA", "Wrestler", 1400, {}),
  d("HW", 99, "Anthony Wint", null, "US", 7, 4, 0, 4, 1, 33, `6'2"`, `76"`, "Kill Cliff FC", "MMA", 1420, {}),

  // ---- LIGHT HEAVYWEIGHT ----
  d("LHW", 99, "Devin Clark", "Brown Bear", "US", 14, 9, 0, 5, 2, 34, `5'11"`, `74"`, "Jackson Wink MMA", "Wrestler", 1480, {}),
  d("LHW", 99, "Ken Shamrock", "The World's Most Dangerous Man", "US", 28, 15, 2, 13, 8, 61, `6'1"`, `76"`, "Lion's Den", "Wrestler", 1600, { retired: true, legend: true }),
  d("LHW", 99, "Brian Stann", "All American", "US", 12, 6, 0, 7, 3, 45, `6'1"`, `75"`, "Jackson Wink MMA", "Boxer", 1520, { retired: true }),
  d("LHW", 99, "Tim Boetsch", "The Barbarian", "US", 21, 14, 0, 11, 3, 44, `6'0"`, `74"`, "Team Sityodtong", "Wrestler", 1500, { retired: true }),
  d("LHW", 99, "Tuco Tokkos", null, "TR", 10, 5, 0, 5, 3, 34, `6'2"`, `76"`, "Kapatira Fight Club", "MMA", 1430, {}),
  d("LHW", 99, "Klidson Abreu", null, "BR", 16, 6, 0, 5, 8, 32, `6'2"`, `76"`, "Nogueira Brothers", "BJJ", 1460, {}),
  d("LHW", 99, "Mark Muñoz", "The Filipino Wrecking Machine", "US", 14, 6, 0, 5, 3, 48, `6'0"`, `74"`, "Reign MMA", "Wrestler", 1530, { retired: true }),
  d("LHW", 99, "Dan Kelly", null, "AU", 15, 4, 0, 5, 5, 48, `6'0"`, `73"`, "Dynamite MMA", "Judo", 1480, { retired: true }),
  d("LHW", 99, "Jeremy Horn", "Gumby", "US", 58, 19, 3, 18, 30, 51, `6'1"`, `74"`, "Elite Performance", "BJJ", 1560, { retired: true }),
  d("LHW", 99, "Keith Jardine", "The Dean of Mean", "US", 21, 13, 1, 10, 3, 50, `6'2"`, `76"`, "Jackson Wink MMA", "MMA", 1520, { retired: true }),
  d("LHW", 99, "Thiago Silva", null, "BR", 21, 11, 0, 15, 2, 42, `6'2"`, `76"`, "Black House", "Brawler", 1520, { retired: true }),

  // ---- MIDDLEWEIGHT ----
  d("MW", 99, "Denis Fonseca", null, "BR", 10, 5, 0, 4, 4, 31, `6'0"`, `74"`, "CM System", "BJJ", 1450, {}),
  d("MW", 99, "Nate Marquardt", "The Great", "US", 36, 20, 2, 16, 12, 46, `6'0"`, `74"`, "Grudge Training Center", "Wrestler", 1560, { retired: true }),
  d("MW", 99, "Chris Leben", "The Crippler", "US", 22, 12, 0, 14, 4, 45, `6'1"`, `74"`, "Team Quest", "Brawler", 1520, { retired: true }),
  d("MW", 99, "Yushin Okami", "Thunder", "JP", 36, 13, 0, 10, 12, 45, `6'2"`, `76"`, "Wajyutsu Keishukai", "Wrestler", 1560, { retired: true }),
  d("MW", 99, "Dustin Stoltzfus", null, "US", 14, 6, 0, 3, 6, 34, `6'1"`, `75"`, "UFD Gym", "BJJ", 1480, {}),
  d("MW", 99, "Warlley Alves", null, "BR", 15, 8, 0, 7, 4, 35, `5'11"`, `73"`, "China Team", "Muay Thai", 1500, {}),
  d("MW", 99, "Cesar Almeida", null, "BR", 6, 2, 0, 4, 0, 38, `6'3"`, `78"`, "American Top Team", "Kickboxer", 1500, {}),
  d("MW", 99, "David Branch", null, "US", 24, 7, 0, 6, 8, 45, `6'1"`, `75"`, "Renzo Gracie Academy", "Grappler", 1520, { retired: true }),
  d("MW", 99, "Nate Quarry", "Rock", "US", 12, 4, 0, 8, 1, 53, `6'0"`, `74"`, "Team Quest", "Striker", 1500, { retired: true }),
  d("MW", 99, "David Loiseau", "The Crow", "CA", 20, 11, 0, 11, 3, 46, `6'1"`, `75"`, "Sityodtong", "Striker", 1480, { retired: true }),
  d("MW", 99, "Cung Le", null, "US", 13, 3, 0, 9, 1, 54, `5'10"`, `74"`, "USH! Fight Team", "Striker", 1560, { retired: true }),
  d("MW", 99, "Chris Camozzi", null, "US", 27, 15, 0, 10, 7, 40, `6'3"`, `77"`, "Grudge Training Center", "MMA", 1480, { retired: true }),
  d("MW", 99, "Tim Kennedy", null, "US", 19, 6, 0, 6, 8, 46, `6'0"`, `74"`, "Jackson Wink MMA", "Wrestler", 1540, { retired: true }),
  d("MW", 99, "David Terrell", "Soul Assassin", "US", 11, 4, 0, 5, 5, 48, `6'1"`, `74"`, "Cesar Gracie Jiu-Jitsu", "BJJ", 1500, { retired: true }),
  d("MW", 99, "Phil Baroni", "The New York Bad Ass", "US", 16, 19, 0, 12, 2, 50, `5'9"`, `72"`, "American Top Team", "Boxer", 1460, { retired: true }),
  d("MW", 99, "Justin Levens", null, "US", 11, 8, 0, 6, 3, 43, `6'0"`, `74"`, "No Limits MMA", "BJJ", 1430, { retired: true }),

  // ---- WELTERWEIGHT ----
  d("WW", 99, "Ian Garry", "The Future", "IE", 16, 2, 0, 8, 1, 28, `6'3"`, `77"`, "Kill Cliff FC", "Striker", 1660, {}),
  d("WW", 99, "Frank Trigg", "Twinkle Toes", "US", 21, 11, 0, 9, 6, 52, `5'10"`, `73"`, "Trigon MMA", "Wrestler", 1520, { retired: true }),
  d("WW", 99, "Jon Fitch", null, "US", 32, 8, 1, 8, 10, 48, `6'0"`, `74"`, "American Kickboxing Academy", "Wrestler", 1600, { retired: true }),
  d("WW", 99, "Thiago Alves", "Pitbull", "BR", 28, 16, 0, 17, 2, 40, `5'9"`, `72"`, "American Top Team", "Muay Thai", 1550, { retired: true }),
  d("WW", 99, "Josh Koscheck", "Kos", "US", 19, 11, 0, 6, 6, 48, `5'10"`, `74"`, "Dethrone Base Camp", "Wrestler", 1580, { retired: true }),
  d("WW", 99, "Chris Lytle", "Lights Out", "US", 31, 18, 2, 13, 13, 50, `5'11"`, `74"`, "Integrated Fighting", "Boxer", 1530, { retired: true }),
  d("WW", 99, "Adriano Martins", null, "BR", 24, 9, 0, 9, 9, 44, `5'11"`, `74"`, "Ataides Jiu-Jitsu", "BJJ", 1500, { retired: true }),
  d("WW", 99, "Li Jingliang", "The Leech", "CN", 19, 9, 0, 11, 2, 36, `6'0"`, `75"`, "China Top Team", "Striker", 1540, {}),
  d("WW", 99, "Jake Matthews", "The Celtic Kid", "AU", 20, 7, 0, 6, 8, 31, `6'1"`, `75"`, "EMA Perth", "MMA", 1530, {}),
  d("WW", 99, "Nursulton Ruziboev", null, "UZ", 24, 7, 0, 15, 6, 32, `6'2"`, `77"`, "S-Team", "Sambo", 1500, {}),
  d("WW", 99, "Jason Jackson", "The Ass Kicker", "JM", 18, 5, 0, 7, 4, 34, `6'1"`, `76"`, "Kill Cliff FC", "MMA", 1520, {}),
  d("WW", 99, "Carlos Newton", "The Ronin", "CA", 25, 9, 0, 5, 12, 49, `5'11"`, `74"`, "Warrior MMA", "BJJ", 1540, { retired: true }),
  d("WW", 99, "Marius Žaromskis", "The Whitemare", "LT", 20, 9, 0, 13, 1, 44, `5'10"`, `73"`, "Kaunas MMA", "Striker", 1480, { retired: true }),
  d("WW", 99, "Paul Daley", "Semtex", "GB", 36, 16, 2, 27, 4, 42, `5'11"`, `74"`, "Team Daley", "Striker", 1560, { retired: true }),
  d("WW", 99, "Court McGee", "The Crusher", "US", 21, 12, 0, 6, 7, 41, `6'1"`, `75"`, "The Pit", "MMA", 1480, { retired: true }),
  d("WW", 99, "Piera Rodriguez", null, "PE", 9, 3, 0, 3, 3, 33, `5'4"`, `66"`, "MMA LAB", "Wrestler", 1450, {}),

  // ---- LIGHTWEIGHT ----
  d("LW", 99, "Erick Gonzalez", "The Ghost", "US", 15, 8, 0, 9, 2, 33, `5'10"`, `73"`, "MMA Lab", "Striker", 1450, { retired: true }),
  d("LW", 99, "Jordan Leavitt", "The Monkey King", "US", 12, 3, 0, 2, 6, 30, `5'9"`, `72"`, "Syndicate MMA", "Wrestler", 1500, {}),
  d("LW", 99, "Léo Santos", null, "BR", 18, 5, 1, 7, 8, 46, `6'0"`, `75"`, "Nova União", "BJJ", 1520, { retired: true }),
  d("LW", 99, "Yancy Medeiros", "The Kid", "US", 16, 8, 0, 7, 5, 38, `5'10"`, `74"`, "Grappling Unlimited Hawaii", "MMA", 1480, { retired: true }),
  d("LW", 99, "Josh Thomson", "The Punk", "US", 22, 8, 1, 8, 9, 47, `5'10"`, `74"`, "American Kickboxing Academy", "MMA", 1540, { retired: true }),
  d("LW", 99, "Gray Maynard", "The Bully", "US", 13, 5, 1, 4, 3, 46, `5'10"`, `73"`, "Power MMA", "Wrestler", 1520, { retired: true }),
  d("LW", 99, "Marquel Meds", null, "US", 10, 6, 0, 5, 2, 31, `5'11"`, `74"`, "Kill Cliff FC", "Striker", 1440, {}),
  d("LW", 99, "Matt Frevola", "Steamrolla", "US", 12, 4, 0, 5, 2, 34, `5'9"`, `72"`, "Longo-Weidman", "Wrestler", 1520, {}),
  d("LW", 99, "Tom Nolan", null, "AU", 7, 2, 0, 4, 1, 25, `6'2"`, `77"`, "Integrated MMA", "Kickboxer", 1480, {}),
  d("LW", 99, "Rinya Nakamura", null, "JP", 11, 1, 0, 4, 3, 30, `5'8"`, `73"`, "KRAV/BROS", "Wrestler", 1560, {}),
  d("LW", 99, "Takanori Gomi", "The Fireball Kid", "JP", 36, 15, 0, 19, 4, 47, `5'8"`, `72"`, "R-Wondo 059", "Boxer", 1550, { retired: true }),
  d("LW", 99, "Kenny Florian", "Ken-Flo", "US", 16, 6, 0, 5, 9, 49, `5'10"`, `74"`, "Florian Martial Arts", "Muay Thai", 1560, { retired: true }),
  d("LW", 99, "Joe Stevenson", "Daddy", "US", 33, 15, 0, 12, 14, 43, `5'8"`, `71"`, "Victory MMA", "Wrestler", 1500, { retired: true }),
  d("LW", 99, "Melvin Guillard", "The Young Assassin", "US", 32, 16, 3, 22, 2, 42, `5'9"`, `73"`, "Jackson Wink MMA", "Boxer", 1500, { retired: true }),

  // ---- FEATHERWEIGHT ----
  d("FW", 99, "Mark Hominick", "The Machine", "CA", 20, 12, 0, 11, 2, 43, `5'8"`, `72"`, "Adrenaline Training Center", "Striker", 1500, { retired: true }),
  d("FW", 99, "Jamall Emmers", null, "US", 21, 7, 0, 9, 2, 35, `5'10"`, `74"`, "MMA Lab", "MMA", 1490, {}),
  d("FW", 99, "Henry Corrales", "Bandido", "US", 20, 6, 0, 9, 4, 39, `5'9"`, `73"`, "MMA Lab", "MMA", 1490, { retired: true }),
  d("FW", 99, "Leonard Garcia", "Bad Boy", "US", 19, 11, 1, 9, 7, 46, `5'8"`, `73"`, "Jackson Wink MMA", "Brawler", 1480, { retired: true }),
  d("FW", 99, "Myles Jury", "The Fury", "US", 18, 6, 0, 8, 4, 38, `5'10"`, `74"`, "Victory MMA", "MMA", 1500, { retired: true }),
  d("FW", 99, "Brandon Davis", "Killer B", "US", 24, 12, 0, 10, 5, 35, `5'9"`, `74"`, "MMA Lab", "MMA", 1470, {}),
  d("FW", 99, "Kyle Bochniak", "Crash", "US", 11, 8, 0, 5, 1, 39, `5'9"`, `73"`, "Wai Kru", "Brawler", 1450, { retired: true }),

  // ---- BANTAMWEIGHT ----
  d("BW", 99, "Michael McDonald", "Mayday", "US", 20, 4, 0, 11, 4, 35, `5'9"`, `73"`, "Last Stand Fight Team", "Boxer", 1530, { retired: true }),
  d("BW", 99, "Taylor Lapilus", null, "FR", 21, 4, 0, 7, 5, 33, `5'8"`, `72"`, "Team Chapa Quente", "Striker", 1510, {}),
  d("BW", 99, "Anthony Romero", null, "CA", 11, 2, 0, 3, 5, 29, `5'9"`, `73"`, "Niagara Top Team", "MMA", 1460, {}),
  d("BW", 99, "Davey Grant", "Dangerous", "GB", 15, 7, 0, 5, 8, 39, `5'6"`, `69"`, "Gracie PSJ", "BJJ", 1490, {}),
  d("BW", 99, "Bogdan Grad", null, "MD", 8, 2, 0, 5, 1, 30, `5'7"`, `70"`, "Team Grad", "Striker", 1480, {}),
  d("BW", 99, "Casey Kenney", null, "US", 16, 4, 1, 4, 7, 34, `5'6"`, `69"`, "Tiger Muay Thai", "MMA", 1500, { retired: true }),
  d("BW", 99, "Brad Pickett", "One Punch", "GB", 25, 14, 0, 9, 8, 47, `5'6"`, `69"`, "ATT London", "Boxer", 1500, { retired: true }),
  d("BW", 99, "Takeya Mizugaki", null, "JP", 24, 14, 2, 8, 4, 42, `5'7"`, `70"`, "Killer Bee", "Boxer", 1500, { retired: true }),
  d("BW", 99, "Scott Jorgensen", "Young Guns", "US", 17, 13, 0, 6, 4, 44, `5'4"`, `67"`, "Twisted Genetiks", "Wrestler", 1480, { retired: true }),

  // ---- FLYWEIGHT ----
  d("FLW", 99, "C.J. Vergara", null, "US", 13, 5, 0, 5, 3, 34, `5'5"`, `68"`, "San Marcos MMA", "Striker", 1470, {}),
  d("FLW", 99, "Codey Rawlings", null, "US", 10, 4, 0, 3, 4, 30, `5'6"`, `69"`, "Murcielago MMA", "Wrestler", 1460, {}),
  d("FLW", 99, "Bruno Silva", "Bulldog", "BR", 14, 5, 2, 8, 1, 35, `5'5"`, `68"`, "ATS Team", "Striker", 1480, {}),
  d("FLW", 99, "Jose Ochoa", null, "US", 7, 2, 0, 3, 2, 28, `5'6"`, `69"`, "Ochoa MMA", "MMA", 1450, {}),
  d("FLW", 99, "Andre Lima", null, "BR", 9, 2, 0, 3, 4, 27, `5'6"`, `69"`, "Lima Fight Team", "MMA", 1470, {}),
  d("FLW", 99, "Alden Coria", null, "US", 6, 2, 0, 2, 3, 27, `5'4"`, `67"`, "Coria Combat", "Wrestler", 1430, {}),
  d("FLW", 99, "Wilson Reis", null, "BR", 25, 11, 0, 5, 11, 41, `5'4"`, `67"`, "Silver Corner BJJ", "BJJ", 1490, { retired: true }),
  d("FLW", 99, "Ray Borg", "The Tazmanian Devil", "US", 16, 5, 0, 2, 10, 32, `5'4"`, `66"`, "Jackson Wink MMA", "Wrestler", 1490, {}),
  d("FLW", 99, "Rodtang Jitmuangnon", "The Iron Man", "TH", 14, 2, 0, 11, 0, 28, `5'6"`, `69"`, "Jitmuangnon Gym", "Muay Thai", 1550, {}),
  d("FLW", 99, "John Moraga", null, "US", 20, 6, 0, 7, 6, 40, `5'6"`, `68"`, "Arizona Combat Sports", "Wrestler", 1480, { retired: true }),
];

export const FILL_WOMEN = [
  // ---- WOMEN'S BANTAMWEIGHT ----
  d("WBW", 99, "Larissa Pacheco", null, "BR", 23, 5, 0, 11, 5, 31, `5'7"`, `70"`, "Pacheco Combat Team", "Striker", 1580, {}),
  d("WBW", 99, "Gabriella Cavalcente", null, "BR", 7, 4, 0, 3, 2, 33, `5'6"`, `69"`, "Kimura Combat", "BJJ", 1400, {}),
  d("WBW", 99, "Bethe Correia", null, "BR", 12, 7, 1, 6, 0, 43, `5'5"`, `68"`, "Pitbull Brothers", "Boxer", 1440, { retired: true }),
  d("WBW", 99, "Lauren Murphy", "Lucky", "US", 16, 8, 0, 6, 6, 43, `5'5"`, `68"`, "MMA Lab", "Brawler", 1500, { retired: true }),
  d("WBW", 99, "Megan Anderson", null, "AU", 11, 5, 0, 7, 1, 36, `6'0"`, `74"`, "Team Quest", "Striker", 1500, { retired: true }),
  d("WBW", 99, "Tonya Evinger", "Triple Threat", "US", 21, 8, 1, 6, 10, 45, `5'7"`, `70"`, "ATT Houston", "Wrestler", 1470, { retired: true }),
  d("WBW", 99, "Felicia Spencer", "Fee", "CA", 9, 2, 1, 2, 5, 35, `5'8"`, `71"`, "Gracie Orlando", "BJJ", 1500, { retired: true }),
  d("WBW", 99, "Aspen Ladd", null, "US", 11, 5, 0, 5, 4, 31, `5'5"`, `68"`, "MMA Gold", "Wrestler", 1490, {}),
  d("WBW", 99, "Gina Mazany", "La Gina", "US", 9, 7, 0, 3, 3, 36, `5'6"`, `69"`, "American Top Team", "MMA", 1400, {}),
  d("WBW", 99, "Sarah Kaufman", null, "CA", 20, 5, 0, 10, 4, 40, `5'6"`, `69"`, "Zugec Ultimate Martial Arts", "Boxer", 1480, { retired: true }),

  // ---- WOMEN'S FLYWEIGHT ----
  d("WFLW", 99, "Victoria Leonardo", null, "US", 9, 6, 0, 3, 4, 35, `5'5"`, `68"`, "K1 Muay Thai & Fitness", "MMA", 1430, {}),
  d("WFLW", 99, "Antonina Shevchenko", "La Pantera", "KG", 12, 5, 0, 5, 1, 41, `5'7"`, `70"`, "Tiger Muay Thai", "Striker", 1470, { retired: true }),
  d("WFLW", 99, "Taila Santos", null, "BR", 20, 3, 0, 10, 5, 32, `5'8"`, `71"`, "Marreta Fit Team", "MMA", 1560, {}),
  d("WFLW", 99, "Alexis Davis", null, "CA", 20, 11, 0, 4, 9, 41, `5'6"`, `69"`, "Jackson Wink MMA", "BJJ", 1470, { retired: true }),

  // ---- WOMEN'S STRAWWEIGHT ----
  d("WSW", 99, "Jessica Penne", null, "US", 14, 6, 0, 3, 9, 44, `5'5"`, `68"`, "Impact Jiu-Jitsu", "BJJ", 1460, { retired: true }),
  d("WSW", 99, "Valérie Létourneau", "Trouble", "CA", 9, 7, 0, 3, 2, 43, `5'7"`, `70"`, "Tristar Gym", "MMA", 1450, { retired: true }),
  d("WSW", 99, "Jessica Aguilar", "Jag", "US", 20, 9, 0, 2, 11, 43, `5'3"`, `66"`, "American Top Team", "Wrestler", 1460, { retired: true }),
];
