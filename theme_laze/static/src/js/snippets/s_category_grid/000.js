odoo.define('theme_laze.s_cat_grid',function(require){
'use strict';

var ajax = require('web.ajax');
var sAnimation = require('website.content.snippets.animation');
const wSaleUtils = require('website_sale.utils');
const { AjaxAddToCart }  = require('theme_laze.core_mixins');
const NavCartUpdate = wSaleUtils.updateCartNavBar;
const cloneAnimation = wSaleUtils.animateClone;

sAnimation.registry.AsCategGrid = sAnimation.Class.extend(AjaxAddToCart, {
    selector: '.as_categ_grid',
    disabledInEditableMode: false,
    'events':{
        'click a.addToCart':'_prodAddToCart',
    },
    start: function (editable_mode) {
        var cr = this;
        if (cr.editableMode){
            cr.$target.empty().append('<div class="container"><div class="seaction-head"><h3>Category Grid Snippet</h3></div></div>');
        }
        if (!cr.editableMode) {
            this.getCatGridData();
        }
    },
    getCatGridData: function() {
        var cr = this;
        cr.$target.addClass("as-dynamic-loading");
        ajax.jsonRpc('/get/get_cat_grid_content', 'call', {
            'cat_ids': cr.$target.attr('data-cat-ids'),
            'prod_ids': cr.$target.attr('data-prod-ids'),
            'snippet_type': cr.$target.attr('data-snippet-type'),
            'styleUI': cr.$target.attr('data-styleUI'),
            'dataCount': cr.$target.attr('data-dataCount'),
        }).then(function(data) {
            cr.$target.removeClass("as-dynamic-loading").empty().append(data.grid);
        });
    },

    _prodAddToCart: function(ev){
        var product_id = parseInt($(ev.currentTarget).attr('data-product-product-id'));
        this._lazeAddToCart({"product_id" : product_id, "add_qty":1}).then(data =>{
            cloneAnimation($('header .o_wsale_my_cart').first(), this.$(ev.currentTarget).closest('form').find('.as-product-img'), 25, 40);
            NavCartUpdate(data);
        })
    },
});
});
