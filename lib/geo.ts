// Ülke / şehir / dil seçenek verileri (form dropdown'ları için)

export const COUNTRIES = [
  "Germany", "United Kingdom", "France", "Netherlands", "Belgium", "Austria",
  "Switzerland", "Italy", "Spain", "Portugal", "Sweden", "Norway", "Denmark",
  "Finland", "Ireland", "Poland", "Romania", "Greece", "Bulgaria", "Russia",
  "Ukraine", "United States", "Canada", "United Arab Emirates", "Saudi Arabia",
  "Qatar", "Kuwait", "Bahrain", "Oman", "Iraq", "Israel", "Azerbaijan",
  "Kazakhstan", "Turkey", "Egypt", "Morocco", "Algeria", "Tunisia", "Libya",
  "Australia", "Other",
];

// En sık kaynak ülkeler için büyük şehirler; listede olmayan ülkede serbest metin
export const CITIES: Record<string, string[]> = {
  Germany: ["Berlin", "München", "Hamburg", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"],
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Strasbourg"],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
  Belgium: ["Brussels", "Antwerp", "Ghent", "Liège"],
  Austria: ["Vienna", "Graz", "Linz", "Salzburg"],
  Switzerland: ["Zürich", "Geneva", "Basel", "Bern"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Dammam"],
  Iraq: ["Baghdad", "Erbil", "Basra", "Mosul"],
  Turkey: ["İstanbul", "Ankara", "İzmir", "Antalya", "Bursa"],
  Russia: ["Moscow", "Saint Petersburg", "Kazan"],
};

// Tercih edilen dil (endonim etiketlerle)
export const LANGUAGES = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "other", label: "Other" },
];
