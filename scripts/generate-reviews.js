const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TOTAL_REVIEWS = 320;

const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'image-sets-manifest.json'), 'utf8'));
const SET_IDS = Object.keys(manifest.sets).sort();

const FIRST_NAMES = [
  'Markus', 'Thomas', 'Peter', 'James', 'Alexandre', 'Stefan', 'David', 'Robert', 'Laura', 'Fabio',
  'Henrik', 'Erik', 'Marco', 'Luca', 'Andreas', 'Michael', 'Christian', 'Daniel', 'Martin', 'Patrick',
  'Sebastian', 'Florian', 'Jan', 'Lars', 'Nils', 'Oliver', 'Paul', 'Ralf', 'Sven', 'Tobias',
  'Wolfgang', 'Antoine', 'Benoît', 'Claude', 'François', 'Julien', 'Nicolas', 'Pierre', 'Rémi', 'Yann',
  'Alessandro', 'Andrea', 'Carlo', 'Davide', 'Enrico', 'Francesco', 'Giuseppe', 'Matteo', 'Paolo', 'Roberto',
  'Carlos', 'Diego', 'Fernando', 'Javier', 'Luis', 'Miguel', 'Pablo', 'Rafael', 'Sergio', 'Víctor',
  'Adam', 'Chris', 'George', 'Harry', 'Ian', 'Jack', 'Kevin', 'Luke', 'Neil', 'Oliver',
  'Anna', 'Claudia', 'Elena', 'Franziska', 'Hannah', 'Ingrid', 'Julia', 'Katarina', 'Maria', 'Nina',
  'Sophie', 'Teresa', 'Ursula', 'Victoria', 'Wiebke', 'Yvonne', 'Zoe', 'Amélie', 'Camille', 'Élise'
];

const LAST_INITIALS = 'ABCDEFGHJKLMNPRSTUVW';

const CITIES = [
  { city: 'Munich', country: 'Germany' }, { city: 'Hamburg', country: 'Germany' },
  { city: 'Berlin', country: 'Germany' }, { city: 'Frankfurt', country: 'Germany' },
  { city: 'Stuttgart', country: 'Germany' }, { city: 'Cologne', country: 'Germany' },
  { city: 'Vienna', country: 'Austria' }, { city: 'Zurich', country: 'Switzerland' },
  { city: 'Rotterdam', country: 'Netherlands' }, { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Brussels', country: 'Belgium' }, { city: 'Paris', country: 'France' },
  { city: 'Lyon', country: 'France' }, { city: 'Milan', country: 'Italy' },
  { city: 'Rome', country: 'Italy' }, { city: 'Barcelona', country: 'Spain' },
  { city: 'Madrid', country: 'Spain' }, { city: 'Lisbon', country: 'Portugal' },
  { city: 'Birmingham', country: 'UK' }, { city: 'London', country: 'UK' },
  { city: 'Manchester', country: 'UK' }, { city: 'Dublin', country: 'Ireland' },
  { city: 'Stockholm', country: 'Sweden' }, { city: 'Copenhagen', country: 'Denmark' },
  { city: 'Oslo', country: 'Norway' }, { city: 'Helsinki', country: 'Finland' },
  { city: 'Warsaw', country: 'Poland' }, { city: 'Prague', country: 'Czech Republic' },
  { city: 'Budapest', country: 'Hungary' }, { city: 'Luxembourg', country: 'Luxembourg' }
];

const ENGINES = [
  { family: 'M54B30', platform: 'E46 330i', fuel: 'petrol' },
  { family: 'M54B25', platform: 'E46 325i', fuel: 'petrol' },
  { family: 'M52B28', platform: 'E36 328i', fuel: 'petrol' },
  { family: 'M50B25', platform: 'E36 325i', fuel: 'petrol' },
  { family: 'M20B25', platform: 'E30 325i', fuel: 'petrol' },
  { family: 'M30B35', platform: 'E34 535i', fuel: 'petrol' },
  { family: 'S54B32', platform: 'E46 M3', fuel: 'petrol' },
  { family: 'S55B30', platform: 'F80 M3', fuel: 'petrol' },
  { family: 'N54B30', platform: 'E90 335i', fuel: 'petrol' },
  { family: 'N55B30', platform: 'F30 335i', fuel: 'petrol' },
  { family: 'N52B30', platform: 'E90 330i', fuel: 'petrol' },
  { family: 'B58B30', platform: 'F30 340i', fuel: 'petrol' },
  { family: 'B48B20', platform: 'F30 320i', fuel: 'petrol' },
  { family: 'N47D20', platform: 'F30 320d', fuel: 'diesel' },
  { family: 'N57D30', platform: 'F10 535d', fuel: 'diesel' },
  { family: 'M57D30', platform: 'E39 530d', fuel: 'diesel' },
  { family: 'M57D30', platform: 'E46 330d', fuel: 'diesel' },
  { family: 'B47D20', platform: 'G20 320d', fuel: 'diesel' },
  { family: 'B57D30', platform: 'G30 530d', fuel: 'diesel' },
  { family: 'M47D20', platform: 'E46 320d', fuel: 'diesel' },
  { family: 'S63B44', platform: 'F10 M5', fuel: 'petrol' },
  { family: 'N63B44', platform: 'F01 550i', fuel: 'petrol' },
  { family: 'M62B44', platform: 'E39 M5', fuel: 'petrol' }
];

const TEMPLATES = [
  (e, comp) => `Ordered a ${e.family} for my ${e.platform} ${e.fuel === 'diesel' ? 'diesel' : ''} replacement. Engine arrived on a steel frame, perfectly packaged. Compression test results matched exactly what was advertised — ${comp} bar across all cylinders. Running beautifully after ${Math.floor(Math.random() * 8) + 3} months.`,
  (e) => `The ${e.family} engine for my ${e.platform} was exactly as described. Multiple warehouse photographs showed the actual unit. Test report was thorough. Installation took a weekend and fired first time. Highly recommended supplier.`,
  (e) => `As a workshop owner, I've sourced engines from Premium BMW Engines multiple times. The ${e.family} for a customer ${e.platform} was graded honestly, shipped fast, and the warranty documentation was clear. Our go-to supplier for BMW engines.`,
  (e, comp) => `${e.family} delivered to ${e.platform} project within ${Math.floor(Math.random() * 3) + 3} days. Customs paperwork flawless. ${comp} bar compression on all cylinders. Professional communication from quote through delivery.`,
  (e) => `M57 swap kit enquiry led to excellent technical advice. Even though I bought a standalone ${e.family} for my ${e.platform}, their fitment consultation saved me from ordering the wrong DME generation. Honest people who know BMW engines.`,
  (e) => `Skeptical about buying a ${e.family} online for my ${e.platform} restoration. The detailed warehouse photos and compression report gave me confidence. Engine matches the images. ${e.fuel === 'diesel' ? 'Smooth diesel idle' : 'Rev-happy petrol'} character preserved.`,
  (e) => `Fleet order of ${Math.floor(Math.random() * 4) + 3} ${e.family} engines for our ${e.platform} vehicles. Consistent grading, bulk pricing fair, and dedicated account manager made the process smooth. Saved thousands versus dealer replacement.`,
  (e) => `Dyno test witnessed via video call before they shipped my ${e.family}. Engine made rated power on their SuperFlow. ${e.platform} is back on the road with documented confidence. Exceptional attention to detail.`,
  (e) => `Core exchange worked perfectly. Returned my seized engine, received credit within a week. Used it toward the ${e.family} for my ${e.platform}. Smooth process from start to finish.`,
  (e) => `Their blog articles helped me choose the right ${e.family} for my ${e.platform}. When I called, they didn't push the expensive option — recommended based on my actual needs. Engine arrived tested and warranted.`,
  (e) => `Classic ${e.platform} restoration needed a period-correct ${e.family}. They had three options with different mileage brackets. Chose the low-mileage unit. Compression uniform, photographs honest about cosmetic patina. Perfect for concours build.`,
  (e) => `Defender M57 conversion kit was complete and well-documented. Every connector labelled, mounts fit perfectly. Technical team answered wiring questions promptly. ${Math.floor(Math.random() * 500) + 200}+ km since install without issues.`,
  (e) => `B58 for my ${e.platform} after dealer quoted €12,000+. Their tested ${e.family} cost half that with identical specification. Independent workshop installed it. Six months and 8,000 km — flawless.`,
  (e) => `N47 timing chain inspected before shipping as promised. ${e.family} for ${e.platform} arrived with acoustic analysis report. Chain condition documented. Exactly what a cautious diesel buyer needs.`,
  (e) => `Rebuilt ${e.family} quality is outstanding. New gaskets, timing components, and bearings. Dyno report included. My ${e.platform} track car is reliable again. 12-month extended warranty purchased with confidence.`,
  (e) => `Shipping to UK post-Brexit was seamless. ${e.family} for ${e.platform} arrived in 6 days with all customs documents. Engine hoist at delivery point — kerbside as described. No surprises.`,
  (e) => `Visited Hamburg facility to inspect ${e.family} before purchase. Met the technician who ran the dyno test. Seeing the warehouse operation convinced me these are real tested engines, not brokers. Bought on the spot.`,
  (e) => `Trade account setup took 48 hours. Now source all ${e.family} and ${e.platform} engines through them. Priority allocation when stock is tight. Technical support line is genuinely useful.`,
  (e) => `Warranty claim handled without argument. ${e.family} had a sensor issue within 30 days. They shipped replacement ancillaries next day. Stood behind their product exactly as promised.`,
  (e) => `Photographs show real warehouse inventory — engines on pallets, hoses visible, multiple angles. The ${e.family} I received matches the listing images. Finally a supplier that shows what you actually get.`
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }

function generateReview(id) {
  const firstName = FIRST_NAMES[(id - 1) % FIRST_NAMES.length];
  const lastInitial = LAST_INITIALS[(id - 1) % LAST_INITIALS.length];
  const location = CITIES[(id - 1) % CITIES.length];
  const engine = ENGINES[(id - 1) % ENGINES.length];
  const template = TEMPLATES[(id - 1) % TEMPLATES.length];
  const compression = (11 + Math.random() * 2.5).toFixed(1);
  const stars = id % 47 === 0 ? 4 : 5;
  const monthsAgo = rand(1, 36);
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);

  const setId = SET_IDS[(id - 1) % SET_IDS.length];
  const imageIndex = (id % 6) + 1;
  const image = `images/engines/sets/${setId}/${String(imageIndex).padStart(2, '0')}.webp`;

  return {
    id,
    name: `${firstName} ${lastInitial}.`,
    city: location.city,
    country: location.country,
    stars,
    text: template(engine, compression),
    engine: engine.family,
    platform: engine.platform,
    date: date.toISOString().split('T')[0],
    verified: true,
    image
  };
}

const reviews = [];
for (let i = 1; i <= TOTAL_REVIEWS; i++) {
  reviews.push(generateReview(i));
}

const reviewsDir = path.join(DATA_DIR, 'reviews');
fs.mkdirSync(reviewsDir, { recursive: true });

const avgStars = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
const fiveStar = reviews.filter(r => r.stars === 5).length;

fs.writeFileSync(path.join(reviewsDir, 'index.json'), JSON.stringify({
  total: TOTAL_REVIEWS,
  averageRating: parseFloat(avgStars),
  fiveStarCount: fiveStar,
  satisfactionRate: 99.7,
  reviews
}, null, 2));

console.log(`Generated ${TOTAL_REVIEWS} reviews (${fiveStar} five-star, avg ${avgStars})`);
