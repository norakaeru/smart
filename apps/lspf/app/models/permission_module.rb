class PermissionModule < ActiveRecord::Base
  belongs_to :parent_module, class_name: 'PermissionModule', foreign_key: :parent_module_id
  has_many :modules, class_name: 'PermissionModule', foreign_key: :parent_module_id
  has_many :permissions

  def self.tree_select(module_id, system_code)
    permissions, items = [],[]

    if module_id.nil?
      modules = self.where(system_code: system_code, parent_module_id: nil)
    else
      modules = self.where(system_code: system_code, parent_module_id: module_id)
      permissions = Permission.where(permission_module_id: module_id)
    end

    modules.each do |m|
      #items << {type: 'module', id: m.id, label: m.name, hasChildren: (m.modules.size > 0 || m.permissions.size > 0) ? true : false, items: self.tree_select(m.id, m.system_code)}
      items << {type: 'module', id: m.id, label: m.name, hasChildren: true, items: self.tree_select(m.id, m.system_code)}
    end

    permissions.each do |p|
      items << {type: 'permission', id: p.id, label: p.name, hasChildren: false}
    end

    items
  end

  # 查询所有module权限
  # For权限组TreeView
  def self.system_module_permissions
    result, items = {}, []
    System.all.each do |sys|
      sys_items = self.tree_select(nil, sys.system_code)
      items << {type: 'system', id: sys.id, label: sys.system_name, hasChildren: sys_items.size > 0, items: sys_items}
    end
    result[:items] = items
    result
  end

  # 创建或更新module及其permissions
  def self.merge_modules(modules, system, parent_module=nil)
    if modules
      modules.each do |mdl|
        if parent_module.nil?
          m = self.find_or_create_by(name: mdl[:name], system_code: system.system_code, parent_module_id: nil)
        else
          m = self.find_or_create_by(name: mdl[:name], system_code: system.system_code, parent_module: parent_module)
        end
        if mdl[:modules]
          self.merge_modules(mdl[:modules], system, m)
        end
        if mdl[:permissions]
          Permission.merge_permissions(mdl[:permissions], m)
        end
      end
    end
  end

end
