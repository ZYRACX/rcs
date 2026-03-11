# Frontend

The frontend is located in:

```
client/
```

It is responsible for rendering the game interface and communicating with the backend API.

## Responsibilities

Frontend handles:

* UI rendering
* player interactions
* API calls
* displaying game state

## Example API Call

Fetching inventory:

```javascript
fetch("/inventory")
  .then(res => res.json())
  .then(data => {
     setInventory(data.items)
  })
```

The frontend does not directly communicate with the database.
All data access happens through the backend API.
