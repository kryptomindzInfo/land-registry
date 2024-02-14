"use strict";

var globals = {
  // URL must be in line no. 5
  URL: "http://localhost:8000",
  // IPFS_URL must be in line no. 7
  IPFS_URL: "http://localhost:8080",
  MASTER_OTP: 123456,
  RL: "Residential License",
  VERIFIER_ONE_QUESTIONS: 2,
  VERIFIER_TWO_QUESTIONS: 2,
  COMMISSIONER_QUESTIONS: 3,
  SURVEYOUR_QUESTIONS: 8,
  VERIFIER_ONE: {
    one: "Land Location review for potential short or long term city goals ?",
    two: "The use of land is in confirm with master plan ?",
  },
  SURVEYOUR: {
    one: "Land area was survayed ?",
    two: "Existing notes were reviwed ?",
    three: "Land was surveyed based on offical Town-Plan projections ?",
    four: "Restriction on the use of land reviewed ?",
    five: "Discrepancies on the records against governemnt system of records checked ?",
    six: "Plot measured based on the existing standards ?",
    seven: "Land legal boundaries confirmed ?",
    eight: "GPS cordinates or drawing reviwed ?",
  },
  VERIFIER_TWO: {
    one: "Application reviewed completely for its accuracy ?",
    two: "Approve the application ?",
  },
  COMMISSIONER: {
    one: "Approve, sign and issue a certificate",
    two: "Place the document into the system",
    three: "Generate QRC",
  },
};

// var regions = [
//     {
//         id: 1,
//         name: 'Arusha'
//     },
//     {
//         id: 2,
//         name: 'Dar Es Salaam'
//     }
// ]

// var districts = [
//     {
//         id: 1,
//         region_id: 1,
//         name: 'Meru District Council'
//     },
//     {
//         id: 2,
//         region_id: 1,
//         name: 'Arusha District Council'
//     },
//     {
//         id: 3,
//         region_id: 1,
//         name: 'Karatu District Council'
//     },
//     {
//         id: 4,
//         region_id: 1,
//         name: 'Longido District Council'
//     },
//     {
//         id: 5,
//         region_id: 1,
//         name: 'Monduli District Council'
//     },
//     {
//         id: 6,
//         region_id: 1,
//         name: 'Ngorongoro District Council'
//     },
//     {
//         id: 7,
//         region_id: 2,
//         name: 'Ilala Municipal Council'
//     },
//     {
//         id: 8,
//         region_id: 2,
//         name: 'Kinondoni Municipal Council'
//     },
//     {
//         id: 9,
//         region_id: 2,
//         name: 'Temeke Municipal Council'
//     },
//     {
//         id: 10,
//         region_id: 2,
//         name: 'Kigamboni Municipal Council'
//     },
//     {
//         id: 11,
//         region_id: 2,
//         name: 'Ubungo Municipal Council'
//     }
// ]

// var wards = [
//     {
//         id: 1,
//         district_id: 1,
//         name: 'Akheri'
//     },
//     {
//         id: 2,
//         district_id: 1,
//         name: 'Bangata'
//     },
//     {
//         id: 3,
//         district_id: 1,
//         name: 'Bwawani'
//     },
//     {
//         id: 4,
//         district_id: 1,
//         name: "Ilkiding'a"
//     },
//     {
//         id: 5,
//         district_id: 1,
//         name: 'Kikatiti'
//     },
//     {
//         id: 6,
//         district_id: 1,
//         name: 'Kikwe'
//     },
//     {
//         id: 7,
//         district_id: 1,
//         name: 'Kimnyaki'
//     },
//     {
//         id: 8,
//         district_id: 1,
//         name: "King'ori"
//     },
//     {
//         id: 9,
//         district_id: 1,
//         name: 'Kiranyi'
//     },
//     {
//         id: 10,
//         district_id: 1,
//         name: 'Kisongo'
//     },
//     {
//         id: 11,
//         district_id: 1,
//         name: 'Leguruki'
//     },
//     {
//         id: 12,
//         district_id: 1,
//         name: 'Makiba'
//     },
//     {
//         id: 13,
//         district_id: 1,
//         name: 'Maji ya Chai'
//     },
//     {
//         id: 14,
//         district_id: 1,
//         name: 'Maroroni'
//     },
//     {
//         id: 15,
//         district_id: 1,
//         name: 'Mateves'
//     },
//     {
//         id: 16,
//         district_id: 1,
//         name: 'Mbuguni'
//     },
//     {
//         id: 17,
//         district_id: 1,
//         name: 'Mlangarini'
//     },
//     {
//         id: 18,
//         district_id: 1,
//         name: 'Moivo'
//     },
//     {
//         id: 19,
//         district_id: 1,
//         name: 'Moshono'
//     },
//     {
//         id: 20,
//         district_id: 1,
//         name: 'Murieti'
//     },
//     {
//         id: 21,
//         district_id: 1,
//         name: 'Musa'
//     },
//     {
//         id: 22,
//         district_id: 1,
//         name: 'Mwandeti'
//     },
//     {
//         id: 23,
//         district_id: 1,
//         name: 'Nduruma'
//     },
//     {
//         id: 24,
//         district_id: 1,
//         name: 'Ngarenanyuki'
//     },
//     {
//         id: 25,
//         district_id: 1,
//         name: 'Nkoanrua'
//     },
//     {
//         id: 26,
//         district_id: 1,
//         name: 'Nkoaranga'
//     },
//     {
//         id: 27,
//         district_id: 1,
//         name: 'Nkoarisambu'
//     },
//     {
//         id: 28,
//         district_id: 1,
//         name: 'Oldonyosambu'
//     },
//     {
//         id: 29,
//         district_id: 1,
//         name: 'Oljoro'
//     },
//     {
//         id: 30,
//         district_id: 1,
//         name: 'Olkokola'
//     },
//     {
//         id: 31,
//         district_id: 1,
//         name: 'Oltroto'
//     },
//     {
//         id: 32,
//         district_id: 1,
//         name: 'Oltrumet'
//     },
//     {
//         id: 33,
//         district_id: 1,
//         name: 'Poli'
//     },
//     {
//         id: 34,
//         district_id: 1,
//         name: 'Singisi'
//     },
//     {
//         id: 35,
//         district_id: 1,
//         name: 'Sokoni II'
//     },
//     {
//         id: 36,
//         district_id: 1,
//         name: 'Songoro'
//     },
//     {
//         id: 37,
//         district_id: 1,
//         name: 'Usa River'
//     },
//     {
//         id: 38,
//         district_id: 1,
//         name: 'Baraa'
//     },
//     {
//         id: 39,
//         district_id: 1,
//         name: 'Daraja Mbili'
//     },
//     {
//         id: 40,
//         district_id: 1,
//         name: 'Elerai'
//     },
//     {
//         id: 41,
//         district_id: 1,
//         name: 'Engosheraton'
//     },
//     {
//         id: 42,
//         district_id: 1,
//         name: 'Engutoto'
//     },
//     {
//         id: 43,
//         district_id: 1,
//         name: 'Kaloleni'
//     },
//     {
//         id: 44,
//         district_id: 1,
//         name: 'Kati'
//     },
//     {
//         id: 45,
//         district_id: 1,
//         name: 'Kimandolu'
//     },
//     {
//         id: 46,
//         district_id: 1,
//         name: 'Lemara'
//     },
//     {
//         id: 47,
//         district_id: 1,
//         name: 'Levolosi'
//     },
//     {
//         id: 48,
//         district_id: 1,
//         name: 'Ngarenaro'
//     },
//     {
//         id: 49,
//         district_id: 1,
//         name: 'Oloirien'
//     },
//     {
//         id: 50,
//         district_id: 1,
//         name: 'Sekei'
//     },
//     {
//         id: 51,
//         district_id: 1,
//         name: 'Sokon I'
//     },
//     {
//         id: 52,
//         district_id: 1,
//         name: 'Sombetini'
//     },
//     {
//         id: 53,
//         district_id: 1,
//         name: 'Terrat'
//     },
//     {
//         id: 54,
//         district_id: 1,
//         name: 'Themi'
//     },
//     {
//         id: 55,
//         district_id: 1,
//         name: 'Unga L.T.D.'
//     },
//     {
//         id: 56,
//         district_id: 2,
//         name: 'Bangata'
//     },
//     {
//         id: 57,
//         district_id: 2,
//         name: 'Ilboru'
//     },
//     {
//         id: 58,
//         district_id: 2,
//         name: "Ilkiding'a"
//     },
//     {
//         id: 59,
//         district_id: 2,
//         name: 'Kiranyi'
//     },
//     {
//         id: 60,
//         district_id: 2,
//         name: 'Kisongo'
//     },
//     {
//         id: 61,
//         district_id: 2,
//         name: 'Kiutu'
//     },
//     {
//         id: 62,
//         district_id: 2,
//         name: 'Laroi'
//     },
//     {
//         id: 63,
//         district_id: 2,
//         name: 'Lemanyata'
//     },
//     {
//         id: 64,
//         district_id: 2,
//         name: 'Mateves'
//     },
//     {
//         id: 65,
//         district_id: 2,
//         name: 'Mlangarini'
//     },
//     {
//         id: 66,
//         district_id: 2,
//         name: 'Moivo'
//     },
//     {
//         id: 67,
//         district_id: 2,
//         name: 'Musa'
//     },
//     {
//         id: 68,
//         district_id: 2,
//         name: 'Mwandeti'
//     },
//     {
//         id: 69,
//         district_id: 2,
//         name: 'Nduruma'
//     },
//     {
//         id: 70,
//         district_id: 2,
//         name: 'Oldadai'
//     },
//     {
//         id: 71,
//         district_id: 2,
//         name: 'Oldonyomaasi'
//     },
//     {
//         id: 72,
//         district_id: 2,
//         name: 'Oldonyosambu'
//     },
//     {
//         id: 73,
//         district_id: 2,
//         name: 'Oljoro'
//     },
//     {
//         id: 74,
//         district_id: 2,
//         name: 'Olmotonyi'
//     },
//     {
//         id: 75,
//         district_id: 2,
//         name: 'Olorieni'
//     },
//     {
//         id: 76,
//         district_id: 2,
//         name: 'Oltoroto'
//     },
//     {
//         id: 77,
//         district_id: 2,
//         name: 'Oltrumet'
//     },
//     {
//         id: 78,
//         district_id: 2,
//         name: 'Sambasha'
//     },
//     {
//         id: 79,
//         district_id: 2,
//         name: 'Sokon II'
//     },
//     {
//         id: 80,
//         district_id: 2,
//         name: 'Tarakwa'
//     },
//     {
//         id: 81,
//         district_id: 2,
//         name: 'Timbolo'
//     },
//     {
//         id: 82,
//         district_id: 3,
//         name: 'Baray'
//     },
//     {
//         id: 83,
//         district_id: 3,
//         name: 'Buger'
//     },
//     {
//         id: 84,
//         district_id: 3,
//         name: 'Daa'
//     },
//     {
//         id: 85,
//         district_id: 3,
//         name: 'Endabash'
//     },
//     {
//         id: 86,
//         district_id: 3,
//         name: 'Endamarariek'
//     },
//     {
//         id: 87,
//         district_id: 3,
//         name: 'Kansay'
//     },
//     {
//         id: 88,
//         district_id: 3,
//         name: 'Karatu'
//     },
//     {
//         id: 89,
//         district_id: 3,
//         name: "Mang'ola"
//     },
//     {
//         id: 90,
//         district_id: 3,
//         name: 'Mbulumbulu'
//     },
//     {
//         id: 91,
//         district_id: 3,
//         name: 'Oldeani'
//     },
//     {
//         id: 92,
//         district_id: 3,
//         name: 'Qurus'
//     },
//     {
//         id: 93,
//         district_id: 3,
//         name: 'Rhotia'
//     },
//     {
//         id: 94,
//         district_id: 4,
//         name: "Elang'atadapash"
//     },
//     {
//         id: 95,
//         district_id: 4,
//         name: 'Engarenaibo'
//     },
//     {
//         id: 96,
//         district_id: 4,
//         name: 'Engikaret'
//     },
//     {
//         id: 97,
//         district_id: 4,
//         name: 'Gelai Lumbwa'
//     },
//     {
//         id: 98,
//         district_id: 4,
//         name: 'Gelai Meirugoi'
//     },
//     {
//         id: 99,
//         district_id: 4,
//         name: 'Iloirienito'
//     },
//     {
//         id: 100,
//         district_id: 4,
//         name: 'Kamwanga'
//     },
//     {
//         id: 101,
//         district_id: 4,
//         name: 'Ketumbeine'
//     },
//     {
//         id: 102,
//         district_id: 4,
//         name: 'Kimokouwa'
//     },
//     {
//         id: 103,
//         district_id: 4,
//         name: 'Longido'
//     },
//     {
//         id: 104,
//         district_id: 4,
//         name: 'Matale'
//     },
//     {
//         id: 105,
//         district_id: 4,
//         name: 'Mundarara'
//     },
//     {
//         id: 106,
//         district_id: 4,
//         name: 'Namanga'
//     },
//     {
//         id: 107,
//         district_id: 4,
//         name: 'Noondoto'
//     },
//     {
//         id: 108,
//         district_id: 4,
//         name: 'Ol‐molog'
//     },
//     {
//         id: 109,
//         district_id: 4,
//         name: 'Orbomba'
//     },
//     {
//         id: 110,
//         district_id: 4,
//         name: 'Sinya'
//     },
//     {
//         id: 111,
//         district_id: 4,
//         name: 'Tingatinga'
//     },
//     {
//         id: 112,
//         district_id: 5,
//         name: 'Engarenaibor'
//     },
//     {
//         id: 113,
//         district_id: 5,
//         name: 'Engaruka'
//     },
//     {
//         id: 114,
//         district_id: 5,
//         name: 'Engutoto'
//     },
//     {
//         id: 115,
//         district_id: 5,
//         name: 'Esilalei'
//     },
//     {
//         id: 116,
//         district_id: 5,
//         name: 'Gelai Lumbwa'
//     },
//     {
//         id: 117,
//         district_id: 5,
//         name: 'Gelai Meirugoi'
//     },
//     {
//         id: 118,
//         district_id: 5,
//         name: 'Kitumbeine'
//     },
//     {
//         id: 119,
//         district_id: 5,
//         name: 'Lolkisale'
//     },
//     {
//         id: 120,
//         district_id: 5,
//         name: 'Longido'
//     },
//     {
//         id: 121,
//         district_id: 5,
//         name: 'Makuyuni'
//     },
//     {
//         id: 122,
//         district_id: 5,
//         name: 'Matale'
//     },
//     {
//         id: 123,
//         district_id: 5,
//         name: 'Moita'
//     },
//     {
//         id: 124,
//         district_id: 5,
//         name: 'Monduli Juu'
//     },
//     {
//         id: 125,
//         district_id: 5,
//         name: 'Monduli Mjini'
//     },
//     {
//         id: 126,
//         district_id: 5,
//         name: 'Mto wa Mbu[2]'
//     },
//     {
//         id: 127,
//         district_id: 5,
//         name: 'Ol-molog'
//     },
//     {
//         id: 128,
//         district_id: 5,
//         name: 'Selela'
//     },
//     {
//         id: 129,
//         district_id: 5,
//         name: 'Sepeko'
//     },
//     {
//         id: 130,
//         district_id: 5,
//         name: 'Tingatinga'
//     },
//     {
//         id: 131,
//         district_id: 6,
//         name: 'Arash'
//     },
//     {
//         id: 132,
//         district_id: 6,
//         name: 'Digodigo'
//     },
//     {
//         id: 133,
//         district_id: 6,
//         name: 'Enduleni'
//     },
//     {
//         id: 134,
//         district_id: 6,
//         name: 'Kakesio'
//     },
//     {
//         id: 135,
//         district_id: 6,
//         name: 'Malambo'
//     },
//     {
//         id: 136,
//         district_id: 6,
//         name: 'Nainokanoka'
//     },
//     {
//         id: 137,
//         district_id: 6,
//         name: 'Nayobi'
//     },
//     {
//         id: 138,
//         district_id: 6,
//         name: 'Olbalbal'
//     },
//     {
//         id: 139,
//         district_id: 6,
//         name: 'Oldonyo-Sambu'
//     },
//     {
//         id: 140,
//         district_id: 6,
//         name: 'Orgosorok'
//     },
//     {
//         id: 141,
//         district_id: 6,
//         name: 'Ngorongoro'
//     },
//     {
//         id: 142,
//         district_id: 6,
//         name: 'Pinyinyi'
//     },
//     {
//         id: 143,
//         district_id: 6,
//         name: 'Sale'
//     },
//     {
//         id: 144,
//         district_id: 6,
//         name: 'Soit Sambu'
//     },
//     {
//         id: 145,
//         district_id: 6,
//         name: 'Ololosokwan'
//     },
//     {
//         id: 146,
//         district_id: 6,
//         name: 'Oloipiri'
//     },
//     {
//         id: 147,
//         district_id: 6,
//         name: 'Enguserosambu'
//     },
//     {
//         id: 148,
//         district_id: 6,
//         name: 'Orgosorok'
//     },
//     {
//         id: 149,
//         district_id: 6,
//         name: 'Nayobi'
//     },
//     {
//         id: 150,
//         district_id: 7,
//         name: 'Buguruni'
//     },
//     {
//         id: 151,
//         district_id: 7,
//         name: 'Chanika'
//     },
//     {
//         id: 152,
//         district_id: 7,
//         name: 'Gerezani'
//     },
//     {
//         id: 153,
//         district_id: 7,
//         name: 'Ilala'
//     },
//     {
//         id: 154,
//         district_id: 7,
//         name: 'Jangwani'
//     },
//     {
//         id: 155,
//         district_id: 7,
//         name: 'Kariakoo'
//     },
//     {
//         id: 156,
//         district_id: 7,
//         name: 'Kinyerezi'
//     },
//     {
//         id: 157,
//         district_id: 7,
//         name: 'Kipawa'
//     },
//     {
//         id: 158,
//         district_id: 7,
//         name: 'Kitunda'
//     },
//     {
//         id: 159,
//         district_id: 7,
//         name: 'Kisutu'
//     },
//     {
//         id: 160,
//         district_id: 7,
//         name: 'Kivukoni'
//     },
//     {
//         id: 161,
//         district_id: 7,
//         name: 'Kiwalani'
//     },
//     {
//         id: 162,
//         district_id: 7,
//         name: 'Mchafukoge'
//     },
//     {
//         id: 163,
//         district_id: 7,
//         name: 'Mchikichini'
//     },
//     {
//         id: 164,
//         district_id: 7,
//         name: 'Msongola'
//     },
//     {
//         id: 165,
//         district_id: 7,
//         name: 'Pugu'
//     },
//     {
//         id: 166,
//         district_id: 7,
//         name: 'Segerea'
//     },
//     {
//         id: 167,
//         district_id: 7,
//         name: 'Tabata'
//     },
//     {
//         id: 168,
//         district_id: 7,
//         name: 'Ukonga'
//     },
//     {
//         id: 169,
//         district_id: 7,
//         name: 'Upanga East'
//     },
//     {
//         id: 170,
//         district_id: 7,
//         name: 'Upanga West'
//     },
//     {
//         id: 171,
//         district_id: 7,
//         name: 'Vingunguti'
//     },
//     {
//         id: 172,
//         district_id: 8,
//         name: 'Bunju'
//     },
//     {
//         id: 173,
//         district_id: 8,
//         name: 'Goba'
//     },
//     {
//         id: 174,
//         district_id: 8,
//         name: 'Hananasif'
//     },
//     {
//         id: 175,
//         district_id: 8,
//         name: 'Kawe'
//     },
//     {
//         id: 176,
//         district_id: 8,
//         name: 'Kibamba'
//     },
//     {
//         id: 177,
//         district_id: 8,
//         name: 'Kigogo'
//     },
//     {
//         id: 178,
//         district_id: 8,
//         name: 'Kijitonyama'
//     },
//     {
//         id: 179,
//         district_id: 8,
//         name: 'Kimara'
//     },
//     {
//         id: 180,
//         district_id: 8,
//         name: 'Kinondoni'
//     },
//     {
//         id: 181,
//         district_id: 8,
//         name: 'Kunduchi'
//     },
//     {
//         id: 182,
//         district_id: 8,
//         name: 'Mabibo'
//     },
//     {
//         id: 183,
//         district_id: 8,
//         name: 'Magomeni'
//     },
//     {
//         id: 184,
//         district_id: 8,
//         name: 'Makuburi'
//     },
//     {
//         id: 185,
//         district_id: 8,
//         name: 'Makumbusho'
//     },
//     {
//         id: 186,
//         district_id: 8,
//         name: 'Makurumula'
//     },
//     {
//         id: 187,
//         district_id: 8,
//         name: 'Manzese'
//     },
//     {
//         id: 188,
//         district_id: 8,
//         name: 'Mbezi'
//     },
//     {
//         id: 189,
//         district_id: 8,
//         name: 'Mburahati'
//     },
//     {
//         id: 190,
//         district_id: 8,
//         name: 'Mbweni'
//     },
//     {
//         id: 191,
//         district_id: 8,
//         name: 'Mikocheni'
//     },
//     {
//         id: 192,
//         district_id: 8,
//         name: 'Msasani'
//     },
//     {
//         id: 193,
//         district_id: 8,
//         name: 'Mwananyamala'
//     },
//     {
//         id: 194,
//         district_id: 8,
//         name: 'Mzimuni'
//     },
//     {
//         id: 195,
//         district_id: 8,
//         name: 'Ndugumbi'
//     },
//     {
//         id: 196,
//         district_id: 8,
//         name: 'Sinza'
//     },
//     {
//         id: 197,
//         district_id: 8,
//         name: 'Tandale'
//     },
//     {
//         id: 198,
//         district_id: 8,
//         name: 'Ubungo'
//     },
//     {
//         id: 199,
//         district_id: 9,
//         name: 'Azimio'
//     },
//     {
//         id: 200,
//         district_id: 9,
//         name: 'Chamazi'
//     },
//     {
//         id: 201,
//         district_id: 9,
//         name: "Chang'ombe"
//     },
//     {
//         id: 202,
//         district_id: 9,
//         name: 'Charambe'
//     },
//     {
//         id: 203,
//         district_id: 9,
//         name: 'Keko'
//     },
//     {
//         id: 204,
//         district_id: 9,
//         name: 'Kigamboni'
//     },
//     {
//         id: 205,
//         district_id: 9,
//         name: 'Kibada'
//     },
//     {
//         id: 206,
//         district_id: 9,
//         name: 'Yombo Vituka'
//     },
//     {
//         id: 207,
//         district_id: 9,
//         name: 'Kimbiji'
//     },
//     {
//         id: 208,
//         district_id: 9,
//         name: 'Kisarawe II'
//     },
//     {
//         id: 209,
//         district_id: 9,
//         name: 'Kurasini'
//     },
//     {
//         id: 210,
//         district_id: 9,
//         name: 'Makangarawe'
//     },
//     {
//         id: 211,
//         district_id: 9,
//         name: 'Mbagala'
//     },
//     {
//         id: 212,
//         district_id: 9,
//         name: 'Mbagala Kuu'
//     },
//     {
//         id: 213,
//         district_id: 9,
//         name: 'Miburani'
//     },
//     {
//         id: 214,
//         district_id: 9,
//         name: 'Mjimwema'
//     },
//     {
//         id: 215,
//         district_id: 9,
//         name: 'Mtoni'
//     },
//     {
//         id: 216,
//         district_id: 9,
//         name: 'Pemba Mnazi'
//     },
//     {
//         id: 217,
//         district_id: 9,
//         name: 'Sandali'
//     },
//     {
//         id: 218,
//         district_id: 9,
//         name: 'Somangira'
//     },
//     {
//         id: 219,
//         district_id: 9,
//         name: 'Tandika'
//     },
//     {
//         id: 220,
//         district_id: 9,
//         name: 'Temeke'
//     },
//     {
//         id: 221,
//         district_id: 9,
//         name: 'Toangoma'
//     },
//     {
//         id: 222,
//         district_id: 9,
//         name: 'Vijibweni'
//     }
// ]
