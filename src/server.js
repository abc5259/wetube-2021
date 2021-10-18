import "./db"; // db.js파일을 import해줌으로써 내서버가 mongo에 연결된다.
import "./models/Video"; 
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
const logger = morgan('dev');


app.set("views", `${process.cwd()}/src/views`);
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


const handleListening = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🔥`);
}

app.listen(PORT, handleListening);