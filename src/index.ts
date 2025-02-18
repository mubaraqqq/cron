import express from "express";
import "./scheduler";

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
