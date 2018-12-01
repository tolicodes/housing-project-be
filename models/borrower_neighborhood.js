'use strict';
module.exports = (sequelize, DataTypes) => {
  const borrower_neighborhood = sequelize.define('borrower_neighborhood', {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    borrowerId: DataTypes.INTEGER
  }, {});
  borrower_neighborhood.associate = function(models) {
    borrower_neighborhood.belongsTo(models.borrower);
  };
  return borrower_neighborhood;
};