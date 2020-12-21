/* system-cms-prefix start */
const prefix = '/cmsmanager'
/* system-cms-prefix change const prefix = '/cmsadmin' system-cms-prefix change */
/* system-cms-prefix end */

export default {
  // 单点登录
  singleLogin: `${prefix}/sso/status`,
  // 单点登录登录信息
  singleInfo: `${prefix}/sso/getInfo`,
  // 单点登录设置详情
  singleLoginDetail: `${prefix}/sso`,
  // 单点登录设置修改
  singleLoginUpdate: `${prefix}/sso`,
  // 验证码
  code: '/common/kaptcha',
  // 登陆
  login: `${prefix}/login`,
  // 退出
  logout: `${prefix}/logout`,
  // 上传
  upload: `${prefix}/upload/o_upload`,
  // 返回中文首字母
  pinyin: '/language/pinyin',
  // 自动摘要
  summary: '/language/summary',
  // 修改密码
  adminpsw: `${prefix}/users/adminpsw`,
  // 导入word
  docImport: `${prefix}/contentext/docImport`,
  // 登录封面图片
  registerImg: '/register/getImage',
  // 判断国密加密
  loginType: `${prefix}/config/global/isSmEncrypt`,
  // 登录短信验证码
  sendLogin: `${prefix}/config/element/sendLogin`
}
