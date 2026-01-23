const db = require('../connection');
module.exports = {
    name: 'register',
    description: 'Register a new user',
    async execute(message, args) {
        try {
            const discordId = message.author.id;
            db.query("INSERT INTO user (`discord_uid`, `username`) VALUES (?, ?)", [discordId, username], (error, results) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        console.log("User already exists:", userId);
                    }
                    console.log("Database error while inserting user:", error);
                    return res.status(500).json({ error: "Database error" });
                }
            });
            message.channel.send("✅ Registration successful! You can now use other commands.");
        } catch (error) {
            if (error.response?.status === 409) {
                message.channel.send("⚠️ You are already registered.");
            } else {
                console.error("Error during registration:", error.message);
                message.channel.send("❌ Error during registration. Please try again later.");
            }
        }
    }
};
