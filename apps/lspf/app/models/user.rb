class User < ActiveRecord::Base
  extend SmartUtils

  has_many :group_user, :dependent => :destroy
  has_many :groups, through: :group_user

  acts_as_authentic do |c|
    c.login_field :account
    # c.logged_in_timeout(60.minutes)
    c.validates_length_of_password_field_options(:minimum => 3)
    c.validates_length_of_password_confirmation_field_options(:minimum => 3)
  end

  def self.paging_select(model, pages)
    conditions, values = [], {}
    relation = self

    if model.present?
      model.each do |name, value|
        if name.present? && value.present?
          case name.to_sym
            when :name, :account
              values[name.to_sym] = "%#{value}%"
              conditions << "#{name} like :#{name}"
            when :group_id
              relation = relation.joins(:group_user)
              values[name.to_sym] = value
              conditions << "#{name} = :#{name}"
          end
        end
      end
    end

    result = relation.where(conditions.join(' and '), values)

    base_select(result, pages)
  end

  #-------------------includes避免N+1次查询-----------------------------
  #用户菜单id[]
  def menu_ids
    menu_ids = []
    self.groups.includes(:menus).each do |group|
      menu_ids.concat group.menus.collect {|menu| menu.id}
    end
    menu_ids
  end

  #用户角色[]
  def roles
    roles = []
    self.groups.includes(:roles).each do |group|
       roles.concat group.roles.collect {|role| role.code}
    end
    roles
  end

  #用户权限[]
  def permissions(controller_path)
    permissions = []
    self.groups.each do |group|
      permissions.concat group.permissions.where(controller: controller_path).collect {|permission| permission.code}
    end
    permissions
  end
  #--------------------------------------------------------------------

  #用户系统(菜单)[]
  def systems user_menu_ids
    user_systems = []
    System.all.each do |sys|
      #获取system的默认leaf_menu，用于点击系统菜单时链接到leaf_menu
      sys.default_menu = sys.menus.where(id: user_menu_ids, menu_type: 'LEAF').first
      user_systems << sys if sys.default_menu
    end
    user_systems
  end

end
