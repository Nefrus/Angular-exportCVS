import {Injectable} from '@angular/core';

@Injectable()
export class ExportService {
  csvSeparator = ',';

  constructor() {
  }

  /**
   * @param value
   * @param columns
   * @param exportFilename
   * @example
   * const value = ['100','92','93'];
   * const columns = ['语文','数学','英语']
   * ExportService.exportCVS(value,columns,'成绩表')
   */
  exportCVS(value, columns, exportFilename) {
    const data = value;
    let csv = '\ufeff';
    // headers
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      csv += '"' + (column.header || column) + '"';
      if (i < (columns.length - 1)) {
        csv += this.csvSeparator;
      }
    }
    // body
    data.forEach((record) => {
      csv += '\n';
      for (let i_1 = 0; i_1 < columns.length; i_1++) {
        const column = columns[i_1];
        csv += '"' + this.resolveFieldData(record, column) + '"';
        if (i_1 < (columns.length - 1)) {
          csv += this.csvSeparator;
        }
      }
    });
    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, exportFilename + '.csv');
    } else {
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', exportFilename + '.csv');
        link.click();
      } else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }

  resolveFieldData(data, field) {
    if (data && field) {
      if (field.indexOf('.') === -1) {
        return data[field];
      } else {
        const fields = field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value === null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }
}
