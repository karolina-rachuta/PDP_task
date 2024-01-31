'use strict';
var baseBase = require('base/product/base');

baseBase.getPidValue = function($el) {
    var pid;

    if ($('#quickViewModal').hasClass('show') && !$('.product-set').length) {
        pid = $($el).closest('.modal-content').find('.product-quickview').data('pid');
    } else if ($('.product-set-detail').length || $('.product-set').length) {
        pid = $($el).closest('.product-detail').find('.product-id').text();
    } else {
        pid = $('.product-detail:not(".bundle-item")').data('pid');
    }
    console.log("pid", pid)
    return pid;
}
baseBase.processSwatchValues = function(attr, $productContainer, msgs) {
    attr.values.forEach(function (attrValue) {
        var $attrValue = $productContainer.find('[data-attr="' + attr.id + '"] [data-attr-value="' +
            attrValue.value + '"]');
        var $swatchButton = $attrValue.parent();

        if (attrValue.selected) {
            $attrValue.addClass('selected');
            $attrValue.siblings('.selected-assistive-text').text(msgs.assistiveSelectedText);
        } else {
            $attrValue.removeClass('selected');
            $attrValue.siblings('.selected-assistive-text').empty();
        }

        if (attrValue.url) {
            $swatchButton.attr('data-url', attrValue.url);
        } else {
            $swatchButton.removeAttr('data-url');
        }

        // Disable if not selectable
        $attrValue.removeClass('selectable unselectable');

        $attrValue.addClass(attrValue.selectable ? 'selectable' : 'unselectable');
    });
}
baseBase.processNonSwatchValues = function(attr, $productContainer) {
    var $attr = '[data-attr="' + attr.id + '"]';
    var $defaultOption = $productContainer.find($attr + ' .select-' + attr.id + ' option:first');
    $defaultOption.attr('value', attr.resetUrl);

    attr.values.forEach(function (attrValue) {
        var $attrValue = $productContainer
            .find($attr + ' [data-attr-value="' + attrValue.value + '"]');
        $attrValue.attr('value', attrValue.url)
            .removeAttr('disabled');

        if (!attrValue.selectable) {
            $attrValue.attr('disabled', true);
        }
    });
}

baseBase.updateAttrs = function (attrs, $productContainer, msgs) {
    // Currently, the only attribute type that has image swatches is Color.
    var attrsWithSwatches = ['color'];

    attrs.forEach(function (attr) {
        if (attrsWithSwatches.indexOf(attr.id) > -1) {
            baseBase.processSwatchValues(attr, $productContainer, msgs);
        } else {
            baseBase.processNonSwatchValues(attr, $productContainer);
        }
    });
}

baseBase.createCarousel = function(imgs, $productContainer) {
    var carousel = $productContainer.find('.carousel');
    $(carousel).carousel('dispose');
    var carouselId = $(carousel).attr('id');
    $(carousel).empty().append('<ol class="carousel-indicators"></ol><div class="carousel-inner" role="listbox"></div><a class="carousel-control-prev" href="#' + carouselId + '" role="button" data-slide="prev"><span class="fa icon-prev" aria-hidden="true"></span><span class="sr-only">' + $(carousel).data('prev') + '</span></a><a class="carousel-control-next" href="#' + carouselId + '" role="button" data-slide="next"><span class="fa icon-next" aria-hidden="true"></span><span class="sr-only">' + $(carousel).data('next') + '</span></a>');
    for (var i = 0; i < imgs.length; i++) {
        $('<div class="carousel-item"><img src="' + imgs[i].url + '" class="d-block img-fluid" alt="' + imgs[i].alt + ' image number ' + parseInt(imgs[i].index, 10) + '" title="' + imgs[i].title + '" itemprop="image" /></div>').appendTo($(carousel).find('.carousel-inner'));
        $('<li data-target="#' + carouselId + '" data-slide-to="' + i + '" class=""></li>').appendTo($(carousel).find('.carousel-indicators'));
    }
    $($(carousel).find('.carousel-item')).first().addClass('active');
    $($(carousel).find('.carousel-indicators > li')).first().addClass('active');
    if (imgs.length === 1) {
        $($(carousel).find('.carousel-indicators, a[class^="carousel-control-"]')).detach();
    }
    $(carousel).carousel();
    $($(carousel).find('.carousel-indicators')).attr('aria-hidden', true);
}
baseBase.updateAvailability = function(response, $productContainer) {
    var availabilityValue = '';
    var availabilityMessages = response.product.availability.messages;
    if (!response.product.readyToOrder) {
        availabilityValue = '<li><div>' + response.resources.info_selectforstock + '</div></li>';
    } else {
        availabilityMessages.forEach(function (message) {
            availabilityValue += '<li><div>' + message + '</div></li>';
        });
    }

    $($productContainer).trigger('product:updateAvailability', {
        product: response.product,
        $productContainer: $productContainer,
        message: availabilityValue,
        resources: response.resources
    });
}

baseBase.getAttributesHtml = function(attributes) {
    if (!attributes) {
        return '';
    }

    var html = '';

    attributes.forEach(function (attributeGroup) {
        if (attributeGroup.ID === 'mainAttributes') {
            attributeGroup.attributes.forEach(function (attribute) {
                html += '<div class="attribute-values">' + attribute.label + ': '
                    + attribute.value + '</div>';
            });
        }
    });

    return html;
}
baseBase.handleVariantResponse = function (response, $productContainer) {
    var isChoiceOfBonusProducts =
        $productContainer.parents('.choose-bonus-product-dialog').length > 0;
    var isVaraint;
    if (response.product.variationAttributes) {
        baseBase.updateAttrs(response.product.variationAttributes, $productContainer, response.resources);
        isVaraint = response.product.productType === 'variant';
        if (isChoiceOfBonusProducts && isVaraint) {
            $productContainer.parent('.bonus-product-item')
                .data('pid', response.product.id);

            $productContainer.parent('.bonus-product-item')
                .data('ready-to-order', response.product.readyToOrder);
        }
    }

    // Update primary images
    var primaryImageUrls = response.product.images.large;
    baseBase.createCarousel(primaryImageUrls, $productContainer);

    // Update pricing
    if (!isChoiceOfBonusProducts) {
        var $priceSelector = $('.prices .price', $productContainer).length
            ? $('.prices .price', $productContainer)
            : $('.prices .price');
        $priceSelector.replaceWith(response.product.price.html);
    }

    // Update promotions
    $productContainer.find('.promotions').empty().html(response.product.promotionsHtml);

    baseBase.updateAvailability(response, $productContainer);

    if (isChoiceOfBonusProducts) {
        var $selectButton = $productContainer.find('.select-bonus-product');
        $selectButton.trigger('bonusproduct:updateSelectButton', {
            product: response.product, $productContainer: $productContainer
        });
    } else {
        // Enable "Add to Cart" button if all required attributes have been selected
        $('button.add-to-cart, button.add-to-cart-global, button.update-cart-product-global').trigger('product:updateAddToCart', {
            product: response.product, $productContainer: $productContainer
        }).trigger('product:statusUpdate', response.product);
    }

    // Update attributes
    $productContainer.find('.main-attributes').empty()
        .html(baseBase.getAttributesHtml(response.product.attributes));
}
baseBase.updateOptions = function(optionsHtml, $productContainer) {
	// Update options
    $productContainer.find('.product-options').empty().html(optionsHtml);
}

baseBase.getQuantitySelector = function($el) {
    var quantitySelected;
    if ($el && $('.set-items').length) {
        quantitySelected = $($el).closest('.product-detail').find('.quantity-select');
    } else if ($el && $('.product-bundle').length) {
        var quantitySelectedModal = $($el).closest('.modal-footer').find('.quantity-select');
        var quantitySelectedPDP = $($el).closest('.bundle-footer').find('.quantity-select');
        if (quantitySelectedModal.val() === undefined) {
            quantitySelected = quantitySelectedPDP;
        } else {
            quantitySelected = quantitySelectedModal;
        }
    } else {
        quantitySelected = $('.quantity-select');
    }
    return quantitySelected;
}

baseBase.updateQuantities = function(quantities, $productContainer) {
    if ($productContainer.parent('.bonus-product-item').length <= 0) {
        var optionsHtml = quantities.map(function (quantity) {
            var selected = quantity.selected ? ' selected ' : '';
            return '<option value="' + quantity.value + '"  data-url="' + quantity.url + '"' +
                selected + '>' + quantity.value + '</option>';
        }).join('');
        baseBase.getQuantitySelector($productContainer).empty().html(optionsHtml);
    }
}

baseBase.attributeSelect = function (selectedValueUrl, $productContainer) {
    console.log("selectedValueUrl", selectedValueUrl);

    if (selectedValueUrl) {
        $('body').trigger('product:beforeAttributeSelect',
            { url: selectedValueUrl, container: $productContainer });

        $.ajax({
            url: selectedValueUrl,
            method: 'GET',
            success: function (data) {
                baseBase.handleVariantResponse(data, $productContainer);
                baseBase.updateOptions(data.product.optionsHtml, $productContainer);
                baseBase.updateQuantities(data.product.quantities, $productContainer);
                console.log("selectedValueUrl2", selectedValueUrl);
                console.log("updateQuantities", baseBase.handleVariantResponse);
                $('body').trigger('product:afterAttributeSelect',
                    { data: data, container: $productContainer });
                $.spinner().stop();
            },
            error: function () {
                $.spinner().stop();
            }
        });
    }
};

baseBase.sizeAttribute = function () {
    $(document).on('click', 'button.button-size', function (e) {
        e.preventDefault();

        var $productContainer = $(this).closest('.set-item');
        if (!$productContainer.length) {
            $productContainer = $(this).closest('.product-detail');
        }
        baseBase.attributeSelect($(this).attr('data-url'), $productContainer);
    });
};

    baseBase.availability = function () {
        $(document).on('change', '.quantity-select', function (e) {
            e.preventDefault();

            var $productContainer = $(this).closest('.product-detail');
            if (!$productContainer.length) {
                $productContainer = $(this).closest('.modal-content').find('.product-quickview');
            }

            if ($('.bundle-items', $productContainer).length === 0) {
                baseBase.attributeSelect($(e.currentTarget).find('option:selected').data('url'),
                    $productContainer);
            }
        });
    },
    baseBase.getQuantitySelected = function ($el) {
        return baseBase.getQuantitySelector($el).val();
    }

    baseBase.updateQuantities = function(quantities, $productContainer) {
        if ($productContainer.parent('.bonus-product-item').length <= 0) {
            var optionsHtml = quantities.map(function (quantity) {
                var selected = quantity.selected ? ' selected ' : '';
                return '<option value="' + quantity.value + '"  data-url="' + quantity.url + '"' +
                    selected + '>' + quantity.value + '</option>';
            }).join('');
            baseBase.getQuantitySelector($productContainer).empty().html(optionsHtml);
        }
    }

    baseBase.getChildProducts = function() {
        var childProducts = [];
        $('.bundle-item').each(function () {
            childProducts.push({
                pid: $(this).find('.product-id').text(),
                quantity: parseInt($(this).find('label.quantity').data('quantity'), 10)
            });
        });
    
        return childProducts.length ? JSON.stringify(childProducts) : [];
    }
    baseBase.getAddToCartUrl = function() {
        return $('.add-to-cart-url').val();
    }
    baseBase.getOptions = function($productContainer) {
        var options = $productContainer
            .find('.product-option')
            .map(function () {
                var $elOption = $(this).find('.options-select');
                var urlValue = $elOption.val();
                var selectedValueId = $elOption.find('option[value="' + urlValue + '"]')
                    .data('value-id');
                return {
                    optionId: $(this).data('option-id'),
                    selectedValueId: selectedValueId
                };
            }).toArray();
    
        return JSON.stringify(options);
    }
    baseBase.addToCart = function () {
        $(document).on('click', 'button.add-to-cart, button.add-to-cart-global', function () {
            var addToCartUrl;
            var pid;
            var pidsObj;
            var setPids;

            $('body').trigger('product:beforeAddToCart', this);

            if ($('.set-items').length && $(this).hasClass('add-to-cart-global')) {
                setPids = [];

                $('.product-detail').each(function () {
                    if (!$(this).hasClass('product-set-detail')) {
                        setPids.push({
                            pid: $(this).find('.product-id').text(),
                            qty: $(this).find('.quantity-select').val(),
                            options: baseBase.getOptions($(this))
                        });
                    }
                });
                pidsObj = JSON.stringify(setPids);
            }

            pid = baseBase.getPidValue($(this));

            var $productContainer = $(this).closest('.product-detail');
            if (!$productContainer.length) {
                $productContainer = $(this).closest('.quick-view-dialog').find('.product-detail');
            }

            addToCartUrl = baseBase.getAddToCartUrl();

            var form = {
                pid: pid,
                pidsObj: pidsObj,
                childProducts: baseBase.getChildProducts(),
                quantity: baseBase.getQuantitySelected($(this))
            };

            if (!$('.bundle-item').length) {
                form.options = baseBase.getOptions($productContainer);
            }

            $(this).trigger('updateAddToCartFormData', form);
            if (addToCartUrl) {
                $.ajax({
                    url: addToCartUrl,
                    method: 'POST',
                    data: form,
                    success: function (data) {
                        baseBase.handlePostCartAdd(data);
                        $('body').trigger('product:afterAddToCart', data);
                        $.spinner().stop();
                        baseBase.miniCartReportingUrl(data.reportingURL);
                    },
                    error: function () {
                        $.spinner().stop();
                    }
                });
            }
        });
    },
   
    baseBase.miniCartReportingUrl = function(url) {
        if (url) {
            $.ajax({
                url: url,
                method: 'GET',
                success: function () {
                    // reporting urls hit on the server
                },
                error: function () {
                    // no reporting urls hit on the server
                }
            });
        }
    }

    baseBase.handlePostCartAdd = function(response) {
        $('.minicart').trigger('count:update', response);
        var messageType = response.error ? 'alert-danger' : 'alert-success';
        // show add to cart toast
        if (response.newBonusDiscountLineItem
            && Object.keys(response.newBonusDiscountLineItem).length !== 0) {
            chooseBonusProducts(response.newBonusDiscountLineItem);
        } else {
            if ($('.add-to-cart-messages').length === 0) {
                $('body').append(
                    '<div class="add-to-cart-messages"></div>'
                );
            }
    
            $('.add-to-cart-messages').append(
                '<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">'
                + response.message
                + '</div>'
            );
    
            setTimeout(function () {
                $('.add-to-basket-alert').remove();
            }, 5000);
        }
    }

module.exports = baseBase;
