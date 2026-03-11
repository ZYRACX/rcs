/**
 * RandomItemPicker
 * Picks multiple items based on rarity weights.
 *
 * @param {Array<{itemId: string, Rarity: number|string}>} itemList
 * @param {number} minimumRange - cannot be negative
 * @param {number} maximumRange - must be >= 100
 * @returns {Array<Object>} array of selected items
 */

function RandomItemPicker(itemList, minimumRange, maximumRange) {

    // -----------------------------
    // Input Validation
    // -----------------------------
    if (!Array.isArray(itemList) || itemList.length === 0) {
        throw new Error("itemList must be a non-empty array.");
    }

    if (minimumRange < 0) {
        throw new Error("minimumRange cannot be negative.");
    }

    if (maximumRange < 100) {
        throw new Error("maximumRange must be at least 100.");
    }

    if (minimumRange >= maximumRange) {
        throw new Error("minimumRange must be smaller than maximumRange.");
    }

    // -----------------------------
    // Step 1: Determine how many times to roll
    // -----------------------------
    const numberOfRolls =
        Math.floor(Math.random() * (maximumRange - minimumRange + 1)) + minimumRange;

    // -----------------------------
    // Step 2: Convert rarities to numbers
    // -----------------------------
    const itemsWithWeights = itemList.map(item => ({
        itemId: item.itemId,
        rarityWeight: Number(item.Rarity)
    }));

    // -----------------------------
    // Step 3: Calculate total rarity weight
    // -----------------------------
    const totalWeight = itemsWithWeights.reduce(
        (sum, item) => sum + item.rarityWeight,
        0
    );

    const selectedItems = [];

    // -----------------------------
    // Step 4: Run weighted roll N times
    // -----------------------------
    for (let rollIndex = 0; rollIndex < numberOfRolls; rollIndex++) {

        const randomWeightValue = Math.random() * totalWeight;

        let cumulativeWeight = 0;

        for (const currentItem of itemsWithWeights) {

            cumulativeWeight += currentItem.rarityWeight;

            if (randomWeightValue < cumulativeWeight) {
                selectedItems.push(currentItem);
                break;
            }
        }
    }

    return selectedItems;
}