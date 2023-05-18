odoo.define('theme_laze.recordSelector', function (require) {
'use strict';

const webWidgets = require('web_editor.widget');
const webUtils = require('web.utils');
const webCore = require('web.core');
const recordSelector = webWidgets.Dialog;
const _t = webCore._t;

const { FetchProductsData,FetchCategoryData, FetchBlogData, BaseLazeQweb, FetchBrandData} = require("theme_laze.core_mixins")

let BaseRecordSelector = recordSelector.extend(FetchProductsData, FetchBlogData, FetchCategoryData,BaseLazeQweb,FetchBrandData, {
    template: 'theme_laze.record_selector_dialog',
    xmlDependencies: recordSelector.prototype.xmlDependencies.concat([
        '/theme_laze/static/src/xml/selector_dialog.xml',
        '/theme_laze/static/src/xml/record_list_view.xml',
        '/theme_laze/static/src/xml/dropdown_template.xml',
    ]),
    events: _.extend({}, recordSelector.prototype.events , {
        'click .as-save-dialog': '_onSavebtn',
        'click .as-close-dialog': 'close',
    }),
    init:function (src, opts){
        let cr = this;
        cr._super(src, _.extend({
            dialogClass: 'as-core-selector-modal',
            fieldLabel: opts.fieldLabel || _t("Configuration"),
            coreTitle: opts.coreTitle || _t("Select"),
            dialogClass: 'as-edit-selector-modal',
            renderHeader: 0,
            renderFooter: 0,
            multiSelect:opts.multiSelect || false,
            miniLenght:opts.miniLenght || 1,
            isMultiSelect:opts.isMultiSelect || false,
            maxSelectSize:opts.maxSelectSize || 100,
            initIds:opts.initIds || "",
            searchType:opts.searchType || false,
            route:opts.route,
            initData:opts.initData || false,
            parentDomain:opts.parentDomain || false,
            extraData:opts.extraData || false,
            customTemplate:opts.customTemplate
        }));
        cr.opts = opts;
        cr.src = src;
    },
    start: function () {
        let cr = this;
        return cr._super.apply(cr, arguments).then(() => {
            cr.$inField = cr.$el.find("#as-select2-field");
            cr.$inField.select2({
                width: "100%",
                tokenSeparators:[","],
                minimumInputLength: cr.opts.miniLenght,
                multiple: cr.opts.isMultiSelect,
                maximumSelectionSize: cr.opts.maxSelectSize,
                dropdownCssClass: 'as-custom-select2-dropdown',
                initSelection: function (ele, cbf) {
                    cbf(cr.opts.initData);
                },
                ajax: {
                    url: cr.opts.route,
                    quietMillis: 600,
                    dataType: 'json',
                    data: function (searchTerm) {
                        let context = { searchTerm:searchTerm,
                        searchType:cr.opts.searchType,
                        parentDomain:cr.opts.parentDomain }
                        return _.extend(context);
                    },
                    results: function (rec) {
                        return {
                            results: cr._procedureData(rec)
                        };
                    },
                },
                formatResult: function (res) {
                    return cr._baseLazeQweb(cr.opts.customTemplate,res);
                },
            });
            cr.$inField.select2('container').find('ul.select2-choices').sortable({
                containment: 'parent',
                update: function () { cr.$inField.select2('onSortEnd'); }
            });
        });
    },
    _procedureData: function (rec) {
        rec.forEach(ele => { ele['text'] = ele['name'] });
        return rec;
    },
    _onSavebtn: function (ev) {
        let cr = this;
        let s_vals = cr.$inField.val();
        var $mainDataDiv = cr.src.$el.find(".as-product-select-list-view");
        if(cr.opts.searchType == "Product" || cr.opts.searchType == "CategProd"){
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchProductRawData(s_vals,"product.template").then((rec) =>{
                    rec.forEach(ele => { ele['price'] = webUtils.Markup(ele['price']) })
                    const ProdTemp = cr._baseLazeQweb("theme_laze.dialog_product_list_view", rec);
                    $mainDataDiv.empty().append(ProdTemp);
                    $mainDataDiv.find(".as-sort-data").sortable()
                    cr.close();
                });
            }else{
                $mainDataDiv.empty();
                cr.close()
            }
        }
        else if(cr.opts.searchType == "ProdOffer"){
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchProductRawData(s_vals,"product.template").then((rec) =>{
                    rec.forEach(ele => { 
                        ele['price'] = webUtils.Markup(ele['price']);
                        cr.opts.extraData.forEach(subEle => {
                            if(ele['id'] == subEle['id']){
                                if(subEle['timeData'] != undefined){
                                    ele['timeData'] = JSON.stringify(subEle['timeData']);
                                }
                            }
                        })
                    })
                    const ProdTemp = cr._baseLazeQweb("theme_laze.dialog_prodOffer_list_view", rec);
                    $mainDataDiv.empty().append(ProdTemp);
                    $mainDataDiv.find(".as-sort-data").sortable()
                    cr.close();
                });
            }else{
                $mainDataDiv.empty();
                cr.close()
            }
        }
        else if(cr.opts.searchType == "Category"){
            var $mainDataDiv = cr.src.$el.find(".as-category-select-list-view");
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchCategoryRawData(s_vals).then((rec) =>{
                    rec.forEach(mainEle => {
                        cr.opts.extraData.forEach(subEle => {
                            if(mainEle['id'] == subEle['id']){
                                if(subEle['subCatData'] != undefined){
                                    mainEle['subCatData'] = JSON.stringify(subEle['subCatData']);
                                    mainEle['subCatIds'] =  JSON.stringify(subEle['subCatIds']);
                                }
                            }
                        });
                    });
                    const catTemp = cr._baseLazeQweb("theme_laze.dialog_cat_list_view",rec);
                    $mainDataDiv.empty().append(catTemp);
                    $mainDataDiv.find(".as-sort-data").sortable()
                    cr.close();
                });
            }else{
                $mainDataDiv.empty();
                cr.close()
            }
        }else if(cr.opts.searchType == "SubCategoryLevel1"){
            let $mainDataDiv = cr.src.$el.find(".as-category-select-list-view");
            let searchContex = '.as-record-card-view[data-cat-id=' + cr.opts.parentDomain + ']';
            let $getParentDiv = $mainDataDiv.find(searchContex);
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchCategoryRawData(s_vals).then((rec) =>{
                    let clean_data = []
                    let clean_ids = []
                    rec.forEach(ele => {
                        ele['price'] = webUtils.Markup(ele['price'])
                        let data = {"id":ele["id"], "text":ele["name"]};
                        clean_data.push(data);
                        clean_ids.push(ele["id"]);
                    })


                    let $getParentDiv = $mainDataDiv.find(searchContex);
                    $getParentDiv.attr("data-sub-cat-data",JSON.stringify(clean_data));
                    $getParentDiv.attr("data-sub-cat-ids",JSON.stringify(clean_ids));
                    cr.close();
                });
            }else{
                $getParentDiv.removeAttr("data-sub-cat-data");
                $getParentDiv.removeAttr("data-sub-cat-ids");
                cr.close()
            }
        }else if(cr.opts.searchType == "BrandMix"){
            var $mainDataDiv = cr.src.$el.find(".as-brand-select-list-view");
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchBrandRawData(s_vals).then((rec) =>{
                    const BrandTemp = cr._baseLazeQweb("theme_laze.dialog_brand_list_view", rec);
                    $mainDataDiv.empty().append(BrandTemp);
                    $mainDataDiv.find(".as-sort-data").sortable();
                    cr.close();
                });
            }else{
                $mainDataDiv.empty();
                cr.close();
            }
        }else if(cr.opts.searchType == "CatMix"){
            var $mainDataDiv = cr.src.$el.find(".as-cat-select-list-view");
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchCategoryRawData(s_vals).then((rec) =>{
                    const CatTemp = cr._baseLazeQweb("theme_laze.dialog_categ_list_view", rec);
                    $mainDataDiv.empty().append(CatTemp);
                    $mainDataDiv.find(".as-sort-data").sortable();
                    cr.close();
                });
            }else{
                $mainDataDiv.empty();
                cr.close();
            }
        }else if(cr.opts.searchType == "ImageHotspot"){
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchProductRawData(s_vals,"product.template").then((rec) =>{
                    cr.src.$target.attr('data-product-id',rec[0]['id']);
                    cr.src.$target.attr('data-product_name',rec[0]['name']);

                    cr.close();
                });

            }
        }else if(cr.opts.searchType == "Blogs"){
            var $mainDataDiv = cr.src.$el.find(".as-blog-select-list-view");
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchBlogRawData(s_vals).then((rec) =>{
                    const BlogTemp = cr._baseLazeQweb("theme_laze.dialog_blog_list_view", rec);
                    $mainDataDiv.empty().append(BlogTemp);
                    $mainDataDiv.find(".as-sort-data").sortable();
                    cr.close();
                });
            }else{
                $mainDataDiv.empty();
                cr.close();
            }
        }else if(cr.opts.searchType == "CatProds"){
            var $mainDataDiv = cr.src.$el.find(".as-cat-select-list-view");
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchCategoryRawData(s_vals).then((rec) =>{
                    const CatTemp = cr._baseLazeQweb("theme_laze.dialog_catProd_list_view", rec);
                    $mainDataDiv.empty().append(CatTemp);
                    $mainDataDiv.find(".as-sort-data").sortable();
                    cr.close();
                    var catBtn = cr.src.$el.find("#add-btn-cat");
                    catBtn.remove();
                    var alertMsg = cr.src.$el.find(".alertMsg");
                    alertMsg.removeClass('d-none');
                });
            }else{
                $mainDataDiv.empty();
                cr.close();
            }
        }else if(cr.opts.searchType == "CatGrid"){
            var $mainDataDiv = cr.src.$el.find(".as-cat-grid-select-list-view");
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchCategoryRawData(s_vals).then((rec) =>{
                    rec.forEach(mainEle => {
                        cr.opts.extraData.forEach(subEle => {
                            if(mainEle['id'] == subEle['id']){
                                if(subEle['prodData'] != undefined){
                                    mainEle['prodData'] = JSON.stringify(subEle['prodData']);
                                    mainEle['prodIds'] =  JSON.stringify(subEle['prodIds']);
                                }
                            }
                        });
                    });
                    const catTemp = cr._baseLazeQweb("theme_laze.dialog_catGrid_list_view",rec);
                    $mainDataDiv.empty().append(catTemp);
                    $mainDataDiv.find(".as-sort-data").sortable();
                    cr.close();
                });
            }else{
                $mainDataDiv.empty();
                cr.close()
            }
        }else if(cr.opts.searchType == "CatProdGrid"){
            let $mainDataDiv = cr.src.$el.find(".as-cat-grid-select-list-view");
            let searchContex = '.as-record-card-view[data-cat-id=' + cr.opts.parentDomain + ']';
            let $getParentDiv = $mainDataDiv.find(searchContex);
            if(s_vals != undefined && s_vals != ""){
                s_vals = s_vals.split(",");
                cr._fetchProductRawData(s_vals,"product.template").then((rec) =>{
                    let clean_data = []
                    let clean_ids = []
                    rec.forEach(ele => {
                        ele['price'] = webUtils.Markup(ele['price'])
                        let data = {"id":ele["id"], "text":ele["name"]};
                        clean_data.push(data);
                        clean_ids.push(ele["id"]);
                    })


                    let $getParentDiv = $mainDataDiv.find(searchContex);
                    $getParentDiv.attr("data-prod-data",JSON.stringify(clean_data));
                    $getParentDiv.attr("data-prod-ids",JSON.stringify(clean_ids));
                    cr.close();
                });
            }else{
                $getParentDiv.removeAttr("data-prod-data");
                $getParentDiv.removeAttr("data-prod-ids");
                cr.close()
            }
        }
    },
});
return BaseRecordSelector;
});
