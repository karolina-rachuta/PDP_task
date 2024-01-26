'use strict';

/**
 * Get list price for a product
 * @param {string} productID- Product ID
 * @param {dw.catalog.Product} apiProduct - Product information returned by the script API
 * @param {Object} options - Options passed in from the factory
 * @property {string} apiProduct.ID - Variables passed
 * @property {string} apiProduct.masterProduct.ID - Variables passed
 * @return {string} - Content Asset Body
 */
function getDeliveryInformation(productID) {
    var ContentMgr = require('dw/content/ContentMgr');
    var deliveryContentAsset = 'delivery-info-' + productID;
    var deliveryContent = ContentMgr.getContent(deliveryContentAsset);
    if (deliveryContent && deliveryContent.online && deliveryContent.custom.body) {
        return deliveryContent.custom.body;
    } else {
        var genericContentAsset = 'delivery-info-generic';
        var genericContent = ContentMgr.getContent(genericContentAsset);
        if (genericContent && genericContent.online && genericContent.custom.body) {
            return genericContent.custom.body;
        }
    }
    return '';
}

module.exports = function (object, apiProduct) {
    var productID = apiProduct.master ? apiProduct.ID : apiProduct.masterProduct.ID;
    Object.defineProperty(object, 'deliveryInfo', {
        enumerable: true,
        value: getDeliveryInformation(productID)
    });
};