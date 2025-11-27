/**
 * Compare checklist order with JSON order and find missing wines
 */

const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Checklist order (as provided by user)
const checklistWines = [
  "La Marca Prosecco",
  "Valdo Bio Prosecco",
  "1928 Prosecco DOC Frizzante Carvicchioli e Figli",
  "Valdo Prosecco Rosé Brut",
  "Montegrande Prosecco",
  "Millage Prosecco DOC Treviso",
  "Corte delle Calli Rosé Spumante",
  "Whispering Angel Rosé",
  "Bargemone Rosé",
  "Boutinot Malbec Rosé",
  "Les Cerisiers Côtes du Rhône Rosé",
  "Lafage Miraflors Rosé",
  "Brunello di Montalcino Banfi 2019",
  "Sequoia Grove Cabernet Sauvignon Napa Valley 2020",
  "Cloudy Bay Pinot Noir 2022",
  "Margaux de Brane 2019",
  "Frank Phélan Saint-Estèphe 2018",
  "Château Lilian Ladouys Saint-Estèphe 2019",
  "Labastide Dauzac Margaux 2021",
  "Barolo DOCG Patres",
  "Piedra Negra Malbec Alta Colección 2024",
  "Rupert & Rothschild Classique 2009",
  "Vale D. Maria Douro Superior 2022",
  "Faustino I Gran Reserva 2015",
  "Château Tour de Perrigal Bordeaux Supérieur 2021",
  "Conde Valdemar Rioja Crianza Reserva 2017",
  "Rioja Vega Crianza 2021",
  "Ébano 6 Ribera del Duero",
  "Esporão Reserva Tinto Organic 2022",
  "Terrazas de los Andes Malbec 2022",
  "Portillo Malbec 2022",
  "Fin del Mundo Malbec 2022",
  "Crozes-Hermitage Delas 2022",
  "Bertani Valpolicella Ripasso",
  "Castello di Albola Chianti Classico",
  "Valmoissine Pinot Noir Louis Latour 2022",
  "Grand Veneur Côtes du Rhône 2023",
  "Geyerhof Stockwerk Zweigelt",
  "Barahonda Organic Monastrell–Merlot 2018",
  "Corazón de Lolita Premium Coupage",
  "Bread & Butter Pinot Noir 2023",
  "Lafage Miraflors Red",
  "Pasqua ZIN Primitivo",
  "Pasqua Morago Appassite",
  "Plaimont Colombelle Tannat Cabernet Sauvignon",
  "Integral 3 Unfiltered",
  "Cloudy Bay Chardonnay 2022",
  "Sequoia Grove Chardonnay 2021",
  "Cloudy Bay Sauvignon Blanc 2024",
  "Chablis \"La Sereine\"",
  "Rupert & Rothschild Baroness Nadine Chardonnay 2023",
  "Sancerre 2023",
  "Louis Jadot Mâcon-Lugny 2023",
  "Domaine Gueneau Sancerre \"La Guiberte\" 2024",
  "Assyrtiko Papagiannakos",
  "Geyerhof Stockwerk Grüner Veltliner",
  "Lolo Albariño",
  "Terrazas de los Andes Chardonnay 2024",
  "Protos Verdejo 2024",
  "Picpoul de Pinet Domaine de la Madone 2023",
  "Viore Verdejo Sobre Lias 2022",
  "Lagar de Besada Albariño",
  "Bread & Butter Chardonnay 2023",
  "3 Wooly Sheep Sauvignon Blanc",
  "Salisbury 1848 Chardonnay 2024",
  "Faustino VII Blanco",
  "Lafage Miraflors Blanc",
  "Hans Baer Riesling Trocken"
];

// Read JSON to get all wines
const jsonPath = path.join(__dirname, '../wine-list-transformed.json');
const wines = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Create maps for comparison
const checklistSlugs = checklistWines.map(w => slugify(w));
const jsonWinesMap = new Map(wines.map(w => [slugify(w.name), w.name]));

console.log('📋 SLUGIFIED FILENAMES IN CHECKLIST ORDER:\n');
checklistWines.forEach((wine, index) => {
  const slug = slugify(wine);
  console.log(`${index + 1}. ${slug}.jpg`);
});

console.log('\n\n🔍 COMPARISON:\n');

// Find wines in checklist but not in JSON
const missingInJson = [];
checklistSlugs.forEach((slug, index) => {
  if (!jsonWinesMap.has(slug)) {
    missingInJson.push({ index: index + 1, name: checklistWines[index], slug });
  }
});

// Find wines in JSON but not in checklist
const missingInChecklist = [];
jsonWinesMap.forEach((name, slug) => {
  if (!checklistSlugs.includes(slug)) {
    missingInChecklist.push({ name, slug });
  }
});

if (missingInJson.length > 0) {
  console.log('❌ Wines in checklist but NOT in JSON:');
  missingInJson.forEach(w => {
    console.log(`   ${w.index}. ${w.name} → ${w.slug}.jpg`);
  });
}

if (missingInChecklist.length > 0) {
  console.log('\n✅ Wines in JSON but NOT in checklist (these are the missing ones!):');
  missingInChecklist.forEach(w => {
    console.log(`   - ${w.name} → ${w.slug}.jpg`);
  });
}

if (missingInJson.length === 0 && missingInChecklist.length === 0) {
  console.log('✅ All wines match!');
}

console.log(`\n📊 Summary:`);
console.log(`   Checklist: ${checklistWines.length} wines`);
console.log(`   JSON: ${wines.length} wines`);
console.log(`   Missing from checklist: ${missingInChecklist.length} wine(s)`);

