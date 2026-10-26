// PLACEHOLDER CONTENT — replace with the real content from dgapbrownie.in.
// Only used to populate an empty database on first start; afterwards edit via /admin.
export const seed = {
  products: [
    { name: "Classic Fudge Brownie", category: "Brownies", description: "Rich, dense chocolate brownie.", price: 60, image: "" },
    { name: "Walnut Brownie", category: "Brownies", description: "Fudgy brownie loaded with walnuts.", price: 80, image: "" },
    { name: "Brownie Box (6)", category: "Boxes", description: "A box of six assorted brownies.", price: 399, image: "" }
  ],
  mantras: [
    { text: "Om Namah Shivaya", meaning: "I bow to the inner self", slot: "morning" },
    { text: "So Hum", meaning: "I am that", slot: "afternoon" },
    { text: "Om Shanti Shanti Shanti", meaning: "Peace in body, mind and spirit", slot: "evening" },
    { text: "Lokah Samastah Sukhino Bhavantu", meaning: "May all beings be happy", slot: "any" },
    { text: "Om Mani Padme Hum", meaning: "The jewel is in the lotus", slot: "any" }
  ],
  pages: [
    { slug: "home", title: "Welcome to DGAP Brownie", body: "Freshly baked brownies, made with love. (placeholder)" },
    { slug: "about", title: "About Us", body: "Our story goes here. (placeholder)" }
  ]
};
