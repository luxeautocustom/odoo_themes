odoo.define('theme_laze.s_product_slider_options', function (require) {
"use strict";

const options = require('web_editor.snippets.options');
const { BaseLazeQweb } = require("theme_laze.core_mixins");
const productDialog = require('theme_laze.productDialog');
const webUtils = require('web.utils');

options.registry.AsProductSlider= options.Class.extend(BaseLazeQweb, {
    xmlDependencies: [ '/theme_laze/static/src/xml/snippets/product_dialog.xml',
                       '/theme_laze/static/src/xml/snippets/base_templates.xml' ],
    events:{'click .set-prod-config':'_product_configure' },
    init: function(){
        this._super.apply(this, arguments);
    },
    onBuilt: function(){
        this._super();
        this._product_configure();
    },
    _product_configure: function(){
        let cr = this;
        const prodData = {
            size:"large",
            subTemplate: webUtils.Markup($(cr._baseLazeQweb("theme_laze.dialog_product_modal", {'type': 'product'})).html()),
            fullSubTemplate:1,
            enableCoreButton:0,
            enableCoreTitle:0,
            initRecords:cr.$target.attr("data-prod-ids"),
            mainUI:cr.$target.attr("data-mainUI"),
            styleUI:cr.$target.attr("data-styleUI"),
            autoSlider:cr.$target.attr("data-autoSlider"),
            dataCount:cr.$target.attr("data-dataCount"),
            sTimer:cr.$target.attr("data-sTimer"),
            cart:cr.$target.attr("data-cart"),
            quickView:cr.$target.attr("data-quickView"),
            compare:cr.$target.attr("data-compare"),
            wishList:cr.$target.attr("data-wishList"),
            prodLabel:cr.$target.attr("data-prodLabel"),
            rating:cr.$target.attr("data-rating"),
            infinity:cr.$target.attr("data-infinity"),
            popupType:"Product",
        }
        cr.productDialog = new productDialog(cr, prodData);
        cr.productDialog.open();
    },
    cleanForSave: function(){
        this.$target.empty();
    },
});
});