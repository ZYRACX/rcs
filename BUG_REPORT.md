# Bug Report

## Summary
This document contains a comprehensive list of bugs and potential issues found in the codebase through static code analysis.

---

## 🔴 Critical Bugs

### 1. **Incomplete Return Statement in `removeOneItemToInventory`**
**File:** `server/src/shared/services/inventory.service.js` (Line 105)

**Issue:**
```javascript
} else return  // ❌ Missing return value - returns undefined
```

**Impact:** When a user tries to remove an item that doesn't exist in their inventory, the function returns `undefined` instead of a proper value or error. This can cause downstream null/undefined reference errors.

**Severity:** High

**Fix:**
```javascript
} else {
    throw new Error("Item not found in inventory");
}
```

---

### 2. **Missing Error Information in `removeOneItemToInventory`**
**File:** `server/src/shared/services/inventory.service.js` (Line 98)

**Issue:**
```javascript
data: {
    amount: row.amount - quantity
}
```

**Impact:** No validation that the quantity being removed doesn't exceed the available amount. Can result in negative inventory amounts.

**Severity:** High

**Fix:** Add validation before updating:
```javascript
if (row.amount < quantity) {
    throw new Error("Insufficient quantity in inventory");
}
```

---

### 3. **Missing User Data Row Error in User Registration**
**File:** `server/src/modules/auth/auth.controller.js` (Line 26-36)

**Issue:**
```javascript
tablesDB.createRow({
    databaseId: appwriteConfig.appwrite.databaseId,
    tableId: appwriteConfig.appwrite.USER_TABLE,
    rowId: ID.unique(),
    data: { ... }
}) // ❌ No await, no error handling
```

**Impact:** Database row creation is not awaited and has no error handling. If this fails, the user is already registered in Appwrite but the database record creation fails, causing an inconsistent state.

**Severity:** Critical

**Fix:**
```javascript
try {
    const user = await authService.register(username, email, password);
    
    await tablesDB.createRow({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.USER_TABLE,
        rowId: ID.unique(),
        data: {
            userId: user.userId,
            username: user.username,
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
        }
    });
    
    return res.status(201).json({...});
} catch (error) {
    // Handle both registration and database errors
}
```

---

### 4. **Silent Failure in Auth Service**
**File:** `server/src/modules/auth/auth.service.js` (Line 33)

**Issue:**
```javascript
} catch (error) {
    console.error("Auth register error:", error);
    if (error.code == 400 && error.type == 'general_argument_invalid') {
        return { code: error.code, error: "..." }
    }
    if (error.code == 409 && error.type == 'user_already_exists') {
        return { code: error.code, error: "..." }
    }
    // ❌ No return statement for unknown errors - returns undefined
}
```

**Impact:** Unknown errors silently fail and return `undefined`, which is not handled properly by the controller.

**Severity:** High

**Fix:** Add a default error return:
```javascript
return {
    code: error.code || 500,
    error: error.message || "An unexpected error occurred"
}
```

---

## ⚠️ High Priority Issues

### 5. **No Validation for Negative Inventory Amount**
**File:** `server/src/shared/services/inventory.service.js` (Lines 93-100)

**Issue:** When removing items, the amount is decremented without checking if it would go negative, allowing negative inventory values.

**Severity:** High

---

### 6. **Missing Return Value Logic**
**File:** `server/src/modules/admin/playerManage/playerManage.service.js`

**Issue:** Consistent pattern of missing error handling and return statements in admin operations could cause silent failures.

**Severity:** High

---

## ⚠️ Medium Priority Issues

### 7. **Inconsistent Error Handling Patterns**
**File:** Multiple files across `server/src/modules/`

**Issue:** Mix of error handling styles:
- Some files: `} catch (error) {` (proper spacing)
- Some files: `}catch(error){` (no spaces)
- Some files: `.catch((error) => {...})` (promise chaining)

**Impact:** Inconsistent code style makes debugging harder.

**Severity:** Medium

**Example locations:**
- `server/src/modules/game/economy/economy.controller.js:36`
- `server/src/modules/admin/playerManage/playerManage.controller.js:32`

---

### 8. **No Quantity Validation in Item Addition**
**File:** `server/src/shared/services/inventory.service.js` (Line 12)

**Issue:**
```javascript
export async function addOneItemToInventory(tablesDB, userId, itemId, quantity) {
    // No validation that quantity > 0
    const updated = await tablesDB.updateRow({
        data: {
            amount: row.amount + quantity  // Could add negative value
        }
    });
}
```

**Impact:** Negative quantities can be added to inventory.

**Severity:** Medium

**Fix:** Add validation:
```javascript
if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
}
```

---

### 9. **Player Info Endpoint Could Return Undefined**
**File:** `server/src/modules/game/player/player.service.js` (Line 25)

**Issue:**
```javascript
return result.rows[0];  // Returns undefined if no rows found
```

**Impact:** If a player record doesn't exist, this returns `undefined` instead of throwing an error. Controllers don't handle this gracefully.

**Severity:** Medium

**Fix:**
```javascript
if (!result.rows[0]) {
    throw new Error("Player not found");
}
return result.rows[0];
```

---

### 10. **Missing Validation in Mining/Exploring Controllers**
**File:** `server/src/modules/game/mining/mining.controller.js` (Line 38)

**Issue:**
```javascript
const minedItems = RandomItemPicker(minableItems, 100, 500);
```

**Missing:** No check if `minableItems` array is empty. Will cause an error in `RandomItemPicker`.

**Severity:** Medium

**Fix:** Add validation:
```javascript
if (!minableItems || minableItems.length === 0) {
    return res.status(400).json({
        error: "No items available to mine"
    });
}
```

---

## 🟡 Low Priority Issues / Code Quality

### 11. **Commented Out Import**
**File:** `server/src/modules/auth/auth.service.js` (Line 2)

**Issue:**
```javascript
// import appwriteConfig from "../../config/appwrite.js"
```

**Impact:** Dead code left in production. Creates confusion during maintenance.

**Severity:** Low

---

### 12. **Commented Out Code in RandomItemPicker**
**File:** `server/src/utils/randomItemPicker.js` (Line 65)

**Issue:**
```javascript
// console.log(currentItem)
```

**Impact:** Debug code left in production.

**Severity:** Low

---

### 13. **Overly Broad Error Catching**
**File:** Multiple files

**Issue:** Many catch blocks log errors but return generic 500 responses without distinguishing between different error types.

**Example:**
```javascript
} catch (error) {
    console.error("Mining error:", error);
    return res.status(500).json({
        error: "Mining failed"
    });
}
```

**Impact:** Makes debugging harder for API consumers and support team.

**Severity:** Low

---

### 14. **Missing Input Validation in Controllers**
**File:** Multiple controller files

**Issue:** Most endpoints don't validate required query parameters or request body fields.

**Severity:** Low

**Example:** `server/src/modules/admin/itemsManager/itemManager.controller.js` - Item update doesn't validate that required fields are present.

---

### 15. **Possible Race Condition in Mining Timestamp Update**
**File:** `server/src/modules/game/mining/mining.controller.js` (Line 32)

**Issue:**
```javascript
// Check cooldown
const cooldownCheck = await miningService.checkMiningCooldown(...);

if (!cooldownCheck.allowed) {
    return res.status(429).json({...});
}

// 🚨 update timestamp immediately to prevent spam
await miningService.updateMiningTimestamp(...);
```

**Problem:** Between the cooldown check and timestamp update, another request could pass the cooldown check. The comment indicates awareness but this is a known race condition.

**Severity:** Low (but good to document)

**Note:** This is mitigated by updating immediately, but ideally should use database transactions.

---

## 📋 Summary Table

| Bug ID | File | Type | Severity | Status |
|--------|------|------|----------|--------|
| 1 | `inventory.service.js:105` | Logic Error | Critical | Not Fixed |
| 2 | `inventory.service.js:98` | Missing Validation | High | Not Fixed |
| 3 | `auth.controller.js:26` | Missing Await/Error Handling | Critical | Not Fixed |
| 4 | `auth.service.js:33` | Silent Failure | High | Not Fixed |
| 5 | `inventory.service.js` | Missing Validation | High | Not Fixed |
| 6 | `playerManage.service.js` | Missing Returns | High | Not Fixed |
| 7 | Multiple Files | Code Style | Medium | Not Fixed |
| 8 | `inventory.service.js:12` | Missing Validation | Medium | Not Fixed |
| 9 | `player.service.js:25` | Error Handling | Medium | Not Fixed |
| 10 | `mining.controller.js:38` | Missing Validation | Medium | Not Fixed |
| 11 | `auth.service.js:2` | Dead Code | Low | Not Fixed |
| 12 | `randomItemPicker.js:65` | Debug Code | Low | Not Fixed |
| 13 | Multiple Files | Error Handling | Low | Not Fixed |
| 14 | Multiple Controllers | Input Validation | Low | Not Fixed |
| 15 | `mining.controller.js` | Race Condition | Low | Not Fixed |

---

## Recommendations

1. **Immediate Actions (Critical):**
   - Fix missing await in user registration (Bug #3)
   - Fix incomplete return in `removeOneItemToInventory` (Bug #1)
   - Add proper error handling in auth service (Bug #4)

2. **Short Term (High Priority):**
   - Add input validation for all inventory operations (Bugs #2, #5, #8)
   - Add player existence checks in service layer (Bug #9)
   - Add item availability validation (Bug #10)

3. **Medium Term (Code Quality):**
   - Standardize error handling patterns across all controllers
   - Implement request body validation middleware
   - Remove commented-out code

4. **Long Term (Architecture):**
   - Consider implementing database transactions for multi-step operations
   - Add comprehensive logging and error tracking
   - Implement API validation schemas (e.g., using Joi or Zod)

---

**Last Updated:** 2026-05-18
