class Role < ActiveRecord::Base
  extend SmartUtils

  has_many :group_role, :dependent => :destroy
  has_many :groups, through: :group_role

  # :manager 可执行controller內 所有的 action
  # :viewer 可执行controller內 :index, :show
  # :modifier 可执行controller内 :new, :create, :edit, :update
  # :remover 可执行controller内 :destroy
  # :submitter 自定义提交action
  # :auditor 自定义审核action

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
