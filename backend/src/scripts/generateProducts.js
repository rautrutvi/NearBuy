import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_PER_SHOP = 20;

// Resolve paths
const rootDir = path.resolve(__dirname, '../../../');
const csvDir = path.resolve(rootDir, 'csv_files');
const publicImagesDir = path.resolve(rootDir, 'public/images/products');

// Master list of 50 products
const MASTER_PRODUCTS = [
  // Dairy & Eggs
  {
    name: 'Amul Taza Milk 1 L',
    brand: 'Amul',
    description: 'Fresh homogenized toned milk rich in calcium, protein, and essential vitamins.',
    category: 'Dairy & Eggs',
    subcategory: 'Milk & Dairy',
    barcode: '8901262010012',
    base_price: 68,
    slug: 'amul-taza-milk-1l',
    unit: '1 L pouch',
    shelf_location: 'Chiller Cabinet',
    is_milk_egg: true,
  },
  {
    name: 'Gokul Full Cream Milk 500 ml',
    brand: 'Gokul',
    description: 'Pure pasteurized full cream milk with rich creamy texture for tea and sweets.',
    category: 'Dairy & Eggs',
    subcategory: 'Milk & Dairy',
    barcode: '8901262010029',
    base_price: 35,
    slug: 'gokul-full-cream-milk-500ml',
    unit: '500 ml pouch',
    shelf_location: 'Chiller Cabinet',
    is_milk_egg: true,
  },
  {
    name: 'Mother Dairy Toned Milk 500 ml',
    brand: 'Mother Dairy',
    description: 'Pasteurized toned milk packed with natural protein and essential daily nutrients.',
    category: 'Dairy & Eggs',
    subcategory: 'Milk & Dairy',
    barcode: '8901262010036',
    base_price: 29,
    slug: 'mother-dairy-toned-milk-500ml',
    unit: '500 ml pouch',
    shelf_location: 'Chiller Cabinet',
    is_milk_egg: true,
  },
  {
    name: 'Farm Eggs pack of 6',
    brand: 'Farm Fresh',
    description: 'Fresh farm grade-A brown table eggs high in natural protein and omega-3.',
    category: 'Dairy & Eggs',
    subcategory: 'Eggs',
    barcode: '8901262010043',
    base_price: 54,
    slug: 'eggs-6-pack',
    unit: 'pack of 6',
    shelf_location: 'Dairy Rack',
    is_milk_egg: true,
  },
  {
    name: 'Farm Eggs tray of 12',
    brand: 'Farm Fresh',
    description: 'Economical tray of 12 fresh farm eggs for wholesome daily breakfast cooking.',
    category: 'Dairy & Eggs',
    subcategory: 'Eggs',
    barcode: '8901262010050',
    base_price: 100,
    slug: 'eggs-12-tray',
    unit: 'tray of 12',
    shelf_location: 'Dairy Rack',
    is_milk_egg: true,
  },
  {
    name: 'Amul Butter 100 g',
    brand: 'Amul',
    description: 'Classic salted pure butter made from fresh dairy milk cream.',
    category: 'Dairy & Eggs',
    subcategory: 'Butter & Cheese',
    barcode: '8901262010067',
    base_price: 58,
    slug: 'amul-butter-100g',
    unit: '100 g pack',
    shelf_location: 'Chiller Cabinet',
    is_dairy: true,
  },
  {
    name: 'Amul Cheese Slices 200 g',
    brand: 'Amul',
    description: 'Rich processed cheddar cheese slices ideal for sandwiches, toasts, and burgers.',
    category: 'Dairy & Eggs',
    subcategory: 'Butter & Cheese',
    barcode: '8901262010074',
    base_price: 150,
    slug: 'amul-cheese-slices-200g',
    unit: '200 g pack',
    shelf_location: 'Chiller Cabinet',
    is_dairy: true,
  },
  {
    name: 'Amul Fresh Paneer 200 g',
    brand: 'Amul',
    description: 'Soft and fresh malai cottage cheese block for traditional curries and starters.',
    category: 'Dairy & Eggs',
    subcategory: 'Paneer & Curd',
    barcode: '8901262010081',
    base_price: 95,
    slug: 'amul-fresh-paneer-200g',
    unit: '200 g pack',
    shelf_location: 'Chiller Cabinet',
    is_dairy: true,
  },
  {
    name: 'Mother Dairy Curd 400 g',
    brand: 'Mother Dairy',
    description: 'Thick natural cultured curd with creamy texture and healthy probiotic benefits.',
    category: 'Dairy & Eggs',
    subcategory: 'Paneer & Curd',
    barcode: '8901262010098',
    base_price: 40,
    slug: 'mother-dairy-curd-400g',
    unit: '400 g tub',
    shelf_location: 'Chiller Cabinet',
    is_dairy: true,
  },

  // Bread & Bakery
  {
    name: 'Britannia White Bread 400 g',
    brand: 'Britannia',
    description: 'Soft and fluffy sliced white sandwich bread baked fresh daily.',
    category: 'Bread & Bakery',
    subcategory: 'Breads & Buns',
    barcode: '8901262010104',
    base_price: 45,
    slug: 'britannia-white-bread-400g',
    unit: '400 g pack',
    shelf_location: 'Bakery Rack',
    is_bread: true,
  },
  {
    name: 'Modern Brown Bread 400 g',
    brand: 'Modern',
    description: 'Wholesome whole wheat brown bread packed with dietary fibre.',
    category: 'Bread & Bakery',
    subcategory: 'Breads & Buns',
    barcode: '8901262010111',
    base_price: 50,
    slug: 'modern-brown-bread-400g',
    unit: '400 g pack',
    shelf_location: 'Bakery Rack',
    is_bread: true,
  },
  {
    name: 'Harvest Gold Sandwich Bread',
    brand: 'Harvest Gold',
    description: 'Large soft bread slices tailored for breakfast sandwiches and golden toasts.',
    category: 'Bread & Bakery',
    subcategory: 'Breads & Buns',
    barcode: '8901262010128',
    base_price: 45,
    slug: 'harvest-gold-sandwich-bread',
    unit: '450 g pack',
    shelf_location: 'Bakery Rack',
    is_bread: true,
  },
  {
    name: 'Pav Buns pack of 6',
    brand: 'Local Bakery',
    description: 'Fresh and airy bakery pav buns perfect for vada pav, pav bhaji, and misal.',
    category: 'Bread & Bakery',
    subcategory: 'Breads & Buns',
    barcode: '8901262010135',
    base_price: 30,
    slug: 'pav-buns-6pcs',
    unit: 'pack of 6',
    shelf_location: 'Bakery Rack',
    is_bread: true,
  },

  // Instant & Breakfast
  {
    name: 'Maggi 2-Minute Masala Noodles 70 g',
    brand: 'Maggi',
    description: 'Iconic Indian instant noodles enriched with roasted spices and iron.',
    category: 'Instant & Breakfast',
    subcategory: 'Noodles & Vermicelli',
    barcode: '8901262010142',
    base_price: 14,
    slug: 'maggi-masala-noodles-70g',
    unit: '70 g pack',
    shelf_location: 'Aisle 3 - Breakfast & Instant',
    is_noodle: true,
  },
  {
    name: 'Sunfeast Yippee Magic Masala',
    brand: 'Sunfeast',
    description: 'Non-sticky round noodles infused with a blend of exotic Indian spices.',
    category: 'Instant & Breakfast',
    subcategory: 'Noodles & Vermicelli',
    barcode: '8901262010159',
    base_price: 14,
    slug: 'yippee-magic-masala-noodles',
    unit: '70 g pack',
    shelf_location: 'Aisle 3 - Breakfast & Instant',
    is_noodle: true,
  },
  {
    name: 'Top Ramen Curry Noodles',
    brand: 'Top Ramen',
    description: 'Delicious flat instant curry noodles offering a rich savory spicy broth.',
    category: 'Instant & Breakfast',
    subcategory: 'Noodles & Vermicelli',
    barcode: '8901262010166',
    base_price: 14,
    slug: 'top-ramen-curry-noodles',
    unit: '70 g pack',
    shelf_location: 'Aisle 3 - Breakfast & Instant',
    is_noodle: true,
  },
  {
    name: "Kellogg's Corn Flakes 250 g",
    brand: "Kellogg's",
    description: 'Crispy golden toasted corn flakes packed with 8 essential vitamins and minerals.',
    category: 'Instant & Breakfast',
    subcategory: 'Cereals & Oats',
    barcode: '8901262010173',
    base_price: 120,
    slug: 'kelloggs-corn-flakes-250g',
    unit: '250 g box',
    shelf_location: 'Aisle 3 - Breakfast & Instant',
  },
  {
    name: 'Saffola Masala Oats 40 g',
    brand: 'Saffola',
    description: 'Savory whole grain oats with authentic Indian spices and crunchy veggie bits.',
    category: 'Instant & Breakfast',
    subcategory: 'Cereals & Oats',
    barcode: '8901262010180',
    base_price: 20,
    slug: 'saffola-masala-oats-40g',
    unit: '40 g pouch',
    shelf_location: 'Aisle 3 - Breakfast & Instant',
  },

  // Snacks
  {
    name: 'Parle-G Biscuits',
    brand: 'Parle',
    description: "India's favourite milk and wheat glucose biscuits for morning tea time.",
    category: 'Snacks',
    subcategory: 'Biscuits & Cookies',
    barcode: '8901262010197',
    base_price: 10,
    slug: 'parle-g-biscuits-100g',
    unit: '100 g pack',
    shelf_location: 'Aisle 2 - Snacks & Biscuits',
    is_snack: true,
  },
  {
    name: 'Britannia Good Day Cashew',
    brand: 'Britannia',
    description: 'Rich buttery cookies packed with crunchy roasted cashew nut pieces.',
    category: 'Snacks',
    subcategory: 'Biscuits & Cookies',
    barcode: '8901262010203',
    base_price: 30,
    slug: 'britannia-good-day-cashew',
    unit: '100 g pack',
    shelf_location: 'Aisle 2 - Snacks & Biscuits',
    is_snack: true,
  },
  {
    name: 'Britannia Marie Gold',
    brand: 'Britannia',
    description: 'Crisp and light tea-time biscuits enriched with 10 essential vitamins.',
    category: 'Snacks',
    subcategory: 'Biscuits & Cookies',
    barcode: '8901262010210',
    base_price: 30,
    slug: 'britannia-marie-gold',
    unit: '120 g pack',
    shelf_location: 'Aisle 2 - Snacks & Biscuits',
    is_snack: true,
  },
  {
    name: 'Oreo Biscuits',
    brand: 'Cadbury',
    description: 'Crunchy chocolate sandwich cookies filled with smooth sweet vanilla cream.',
    category: 'Snacks',
    subcategory: 'Biscuits & Cookies',
    barcode: '8901262010227',
    base_price: 30,
    slug: 'oreo-biscuits',
    unit: '120 g pack',
    shelf_location: 'Aisle 2 - Snacks & Biscuits',
    is_snack: true,
  },
  {
    name: "Lay's Classic Salted",
    brand: "Lay's",
    description: 'Thin crispy potato chips lightly sprinkled with pure sea salt.',
    category: 'Snacks',
    subcategory: 'Chips & Namkeen',
    barcode: '8901262010234',
    base_price: 20,
    slug: 'lays-classic-salted',
    unit: '50 g bag',
    shelf_location: 'Aisle 2 - Snacks & Biscuits',
    is_snack: true,
  },
  {
    name: 'Kurkure Masala Munch',
    brand: 'Kurkure',
    description: 'Crunchy corn and rice puffs seasoned with a tangy fiery Indian spice kick.',
    category: 'Snacks',
    subcategory: 'Chips & Namkeen',
    barcode: '8901262010241',
    base_price: 20,
    slug: 'kurkure-masala-munch',
    unit: '75 g bag',
    shelf_location: 'Aisle 2 - Snacks & Biscuits',
    is_snack: true,
  },
  {
    name: "Haldiram's Aloo Bhujia 200 g",
    brand: "Haldiram's",
    description: 'Traditional crispy spiced potato noodle namkeen seasoned with mint and lemon.',
    category: 'Snacks',
    subcategory: 'Chips & Namkeen',
    barcode: '8901262010258',
    base_price: 60,
    slug: 'haldirams-aloo-bhujia-200g',
    unit: '200 g pack',
    shelf_location: 'Aisle 2 - Snacks & Biscuits',
    is_snack: true,
  },
  {
    name: 'Bingo Mad Angles',
    brand: 'Bingo',
    description: 'Triangle shaped crunchy corn snack bursting with tangy achari masti flavour.',
    category: 'Snacks',
    subcategory: 'Chips & Namkeen',
    barcode: '8901262010265',
    base_price: 20,
    slug: 'bingo-mad-angles',
    unit: '66 g bag',
    shelf_location: 'Aisle 2 - Snacks & Biscuits',
    is_snack: true,
  },
  {
    name: 'Cadbury Dairy Milk',
    brand: 'Cadbury',
    description: 'Smooth and creamy milk chocolate bar melting with rich cocoa goodness.',
    category: 'Snacks',
    subcategory: 'Chocolates & Sweets',
    barcode: '8901262010272',
    base_price: 20,
    slug: 'cadbury-dairy-milk',
    unit: '50 g bar',
    shelf_location: 'Front Counter Display',
    is_snack: true,
  },

  // Beverages
  {
    name: 'Tata Tea Gold 250 g',
    brand: 'Tata Tea',
    description: 'Exquisite blend of rich CTC tea granules with gently rolled aromatic long leaves.',
    category: 'Beverages',
    subcategory: 'Tea & Coffee',
    barcode: '8901262010289',
    base_price: 150,
    slug: 'tata-tea-gold-250g',
    unit: '250 g pack',
    shelf_location: 'Aisle 4 - Beverages',
  },
  {
    name: 'Brooke Bond Red Label 250 g',
    brand: 'Brooke Bond',
    description: 'Fine quality black tea delivering strong taste and rich red liquor in every sip.',
    category: 'Beverages',
    subcategory: 'Tea & Coffee',
    barcode: '8901262010296',
    base_price: 130,
    slug: 'red-label-tea-250g',
    unit: '250 g pack',
    shelf_location: 'Aisle 4 - Beverages',
  },
  {
    name: 'Nescafe Classic 50 g',
    brand: 'Nescafe',
    description: '100% pure instant coffee powder delivering rich aroma and bold morning flavour.',
    category: 'Beverages',
    subcategory: 'Tea & Coffee',
    barcode: '8901262010302',
    base_price: 190,
    slug: 'nescafe-classic-50g',
    unit: '50 g jar',
    shelf_location: 'Aisle 4 - Beverages',
  },
  {
    name: 'Bru Instant Coffee 50 g',
    brand: 'Bru',
    description: 'Aromatic coffee-chicory blend crafted from select roasted plantation beans.',
    category: 'Beverages',
    subcategory: 'Tea & Coffee',
    barcode: '8901262010319',
    base_price: 170,
    slug: 'bru-instant-coffee-50g',
    unit: '50 g jar',
    shelf_location: 'Aisle 4 - Beverages',
  },
  {
    name: 'Real Fruit Power Mango 1 L',
    brand: 'Real',
    description: 'Refreshing fruit beverage made with sweet ripe mangoes and enriched with vitamin C.',
    category: 'Beverages',
    subcategory: 'Juices & Cold Drinks',
    barcode: '8901262010326',
    base_price: 110,
    slug: 'real-mango-juice-1l',
    unit: '1 L tetra pack',
    shelf_location: 'Aisle 4 - Beverages',
  },
  {
    name: 'Coca-Cola 750 ml',
    brand: 'Coca-Cola',
    description: 'Sparkling carbonated cola beverage with an uplifting crisp refreshing bite.',
    category: 'Beverages',
    subcategory: 'Juices & Cold Drinks',
    barcode: '8901262010333',
    base_price: 40,
    slug: 'coca-cola-750ml',
    unit: '750 ml bottle',
    shelf_location: 'Aisle 4 - Beverages',
  },
  {
    name: 'Bisleri Water 1 L',
    brand: 'Bisleri',
    description: 'Purified packaged drinking water with added essential minerals and 10-step purity.',
    category: 'Beverages',
    subcategory: 'Packaged Water',
    barcode: '8901262010340',
    base_price: 20,
    slug: 'bisleri-water-1l',
    unit: '1 L bottle',
    shelf_location: 'Aisle 4 - Beverages',
  },

  // Staples
  {
    name: 'Aashirvaad Atta 5 kg',
    brand: 'Aashirvaad',
    description: '100% pure whole wheat stone ground chakki atta for soft and fluffy rotis.',
    category: 'Staples',
    subcategory: 'Atta & Flours',
    barcode: '8901262010357',
    base_price: 290,
    slug: 'aashirvaad-atta-5kg',
    unit: '5 kg bag',
    shelf_location: 'Aisle 1 - Staples & Grains',
    is_staple: true,
  },
  {
    name: 'India Gate Basmati Rice 1 kg',
    brand: 'India Gate',
    description: 'Aged fragrant long grain basmati rice ideal for everyday biryani, pulao, and fried rice.',
    category: 'Staples',
    subcategory: 'Rice & Grains',
    barcode: '8901262010364',
    base_price: 140,
    slug: 'india-gate-basmati-rice-1kg',
    unit: '1 kg pack',
    shelf_location: 'Aisle 1 - Staples & Grains',
    is_staple: true,
  },
  {
    name: 'Tata Sampann Toor Dal 1 kg',
    brand: 'Tata Sampann',
    description: 'Unpolished high protein yellow pigeon pea dal naturally dried with no chemical polish.',
    category: 'Staples',
    subcategory: 'Dals & Pulses',
    barcode: '8901262010371',
    base_price: 170,
    slug: 'tata-sampann-toor-dal-1kg',
    unit: '1 kg pack',
    shelf_location: 'Aisle 1 - Staples & Grains',
    is_staple: true,
  },
  {
    name: 'Tata Sampann Moong Dal 500 g',
    brand: 'Tata Sampann',
    description: 'Unpolished split yellow moong lentils, nutrient rich and easily digestible for daily meals.',
    category: 'Staples',
    subcategory: 'Dals & Pulses',
    barcode: '8901262010388',
    base_price: 90,
    slug: 'tata-sampann-moong-dal-500g',
    unit: '500 g pack',
    shelf_location: 'Aisle 1 - Staples & Grains',
    is_staple: true,
  },
  {
    name: 'Madhur Sugar 1 kg',
    brand: 'Madhur',
    description: 'Sulphur-free refined white sugar crystals processed with sparkling pure hygiene.',
    category: 'Staples',
    subcategory: 'Sugar & Salt',
    barcode: '8901262010395',
    base_price: 50,
    slug: 'madhur-sugar-1kg',
    unit: '1 kg pack',
    shelf_location: 'Aisle 1 - Staples & Grains',
    is_staple: true,
  },
  {
    name: 'Tata Salt 1 kg',
    brand: 'Tata',
    description: 'Vacuum evaporated iodized salt essential for proper mental development and taste.',
    category: 'Staples',
    subcategory: 'Sugar & Salt',
    barcode: '8901262010401',
    base_price: 28,
    slug: 'tata-salt-1kg',
    unit: '1 kg pack',
    shelf_location: 'Aisle 1 - Staples & Grains',
    is_staple: true,
  },

  // Oils & Spices
  {
    name: 'Fortune Sunflower Oil 1 L',
    brand: 'Fortune',
    description: 'Light and healthy refined sunflower cooking oil enriched with vitamins A and D.',
    category: 'Oils & Spices',
    subcategory: 'Edible Oils',
    barcode: '8901262010418',
    base_price: 135,
    slug: 'fortune-sunflower-oil-1l',
    unit: '1 L pouch',
    shelf_location: 'Aisle 1 - Oils & Spices',
    is_oil_spice: true,
  },
  {
    name: 'Saffola Gold Oil 1 L',
    brand: 'Saffola',
    description: 'Pro-heart blended cooking oil with natural antioxidant oryzanol for everyday fitness.',
    category: 'Oils & Spices',
    subcategory: 'Edible Oils',
    barcode: '8901262010425',
    base_price: 175,
    slug: 'saffola-gold-oil-1l',
    unit: '1 L pouch',
    shelf_location: 'Aisle 1 - Oils & Spices',
    is_oil_spice: true,
  },
  {
    name: 'Everest Turmeric Powder 100 g',
    brand: 'Everest',
    description: 'Pure vibrant turmeric powder with high curcumin content and rich golden aroma.',
    category: 'Oils & Spices',
    subcategory: 'Spices & Masalas',
    barcode: '8901262010432',
    base_price: 35,
    slug: 'everest-turmeric-powder-100g',
    unit: '100 g box',
    shelf_location: 'Aisle 1 - Oils & Spices',
    is_oil_spice: true,
  },
  {
    name: 'Everest Red Chilli Powder 100 g',
    brand: 'Everest',
    description: 'Fiery ground red chilli powder delivering bright natural colour and authentic hot punch.',
    category: 'Oils & Spices',
    subcategory: 'Spices & Masalas',
    barcode: '8901262010449',
    base_price: 65,
    slug: 'everest-red-chilli-powder-100g',
    unit: '100 g box',
    shelf_location: 'Aisle 1 - Oils & Spices',
    is_oil_spice: true,
  },
  {
    name: 'MDH Garam Masala 100 g',
    brand: 'MDH',
    description: 'Classic blend of aromatic whole Indian spices roasted to elevate rich gravies and curries.',
    category: 'Oils & Spices',
    subcategory: 'Spices & Masalas',
    barcode: '8901262010456',
    base_price: 85,
    slug: 'mdh-garam-masala-100g',
    unit: '100 g box',
    shelf_location: 'Aisle 1 - Oils & Spices',
    is_oil_spice: true,
  },
  {
    name: 'Catch Cumin Seeds 100 g',
    brand: 'Catch',
    description: 'Machine cleaned whole jeera seeds releasing strong earthy aroma upon tempering.',
    category: 'Oils & Spices',
    subcategory: 'Spices & Masalas',
    barcode: '8901262010463',
    base_price: 70,
    slug: 'catch-cumin-seeds-100g',
    unit: '100 g pack',
    shelf_location: 'Aisle 1 - Oils & Spices',
    is_oil_spice: true,
  },

  // Household & Personal Care
  {
    name: 'Vim Dishwash Bar',
    brand: 'Vim',
    description: 'Lemon-powered degreasing dishwash bar that removes tough burnt grease with ease.',
    category: 'Household & Personal Care',
    subcategory: 'Household & Cleaning',
    barcode: '8901262010470',
    base_price: 25,
    slug: 'vim-dishwash-bar-300g',
    unit: '300 g bar',
    shelf_location: 'Aisle 5 - Cleaning & Hygiene',
  },
  {
    name: 'Surf Excel Easy Wash 1 kg',
    brand: 'Surf Excel',
    description: 'Advanced detergent powder that dissolves rapidly and removes tough stains in one wash.',
    category: 'Household & Personal Care',
    subcategory: 'Household & Cleaning',
    barcode: '8901262010487',
    base_price: 130,
    slug: 'surf-excel-easy-wash-1kg',
    unit: '1 kg pack',
    shelf_location: 'Aisle 5 - Cleaning & Hygiene',
  },
  {
    name: 'Dettol Handwash 200 ml',
    brand: 'Dettol',
    description: 'Antibacterial liquid handwash pump bottle providing trusted 99.9% germ protection.',
    category: 'Household & Personal Care',
    subcategory: 'Personal Care',
    barcode: '8901262010494',
    base_price: 99,
    slug: 'dettol-handwash-200ml',
    unit: '200 ml pump bottle',
    shelf_location: 'Aisle 5 - Cleaning & Hygiene',
  },
  {
    name: 'Colgate Strong Teeth 100 g',
    brand: 'Colgate',
    description: 'Calcium boost fluoride toothpaste providing all-day cavity defence and fresh breath.',
    category: 'Household & Personal Care',
    subcategory: 'Personal Care',
    barcode: '8901262010500',
    base_price: 60,
    slug: 'colgate-strong-teeth-100g',
    unit: '100 g tube',
    shelf_location: 'Aisle 5 - Cleaning & Hygiene',
  },
];

// Helper to escape CSV values
function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('\"') || str.includes('\n')) {
    return `\"${str.replace(/\"/g, '\"\"')}\"`;
  }
  return str;
}

// 1. Resolve actual image files on disk
function resolveImageFiles() {
  const existingFiles = fs.readdirSync(publicImagesDir);
  const fileMap = new Map();
  for (const f of existingFiles) {
    const slugKey = f.replace(/\.[^/.]+$/, '').toLowerCase();
    fileMap.set(slugKey, f);
  }

  const missingProducts = [];
  for (const p of MASTER_PRODUCTS) {
    const matched = fileMap.get(p.slug.toLowerCase());
    if (matched) {
      p.image_file = matched;
      p.image_url = `/images/products/${matched}`;
    } else {
      p.image_file = `${p.slug}.jpg`;
      p.image_url = '';
      missingProducts.push(p.name);
    }
  }

  if (missingProducts.length > 0) {
    console.warn(`[products:generate] Warning: ${missingProducts.length} image files missing on disk:`, missingProducts);
  }
}

// 2. Generate csv_files/products_master.csv
function generateMasterCsv() {
  const masterCsvPath = path.resolve(csvDir, 'products_master.csv');
  const headers = ['name', 'brand', 'description', 'category', 'barcode', 'base_price', 'image_file'];
  const lines = [headers.join(',')];

  for (const p of MASTER_PRODUCTS) {
    lines.push([
      csvEscape(p.name),
      csvEscape(p.brand),
      csvEscape(p.description),
      csvEscape(p.category),
      csvEscape(p.barcode),
      p.base_price,
      csvEscape(p.image_file),
    ].join(','));
  }

  fs.writeFileSync(masterCsvPath, lines.join('\n') + '\n', 'utf8');
  console.log(`[products:generate] Generated ${masterCsvPath} (${MASTER_PRODUCTS.length} products).`);

  // Also sync to NearBuy-main if it exists
  const altPath = path.resolve(rootDir, 'NearBuy-main/csv_files/products_master.csv');
  if (fs.existsSync(path.dirname(altPath))) {
    fs.writeFileSync(altPath, lines.join('\n') + '\n', 'utf8');
  }
}

// 3. Backup csv_files/shop_available_stock.csv
function backupCurrentStockCsv() {
  const stockCsvPath = path.resolve(csvDir, 'shop_available_stock.csv');
  const backupCsvPath = path.resolve(csvDir, 'shop_available_stock.backup.csv');

  if (!fs.existsSync(backupCsvPath) && fs.existsSync(stockCsvPath)) {
    fs.copyFileSync(stockCsvPath, backupCsvPath);
    console.log(`[products:generate] Created backup at ${backupCsvPath}`);
  } else if (fs.existsSync(backupCsvPath)) {
    console.log(`[products:generate] Backup already exists at ${backupCsvPath}. Skipping copy.`);
  }
}

// 4. Read 6 shops from shops_and_locations.csv
function readShops() {
  const shopsCsvPath = path.resolve(csvDir, 'shops_and_locations.csv');
  const content = fs.readFileSync(shopsCsvPath, 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const header = lines[0].split(',');
  const idIdx = header.indexOf('shop_id');
  const nameIdx = header.indexOf('shop_name');

  const shops = [];
  for (let i = 1; i < lines.length; i++) {
    // Parse CSV line properly
    const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    // Simple split for shop_id and shop_name
    const parts = lines[i].split(',');
    shops.push({
      shop_id: parts[0],
      shop_name: parts[1].replace(/^"|"$/g, ''),
    });
  }

  if (shops.length !== 6) {
    throw new Error(`Expected exactly 6 shops in shops_and_locations.csv, found ${shops.length}`);
  }
  return shops;
}

// 5. Deterministic Assignment Solver
function generateStockAssignments(shops) {
  // Exactly 20 products with 3 shops, exactly 30 products with 2 shops
  // Product indices:
  // 4 milk/eggs (0, 1, 2, 3)
  // 4 breads (9, 10, 11, 12)
  // 3 noodles (13, 14, 15)
  // 3 snacks (18, 19, 20)
  // 3 staples (34, 35, 36)
  // 3 oils/spices (40, 41, 42)
  // Total = 4 + 4 + 3 + 3 + 3 + 3 = 20 products
  const degree3Set = new Set([
    0, 1, 2, 3,
    9, 10, 11, 12,
    13, 14, 15,
    18, 19, 20,
    34, 35, 36,
    40, 41, 42,
  ]);

  const targetDegrees = MASTER_PRODUCTS.map((_, i) => degree3Set.has(i) ? 3 : 2);
  const shopAssignments = Array.from({ length: 6 }, () => []);

  function solve(prodIdx) {
    if (prodIdx === 50) {
      if (!shopAssignments.every(s => s.length === PRODUCTS_PER_SHOP)) return false;
      // Validate constraints on all 6 shops
      for (let s = 0; s < 6; s++) {
        const list = shopAssignments[s].map(pid => MASTER_PRODUCTS[pid]);
        const cats = {};
        let milkEgg = 0, bread = 0, noodle = 0;
        for (const p of list) {
          cats[p.category] = (cats[p.category] || 0) + 1;
          if (p.is_milk_egg) milkEgg++;
          if (p.is_bread) bread++;
          if (p.is_noodle) noodle++;
        }
        if (milkEgg < 1 || bread < 1 || noodle < 1) return false;
        if ((cats['Dairy & Eggs'] || 0) < 2) return false;
        if ((cats['Snacks'] || 0) < 2) return false;
        if ((cats['Staples'] || 0) < 2) return false;
        if ((cats['Oils & Spices'] || 0) < 2) return false;
      }
      return true;
    }

    const deg = targetDegrees[prodIdx];

    function getCombos(startShop, count, current) {
      if (current.length === count) return [current];
      const combos = [];
      for (let s = startShop; s <= 6 - (count - current.length); s++) {
        if (shopAssignments[s].length < PRODUCTS_PER_SHOP) {
          combos.push(...getCombos(s + 1, count, [...current, s]));
        }
      }
      return combos;
    }

    // Sort combos by shop load (prefer least loaded shops)
    const combos = getCombos(0, deg, []).sort((a, b) => {
      const sumA = a.reduce((acc, s) => acc + shopAssignments[s].length, 0);
      const sumB = b.reduce((acc, s) => acc + shopAssignments[s].length, 0);
      return sumA - sumB;
    });

    for (const combo of combos) {
      for (const s of combo) shopAssignments[s].push(prodIdx);
      if (solve(prodIdx + 1)) return true;
      for (const s of combo) shopAssignments[s].pop();
    }
    return false;
  }

  const success = solve(0);
  if (!success) {
    throw new Error('Failed to find deterministic product assignment satisfying all constraints!');
  }

  return shopAssignments;
}

// 6. Generate 120 stock rows and write shop_available_stock.csv
function generateStockCsv(shops, shopAssignments) {
  const stockCsvPath = path.resolve(csvDir, 'shop_available_stock.csv');
  const headers = [
    'product_id',
    'shop_id',
    'shop_name',
    'product_name',
    'category',
    'subcategory',
    'barcode',
    'price_inr',
    'mrp_inr',
    'stock_quantity',
    'reserved_quantity',
    'unit',
    'low_stock_threshold',
    'is_available',
    'shelf_location',
    'brand',
    'description',
    'image_url',
    'last_restocked_date',
    'last_updated',
  ];

  const rows = [headers.join(',')];
  let listingIndex = 1;

  for (let shopIdx = 0; shopIdx < shops.length; shopIdx++) {
    const shop = shops[shopIdx];
    const productIndices = shopAssignments[shopIdx];

    for (const prodIdx of productIndices) {
      const p = MASTER_PRODUCTS[prodIdx];
      const prodId = `prod-${String(listingIndex).padStart(4, '0')}`;

      // Price variation: -5% to +8% (whole rupees)
      // Deterministic pseudo-formula: range from -5 to +8
      const varPct = (((shopIdx * 7 + prodIdx * 11) % 14) - 5) / 100;
      const price_inr = Math.round(p.base_price * (1 + varPct));

      // mrp_inr >= price_inr (markup of 5% to 19% on base price)
      const markupPct = 5 + ((shopIdx * 13 + prodIdx * 17) % 15);
      const rawMrp = Math.round(p.base_price * (1 + markupPct / 100));
      const mrp_inr = Math.max(price_inr, rawMrp);

      // stock_quantity between 8 and 50
      const stock_quantity = 8 + ((shopIdx * 19 + prodIdx * 23) % 43);

      const row = [
        prodId,
        shop.shop_id,
        csvEscape(shop.shop_name),
        csvEscape(p.name),
        csvEscape(p.category),
        csvEscape(p.subcategory),
        p.barcode,
        `${price_inr}.00`,
        `${mrp_inr}.00`,
        stock_quantity,
        0, // reserved_quantity
        csvEscape(p.unit),
        5, // low_stock_threshold
        'TRUE', // is_available
        csvEscape(p.shelf_location),
        csvEscape(p.brand),
        csvEscape(p.description),
        csvEscape(p.image_url),
        '2026-10-15',
        '2026-10-22 09:00:00',
      ];

      rows.push(row.join(','));
      listingIndex++;
    }
  }

  fs.writeFileSync(stockCsvPath, rows.join('\n') + '\n', 'utf8');
  console.log(`[products:generate] Successfully generated ${stockCsvPath} with ${rows.length - 1} listings.`);

  // Also sync to NearBuy-main and seed directories if present
  const altPath = path.resolve(rootDir, 'NearBuy-main/csv_files/shop_available_stock.csv');
  if (fs.existsSync(path.dirname(altPath))) {
    fs.writeFileSync(altPath, rows.join('\n') + '\n', 'utf8');
  }
  const seedPath = path.resolve(rootDir, 'backend/src/main/resources/seed/shop_available_stock.csv');
  if (fs.existsSync(path.dirname(seedPath))) {
    fs.writeFileSync(seedPath, rows.join('\n') + '\n', 'utf8');
  }
}

function run() {
  console.log('[products:generate] Starting deterministic products generation...');
  resolveImageFiles();
  generateMasterCsv();
  backupCurrentStockCsv();
  const shops = readShops();
  console.log(`[products:generate] Loaded ${shops.length} shops from shops_and_locations.csv.`);
  const assignments = generateStockAssignments(shops);
  generateStockCsv(shops, assignments);
  console.log('[products:generate] Generation completed successfully!');
}

run();
