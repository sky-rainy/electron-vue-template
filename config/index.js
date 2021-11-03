module.exports = {
  build: {
    env: require('./prod.env'),
    DisableF12: true
  },
  dev: {
    env: require('./dev.env'),
    removeElectronJunk: true,
    chineseLog: false,
    port: 9080
  },
  development: require('./dev.env'),
  production: require('./prod.env'),
  UseStartupChart: true,
  IsUseSysTitle: false,
  DllFolder: '',
  BuiltInServerPort: 25565
}
