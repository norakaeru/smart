module Voyage
  class Port < ActiveRecord::Base
    extend SmartUtils

    validates :port_code, :port_name_en, :port_name_cn, :presence => true

    def self.paging_select(model, pages, sort, filter)
      conditions, values = [], {}

      if model.present?
        model.each do |name, value|
          if name.present? && value.present?
            case name.to_sym
              when :port_code
                values[name.to_sym] = "#{value}"
                conditions << "#{name} = :#{name}"
              when :port_name_en, :port_name_cn, :operator, :remark
                values[name.to_sym] = "%#{value}%"
                conditions << "#{name} like :#{name}"
            end
          end
        end
      end

      result = self.where(conditions.join(' and '), values).order('updated_at desc')

      base_select(result, pages, sort, filter)
    end

  end
end
