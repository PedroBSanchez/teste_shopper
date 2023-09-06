import { Model, DataTypes } from "sequelize";
import sequelize from "../database/Sequelize";
class Product extends Model {
  public code!: number;
  public name!: string;
  public cost_price!: number;
  public sales_price!: number;
}

Product.init(
  {
    code: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost_price: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false,
    },
    sales_price: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "products",
  }
);

export default Product;
