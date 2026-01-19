import Toy from "./models/Toy.js";

const toys = [
  {
    name: "Naruto Uzumaki Figure",
    description: "Highly detailed Naruto Shippuden figure (15 cm).",
    type: "figure",
    ageGroup: "6+",
    targetGroup: "svi",
    productionDate: new Date("2024-01-10"),
    price: 29.99,
    image: "https://media3.nin-nin-game.com/240229/shfiguarts-naruto-uzumaki-naruto-the-no1-most-unpredictable-ninja-bandai-spirits-.jpg",
    inStock: 30,
    reviews: []
  },
  {
    name: "Sasuke Uchiha Figure",
    description: "High-quality Sasuke figure with Chidori effect.",
    type: "figure",
    ageGroup: "6+",
    targetGroup: "svi",
    productionDate: new Date("2024-01-12"),
    price: 34.99,
    image: "https://i.ebayimg.com/images/g/emMAAOSwG-djQTRg/s-l1200.jpg",
    inStock: 22,
    reviews: []
  },
  {
    name: "Kakashi Hatake Figure",
    description: "Collector Kakashi figure performing Lightning Blade.",
    type: "figure",
    ageGroup: "8+",
    targetGroup: "svi",
    productionDate: new Date("2024-02-01"),
    price: 34.99,
    image: "https://i.ebayimg.com/00/s/MTYwMFgxNDUy/z/aK0AAOSw-lVfvLYv/$_57.JPG?set_id=8800005007",
    inStock: 18,
    reviews: []
  },
  {
    name: "Goku Super Saiyan Figure",
    description: "Dragon Ball Z figure — Goku in Super Saiyan form (18 cm).",
    type: "figure",
    ageGroup: "6+",
    targetGroup: "svi",
    productionDate: new Date("2023-12-20"),
    price: 39.99,
    image: "https://i.ebayimg.com/images/g/IrQAAOSwmRNnYWts/s-l500.jpg",
    inStock: 25,
    reviews: []
  },
  {
    name: "Vegeta Super Saiyan Blue Figure",
    description: "Dragon Ball Super Vegeta Blue collectible figure.",
    type: "figure",
    ageGroup: "6+",
    targetGroup: "svi",
    productionDate: new Date("2024-01-05"),
    price: 31.99,
    image: "https://hobbyfigures.co.uk/cdn/shop/products/Dragon-Ball-Super-S-H-Figuarts-Action-Figure-Vegeta-Super-Saiyan-Blue-15th-Anniversary-Version-14cm-0_720x.jpg?v=1688606606",
    inStock: 20,
    reviews: []
  },
  {
    name: "LEGO City Fire Truck",
    description: "LEGO fire truck set with mini-figures and equipment.",
    type: "vehicles",
    ageGroup: "5+",
    targetGroup: "svi",
    productionDate: new Date("2023-10-01"),
    price: 19.99,
    image: "https://m.media-amazon.com/images/I/81hjKr5g5hL.jpg",
    inStock: 40,
    reviews: []
  },
  {
    name: "Space Puzzle — 200 Pieces",
    description: "Space themed puzzle featuring planets and galaxies.",
    type: "puzzle",
    ageGroup: "7+",
    targetGroup: "svi",
    productionDate: new Date("2024-02-15"),
    price: 12.99,
    image: "https://i5.walmartimages.com/seo/Exploring-the-Solar-System-Puzzle-200-Pieces_51d8e8f9-6a5e-411f-9fe7-f06254aae652.2ae82dabaf120d3f16fa364a8fa93eb6.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    inStock: 50,
    reviews: []
  },
  {
    name: "Large Plush Teddy Bear",
    description: "Soft and cuddly plush teddy bear, suitable for all ages.",
    type: "pleated",
    ageGroup: "0+",
    targetGroup: "svi",
    productionDate: new Date("2024-03-01"),
    price: 22.99,
    image: "https://img.fruugo.com/product/6/00/1822323006_max.jpg",
    inStock: 15,
    reviews: []
  },
  {
    name: "Noddy Figure",
    description: "Classic Noddy collectible figur and his car, perfect for kids aged 3+.",
    type: "figure",
    ageGroup: "3+",
    targetGroup: "svi",
    productionDate: new Date("2024-03-10"),
    price: 14.99,
    image: "https://www.lulu-berlu.com/upload/image/noddy---ideal-1994-pvc-figure---noddy-p-image-377032-grande.jpg",
    inStock: 40,
    reviews: []
  },
  {
    name: "Hot Wheels Racing Car",
    description: "Metal Hot Wheels race car for boys and collectors.",
    type: "vehicles",
    ageGroup: "4+",
    targetGroup: "dečak",
    productionDate: new Date("2023-11-10"),
    price: 7.99,
    image: "https://i.ebayimg.com/images/g/rSYAAOSwnRRfMUT5/s-l400.jpg",
    inStock: 60,
    reviews: []
  },
  {
    name: "Barbi i ljubimac",
    description: "Barbie set sa preslatkim kućnim ljubimcem i dodacima.",
    type: "figure",
    ageGroup: "3+",
    targetGroup: "devojčica",
    productionDate: new Date("2024-04-01"),
    price: 24.99,
    image: "https://toyzzz.rs/wp-content/uploads/2022/01/400548-300x300.jpg",
    inStock: 15,
    reviews: []
  }
];

export const seedDatabase = async () => {
  try {
    const count = await Toy.countDocuents();
    if (count === 0) {
      console.log("📭 Database is empty. Starting seed...");
      await Toy.insertMany(toys);
      console.log("🎉 Seeded toys successfully!");
    } else {
      console.log(`ℹDatabase already has ${count} toys. Seed skipped.`);
    }
  } catch (err) {
    console.error("Seed failed:", err);
  }
};