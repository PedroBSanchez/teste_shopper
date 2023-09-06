import { Sequelize } from "sequelize";
import { execSync } from "child_process";
import sequelize from "./Sequelize";
import Product from "../models/Product";
import Pack from "../models/Packs";
import { startDataBase } from "./StartDataBase";

const connectToDataBase = async () => {
  try {
    await startDataBase();
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
};

export { connectToDataBase, sequelize };
