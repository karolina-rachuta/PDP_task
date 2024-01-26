'use strict';

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'productDetails', {
        enumerable: true,
        value: apiProduct.custom.productDetails ? apiProduct.custom.productDetails : null
    });
};