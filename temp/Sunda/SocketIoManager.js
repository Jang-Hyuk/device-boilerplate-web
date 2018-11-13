const _ = require('lodash');
const moment = require('moment');
const { BU } = require('base-util-jh');

const Server = require('socket.io');

const XLSX = require('xlsx');

const COLUMN_ID_LIST = ['date', 'SAP_001', 'TAPP_001', 'STP_001', 'CGT_001', 'COT_001', 'HMST_001'];

class SocketIoManager {
  constructor() {
    this.connectedSocketList = [];
    /** @type {{dateHour: number, dateMinutes: number}[]} */
    this.excelDataList = [];

    this.readFile();
  }

  readFile() {
    const wb = XLSX.readFile(`${__dirname}/data.xlsx`);
    // const wb = XLSX.readFile(`${process.cwd()}/data.xlsx`);
    const ws = wb.Sheets.Sheet1;
    const dataTableRows = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // 데이터 초기화
    this.excelDataList = [];

    _.forEach(dataTableRows, dataTableRow => {
      const addObj = {};
      _.forEach(dataTableRow, (v, index) => {
        if (index === 0) {
          const date = BU.convertExcelDateToJSDate(v);
          addObj.dateHour = moment(date).get('hours');
          addObj.dateMinutes = moment(date).get('minutes');
        } else {
          addObj[COLUMN_ID_LIST[index]] = v;
        }
      });
      this.excelDataList.push(addObj);
    });
  }

  /**
   * Web Socket 설정
   * @param {Object} http
   */
  setSocketIO(http) {
    this.io = new Server(http);

    this.io.on('connection', socket => {
      BU.CLI('connect Client');
      this.connectedSocketList.push(socket);

      socket.emit('updateNodeInfo', this.renewalData());
      // 1초마다 실행
      setInterval(() => {
        socket.emit('updateNodeInfo', this.renewalData());
        // socket.emit('updateNodeInfo', [{ node_id: 'MRT_001', data: 5 }]);
      }, 1000 * 60);

      // 연결 해제한 Socket 제거
      socket.on('disconnect', () => {
        _.remove(this.connectedSocketList, connSocket => _.isEqual(connSocket, socket));
      });
    });
  }

  renewalData() {
    const hour = moment().get('hours');
    const minutes = moment().get('minutes');

    const currExcelRow = _.find(this.excelDataList, { dateHour: hour, dateMinutes: minutes });
    // BU.CLI(currExcelRow);

    const nodeDataList = [];
    _.forEach(currExcelRow, (v, k) => {
      const nodeInfo = {
        node_id: k,
        data: _.isNumber(v) ? this.numberWithCommas(v) : v,
      };
      nodeDataList.push(nodeInfo);
    });

    nodeDataList.push({
      node_id: 'UT_001',
      data: moment().format('HH:mm:ss'),
    });

    return nodeDataList;
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
module.exports = SocketIoManager;
