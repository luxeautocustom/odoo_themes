odoo.define('theme_laze.snippet_builder',function(require) {
'use strict';

var core = require('web.core');
var QWeb = core.qweb;
var options = require('web_editor.snippets.options');
var Dialog = require('web.Dialog');
var _t = core._t;

options.registry['js_laze_snippet_builder'] = options.Class.extend({
    xmlDependencies: ['/theme_laze/static/src/xml/snippets/laze_snippet_builder/laze_snippet_builder.xml' ],
    events:{ 'click':'_changeCollection' },

    _changeCollection:function(){
        this.select_snippet('click','true');
    },
    select_snippet: function(type, value) {
        var self = this;
        this.id = this.$target.attr('id');
        if(type == false || type == 'click'){
            var dialog = new Dialog(self, {
                size: 'extra-large',
                title: 'Laze Snippet Builder',
                $content: QWeb.render('theme_laze.builder_block'),
                buttons: [{text: _t('Save'), classes: 'btn-primary', close: true, click: function () {
                    var snippet = $("input[name='radio-snippet']:checked").closest('.snippet-as').find('textarea').val();
                    self.$target.empty().append(snippet);
                    var model = self.$target.parent().attr('data-oe-model');
                    if(model){
                        self.$target.parent().addClass('o_editable o_dirty');
                    }
                }}, {text: _t('Discard'), close: true}],
            });
            dialog.open();
            return self;
        }
    },
    onBuilt: function () {
        this._super();
        this.select_snippet('click', 'true');
    },
});

$(document).on('click', '.edit-snippet-builder-box .e-sb-tab label', function(){
    $('.edit-snippet-builder-box .e-sb-tab label').removeClass('e-sb-active');
    $(this).addClass('e-sb-active');
    var tagid = $(this).data('tag');
    $('.e-sb-tab--content').removeClass('active').addClass('d-none');
    $('#'+tagid).addClass('active').removeClass('d-none');
});

});