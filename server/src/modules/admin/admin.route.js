import Express from "express";
import { extractSessionCookie } from "../../utils/SessionCookieExtractor.js";
import { createAppwriteClient } from "../../utils/appwrite.js";
import itemManagerRouter from "./itemsManager/itemManager.route.js";
import userManagerRouter from "./userManager/userManager.route.js";
import playerManageRouter from "./playerManage/playerManage.route.js"
const router = Express.Router();

router.use(async (req, res, next) => {

    try {

        const session = extractSessionCookie(req);
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { account } = createAppwriteClient("user", session);

        const user = await account.get();

        const isAdmin = user.labels?.includes("admin");

        if (!isAdmin) {
            return res.status(403).json({
                message: "Admin privileges required"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.error("Admin middleware error:", error);

        return res.status(401).json({
            error: "Invalid or expired session"
        });

    }

});

router.use("/items", itemManagerRouter);
router.use("/users", userManagerRouter);
router.use("/player", playerManageRouter)

router.get("/", (req, res) => {
    res.send("admin route");
});

export default router;