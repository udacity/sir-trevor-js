"use strict";

var Block = require('../block');
var _ = require('../lodash');
var marked = require('marked');
var hljs = require('highlight.js');
var $ = require('jquery');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

var md_template = _.template([
  '<div class="expanding-textarea">',
    '<div class="st-markdown__display"></div>',
    '<textarea class="st-markdown" name="md" contenteditable="true"></textarea>',
  '</div>'
].join("\n"));

module.exports = Block.extend({

  type: "markdown",
  title: function() { return i18n.t('blocks:markdown:title'); },
  icon_name: 'competition',
  formattable: true,

  editorHTML: function() {
    return md_template(this);
  },

  loadData: function(data){
    this.$el.find('.st-markdown__display');
  },

  onBlockRender: function() {
    /* Make our expanding text area */
    var cont = this.$('.expanding-textarea'),
        area = cont.find('.st-markdown'),
        span = cont.find('.st-markdown__display');

    area.bind('input', function() {
      span.html(marked(area.val()));
    });

    cont.addClass('active');
    this.toData();
  },

  toData: function() {
    var dataObj = {};
    var content = this.$('.st-markdown__display');
    dataObj.text = content;
    this.setData(dataObj);
  }
});
