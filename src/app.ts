import express from "express";
import routes from "./routes/user";
import cookieSession from "cookie-session";
import rateLimit from "express-rate-limit";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Setup session middleware
app.use(cookieSession({
    name: "session",
    keys: [process.env.SESSION_KEY1 as string, process.env.SESSION_KEY2 as string],
    maxAge: 24 * 60 * 60 * 1000, // one day in miliseconds
}));
// Rate limiting to prevent abusive requests
app.use(rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20 // 20 requests,
}));
app.use(passport.initialize());
app.use("/", routes);



app.get("/", (req, res) => {
    res.json({
        message: "Hello, world!",
    });
    console.log("GET response");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
