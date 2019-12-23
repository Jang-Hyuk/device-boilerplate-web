'use strict';

/**
 *
 * @param {HTMLElement} domElement
 * @param {{dataList: V_PW_INVERTER_STATUS[], totalInfo: {pv_kw: number, grid_kw: number, d_kwh: number, m_kwh: number}}} inverterStatusList
 * @param {string} siteId
 */
function setInverterList(domElement, inverterStatusList) {
  var inverterStatusTemplate = _.template(
    '\n    <tr class="sel">\n    <td scope="row"><%= siteName %></td>\n    <td > <%= horizontalSolar %> </td>\n    <td> <%= pv_a %> </td>\n    <td> <%= pv_v %> </td>\n    <td> <%= pv_kw %> </td>\n    <td> <%= grid_r_a %> </td>\n    <td> <%= grid_rs_v %> </td>\n    <td> <%= line_f %> </td>\n    <td> <%= power_kw %> </td>\n    <td> <%= power_f %> </td>\n    <td> <%= daily_power_kwh %> </td>\n    <td> <%= power_cp_kwh %> </td>\n    <td class="center_ball">\n      <img src="/image/<%= operImgName %>" />\n    </td>\n  </tr>\n    ',
  );

  var optionList = inverterStatusList.dataList.map(function(inverterStatusInfo) {
    var operImgName = inverterStatusInfo.isOperation ? 'green.png' : 'red.png';
    inverterStatusInfo.operImgName = operImgName;
    return inverterStatusTemplate(inverterStatusInfo);
  });
  $(domElement).html(optionList); // domElement.innerHTML = optionList;
}
