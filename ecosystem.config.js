module.exports = {
  apps: [
    {
      name: 'ETC',
      script: './bin/www.js',
      // instances: 0,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      // wait_ready: true,
      // listen_timeout: 50000,
      // kill_timeout: 5000,
      ignore_watch: [
        'package-lock.json',
        '**/*/package-lock.json',
        '**/node_modules/',
        '**/log/',
        '**/.vscode/',
        '**/out/',
        '**/docs/',
        '**/snapshot/',
        '**/dist/',
        '*.log',
      ],
      env: {
        NODE_ENV: 'development',
        PJ_MAIN_ID: 'ETC',
        PJ_SUB_ID: '',
        PJ_HTTP_PORT: 15351,
        PJ_API_PORT: 15352,
        // DB
        PJ_DB_HOST: 'localhost',
        PJ_DB_PORT: 15390,
        PJ_DB_DB: 'SOLAR_IOT',
        PJ_DB_USER: 'root',
        PJ_DB_PW: 'smsoftware',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'UPSAS',
      script: './bin/www.js',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'one two',
      // instances: 0,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      ignore_watch: [
        'package-lock.json',
        '**/*/package-lock.json',
        '**/node_modules/',
        '**/log/',
        '**/.vscode/',
        '**/out/',
        '**/docs/',
        '**/snapshot/',
        '**/dist/',
        '*.log',
      ],
      env: {
        NODE_ENV: 'development',
        PJ_MAIN_ID: 'UPSAS',
        PJ_HTTP_PORT: 15351,
        PJ_API_PORT: 15352,
        PJ_DB_HOST: 'salt100k.iptime.org',
        PJ_DB_PORT: 7556,
        PJ_DB_DB: 'UPSAS',
        PJ_DB_USER: 'root',
        PJ_DB_PW: 'smsoft1234',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'FP',
      script: './bin/www.js',
      // args: 'one two',
      // instances: 0,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      ignore_watch: [
        'package-lock.json',
        '**/*/package-lock.json',
        '**/node_modules/',
        '**/log/',
        '**/.vscode/',
        '**/out/',
        '**/docs/',
        '**/snapshot/',
        '**/dist/',
        '*.log',
      ],
      env: {
        NODE_ENV: 'development',
        PJ_MAIN_ID: 'FP',
        PJ_HTTP_PORT: 15351,
        PJ_API_PORT: 15352,
        PJ_DB_HOST: 'smsoft.co.kr',
        PJ_DB_PORT: 9000,
        PJ_DB_DB: 'FARM_PARALLEL',
        PJ_DB_USER: 'root',
        PJ_DB_PW: 'smsoftware',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'S2W',
      script: './bin/www.js',
      // instances: 0,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      // wait_ready: true,
      // listen_timeout: 50000,
      // kill_timeout: 5000,
      ignore_watch: [
        'package-lock.json',
        '**/*/package-lock.json',
        '**/node_modules/',
        '**/log/',
        '**/.vscode/',
        '**/out/',
        '**/docs/',
        '**/snapshot/',
        '**/dist/',
        '*.log',
      ],
      env: {
        NODE_ENV: 'development',
        PJ_MAIN_ID: 'S2W',
        PJ_HTTP_PORT: 15351,
        PJ_API_PORT: 15352,
        // DB
        PJ_DB_HOST: 'smsoft.co.kr',
        PJ_DB_PORT: 9000,
        PJ_DB_DB: 'SOLAR_2WAY',
        PJ_DB_USER: 'solar2way',
        PJ_DB_PW: 'qwer1234',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
