import {Client, Account} from "appwrite"

const client = new Client()
    .setEndpoint("http://localhost/v1") // Your API Endpoint
    .setProject("69987f4a0029b8b0b902") // Your project ID

const account = new Account(client)

export {client, account}