const _ = require('lodash');
const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

const { BU, DU } = require('base-util-jh');

const admin = require('./admin/users');
// const manager = require('./manager/users');
// const owner = require('./owner/users');
// const guest = require('./guest/users');
const users = require('./users');
const upsas = require('./upsas');
const Ean = require('./Ean');

let selectedRouter;
switch (process.env.PJ_MAIN_ID) {
  case 'UPSAS':
    selectedRouter = upsas;
    break;
  case 'FP':
    selectedRouter = users;
    break;
  case 'Ean':
    selectedRouter = Ean;
    break;
  default:
    selectedRouter = users;
    break;
}

// server middleware

router.use((req, res, next) => {
  // BU.CLI('Main Middile Ware', req.user);
  // if (process.env.DEV_AUTO_AUTH !== '1') {
  // if (global.app.get('auth')) {

  const excludePathList = ['/favicon'];

  const isExclude = _.some(excludePathList, excludePath => _.includes(req.path, excludePath));

  // BU.CLI(req.path);
  if (_.includes(req.path, '/app')) {
    return next();
  }

  if (isExclude) {
    return false;
  }

  if (!req.user) {
    // BU.CLI('웹 자동 로그인');
    return res.redirect('/auth/login');
  }
  // }

  next();
});

router.get('/intersection', (req, res) => {
  // BU.CLI(req.user);
  const grade = _.get(req, 'user.grade');

  // 권한이 설정되어 있지 않고
  if (_.isNil(grade) && process.env.IS_CHECK_USER_GRADE !== '0') {
    return res.send(DU.locationAlertBack('관리자의 승인을 기다리고 있습니다.', '/login'));
  }

  switch (grade) {
    // case 'admin':
    //   router.use('/admin', admin);
    //   res.redirect('/admin');
    //   break;
    default:
      router.use('/', selectedRouter);
      // _.isString(process.env.DEV_PAGE) && res.redirect(`/${process.env.DEV_PAGE}`);
      _.isString(process.env.DEV_PAGE)
        ? res.redirect(`/${process.env.DEV_PAGE}`)
        : res.redirect('/');
      break;
  }
});

module.exports = router;
