const _ = require('lodash');
const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

const { BU } = require('base-util-jh');

const moment = require('moment');
const webUtil = require('../../models/templates/web.util');

const domMakerMain = require('../../models/domMaker/mainDom');

const INCLINED_SOLAR = 'inclinedSolar';

const DeviceProtocol = require('../../models/DeviceProtocol');

const commonUtil = require('../../models/templates/common.util');
const sensorUtil = require('../../models/templates/sensor.util');

router.get(
  ['/', '/main', '/main/:siteId'],
  asyncHandler(async (req, res) => {
    // BU.CLI(req.locals);
    /** @type {BiModule} */
    const biModule = global.app.get('biModule');
    /** @type {BiDevice} */
    const biDevice = global.app.get('biDevice');

    /** @type {V_DV_SENSOR_PROFILE[]} */
    const viewSensorProfileRows = await biModule.getTable('v_dv_sensor_profile');
    /** @type {V_DV_PLACE_RELATION[]} */
    const viewPlaceRelationRows = await biModule.getTable('v_dv_place_relation');

    const placeNormalSeqList = sensorUtil.getPlaceRelationSeqList(viewPlaceRelationRows, {
      place_id: 'TB_N',
    });

    const placeCoolingSeqList = sensorUtil.getPlaceRelationSeqList(viewPlaceRelationRows, {
      place_id: 'TB_C',
    });

    const cpKwhSeqList = sensorUtil.getPlaceRelationSeqList(viewPlaceRelationRows, {
      nd_target_id: 'powerCpKwh',
    });

    const normalSensorProfileRows = _.filter(viewSensorProfileRows, row =>
      _.includes(placeNormalSeqList, row.node_seq),
    );

    const coolingSensorProfileRows = _.filter(viewSensorProfileRows, row =>
      _.includes(placeCoolingSeqList, row.node_seq),
    );

    const deviceProtocol = new DeviceProtocol();

    // 센서 평균 합산
    const currSensorDataInfo = {};
    deviceProtocol.mainEanViewList.forEach(ndKey => {
      const result = sensorUtil.calcSensorProfileRows(viewSensorProfileRows, {
        calcKey: ndKey,
      });
      _.assign(currSensorDataInfo, { [ndKey]: result });
    });

    // 일반 센서
    const currNormalSensorDataInfo = {};
    deviceProtocol.mainEanViewList.forEach(ndKey => {
      const result = sensorUtil.calcSensorProfileRows(normalSensorProfileRows, {
        calcKey: ndKey,
      });
      _.assign(currNormalSensorDataInfo, { [ndKey]: result });
    });

    // 냉각형 센서
    const currCoolingSensorDataInfo = {};
    deviceProtocol.mainEanViewList.forEach(ndKey => {
      const result = sensorUtil.calcSensorProfileRows(coolingSensorProfileRows, {
        calcKey: ndKey,
      });
      _.assign(currCoolingSensorDataInfo, { [ndKey]: result });
    });

    // 금일 발전량
    const normalCpKwhSeq = sensorUtil.getPlaceRelationSeqList(viewPlaceRelationRows, {
      place_id: 'TB_N',
      nd_target_id: 'powerCpKwh',
    })[0];
    const coolingCpKwhSeq = sensorUtil.getPlaceRelationSeqList(viewPlaceRelationRows, {
      place_id: 'TB_C',
      nd_target_id: 'powerCpKwh',
    })[0];

    let searchRange = biModule.createSearchRange({
      searchType: 'days',
      searchInterval: 'day',
    });
    const dailyReport = await biDevice.getSensorReport(searchRange, cpKwhSeqList, 4);
    // BU.CLI(dailyReport);

    const coolRow = _.find(dailyReport, { node_seq: coolingCpKwhSeq });
    const normalRow = _.find(dailyReport, { node_seq: normalCpKwhSeq });

    const dailyPowerInfo = {
      cooling: _.isEmpty(coolRow)
        ? 0
        : _.chain(coolRow.max_data)
            .subtract(coolRow.min_data)
            .multiply(1000)
            .round(2)
            .value(),
      normal: _.isEmpty(normalRow)
        ? 0
        : _.chain(normalRow.max_data)
            .subtract(normalRow.min_data)
            .multiply(1000)
            .round(2)
            .value(),
    };

    searchRange = biModule.createSearchRange({
      searchType: 'months',
      searchInterval: 'month',
    });

    const monthReport = await biDevice.getSensorReport(searchRange, cpKwhSeqList, 2);

    const powerInfo = {
      currPvW: currSensorDataInfo.pvW,
      dailyWh: _.round(_.sum(_.values(dailyPowerInfo)), 2),
      monthKwh: _.round(_.sum(_.map(monthReport, 'interval_data')), 3),
      cpKwh: _.round(_.sum(_.map(monthReport, 'max_data')), 3),
    };

    req.locals.powerInfo = powerInfo;
    req.locals.dailyPowerInfo = dailyPowerInfo;

    req.locals.currSensorDataInfo = currSensorDataInfo;
    req.locals.currNormalSensorDataInfo = currNormalSensorDataInfo;
    req.locals.currCoolingSensorDataInfo = currCoolingSensorDataInfo;

    res.render('./templates/Ean/main/main', req.locals);
  }),
);

module.exports = router;
