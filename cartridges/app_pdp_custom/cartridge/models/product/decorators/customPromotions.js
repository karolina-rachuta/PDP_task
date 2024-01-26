'use strict';

/**
 * Get list price for a product
 * @param {dw.catalog.ContentMgr} ContentMgr - Content information returned by the script API
 * @return {string} - Content Asset Body
 */
function getCustomPromotionInformation() {
    var ContentMgr = require('dw/content/ContentMgr');
    var customPromotionContentAsset = 'custom-promotional-message';
    var customPromotionContent = ContentMgr.getContent(customPromotionContentAsset);
    if (customPromotionContent && customPromotionContent.online && customPromotionContent.custom.body) {
        return customPromotionContent.custom.body;
    }
    return null
}


module.exports = function (object) {
    Object.defineProperty(object, 'customPromotion', {
        enumerable: true,
        value: getCustomPromotionInformation()
    });
};