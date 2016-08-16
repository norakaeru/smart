class Permission < ActiveRecord::Base
  extend SmartUtils

  has_many :group_permission, :dependent => :destroy
  has_many :groups, through: :group_permission

  belongs_to :permission_module

  # 查找或创建permissions
  def self.merge_permissions(permissions, mdl)
    if permissions.present?
      permissions.each do |permission|
        self.find_or_create_by({code: permission[:code], name: permission[:name], controller: permission[:controller], permission_module: mdl})
      end
    end
  end

end
