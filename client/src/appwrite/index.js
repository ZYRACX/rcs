import {Client, Account} from "appwrite"

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your API Endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_NAME) // Your project ID

const account = new Account(client)

export {client, account}