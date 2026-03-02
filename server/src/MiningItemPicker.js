// =======================
// Mining Loot System
// =======================

// Loot Table — realistic rarity & abundance
//  const items = [
//   // 🪨 Very Common
//   { id: 1, name: "Stone", weight: 20.0 },
//   { id: 2, name: "Limestone", weight: 15.5 },
//   { id: 3, name: "Silicon", weight: 14.5 },
//   { id: 4, name: "Iron", weight: 12.0 },

//   // ⚙️ Common to Moderate
//   { id: 5, name: "Sulphur", weight: 9.0 },
//   { id: 6, name: "Copper", weight: 8.0 },
//   { id: 7, name: "Coal", weight: 7.0 },
//   { id: 8, name: "Silver", weight: 5.0 },

//   // 💎 Rare
//   { id: 9, name: "Uranium", weight: 3.0 },
//   { id: 10, name: "Gold", weight: 2.8 },
//   { id: 11, name: "Diamond", weight: 1.2 },
//   { id: 12, name: "Platinum", weight: 1.0 },
// ];

const items = [
  { id: 1, name: "Stone", weight: 40.0 },
  { id: 2, name: "Coal", weight: 30.0 },
  { id: 3, name: "Iron", weight: 24.0 },
  { id: 4, name: "Copper", weight: 28.0 },
  { id: 5, name: "Aluminum", weight: 25.0 },
  { id: 6, name: "Silicon", weight: 25.0 },
  { id: 7, name: "Silver", weight: 9.0 },
  { id: 8, name: "Gold", weight: 5.0 },
  { id: 9, name: "Platinum", weight: 0.2 },
  { id: 10, name: "Diamond", weight: 0.08 },
  { id: 11, name: "Uranium", weight: 0.01 },
  

]

// =======================
// Weighted Mining Function
// =======================

/**
 * Mine multiple items at once based on weight probabilities.
 * @param {Array} items - Array of { id, name, weight }
 * @param {number} count - Number of items to return
 * @param {boolean} unique - If true, prevents duplicate results
 * @returns {Array} Array of item IDs
 */
function mineItems(items, count = 3, unique = false) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const results = [];

  for (let i = 0; i < count; i++) {
    let rand = Math.random() * totalWeight;

    for (let item of items) {
      rand -= item.weight;
      if (rand <= 0) {
        if (unique) {
          // Avoid duplicates
          if (!results.includes(item.id)) results.push(item.id);
        } else {
          results.push(item.id);
        }
        break;
      }
    }
  }

  return results;
}
module.exports = { mineItems, items };