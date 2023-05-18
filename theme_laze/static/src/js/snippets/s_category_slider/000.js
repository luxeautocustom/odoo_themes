odoo.define('theme_laze.s_cat_slider',function(require){
'use strict';

var ajax = require('web.ajax');
var sAnimation = require('website.content.snippets.animation');

sAnimation.registry.AsCategorySlider = sAnimation.Class.extend({
    selector: '.as_cat_slider',
    disabledInEditableMode: false,
    start: function (editable_mode) {
        var cr = this;
        if (cr.editableMode){
            cr.$target.empty().append('<div class="container"><div class="seaction-head"><h3>Category Snippet</h3></div></div>');
        }
        if (!cr.editableMode) {
            this.getCatData();
        }
    },
    getCatData: function() {
        var cr = this;
        cr.$target.addClass("as-dynamic-loaCategory JSding");
        ajax.jsonRpc('/get/get_cat_brand_slider_content', 'call', {
            'cat_ids': cr.$target.attr('data-cat-ids'),
            'snippet_type': cr.$target.attr('data-snippet-type'),
            'mainUI': cr.$target.attr('data-mainUI'),
            'tabOption': cr.$target.attr('data-tabOption'),
            'styleUI': cr.$target.attr('data-styleUI'),
            'dataCount': cr.$target.attr('data-dataCount'),
            'recordLink': cr.$target.attr('data-recordLink'),
            'autoSlider': cr.$target.attr('data-autoSlider'),
            'sTimer': cr.$target.attr('data-sTimer'),
            'infinity': cr.$target.attr('data-infinity'),
        }).then(function(data) {
            cr.$target.removeClass("as-dynamic-loading").empty().append(data.slider);
            var styleUI = data.styleUI;
            var count = data.dataCount;
            var ui = data.mainUI;
            var stimer = data.sTimer;
            if (styleUI == 'style1') {
                var sliderData = { 
                    spaceBetween: 15, 
                    slidesPerView: 1,
                    centeredSlides: true,
                    loop: true,
                    navigation: {
                      nextEl: ".as-swiper-button-next",
                      prevEl: ".as-swiper-button-prev",
                    },
                    breakpoints: {
                        640: {
                          slidesPerView: 1,
                        },
                        768: {
                          slidesPerView: 2,
                        }
                    },
                }
            } else if (styleUI == 'style2') {
                var sliderData = { 
                    spaceBetween: 15, 
                    slidesPerView: 1,
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
                        }
                    },
                }
            } else {
                var sliderData = { 
                    spaceBetween: 0, 
                    slidesPerView: 2,
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
                          slidesPerView: 5,
                        },
                    },
                }
            }
            if (data.autoSlider) {
                sliderData.autoplay = {
                  delay: stimer,
                  disableOnInteraction: false,
                }
            }
            if (data.infinity) {
                sliderData['loop'] = true
            }
            cr.initializeSwiper(sliderData);        
        });
    },
    initializeSwiper: function(data){
        var $slider = this.$target.find(".as-Swiper");
        $slider.attr("id","cr-swiper");
        var swiper = new Swiper("#cr-swiper", data);
        $slider.removeAttr("id");
    },
});
});
