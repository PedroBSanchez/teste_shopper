import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { ProductControllerRoutes } from "./controllers/ProductController";
import { connectToDataBase } from "./database/MySql";

const main = async () => {
  config();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Routes //

  app.use("/api/products", ProductControllerRoutes);

  ////////////
  console.log(process.env.MYSQL_PASSWORD);

  connectToDataBase();

  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log("🖳 - Server up on PORT: " + port));
};

main();
