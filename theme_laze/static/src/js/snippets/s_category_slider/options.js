odoo.define('theme_laze.s_cat_slider_options', function (require) {
"use strict";

const options = require('web_editor.snippets.options');
const { BaseLazeQweb } = require("theme_laze.core_mixins");
const brandCatDialog = require('theme_laze.brandCatDialog');
const webUtils = require('web.utils');

options.registry.AsCategorySlider= options.Class.extend(BaseLazeQweb, {
    xmlDependencies: [ '/theme_laze/static/src/xml/snippets/cat_brand_dialog.xml',
                       '/theme_laze/static/src/xml/snippets/base_templates.xml' ],
    events:{'click .set-cat-config':'_cat_configure' },
    init: function(){
        this._super.apply(this, arguments);
    },
    onBuilt: function(){
        this._super();
        this._cat_configure('click');
    },
    _cat_configure: function(){
        let cr = this;
        const catData = {
            size:"large",
            subTemplate:webUtils.Markup($(cr._baseLazeQweb("theme_laze.dialog_cat_modal", {'type': 'category'})).html()),
            fullSubTemplate:1,
            enableCoreButton:0,
            enableCoreTitle:0,
            initRecords:cr.$target.attr("data-cat-ids"),
            mainUI:cr.$target.attr("data-mainUI"),
            styleUI:cr.$target.attr("data-styleUI"),
            recordLink:cr.$target.attr("data-recordLink"),
            autoSlider:cr.$target.attr("data-autoSlider"),
            dataCount:cr.$target.attr("data-dataCount"),
            sTimer:cr.$target.attr("data-sTimer"),
            popupType:"Category",
        }
        cr.brandCatDialog = new brandCatDialog(cr, catData);
        cr.brandCatDialog.open();
    },
    cleanForSave: function(){
        this.$target.empty();
    },
});
});