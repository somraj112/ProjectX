const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/posts", require("./routes/post.routes"));
app.use("/comments", require("./routes/comment.routes"));
app.use("/notes", require("./routes/note.routes"));
app.use("/events", require("./routes/event.routes"));
app.use("/market", require("./routes/market.routes"));
app.use("/lost-found", require("./routes/lostfound.routes"));

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "Unify backend is running",
  });
});

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
