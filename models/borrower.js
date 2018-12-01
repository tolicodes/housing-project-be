'use strict';
module.exports = (sequelize, DataTypes) => {
  const borrower = sequelize.define('borrower', {
    name: DataTypes.STRING,
    preapprovalAmount: DataTypes.STRING,
  }, {});
  borrower.associate = function(models) {
    borrower.belongsTo(models.user);
    borrower.hasMany(models.borrower_neighborhood);
  };
  return borrower;
};