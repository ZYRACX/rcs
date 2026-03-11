# Backend Architecture

The backend is located in:

```
server/
```

## Folder Structure

Example structure:

```
server/
├─ modules/
│  ├─ auth/
│  ├─ inventory/
│  └─ mining/
│
├─ middleware/
├─ utils/
├─ config/
└─ server.js
```

## Layered Architecture

The backend follows a layered architecture.

Routes → Controllers → Services → Database

### Routes

Define API endpoints.

Example:

```
GET /inventory
```

### Controllers

Controllers process requests and responses.

Responsibilities:

* validate input
* call service functions
* return API responses

Example file:

```
inventory.controller.js
```

### Services

Services contain the main game logic.

Responsibilities:

* database queries
* gameplay calculations
* data transformations

Example:

```
inventory.service.js
```

### Utils

Reusable helper functions.

Examples:

```
utils/appwrite.js
utils/SessionCookieExtractor.js
```
