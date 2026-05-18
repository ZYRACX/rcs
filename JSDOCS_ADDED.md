# JSdocs Added to Exploring Module

## Overview
Comprehensive JSdoc comments have been added to the entire exploring module (`server/src/modules/game/exploring/`) to improve code documentation and IDE support.

---

## Files Updated

### 1. **exploring.controller.js**

#### Function: `doExploring(req, res)`
- **Type:** Async Express middleware handler
- **Purpose:** Handles the exploring game action for authenticated users
- **Documentation includes:**
  - Detailed step-by-step process breakdown (7 steps)
  - `@async` tag
  - Request object structure with headers
  - Response object with all possible status codes (429, 200, 500)
  - Error throwing conditions
  - Two practical examples (success and cooldown scenarios)
  - Return value structure with field descriptions

**Key Details:**
- Validates user session via Appwrite
- Enforces 10-second cooldown between explore actions
- Randomly selects 100-500 items based on weighted probabilities
- Groups items by ID and updates user inventory
- Returns different HTTP statuses for different outcomes

---

### 2. **exploring.service.js**

#### Constant: `COOLDOWN_MS`
- **Type:** Number constant
- **Value:** 10000 (10 seconds)
- **Documentation:** JSDoc constant tag with data type

---

#### Function: `checkExploringCooldown(tablesDB, userId)`
- **Purpose:** Validates if user can perform explore based on cooldown
- **Documentation includes:**
  - Detailed explanation of cooldown checking logic
  - `@async` tag
  - Parameters: TablesDB instance and userId string
  - Return structure with allowed flag and remaining milliseconds
  - Error conditions
  - Two practical examples (allowed and on-cooldown scenarios)

**Behavior:**
- Returns `{ allowed: true, remaining: 0 }` if no cooldown active
- Returns `{ allowed: false, remaining: X }` if cooldown active with milliseconds remaining
- Handles missing user records gracefully

---

#### Function: `updateExploringTimestamp(tablesDB, userId)`
- **Purpose:** Records the current time as user's last explore timestamp
- **Documentation includes:**
  - Explanation of timestamp usage for cooldown enforcement
  - `@async` tag
  - Parameters documented
  - Promise<void> return type
  - Error throwing conditions
  - Note about missing user record handling
  - Practical example

**Behavior:**
- Updates user's `lastExploreAt` field with ISO timestamp
- Returns early if user record not found (silent failure by design)

---

#### Function: `getExploreableItems(tablesDB)`
- **Purpose:** Retrieves all items available for exploration
- **Documentation includes:**
  - Explanation of exploreable item pool concept
  - Database query filter logic (checks for "explorable" in wayToObtain)
  - Detailed return structure with example fields
  - Item object properties documented:
    - `$id`: Unique identifier
    - `itemName`: Display name
    - `chanceOfGetting`: Rarity weight
    - `wayToObtain`: Array with "explorable" flag
  - Error conditions
  - Practical example

**Returns:** Array of all items marked as explorable in the database

---

#### Function: `getSortedItems(items)`
- **Purpose:** Groups and counts item IDs from random selection
- **Documentation includes:**
  - Explanation of aggregation logic
  - Use case in explore workflow
  - `@async` tag (even though it's synchronous, kept for consistency)
  - Array of item IDs parameter
  - Return type: Object with string keys and number values
  - Two practical examples:
    - Normal case with various items
    - Edge case with empty array
  - Practical output format

**Behavior:**
- Converts array of duplicate item IDs into counts object
- Example: `["item1", "item2", "item1"]` → `{ item1: 2, item2: 1 }`

---

#### Function: `addToInventory(tablesDB, sortedItems, userId)`
- **Purpose:** Adds grouped items to user's inventory
- **Documentation includes:**
  - Detailed explanation of create vs. update logic
  - Batch inventory operation workflow
  - Parameters documented:
    - tablesDB instance
    - sortedItems object format: `{ "itemId": quantity }`
    - userId string
  - Return structure: `{ updatedItems: number }`
  - Error throwing conditions
  - Two detailed examples:
    - Basic case
    - Case showing quantity aggregation (existing 5 + new 2 = 7)

**Behavior:**
- Checks if item already in user inventory
- Updates existing inventory quantities
- Creates new inventory records for new items
- Returns count of affected inventory records

---

### 3. **exploring.routes.js**

#### Module Documentation
- **Type:** Module JSDoc
- **Documentation includes:**
  - Module identifier: `exploring/routes`
  - Purpose: Routes for game exploring feature
  - Feature description: Players explore to find random items

---

#### Route: `GET /game/exploring`
- **Type:** API Endpoint route documentation
- **Documentation includes:**
  - Route path: `/game/exploring`
  - HTTP method: GET
  - Description: Execute an exploring action
  - Authentication requirement: Private (requires session cookie)
  - Workflow summary (3 steps)
  - Return status codes:
    - 200: Success
    - 429: Too Many Requests (cooldown)
    - 500: Server error
  - Two detailed examples:
    - Request format with authentication
    - Success response (200) with structured JSON
    - Cooldown response (429) with retry information

**Usage:**
- Requires valid session cookie in request headers
- Returns explored items, grouped counts, and inventory update summary
- Implements rate limiting via cooldown mechanism

---

## JSDoc Features Used

### Standard Tags
- `@async` - Marks async functions
- `@param` - Documents parameters with type and description
- `@returns` - Documents return value/type
- `@throws` - Documents error conditions
- `@example` - Provides practical usage examples
- `@note` - Special notes about function behavior
- `@module` - Marks module-level documentation
- `@route` - Documents API route information
- `@access` - Documents access level (Private/Public)
- `@constant` - Documents constants
- `@deprecated` - Marks deprecated items (if any)

### Type Documentation
- Object types with property descriptions
- Array types with element descriptions
- Union types with alternatives
- Complex nested objects with detailed structure

### Examples
- Real-world scenarios showing function usage
- Response format examples
- Edge case handling examples
- Input/output format demonstrations

---

## Benefits

1. **IDE Support:** Better autocomplete and type hints in VSCode/WebStorm
2. **Developer Experience:** Hover documentation shows detailed information
3. **API Documentation:** Can generate HTML docs with tools like JSDoc generators
4. **Maintenance:** Future developers can understand code intent and usage
5. **Type Safety:** Better TypeScript integration and inference
6. **Testing:** Clear contract definition for unit tests

---

## Standards Applied

- **Consistency:** All functions follow uniform documentation structure
- **Completeness:** Every export documented with full parameter and return info
- **Clarity:** Plain English descriptions with technical accuracy
- **Examples:** Real-world usage patterns for each function
- **Practicality:** Documentation focuses on developer usage, not implementation details

---

## Recommendations for Additional Documentation

1. Consider adding JSdocs to similar modules:
   - `mining` module (same pattern)
   - `market` module (more complex)
   - `inventory` module (core functionality)

2. Consider creating a `README.md` for the exploring module with:
   - Feature overview
   - Architecture diagram
   - Game mechanics explanation
   - Integration points

3. Consider adding TypeScript interfaces for:
   - CooldownStatus object
   - ExploreItem object
   - InventoryUpdate object

---

**Last Updated:** 2026-05-18
**Status:** ✅ Complete
