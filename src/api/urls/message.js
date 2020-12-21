/* system-cms-prefix start */
const prefix = '/cmsmanager'
/* system-cms-prefix change const prefix = '/cmsadmin' system-cms-prefix change */
/* system-cms-prefix end */
export default {
  // 收件箱
  messageInbox: `${prefix}/systemmessage/inbox`,
  // 发件箱
  messageOutbox: `${prefix}/message/outbox`,
  // 收件箱查看消息
  systemmessage: `${prefix}/systemmessage`,
  // 发件箱查看消息
  message: `${prefix}/message`,
  // 收件箱（系统消息+私信）未读数量
  systemmessageNumber: `${prefix}/systemmessage/number`
}
