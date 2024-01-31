'use strict';
var baseDetail = require('base/product/detail');
var base = require('./base');
// extending detail from appstorefront /baseDetail - object

baseDetail.sizeAttribute = base.sizeAttribute;
baseDetail.attributeSelect = base.attributeSelect;

baseDetail.extendingDescriptionButton = function () {
        var btn_toggle = document.getElementsByClassName("btn_toggle")[0];
        var p_short_Description = document.getElementsByClassName("p_short_Description")[0];
        var p_long_Description = document.getElementsByClassName("p_long_Description")[0];

        btn_toggle.addEventListener("click", () => {

            if (p_short_Description.style.display === "block") {
                p_short_Description.style.display = "none";
                p_long_Description.style.display = "block";
            } else if (p_short_Description.style.display === "none") {
                p_long_Description.style.display = "none";
                p_short_Description.style.display = "block";
            }
        });
    };

    baseDetail.updateQuantityButtons = function () {
        var quantity_plus_button = document.querySelector(".quantity_plus_button");
        var quantity_minus_button = document.querySelector(".quantity_minus_button");
        var quantity_select = document.querySelector(".quantity_select");
        var getChosenValue = parseInt(quantity_select.value);

        quantity_plus_button.addEventListener("click", () => {
            if (getChosenValue < 10){
                getChosenValue++
                quantity_select.value = getChosenValue;
            }
        })

        quantity_minus_button.addEventListener("click", () => {
            if (getChosenValue > 1){
                getChosenValue--
                quantity_select.value = getChosenValue;
            }
        })
    };


    baseDetail.extendingDeliveryInformationButtons = function () {
        var delivery_button = document.querySelector(".delivery_button");
        var custom_delivery_info = document.querySelector(".custom_delivery_info");
        var minus_sign_delivery = document.querySelector(".minus_sign_delivery");
        var plus_sign_delivery = document.querySelector(".plus_sign_delivery");

            delivery_button.addEventListener("click", () => {
                if (custom_delivery_info.style.display === 'none') {
                    custom_delivery_info.style.display = 'block';
                    minus_sign_delivery.style.display = 'none'
                    plus_sign_delivery.style.display = 'inline'

                } else if (custom_delivery_info.style.display === 'block') {
                    custom_delivery_info.style.display = 'none';
                    minus_sign_delivery.style.display = 'inline'
                    plus_sign_delivery.style.display = 'none'
                }
            })
    };

    baseDetail.extendingDetailInformationButtons = function () {
        var detail_button = document.querySelector(".detail_button");
        var custom_detail_info = document.querySelector(".custom_detail_info");
        var minus_sign_detail = document.querySelector(".minus_sign_detail");
        var plus_sign_detail = document.querySelector(".plus_sign_detail");

            detail_button.addEventListener("click", () => {
                if (custom_detail_info.style.display === 'none') {
                    custom_detail_info.style.display = 'block';
                    minus_sign_detail.style.display = 'none'
                    plus_sign_detail.style.display = 'inline'

                } else if (custom_detail_info.style.display === 'block') {
                    custom_detail_info.style.display = 'none';
                    minus_sign_detail.style.display = 'inline'
                    plus_sign_detail.style.display = 'none'
                }
            })
    };

    baseDetail.availability = base.availability;

    baseDetail.addToCart = base.addToCart;

    baseDetail.updateAttributesAndDetails = function () {
        $('body').on('product:statusUpdate', function (e, data) {
            var $productContainer = $('.product-detail[data-pid="' + data.id + '"]');

            $productContainer.find('.description-and-detail .product-attributes')
                .empty()
                .html(data.attributesHtml);

            if (data.shortDescription) {
                $productContainer.find('.description-and-detail .description')
                    .removeClass('hidden-xl-down');
                $productContainer.find('.description-and-detail .description .content')
                    .empty()
                    .html(data.shortDescription);
            } else {
                $productContainer.find('.description-and-detail .description')
                    .addClass('hidden-xl-down');
            }

            if (data.longDescription) {
                $productContainer.find('.description-and-detail .details')
                    .removeClass('hidden-xl-down');
                $productContainer.find('.description-and-detail .details .content')
                    .empty()
                    .html(data.longDescription);
            } else {
                $productContainer.find('.description-and-detail .details')
                    .addClass('hidden-xl-down');
            }
        });
    },

    baseDetail.showSpinner = function () {
        $('body').on('product:beforeAddToCart product:beforeAttributeSelect', function () {
            $.spinner().start();
        });
    };

    baseDetail.updateAttribute = function () {
        $('body').on('product:afterAttributeSelect', function (e, response) {
            if ($('.product-detail>.bundle-items').length) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else if ($('.product-set-detail').eq(0)) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else {
                $('.product-id').text(response.data.product.id);
                $('.product-detail:not(".bundle-item")').data('pid', response.data.product.id);
            }
        });
    };

    baseDetail.updateAddToCart = function () {
        $('body').on('product:updateAddToCart', function (e, response) {
            // update local add to cart (for sets)
            $('button.add-to-cart', response.$productContainer).attr('disabled',
                (!response.product.readyToOrder || !response.product.available));

            var enable = $('.product-availability').toArray().every(function (item) {
                return $(item).data('available') && $(item).data('ready-to-order');
            });
            module.exports.methods.updateAddToCartEnableDisableOtherElements(!enable);
        });
    };

    baseDetail.updateAvailability = function () {
        $('body').on('product:updateAvailability', function (e, response) {
            $('div.availability', response.$productContainer)
                .data('ready-to-order', response.product.readyToOrder)
                .data('available', response.product.available);

            $('.availability-msg', response.$productContainer)
                .empty().html(response.message);

            if ($('.global-availability').length) {
                var allAvailable = $('.product-availability').toArray()
                    .every(function (item) { return $(item).data('available'); });

                var allReady = $('.product-availability').toArray()
                    .every(function (item) { return $(item).data('ready-to-order'); });

                $('.global-availability')
                    .data('ready-to-order', allReady)
                    .data('available', allAvailable);

                $('.global-availability .availability-msg').empty()
                    .html(allReady ? response.message : response.resources.info_selectforstock);
            }
        });
    },
module.exports = baseDetail;