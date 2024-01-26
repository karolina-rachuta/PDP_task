'use strict';

/**
 * @namespace Task
 */

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

/**
 * Any customization on this endpoint, also requires update for Default-Start endpoint
 */
/**
 * Task-Product : This endpoint is called when a shopper navigates to the PDP page
 * @name Base/Task-Product
 * @function
 * @memberof Home
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Product', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    
    var showProductPageHelperResult = productHelper.showProductPage(req.querystring, req.pageMetaData);
        res.render('product/customProductDetail', {
        product: showProductPageHelperResult.product,
        addToCartUrl: showProductPageHelperResult.addToCartUrl,
        resources: showProductPageHelperResult.resources,
        breadcrumbs: showProductPageHelperResult.breadcrumbs,
        canonicalUrl: showProductPageHelperResult.canonicalUrl,
        schemaData: showProductPageHelperResult.schemaData
    });
    
    next();
}, pageMetaData.computedPageMetaData);

module.exports = server.exports();
