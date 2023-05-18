odoo.define('theme_laze.s_offer_banner',function(require) {
'use strict';

const options = require('web_editor.snippets.options');
const { BaseLazeQweb } = require("theme_laze.core_mixins");
const webUtils = require('web.utils');
const offerBannerDialog = require('theme_laze.productDialog');

options.registry.AsOfferBanner= options.Class.extend(BaseLazeQweb, {
    xmlDependencies: [ '/theme_laze/static/src/xml/snippets/product_offer_dialog.xml' ],
    events:{'click .set-latest-prod-config':'_offer_banner_configure' },
    init: function(){
        this._super.apply(this, arguments);
    },
    onBuilt: function(){
        this._super();
        this._offer_banner_configure();
    },
    _offer_banner_configure: function(){
        let cr = this;
        const prodOfferData = {
            size:"large",
            subTemplate:webUtils.Markup($(cr._baseLazeQweb("theme_laze.dialog_offer_banner_modal")).html()),
            fullSubTemplate:1,
            enableCoreButton:0,
            enableCoreTitle:0,
            offerTime:cr.$target.attr("data-offerTime"),
            popupType:"Offer Banner",
        }
        cr.offerBannerDialog = new offerBannerDialog(cr, prodOfferData);
        cr.offerBannerDialog.open();
    },
    cleanForSave: function () {
        this.$target.addClass("d-none");
        this.$target.find(".offer_timer_section").empty();
    },

});

});