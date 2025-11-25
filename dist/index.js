"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const areas_1 = __importDefault(require("./routes/areas"));
const boxes_1 = __importDefault(require("./routes/boxes"));
const collections_1 = __importDefault(require("./routes/collections"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/ping", (_req, res) => {
    res.send("pong");
});
app.get("/", (_req, res) => {
    res.send("Donation API Running");
});
// ROUTES
app.use("/auth", auth_1.default);
app.use("/areas", areas_1.default);
app.use("/boxes", boxes_1.default);
app.use("/collections", collections_1.default);
app.use("/users", users_1.default);
const PORT = parseInt(process.env.PORT || "3000", 10);
// Connect to database first, then start server
const startServer = async () => {
    try {
        await (0, db_1.default)();
        app.listen(PORT, () => console.log("Server running on port", PORT));
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map