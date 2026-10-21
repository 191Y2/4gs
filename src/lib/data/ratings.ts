import { Fighter } from "../types";

// ============ CURATED PRIME RATINGS ============
// Hand-tuned fight-engine attributes for the big names — every champion,
// every top contender, the legends, and the fan favorites. The generator
// derives stats from elo + style archetypes, which produced nonsense like
// Francis Ngannou with 68 grappling (he's the purest KO artist alive) and
// Bobby Green rated like a regional can. These patches are applied on top
// of the generated roster at load, keyed by fighter id; unknown ids are
// skipped silently so future roster swaps never crash.
//
// Scale: 0-100 per attribute. Elo anchors the betting math — champs sit
// ~1700-1900, elite contenders ~1650-1800, prime legends ~1700-1900.

export interface RatingPatch {
  str: number;
  pow: number;
  wr: number;
  gr: number;
  tdd: number;
  chin: number;
  cardio: number;
  elo?: number;
}

export const RATING_PATCHES: Record<string, RatingPatch> = {
  // ---------------- HEAVYWEIGHT ----------------
  "francis-ngannou": { str: 82, pow: 100, wr: 40, gr: 36, tdd: 55, chin: 84, cardio: 60, elo: 1820 },
  "jon-jones": { str: 88, pow: 78, wr: 96, gr: 94, tdd: 97, chin: 92, cardio: 88, elo: 1900 },
  "tom-aspinall": { str: 86, pow: 92, wr: 82, gr: 84, tdd: 86, chin: 82, cardio: 80, elo: 1800 },
  "ciryl-gane": { str: 90, pow: 74, wr: 62, gr: 68, tdd: 72, chin: 74, cardio: 82, elo: 1720 },
  "curtis-blaydes": { str: 70, pow: 84, wr: 95, gr: 80, tdd: 90, chin: 76, cardio: 78, elo: 1660 },
  "stipe-miocic": { str: 88, pow: 88, wr: 84, gr: 76, tdd: 84, chin: 88, cardio: 84, elo: 1810 },
  "daniel-cormier": { str: 84, pow: 82, wr: 96, gr: 86, tdd: 94, chin: 88, cardio: 82, elo: 1830 },
  "cain-velasquez": { str: 86, pow: 86, wr: 97, gr: 88, tdd: 95, chin: 84, cardio: 93, elo: 1820 },
  "junior-dos-santos": { str: 90, pow: 90, wr: 62, gr: 60, tdd: 70, chin: 82, cardio: 80, elo: 1750 },
  "fabricio-werdum": { str: 74, pow: 70, wr: 78, gr: 96, tdd: 76, chin: 82, cardio: 78, elo: 1740 },
  "alistair-overeem": { str: 88, pow: 88, wr: 76, gr: 82, tdd: 74, chin: 70, cardio: 76, elo: 1730 },
  "brock-lesnar": { str: 74, pow: 88, wr: 96, gr: 78, tdd: 88, chin: 76, cardio: 68, elo: 1700 },
  "andrei-arlovski": { str: 84, pow: 84, wr: 56, gr: 54, tdd: 62, chin: 62, cardio: 74, elo: 1620 },
  "mark-hunt": { str: 88, pow: 96, wr: 42, gr: 46, tdd: 50, chin: 90, cardio: 62, elo: 1650 },
  "alex-pereira": { str: 94, pow: 98, wr: 42, gr: 48, tdd: 60, chin: 84, cardio: 70, elo: 1780 },
  "derrick-lewis": { str: 80, pow: 96, wr: 48, gr: 44, tdd: 58, chin: 82, cardio: 58, elo: 1620 },
  "jailton-almeida": { str: 70, pow: 74, wr: 92, gr: 94, tdd: 84, chin: 78, cardio: 80, elo: 1700 },
  "alexander-volkov": { str: 84, pow: 78, wr: 56, gr: 60, tdd: 66, chin: 76, cardio: 78, elo: 1640 },
  "sergei-pavlovich": { str: 86, pow: 96, wr: 55, gr: 55, tdd: 60, chin: 78, cardio: 64, elo: 1700 },
  "tai-tuivasa": { str: 82, pow: 92, wr: 45, gr: 45, tdd: 55, chin: 84, cardio: 60, elo: 1580 },
  "jairzinho-rozenstruik": { str: 82, pow: 94, wr: 45, gr: 48, tdd: 55, chin: 80, cardio: 62, elo: 1600 },
  "alexandr-romanov": { str: 74, pow: 84, wr: 92, gr: 84, tdd: 82, chin: 80, cardio: 70, elo: 1620 },
  "marcin-tybura": { str: 74, pow: 74, wr: 80, gr: 76, tdd: 80, chin: 80, cardio: 78, elo: 1600 },

  // ---------------- LIGHT HEAVYWEIGHT ----------------
  "magomed-ankalaev": { str: 86, pow: 84, wr: 74, gr: 74, tdd: 80, chin: 84, cardio: 80, elo: 1750 },
  "carlos-ulberg": { str: 86, pow: 86, wr: 58, gr: 60, tdd: 70, chin: 80, cardio: 78, elo: 1730 },
  "jamahal-hill": { str: 88, pow: 90, wr: 50, gr: 52, tdd: 62, chin: 78, cardio: 76, elo: 1690 },
  "anthony-smith": { str: 78, pow: 80, wr: 60, gr: 66, tdd: 68, chin: 78, cardio: 78, elo: 1600 },
  "thiago-santos": { str: 84, pow: 92, wr: 55, gr: 55, tdd: 62, chin: 76, cardio: 72, elo: 1640 },
  "volkan-oezdemir": { str: 84, pow: 88, wr: 55, gr: 55, tdd: 65, chin: 76, cardio: 74, elo: 1620 },
  "nikita-krylov": { str: 78, pow: 84, wr: 70, gr: 70, tdd: 70, chin: 78, cardio: 74, elo: 1630 },
  "johnny-walker": { str: 80, pow: 88, wr: 55, gr: 60, tdd: 60, chin: 74, cardio: 72, elo: 1580 },
  "khalil-rountree": { str: 84, pow: 88, wr: 48, gr: 50, tdd: 60, chin: 78, cardio: 74, elo: 1660 },
  "azamat-murzakanov": { str: 80, pow: 84, wr: 72, gr: 68, tdd: 72, chin: 78, cardio: 72, elo: 1640 },
  "ryan-spann": { str: 78, pow: 82, wr: 62, gr: 64, tdd: 64, chin: 74, cardio: 72, elo: 1560 },
  "maur-cio-rua": { str: 84, pow: 86, wr: 70, gr: 72, tdd: 72, chin: 82, cardio: 74, elo: 1720 },
  "lyoto-machida": { str: 88, pow: 78, wr: 68, gr: 74, tdd: 78, chin: 80, cardio: 80, elo: 1740 },
  "rashad-evans": { str: 80, pow: 78, wr: 84, gr: 74, tdd: 82, chin: 80, cardio: 80, elo: 1700 },
  "tito-ortiz": { str: 72, pow: 72, wr: 92, gr: 80, tdd: 86, chin: 84, cardio: 78, elo: 1690 },
  "chuck-liddell": { str: 86, pow: 90, wr: 55, gr: 58, tdd: 76, chin: 88, cardio: 74, elo: 1730 },
  "quinton-jackson": { str: 84, pow: 92, wr: 68, gr: 62, tdd: 70, chin: 86, cardio: 72, elo: 1720 },
  "wanderlei-silva": { str: 88, pow: 92, wr: 55, gr: 62, tdd: 60, chin: 84, cardio: 72, elo: 1740 },
  "dan-henderson": { str: 84, pow: 92, wr: 78, gr: 72, tdd: 78, chin: 86, cardio: 72, elo: 1740 },
  "chael-sonnen": { str: 70, pow: 66, wr: 92, gr: 76, tdd: 84, chin: 78, cardio: 82, elo: 1650 },
  "glover-teixeira": { str: 82, pow: 82, wr: 76, gr: 88, tdd: 74, chin: 82, cardio: 76, elo: 1720 },
  "forrest-griffin": { str: 76, pow: 74, wr: 72, gr: 68, tdd: 74, chin: 84, cardio: 84, elo: 1660 },

  // ---------------- MIDDLEWEIGHT ----------------
  "israel-adesanya": { str: 94, pow: 82, wr: 45, gr: 50, tdd: 76, chin: 80, cardio: 78, elo: 1780 },
  "dricus-du-plessis": { str: 84, pow: 88, wr: 74, gr: 84, tdd: 76, chin: 92, cardio: 86, elo: 1770 },
  "sean-strickland": { str: 86, pow: 76, wr: 62, gr: 62, tdd: 78, chin: 88, cardio: 88, elo: 1720 },
  "robert-whittaker": { str: 88, pow: 80, wr: 66, gr: 68, tdd: 78, chin: 84, cardio: 86, elo: 1760 },
  "khamzat-chimaev": { str: 80, pow: 82, wr: 97, gr: 94, tdd: 92, chin: 86, cardio: 78, elo: 1800 },
  "jared-cannonier": { str: 86, pow: 88, wr: 62, gr: 64, tdd: 70, chin: 84, cardio: 76, elo: 1670 },
  "yoel-romero": { str: 84, pow: 92, wr: 88, gr: 84, tdd: 86, chin: 90, cardio: 62, elo: 1750 },
  "anderson-silva": { str: 95, pow: 84, wr: 60, gr: 80, tdd: 70, chin: 84, cardio: 76, elo: 1850 },
  "chris-weidman": { str: 76, pow: 76, wr: 86, gr: 82, tdd: 84, chin: 80, cardio: 78, elo: 1680 },
  "luke-rockhold": { str: 80, pow: 76, wr: 78, gr: 90, tdd: 76, chin: 74, cardio: 78, elo: 1680 },
  "gegard-mousasi": { str: 86, pow: 78, wr: 74, gr: 78, tdd: 78, chin: 80, cardio: 80, elo: 1740 },
  "ronaldo-souza": { str: 78, pow: 78, wr: 86, gr: 96, tdd: 82, chin: 82, cardio: 76, elo: 1730 },
  "kelvin-gastelum": { str: 80, pow: 80, wr: 66, gr: 72, tdd: 70, chin: 82, cardio: 80, elo: 1630 },
  "paulo-costa": { str: 86, pow: 92, wr: 72, gr: 70, tdd: 70, chin: 86, cardio: 72, elo: 1680 },
  "marvin-vettori": { str: 78, pow: 74, wr: 72, gr: 70, tdd: 78, chin: 86, cardio: 86, elo: 1650 },
  "jack-hermansson": { str: 78, pow: 74, wr: 70, gr: 80, tdd: 70, chin: 78, cardio: 80, elo: 1620 },
  "derek-brunson": { str: 70, pow: 72, wr: 86, gr: 76, tdd: 80, chin: 80, cardio: 78, elo: 1620 },
  "vitor-belfort": { str: 88, pow: 90, wr: 60, gr: 74, tdd: 62, chin: 78, cardio: 70, elo: 1730 },
  "michael-bisping": { str: 82, pow: 72, wr: 68, gr: 66, tdd: 78, chin: 84, cardio: 86, elo: 1660 },
  "rich-franklin": { str: 80, pow: 76, wr: 70, gr: 68, tdd: 74, chin: 82, cardio: 80, elo: 1660 },
  "caio-borralho": { str: 82, pow: 78, wr: 84, gr: 84, tdd: 82, chin: 82, cardio: 82, elo: 1710 },

  // ---------------- WELTERWEIGHT ----------------
  "islam-makhachev": { str: 82, pow: 74, wr: 97, gr: 97, tdd: 92, chin: 86, cardio: 92, elo: 1890 },
  "kamaru-usman": { str: 84, pow: 82, wr: 92, gr: 84, tdd: 90, chin: 88, cardio: 84, elo: 1810 },
  "leon-edwards": { str: 88, pow: 78, wr: 68, gr: 72, tdd: 80, chin: 86, cardio: 86, elo: 1750 },
  "belal-muhammad": { str: 78, pow: 70, wr: 86, gr: 76, tdd: 88, chin: 86, cardio: 90, elo: 1740 },
  "shavkat-rakhmonov": { str: 82, pow: 84, wr: 90, gr: 94, tdd: 86, chin: 86, cardio: 84, elo: 1800 },
  "jack-della-maddalena": { str: 90, pow: 86, wr: 60, gr: 62, tdd: 74, chin: 84, cardio: 80, elo: 1740 },
  "ian-garry": { str: 88, pow: 80, wr: 62, gr: 66, tdd: 78, chin: 80, cardio: 84, elo: 1700 },
  "georges-st-pierre": { str: 90, pow: 78, wr: 96, gr: 90, tdd: 96, chin: 88, cardio: 95, elo: 1880 },
  "matt-hughes": { str: 78, pow: 78, wr: 92, gr: 82, tdd: 86, chin: 84, cardio: 82, elo: 1720 },
  "robbie-lawler": { str: 84, pow: 92, wr: 58, gr: 58, tdd: 68, chin: 90, cardio: 74, elo: 1700 },
  "johny-hendricks": { str: 80, pow: 84, wr: 88, gr: 70, tdd: 82, chin: 82, cardio: 78, elo: 1670 },
  "carlos-condit": { str: 82, pow: 78, wr: 62, gr: 76, tdd: 68, chin: 82, cardio: 80, elo: 1670 },
  "nick-diaz": { str: 82, pow: 72, wr: 74, gr: 84, tdd: 74, chin: 88, cardio: 90, elo: 1680 },
  "nate-diaz": { str: 78, pow: 70, wr: 70, gr: 82, tdd: 72, chin: 88, cardio: 88, elo: 1640 },
  "jorge-masvidal": { str: 84, pow: 80, wr: 66, gr: 68, tdd: 74, chin: 84, cardio: 80, elo: 1670 },
  "tyron-woodley": { str: 80, pow: 88, wr: 84, gr: 70, tdd: 82, chin: 82, cardio: 74, elo: 1680 },
  "colby-covington": { str: 78, pow: 70, wr: 92, gr: 78, tdd: 88, chin: 84, cardio: 90, elo: 1720 },
  "gilbert-burns": { str: 76, pow: 76, wr: 84, gr: 90, tdd: 78, chin: 78, cardio: 78, elo: 1680 },
  "stephen-thompson": { str: 88, pow: 74, wr: 45, gr: 50, tdd: 76, chin: 78, cardio: 78, elo: 1660 },
  "demian-maia": { str: 62, pow: 58, wr: 84, gr: 98, tdd: 78, chin: 78, cardio: 76, elo: 1670 },
  "joaquin-buckley": { str: 84, pow: 88, wr: 60, gr: 58, tdd: 66, chin: 80, cardio: 76, elo: 1660 },
  "rory-macdonald": { str: 82, pow: 76, wr: 72, gr: 76, tdd: 76, chin: 84, cardio: 80, elo: 1680 },
  "matt-serra": { str: 74, pow: 78, wr: 70, gr: 78, tdd: 68, chin: 76, cardio: 74, elo: 1580 },

  // ---------------- LIGHTWEIGHT ----------------
  "dustin-poirier": { str: 90, pow: 86, wr: 76, gr: 82, tdd: 78, chin: 90, cardio: 92, elo: 1770 },
  "justin-gaethje": { str: 90, pow: 93, wr: 58, gr: 52, tdd: 76, chin: 86, cardio: 88, elo: 1760 },
  "charles-oliveira": { str: 84, pow: 78, wr: 76, gr: 98, tdd: 70, chin: 78, cardio: 82, elo: 1770 },
  "arman-tsarukyan": { str: 84, pow: 80, wr: 93, gr: 88, tdd: 90, chin: 84, cardio: 88, elo: 1780 },
  "khabib-nurmagomedov": { str: 78, pow: 70, wr: 99, gr: 96, tdd: 97, chin: 90, cardio: 92, elo: 1900 },
  "bobby-green": { str: 84, pow: 70, wr: 58, gr: 56, tdd: 70, chin: 78, cardio: 84, elo: 1640 },
  "paddy-pimblett": { str: 74, pow: 64, wr: 58, gr: 90, tdd: 66, chin: 82, cardio: 84, elo: 1680 },
  "michael-chandler": { str: 84, pow: 88, wr: 74, gr: 70, tdd: 76, chin: 82, cardio: 78, elo: 1690 },
  "tony-ferguson": { str: 82, pow: 78, wr: 68, gr: 84, tdd: 76, chin: 86, cardio: 86, elo: 1670 },
  "eddie-alvarez": { str: 80, pow: 82, wr: 72, gr: 70, tdd: 72, chin: 88, cardio: 82, elo: 1650 },
  "anthony-pettis": { str: 84, pow: 80, wr: 58, gr: 66, tdd: 66, chin: 78, cardio: 78, elo: 1640 },
  "donald-cerrone": { str: 82, pow: 78, wr: 66, gr: 80, tdd: 68, chin: 82, cardio: 82, elo: 1650 },
  "rafael-dos-anjos": { str: 80, pow: 74, wr: 78, gr: 80, tdd: 80, chin: 84, cardio: 84, elo: 1670 },
  "conor-mcgregor": { str: 92, pow: 94, wr: 45, gr: 50, tdd: 62, chin: 76, cardio: 74, elo: 1760 },
  "beneil-dariush": { str: 76, pow: 74, wr: 84, gr: 84, tdd: 80, chin: 82, cardio: 82, elo: 1680 },
  "mateusz-gamrot": { str: 76, pow: 72, wr: 94, gr: 84, tdd: 88, chin: 80, cardio: 84, elo: 1700 },
  "dan-hooker": { str: 84, pow: 80, wr: 55, gr: 60, tdd: 66, chin: 82, cardio: 80, elo: 1640 },
  "renato-moicano": { str: 80, pow: 74, wr: 74, gr: 86, tdd: 74, chin: 78, cardio: 82, elo: 1660 },
  "bj-penn": { str: 82, pow: 78, wr: 74, gr: 88, tdd: 74, chin: 82, cardio: 76, elo: 1700 },

  // ---------------- FEATHERWEIGHT ----------------
  "alexander-volkanovski": { str: 92, pow: 80, wr: 68, gr: 74, tdd: 88, chin: 88, cardio: 94, elo: 1820 },
  "ilia-topuria": { str: 92, pow: 90, wr: 84, gr: 88, tdd: 86, chin: 88, cardio: 84, elo: 1860 },
  "max-holloway": { str: 92, pow: 78, wr: 70, gr: 74, tdd: 80, chin: 94, cardio: 96, elo: 1800 },
  "brian-ortega": { str: 76, pow: 70, wr: 66, gr: 94, tdd: 62, chin: 86, cardio: 80, elo: 1670 },
  "yair-rodr-guez": { str: 86, pow: 74, wr: 62, gr: 70, tdd: 68, chin: 78, cardio: 80, elo: 1700 },
  "josh-emmett": { str: 82, pow: 92, wr: 62, gr: 62, tdd: 70, chin: 88, cardio: 74, elo: 1640 },
  "diego-lopes": { str: 86, pow: 82, wr: 70, gr: 88, tdd: 68, chin: 80, cardio: 78, elo: 1710 },
  "movsar-evloev": { str: 80, pow: 70, wr: 88, gr: 84, tdd: 88, chin: 84, cardio: 86, elo: 1730 },
  "jos-aldo": { str: 90, pow: 88, wr: 68, gr: 76, tdd: 78, chin: 84, cardio: 78, elo: 1820 },
  "chan-sung-jung": { str: 80, pow: 76, wr: 62, gr: 76, tdd: 66, chin: 82, cardio: 78, elo: 1630 },
  "cub-swanson": { str: 80, pow: 78, wr: 58, gr: 66, tdd: 66, chin: 80, cardio: 76, elo: 1580 },
  "frankie-edgar": { str: 78, pow: 68, wr: 84, gr: 72, tdd: 82, chin: 84, cardio: 86, elo: 1680 },
  "urijah-faber": { str: 78, pow: 74, wr: 76, gr: 72, tdd: 76, chin: 80, cardio: 78, elo: 1650 },

  // ---------------- BANTAMWEIGHT ----------------
  "petr-yan": { str: 90, pow: 82, wr: 70, gr: 74, tdd: 80, chin: 86, cardio: 84, elo: 1760 },
  "sean-omalley": { str: 93, pow: 86, wr: 45, gr: 52, tdd: 64, chin: 74, cardio: 80, elo: 1730 },
  "merab-dvalishvili": { str: 76, pow: 66, wr: 97, gr: 84, tdd: 92, chin: 90, cardio: 98, elo: 1810 },
  "aljamain-sterling": { str: 74, pow: 66, wr: 88, gr: 94, tdd: 88, chin: 84, cardio: 88, elo: 1760 },
  "cory-sandhagen": { str: 88, pow: 80, wr: 62, gr: 68, tdd: 74, chin: 78, cardio: 82, elo: 1720 },
  "marlon-vera": { str: 84, pow: 82, wr: 62, gr: 68, tdd: 70, chin: 86, cardio: 80, elo: 1690 },
  "tj-dillashaw": { str: 86, pow: 78, wr: 76, gr: 76, tdd: 78, chin: 78, cardio: 82, elo: 1720 },
  "dominick-cruz": { str: 84, pow: 66, wr: 74, gr: 68, tdd: 84, chin: 78, cardio: 86, elo: 1700 },
  "cody-garbrandt": { str: 84, pow: 88, wr: 50, gr: 52, tdd: 60, chin: 72, cardio: 74, elo: 1600 },
  "henry-cejudo": { str: 82, pow: 78, wr: 92, gr: 88, tdd: 90, chin: 84, cardio: 82, elo: 1780 },
  "marlon-moraes": { str: 82, pow: 84, wr: 60, gr: 66, tdd: 64, chin: 76, cardio: 76, elo: 1640 },
  "pedro-munhoz": { str: 76, pow: 78, wr: 60, gr: 78, tdd: 66, chin: 78, cardio: 76, elo: 1600 },
  "rob-font": { str: 84, pow: 72, wr: 50, gr: 55, tdd: 70, chin: 76, cardio: 80, elo: 1620 },
  "deiveson-figueiredo": { str: 88, pow: 88, wr: 74, gr: 84, tdd: 72, chin: 84, cardio: 80, elo: 1750 },

  // ---------------- FLYWEIGHT ----------------
  "demetrious-johnson": { str: 88, pow: 74, wr: 93, gr: 93, tdd: 95, chin: 86, cardio: 93, elo: 1850 },
  "brandon-moreno": { str: 84, pow: 76, wr: 74, gr: 80, tdd: 78, chin: 88, cardio: 88, elo: 1750 },
  "alexandre-pantoja": { str: 84, pow: 78, wr: 84, gr: 88, tdd: 82, chin: 86, cardio: 86, elo: 1780 },
  "joshua-van": { str: 86, pow: 84, wr: 62, gr: 66, tdd: 72, chin: 80, cardio: 78, elo: 1720 },
  "amir-albazi": { str: 80, pow: 74, wr: 76, gr: 84, tdd: 76, chin: 78, cardio: 78, elo: 1680 },
  "muhammad-mokaev": { str: 70, pow: 62, wr: 94, gr: 90, tdd: 90, chin: 82, cardio: 86, elo: 1710 },
  "tim-elliott": { str: 74, pow: 68, wr: 74, gr: 68, tdd: 72, chin: 78, cardio: 80, elo: 1560 },

  // ---------------- WOMEN'S BW ----------------
  "kayla-harrison": { str: 80, pow: 85, wr: 95, gr: 92, tdd: 90, chin: 86, cardio: 84, elo: 1780 },
  "amanda-nunes": { str: 94, pow: 92, wr: 76, gr: 82, tdd: 78, chin: 88, cardio: 84, elo: 1870 },
  "ronda-rousey": { str: 74, pow: 84, wr: 92, gr: 96, tdd: 74, chin: 78, cardio: 76, elo: 1750 },
  "miesha-tate": { str: 72, pow: 70, wr: 76, gr: 84, tdd: 74, chin: 80, cardio: 78, elo: 1600 },
  "holly-holm": { str: 84, pow: 76, wr: 62, gr: 58, tdd: 78, chin: 82, cardio: 78, elo: 1640 },
  "germaine-de-randamie": { str: 86, pow: 82, wr: 55, gr: 55, tdd: 72, chin: 78, cardio: 74, elo: 1650 },
  "cris-cyborg": { str: 95, pow: 95, wr: 70, gr: 74, tdd: 70, chin: 90, cardio: 78, elo: 1800 },
  "raquel-pennington": { str: 76, pow: 70, wr: 70, gr: 68, tdd: 74, chin: 82, cardio: 84, elo: 1620 },
  "ketlen-vieira": { str: 76, pow: 72, wr: 78, gr: 80, tdd: 76, chin: 80, cardio: 78, elo: 1640 },

  // ---------------- WOMEN'S FLW ----------------
  "valentina-shevchenko": { str: 94, pow: 80, wr: 70, gr: 82, tdd: 84, chin: 86, cardio: 86, elo: 1780 },
  "alexa-grasso": { str: 84, pow: 74, wr: 68, gr: 76, tdd: 76, chin: 82, cardio: 82, elo: 1700 },
  "natalia-silva": { str: 88, pow: 74, wr: 70, gr: 72, tdd: 78, chin: 80, cardio: 84, elo: 1730 },
  "manon-fiorot": { str: 88, pow: 80, wr: 66, gr: 64, tdd: 76, chin: 82, cardio: 82, elo: 1720 },
  "erin-blanchfield": { str: 76, pow: 70, wr: 88, gr: 90, tdd: 84, chin: 80, cardio: 84, elo: 1730 },
  "maycee-barber": { str: 82, pow: 74, wr: 70, gr: 62, tdd: 68, chin: 78, cardio: 78, elo: 1640 },
  "j-ssica-andrade": { str: 84, pow: 84, wr: 72, gr: 74, tdd: 74, chin: 84, cardio: 80, elo: 1680 },

  // ---------------- WOMEN'S SW ----------------
  "zhang-weili": { str: 92, pow: 88, wr: 86, gr: 84, tdd: 90, chin: 88, cardio: 88, elo: 1820 },
  "mackenzie-dern": { str: 72, pow: 62, wr: 58, gr: 96, tdd: 55, chin: 76, cardio: 78, elo: 1650 },
  "rose-namajunas": { str: 84, pow: 72, wr: 66, gr: 72, tdd: 76, chin: 82, cardio: 82, elo: 1700 },
  "joanna-j-drzejczyk": { str: 92, pow: 76, wr: 58, gr: 60, tdd: 72, chin: 84, cardio: 82, elo: 1720 },
  "yan-xiaonan": { str: 84, pow: 74, wr: 62, gr: 60, tdd: 70, chin: 80, cardio: 80, elo: 1640 },
  "tatiana-suarez": { str: 80, pow: 74, wr: 94, gr: 88, tdd: 90, chin: 82, cardio: 82, elo: 1750 },
  "carla-esparza": { str: 68, pow: 60, wr: 88, gr: 74, tdd: 84, chin: 78, cardio: 82, elo: 1600 },

  // ---------------- THE PROSPECTS THE FANS KNOW ----------------
  "quillan-salkilld": { str: 78, pow: 72, wr: 68, gr: 62, tdd: 66, chin: 76, cardio: 78, elo: 1560 },
};

// apply every patch that matches a roster id — returns how many landed
export function applyRatingPatches(roster: Fighter[]): number {
  let applied = 0;
  for (const f of roster) {
    const p = RATING_PATCHES[f.id];
    if (!p) continue;
    f.str = p.str;
    f.pow = p.pow;
    f.wr = p.wr;
    f.gr = p.gr;
    f.tdd = p.tdd;
    f.chin = p.chin;
    f.cardio = p.cardio;
    if (p.elo != null) f.elo = p.elo;
    applied++;
  }
  return applied;
}
