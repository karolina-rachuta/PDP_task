'use strict';
var base = module.superModule;

base.thumbnailImages = require('*/cartridge/models/product/decorators/thumbnailImages');
base.customPromotions = require('*/cartridge/models/product/decorators/customPromotions');
base.customProductDelivery = require('*/cartridge/models/product/decorators/customProductDelivery');
// base.customProductDetails = require('*/cartridge/models/product/decorators/customProductDetails');
module.exports = base;