odoo.define('theme_laze.quick_product_load', function (require) {
"use strict";

var publicWidget = require("web.public.widget");
var url = window.location.href;
var call = false;

publicWidget.registry.ajaxProductLoadAuto = publicWidget.Widget.extend({
    selector:'div#wrapwrap',
    events:{
        'scroll':'_autoLoadShopProduct'
    },
    _autoLoadShopProduct:function(){
        if($('.as_load_product').offset() != undefined){
            var gettop = $('.as_load_product').offset().top;
            var getheight = $('.as_load_product').outerHeight();
            var getwindowheight = $(window).height();
            var nxtbtnpos = gettop+getheight-getwindowheight;
            if (nxtbtnpos < 30){
                if(call != true){
                    $('.as_load_product').click();
                    call = true;
                }
            }else{
                call = false;
            }
        }
    }
});

publicWidget.registry.laze_quick_product_load = publicWidget.Widget.extend({
    "selector": ".as_load_product",
    events : {
        "click": "_loadProduct"
    },
    _loadProduct:function(ev){
        var cr = this;
        var page = 1 +  parseInt(this.$el.attr("page"));
        var path = $($(".products_pager").find("li")[page]).find("a").attr("href");
        var actionUrl = window.location.origin + path;
        var $product_tbody = $(".o_wsale_products_grid_table_wrapper").find("tbody");
        $(".o_wsale_products_grid_table_wrapper").find(".load_next_product").remove();;
        var $product_pager = $(".products_pager");
        $.ajax({
            url: actionUrl,
            type: 'GET',
            success: function (response) {
                var products = $(response).find(".o_wsale_products_grid_table_wrapper").find("tbody").html();
                var pager = $(response).find(".products_pager").html();
                $product_tbody.append(products)
                $($product_pager).empty().append(pager);
                cr.trigger_up('widgets_start_request', {
                    $target: $('.as-shop'),
                });
                cr.trigger_up('widgets_start_request', {
                    $target: $('.as_load_product'),
                });
            }
        });
        var maxpage = cr.$el.attr("max_page");
        cr.$el.attr("page",page);
        if(page == maxpage){cr.$el.remove();}
        var checkurl = url.split("/");
        var checkattrurl = url.split("=");
        var url_have_page = false;
        if(checkattrurl.length > 1){
            var spliturl = url.split("?");
            var checksuburl = spliturl[0].split("/");
            for (let index = 0; index < checksuburl.length; index++){
                if(checksuburl[index] == "page"){
                    url_have_page = true;
                }
            }
            if(url_have_page != true){
                var new_url =  checksuburl.join("/") + "/page/" + page + "?" +spliturl[1];
            }else{
                checksuburl.pop();
                checksuburl.push(page);
                var new_url = checksuburl.join("/") + "?" +spliturl[1];
            }
        }else{
            for (let index = 0; index < checkurl.length; index++) {
                if(checkurl[index] == "page"){
                    url_have_page = true;
                }
            }
            if(url_have_page != true){
                var new_url = url + "/page/" + page;
            }else{
                checkurl.pop();
                checkurl.push(page);
                var new_url = checkurl.join("/");
                }
            }
        window.history.pushState("data","Title",new_url);
    },
});
});