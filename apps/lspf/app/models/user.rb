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

  def roles
    roles = []
    self.groups.each do |group|
       roles.concat group.roles.collect {|role| role.code}
    end
    roles
  end

  def permissions(controller_path)
    permissions = []
    self.groups.each do |group|
      permissions.concat group.permissions.where(controller: controller_path).collect {|permission| permission.code}
    end
    permissions
  end

end
