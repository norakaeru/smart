class Group < ActiveRecord::Base
  extend SmartUtils

  has_many :group_role, :dependent => :destroy
  has_many :roles, through: :group_role

  has_many :group_user, :dependent => :destroy
  has_many :users, through: :group_user

  has_many :group_menu, :dependent => :destroy
  has_many :menus, through: :group_menu

  has_many :group_permission, :dependent => :destroy
  has_many :permissions, through: :group_permission

  def self.paging_select(model, pages)
    conditions, values = [], {}

    if model.present?
      model.each do |name, value|
        if name.present? && value.present?
          case name.to_sym
            when :code
              values[name.to_sym] = value
              conditions << "#{name} = :#{name}"
            when :name
              values[name.to_sym] = "%#{value}%"
              conditions << "#{name} like :#{name}"
          end
        end
      end
    end

    result = self.where(conditions.join(' and '), values).order('updated_at desc')

    base_select(result, pages)
  end

end
