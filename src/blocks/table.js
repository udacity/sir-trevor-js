/*
  Simple Table
  Source: https://github.com/jbaiter/sir-trevor-js/blob/d04c6c93e6402b8b6763ce244d2bfa2b9e04925c/src/blocks/table.js
*/

var Block = require('../block');
var stToHTML = require('../to-html');
var _ = require('../lodash');

var template =  '<div><table id="tbl">' +
                  '<thead>' +
                  '<tr>' +
                    '<th contenteditable="true"></th>' +
                  '</tr></thead>' +
                  '<tbody>' +
                    '<tr>' +
                      '<td contenteditable="true"></td>' +
                    '</tr>' +
                  '</tbody>' +
                '</table></div>';

var addCell = function(row, cellTag) {
  var tag_template = _.template("<<%= tag %>>")
  if (cellTag === undefined) {
    cellTag = tag_template(
      { tag: $(row).children().first().prop('tagName').toLowerCase() }
    );
  }
  $(row).append($(cellTag, {contenteditable: true}));
};

var addColumnHandler = function(ev) {
  ev.preventDefault();
  this.$('#tbl').find('tr').each(function () { addCell(this); });
};

var deleteColumnHandler = function(ev) {
  ev.preventDefault();
  this.$('#tbl').find('tr').each(function () {
    if ($(this).children().length > 1) {
        $(this).children().last().remove();
    }
  });
};

var addRowHandler = function(ev) {
  var row = $("<tr>");
  ev.preventDefault();
  this.$('#tbl').find('th').each(function () {
      addCell(row, "<td>");
  });
  this.$('#tbl').find('tbody').append(row);
};

var deleteRowHandler = function(ev) {
  ev.preventDefault();
  if (this.$('#tbl').find('tbody tr').length > 1) {
    this.$('#tbl').find('tbody tr:last').remove();
  }
};


module.exports = Block.extend({

  type: 'table',

  icon_name: 'text',

  title: function() { return i18n.t('blocks:table:title'); },

  controllable: true,
  controls: {
    'addrow': addRowHandler,
    'delrow': deleteRowHandler,
    'addcol': addColumnHandler,
    'delcol': deleteColumnHandler
  },

  editorHTML: function() {
    // var editor_template = '<div class="st-text-block">' + template + '</div>';
    return _.template(template, this);
  },

  onBlockRender: function() {
    var table = this.$('#tbl');
    console.log('table>>>>>>>>>>>>>>', table);

    // table.addClass('active');
    this.toData()


  },

  loadData: function(data){
    this.$('table').html(SirTrevor.toHTML(data.text, this.type));
  },

  toData: function() {
    var dataObj = {};
    var content = this.$('#tbl').text();
    dataObj.text = content;
    this.setData(dataObj);
  },

  toMarkdown: function(html) {
    function rowToMarkdown(row) {
      var cells = $(row).children(),
          md = cells.map(function() { return $(this).text(); })
              .get().join(" | ");
      if (cells[0].tagName === 'TH') {
        md += "\n";
        md += cells.map(function() { return "---"; }).get().join(" | ");
      }
      return md;
    }

    var markdown = $(html).find('tr').map(function(){
      return rowToMarkdown(this);
    }).get().join("\n");
    if ($(html).find('caption').text() != "") {
      markdown += "\n[" + $(html).find('caption').text() + "]";
    }
    return markdown;
  },

  toHTML: function(markdown) {
    var html = $('<table><thead><tr></tr></thead><tbody></tbody></table>'),
        lines = markdown.split("\n"),
        caption_re = /\[(.*)\]/,
        lastline;
    // Check for caption
    lastline = lines[lines.length-1];
    if (lastline.match(caption_re)) {
      html.find('caption').text(lastline.match(caption_re)[1]);
      lines = lines.slice(0, lines.length-1);
    }
    // Add header row
    _.each(lines[0].split(" | "), function(content) {
      html.find('thead tr').append('<th contenteditable>' + content + '</th>');
    });
    // Add remaining rows
    _.each(lines.slice(2, lines.length), function(line) {
      var row = $('<tr>');
      _.each(line.split(" | "), function(content) {
        row.append('<td contenteditable>' + content + '</th>');
      });
      html.find('tbody').append(row);
    });
    return html[0].outerHTML;
  },

  isEmpty: function() {
    return _.isEmpty(this.saveAndGetData().text);
  }
});
