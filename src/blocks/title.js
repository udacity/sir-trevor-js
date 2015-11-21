"use strict";

/*
  Concept level Title Block - only allow one per concept array
*/

var Block = require('../block');
var stToHTML = require('../to-html');

module.exports = Block.extend({

  type: 'title',

  title: function(){ return i18n.t('blocks:title:title'); },

  editorHTML: '<h2 class="st-required st-text-block st-text-block--heading" contenteditable="true"></h2>',

  scribeOptions: { 
    allowBlockElements: false,
    tags: {
      p: false
    }
  },

  icon_name: 'heading',

  loadData: function(data){
    if (this.options.convertFromMarkdown && data.format !== "html") {
      this.setTextBlockHTML(stToHTML(data.text, this.type));
    } else {
      this.setTextBlockHTML(data.text);
    }
  }
});
