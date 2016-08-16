class Menu < ActiveRecord::Base
  extend SmartUtils

  belongs_to :parent_menu, :class_name => "Menu", :foreign_key => :parent_menu_id
  has_many :menus, :foreign_key => :parent_menu_id

  def self.paging_select(model, pages)
    conditions, values = [], {}

    if model.present?
      model.each do |name, value|
        if name.present? && value.present?
          case name.to_sym
            when :system_code, :plugin_code, :menu_type
              values[name.to_sym] = value
              conditions << "#{name} = :#{name}"
            when :label
              values[name.to_sym] = "%#{value}%"
              conditions << "#{name} like :#{name}"
          end
        end
      end
    end

    result = self.where(conditions.join(' and '), values).order('updated_at desc')

    base_select(result, pages)
  end


  def self.tree_select(menu_id, system_code)
    items = []
    menus = Menu.where(parent_menu_id: menu_id, system_code: system_code)
    menus.each do |menu|
      #items << {id: menu.id, label: menu.label, type: menu.menu_type, hasChildren: menu.menus.size > 0, items: self.tree_select(menu.id, system_code)}
      items << {id: menu.id, label: menu.label, type: menu.menu_type, hasChildren: menu.menu_type != 'LEAF', items: self.tree_select(menu.id, system_code)}
    end
    items
  end

  # 查询所有菜单
  # For权限组TreeView
  def self.system_menus
    result, items = {}, []
    System.all.each do |sys|
      sys_menus = self.tree_select(nil, sys.system_code)
      items << {id: sys.id, label: sys.system_name, type: 'SYSTEM', hasChildren: sys_menus.size > 0, items: sys_menus}
    end
    result[:items] = items
    result
  end


  def self.recreate_plugin_menus(relative_path)
    menu_file_path = File.expand_path( "#{Rails.root}/../" + relative_path + "/db/menus.yml")
    if File.exists?(menu_file_path)
      yaml = YAML::load_file(menu_file_path)
      plugin_menu = PluginMenus.new yaml
      plugin_menu.delete_menus
      plugin_menu.create_menus
    else
      puts "文件#{menu_file_path}不存在。"
    end
  end

  # 创建标准菜单
  def self.create_all_plugin_menus(plugins)
    plugins.each {|plugin| self.recreate_plugin_menus plugin }
  end

  # module菜单
  def self.filter_module_menus(system)
    self.where("system_code = ? and menu_type='MODULE' ", system.system_code)
  end

  # group菜单
  def self.filter_group_menus(module_menu)
    self.where("parent_menu_id = ? and menu_type ='GROUP' ", module_menu.id)
  end

  # leaf菜单
  def self.filter_leaf_menus(module_or_group_menu)
    self.where("parent_menu_id = ? and menu_type ='LEAF' ", module_or_group_menu.id)
  end

  # 系统默认菜单
  def self.system_default_menu(system)
    first_module_menu = filter_module_menus(system).first
    return unless first_module_menu
    module_default_menu(first_module_menu)
  end

  # module默认菜单
  def self.module_default_menu(module_menu)
    first_group_menu = filter_group_menus(module_menu).first
    filter_leaf_menus(first_group_menu||module_menu).first
  end

  # 当前菜单所属的system
  def system
    System.find_by_system_code(self.system_code)
  end

  # 当前菜单所属的module菜单
  def module_menu
    if self.menu_type == 'MODULE'
      self
    elsif self.menu_type == 'GROUP'
      self.parent_menu
    else
      menu = self.parent_menu
      menu.module_menu if menu
    end
  end

end


# 创建插件菜单工具类
class PluginMenus

  def initialize(yml)
    @yaml = yml
    @system_code = yml['system_code']
    @plugin_code = yml['plugin_code']
    @modules = yml['modules']
  end

  def delete_menus
    Menu.where('plugin_code = ?', @plugin_code).delete_all
  end

  def create_menus
    @modules.each do |module_item|
      #module菜单
      module_menu = create_menu_by_desc module_item['module'], nil, "MODULE"

      #group菜单
      if module_item["groups"]
        module_item["groups"].each do |group_item|
          group_menu = create_menu_by_desc group_item["group"], module_menu, "GROUP"
          if group_item["menus"]
            group_item["menus"].each do |leaf_item|
              create_menu_by_desc leaf_item['menu'], group_menu, "LEAF"
            end
          end
        end
      end

      #leaf菜单
      if module_item["menus"]
        module_item["menus"].each do |leaf_item|
          create_menu_by_desc leaf_item['menu'], module_menu, "LEAF"
        end
      end
    end
  end

  def create_menu_by_desc(str, parent_menu, type)
    #module|group菜单，仅label属性
    if type == 'MODULE' || type == 'GROUP'
      return create_menu str, nil, nil, nil, type, parent_menu
    end

    #leaf菜单
    strArr = str.split(',')
    label = strArr[0]
    route = "#{@plugin_code}/#{strArr[1]}/#{strArr[2]}"
    ctrl = "#{@plugin_code}/#{strArr[1]}"
    action = strArr[2]||'index'

    create_menu label, route, ctrl, action, type, parent_menu
  end

  def create_menu(label, route, controller, action, menu_type, parent_menu)
    m = Menu.new
    m.system_code = @system_code
    m.plugin_code = @plugin_code
    m.label = label
    m.route = "#{route}".gsub(/^\/|\/$/, '')
    m.controller = "#{controller}".gsub(/^\/|\/$/, '')
    m.action = action
    m.menu_type = menu_type
    m.parent_menu = parent_menu if parent_menu
    m.save
    m
  end
end
