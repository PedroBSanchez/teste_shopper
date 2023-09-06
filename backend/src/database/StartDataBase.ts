import Pack from "../models/Packs";
import Product from "../models/Product";
import { QueryTypes } from "sequelize";
import sequelize from "./Sequelize";

const startDataBase = async () => {
  await Product.sync();
  await Pack.sync();

  await sequelize.query("DELETE FROM packs;", { raw: true });
  await sequelize.query("DELETE FROM products;", { raw: true });

  await Product.create({
    code: 16,
    name: "AZEITE  PORTUGU�S  EXTRA VIRGEM GALLO 500ML",
    cost_price: 18.44,
    sales_price: 20.49,
  });
  await Product.create({
    code: 18,
    name: "BEBIDA ENERG�TICA VIBE 2L",
    cost_price: 8.09,
    sales_price: 8.99,
  });
  await Product.create({
    code: 19,
    name: "ENERG�TICO  RED BULL ENERGY DRINK 250ML",
    cost_price: 6.56,
    sales_price: 7.29,
  });
  await Product.create({
    code: 20,
    name: "ENERG�TICO RED BULL ENERGY DRINK 355ML",
    cost_price: 9.71,
    sales_price: 10.79,
  });
  await Product.create({
    code: 21,
    name: "BEBIDA ENERG�TICA RED BULL RED EDITION 250ML",
    cost_price: 10.71,
    sales_price: 11.71,
  });
  await Product.create({
    code: 22,
    name: "ENERG�TICO  RED BULL ENERGY DRINK SEM A��CAR 250ML",
    cost_price: 6.74,
    sales_price: 7.49,
  });
  await Product.create({
    code: 23,
    name: "�GUA MINERAL BONAFONT SEM G�S 1,5L",
    cost_price: 2.15,
    sales_price: 2.39,
  });
  await Product.create({
    code: 24,
    name: "FILME DE PVC WYDA 28CMX15M",
    cost_price: 3.59,
    sales_price: 3.99,
  });
  await Product.create({
    code: 26,
    name: "ROLO DE PAPEL ALUM�NIO WYDA 30CMX7,5M",
    cost_price: 5.21,
    sales_price: 5.79,
  });
  await Product.create({
    code: 1000,
    name: "BEBIDA ENERG�TICA VIBE 2L - 6 UNIDADES",
    cost_price: 48.54,
    sales_price: 53.94,
  });
  await Product.create({
    code: 1010,
    name: "KIT ROLO DE ALUMINIO + FILME PVC WYDA",
    cost_price: 8.8,
    sales_price: 9.78,
  });
  await Product.create({
    code: 1020,
    name: "SUPER PACK RED BULL VARIADOS - 6 UNIDADES",
    cost_price: 51.81,
    sales_price: 57.0,
  });

  await Pack.create({ pack_id: 1000, product_id: 18, qty: 6 });
  await Pack.create({ pack_id: 1010, product_id: 24, qty: 1 });
  await Pack.create({ pack_id: 1010, product_id: 26, qty: 1 });
  await Pack.create({ pack_id: 1020, product_id: 19, qty: 3 });
  await Pack.create({ pack_id: 1020, product_id: 21, qty: 3 });
};

export { startDataBase };
