const modulesFiles = require.context('../', true, /Editor\.vue$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.(\/?.*)\/(.*)\.\w+$/, '$2')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default modules
