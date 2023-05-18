odoo.define('theme_laze.s_brand_slider',function(require){
'use strict';

var ajax = require('web.ajax');
var sAnimation = require('website.content.snippets.animation');
const { AjaxAddToCart }  = require('theme_laze.core_mixins');
const wSaleUtils = require('website_sale.utils');
const NavCartUpdate = wSaleUtils.updateCartNavBar;
const cloneAnimation = wSaleUtils.animateClone;

sAnimation.registry.AsBrandSlider = sAnimation.Class.extend(AjaxAddToCart, {
    selector: '.as_brand_slider',
    disabledInEditableMode: false,

    start: function (editable_mode) {
        var cr = this;
        if (cr.editableMode){
            cr.$target.empty().append('<div class="container"><div class="seaction-head"><h3>Brand Snippet</h3></div></div>');
        }
        if (!cr.editableMode) {
            this.getBrandData();
        }
    },
    getBrandData: function() {
        var cr = this;
        cr.$target.addClass("as-dynamic-loading");
        ajax.jsonRpc('/get/get_cat_brand_slider_content', 'call', {
            'brand_ids': cr.$target.attr('data-brand-ids'),
            'snippet_type': cr.$target.attr('data-snippet-type'),
            'tabOption': cr.$target.attr('data-tabOption'),
            'mainUI': cr.$target.attr('data-mainUI'),
            'styleUI': cr.$target.attr('data-styleUI'),
            'dataCount': cr.$target.attr('data-dataCount'),
            'recordLink': cr.$target.attr('data-recordLink'),
            'recordName': cr.$target.attr('data-recordName'),
            'autoSlider': cr.$target.attr('data-autoSlider'),
            'sTimer': cr.$target.attr('data-sTimer'),
            'buyNow': cr.$target.attr('data-buyNow'),
            'cart': cr.$target.attr('data-cart'),
            'quickView': cr.$target.attr('data-quickView'),
            'compare': cr.$target.attr('data-compare'),
            'wishList': cr.$target.attr('data-wishList'),
            'prodLabel': cr.$target.attr('data-prodLabel'),
            'rating': cr.$target.attr('data-rating'),
            'infinity': cr.$target.attr('data-infinity'),
        }).then(function(data) {
            cr.$target.removeClass("as-dynamic-loading").empty().append(data.slider);
            var stimer = data.sTimer;
            var ui = data.mainUI;
            var sliderData = { spaceBetween: 15, slidesPerView: 2,
                navigation: {
                  nextEl: ".as-swiper-button-next",
                  prevEl: ".as-swiper-button-prev",
                },
                breakpoints: {
                    640: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                    1200: {
                      slidesPerView: data.dataCount,
                    },
                },
            }
            if (data.autoSlider) {
                sliderData['autoplay'] = { delay: stimer, disableOnInteraction: false }
            }
            if (data.infinity) {
                sliderData['loop'] = true
            }
            cr.get_slider_data(sliderData);
        });
    },

    get_slider_data: function(data){
        var $slider = this.$target.find(".as-Swiper");
        $slider.attr("id","cr-swiper")
        var swiper = new Swiper("#cr-swiper", data);
        $slider.removeAttr("id");
    },

});
});
