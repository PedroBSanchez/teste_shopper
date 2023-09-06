import { Model, DataTypes } from "sequelize";
import sequelize from "../database/Sequelize";

class Pack extends Model {
  public id!: number;
  public pack_id!: number;
  public product_id!: number;
  public qty!: number;
}

Pack.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    pack_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "products",
        key: "code",
      },
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "products",
        key: "code",
      },
    },
    qty: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  { sequelize, modelName: "packs" }
);

export default Pack;
