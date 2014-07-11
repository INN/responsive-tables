var ResponsiveTable;

(function(){
  var $ = jQuery;

  ResponsiveTable = function(spreadsheetKey, columns) {
    var self = this;

    self.columns = columns;

    self.init = function(dataSpreadsheet) {
      self.pym = new pym.Child({ polling: 500 });
      self.ttop = Tabletop.init({
          key: dataSpreadsheet,
          callback: self.writeTable,
          simpleSheet: true,
          debug: false
      });
    }

    self.sortData = function(dataSource) {
      dataSource.sort(function(a, b){
        var one = a[self.columns[0][0]],
            two = b[self.columns[0][0]];

          if (!isNaN(Number(one)))
            one = Number(one);
          if (!isNaN(Number(two)))
            two = Number(two);

          if(one < two) return -1;
          if(one > two) return 1;
          return 0;
      });
      return dataSource
    };

    self.writeTable = function(dataSource){
        dataSource = self.sortData(dataSource);
        $('#data').html('<table style="display:none;" class="tablesaw" id="data-table-container" data-sortable></table>');
        self.createTableColumns('#data table');
        self.populateTable(dataSource, '#data table');
        $('#data table').table().fadeIn();
        self.pym.sendHeightToParent();
    };

    self.createTableColumns = function(table){
      var thead = $('<thead><tr></tr></thead>');

      $.each(self.columns, function(i, v) {
        if (i == 0)
          thead.find('tr').append('<th data-sortable-col data-sortable-default-col>' + v[1] + '</th>');
        else
          thead.find('tr').append('<th data-sortable-col>' + v[1] + '</th>');
      });

      $(table).data('columns', self.columns);
      $(table).append(thead);
    }

    self.populateTable = function(dataSource, table) {
      var tab = $(table);
          columns = $.map($(table).data('columns'), function(d) { return d[0]; });

      tab.append('<tbody></tbody>');

      $.each(dataSource, function(idx, data) {
        var row = $('<tr></tr>');
        $.each(data, function(key, val) {
          if (columns.indexOf(key) >= 0) {
            var cell = $('<td class="' + key + '"></td>');

            if (columns.indexOf(key) == 0)
              cell.data('priority', 'persist');
            else
              cell.data('priority', columns.indexOf(key));

            // Turn urls into actual anchors
            if (val.match) {
              var matches = val.match(/(https?:\/\/)([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})([\/\w \.-]*)*\/?(\?.*)?(\#.*)?/g);
              if (matches) {
                var replacement = '<a target="_blank" class="ellipsis-link" href="' + matches[0] + '">' + matches[0] + '</a>';
                val = val.replace(matches[0], replacement);
              }
            }

            cell.html(val);
            row.append(cell);
          }
        });
        tab.find('tbody').append(row);
      });
    }

    $(document).ready(self.init.bind(self, spreadsheetKey));
  };

})();
