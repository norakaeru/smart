require 'yaml'

# 创建菜单
plugins = %w(lspf common/voyage smart_doc)
Menu.create_all_plugin_menus(plugins)

# 初始化数据
System.create(system_code: 'FORWARDER', system_name: '货代系统')
System.create(system_code: 'MOTORCADE', system_name: '车队管理')
System.create(system_code: 'BASICDATA', system_name: '基础数据')
System.create(system_code: 'PERMISSION', system_name: '权限管理')
System.create(system_code: 'SMARTDOC', system_name: 'DOC')

group_admin = Group.create(name: '管理员组', code:'group_admin')
group_user = Group.create(name: '普通用户组', code:'group_user')

user_admin = User.create(name: '测试管理员', account: 'admin', email: 'zhao@beiyang.com', password: '123456', password_confirmation: '123456')
user = User.create(name: '测试用户', account: 'user', email: 'user@beiyang.com', password: '123456', password_confirmation: '123456')

role_manager = Role.create(name: '管理员', code:'admin')
role_user = Role.create(name: '普通用户', code:'user')


group_admin.users << user_admin
group_user.users << user

group_admin.roles << role_manager
group_user.roles << role_user

#
Voyage::Engine.load_seed

