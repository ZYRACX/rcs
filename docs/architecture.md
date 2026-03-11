# RCS Architecture

RCS is a browser-based game built using a full-stack architecture.

## Tech Stack

Frontend

* React
* JavaScript / TypeScript
* Browser-based UI

Backend

* Node.js
* Express
* Appwrite (database + authentication)

## System Overview

Client → Server → Appwrite

```
Browser Client
     ↓
Express API Server
     ↓
Appwrite Database
```

The frontend communicates with the backend through REST APIs.
The backend handles authentication, gameplay logic, and data retrieval.

## Major Systems

Current game systems:

* Authentication
* Inventory
* Mining
* Market (planned)
* Economy (planned)

Each system is implemented as a backend module.

Example:

```
server/modules/inventory/
server/modules/mining/
server/modules/auth/
```
