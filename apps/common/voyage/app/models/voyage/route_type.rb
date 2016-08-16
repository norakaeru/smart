module Voyage
  class RouteType < ActiveRecord::Base
    extend SmartUtils

    validates :type_code, :type_name, :presence => true

    def self.paging_select(model, pages, sort, filter)
      conditions, values = [], {}

      if model.present?
        model.each do |name, value|
          if name.present? && value.present?
            case name.to_sym
              when :type_code
                values[name.to_sym] = "#{value}"
                conditions << "#{name} = :#{name}"
              when :type_name
                values[name.to_sym] = "#%#{value}%"
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
