# Inventory System

The inventory system stores items owned by players.

## Data Flow

Mining → Inventory → API → Client

Example flow:

1. Player mines resource
2. Resource is stored in inventory
3. Inventory API returns items
4. Client renders items

## Database Structure

Inventory table:

```
userId
itemId
quantity
```

Item metadata table:

```
itemId
name
baseValue
rarity
```

Inventory API joins inventory data with item metadata before returning the response.
