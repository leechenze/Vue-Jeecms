const modulesFiles = require.context('../SmartComponents/basicComponents', true, /Config\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  modules.push(value.default)
  return modules
}, [])

export default modules
