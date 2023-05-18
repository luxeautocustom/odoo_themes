odoo.define('theme_laze.s_blog_slider',function(require){
'use strict';

var ajax = require('web.ajax');
var sAnimation = require('website.content.snippets.animation');

sAnimation.registry.AsBlogSlider = sAnimation.Class.extend({
    selector: '.as_blog_slider',
    disabledInEditableMode: false,

    start: function (editable_mode) {
        var cr = this;
        if (cr.editableMode){
            cr.$target.empty().append('<div class="container"><div class="seaction-head"><h3>Blog Snippet</h3></div></div>');
        }
        if (!cr.editableMode) {
            this.getBlogData();
        }
    },
    getBlogData: function() {
        var cr = this;
        cr.$target.addClass("as-dynamic-loading");
        ajax.jsonRpc('/get/get_cat_brand_slider_content', 'call', {
            'blog_ids': cr.$target.attr('data-blog-ids'),
            'snippet_type': cr.$target.attr('data-snippet-type'),
            'mainUI': cr.$target.attr('data-mainUI'),
            'styleUI': cr.$target.attr('data-styleUI'),
            'dataCount': cr.$target.attr('data-dataCount'),
            'autoSlider': cr.$target.attr('data-autoSlider'),
            'sTimer': cr.$target.attr('data-sTimer'),
            'infinity': cr.$target.attr('data-infinity'),
        }).then(function(data) {
            cr.$target.removeClass("as-dynamic-loading").empty().append(data.slider);
            var stimer = data.sTimer;
            var ui = data.mainUI;
            var sliderData = { spaceBetween: 15, slidesPerView: 1,
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
