module Voyage
  class Route < ActiveRecord::Base
    extend SmartUtils

    belongs_to :route_type
    has_many :route_ports, :dependent => :destroy

    validates :route_code, :route_name, :route_type_id, :presence => true

    def self.paging_select(model, pages)
      conditions, values = [], {}

      if model.present?
        model.each do |name, value|
          if name.present? && value.present?
            case name.to_sym
              when :route_code
                values[name.to_sym] = "#{value}"
                conditions << "#{name} = :#{name}"
              when :route_name
                values[name.to_sym] = "#%#{value}%"
                conditions << "#{name} like :#{name}"
            end
          end
        end
      end

      result = self.where(conditions.join(' and '), values).order('updated_at desc')

      base_select(result, pages)
    end

    def self.multi_save(id, route_params, ports_params)
      self.transaction do
        if id.present?
          route = self.find(id)
          route.update(route_params)
        else
          route = self.create(route_params)
        end

        errors = {}

        errors[:route] = route.errors if route.errors.any?

        sub_errors = RoutePort.multi_save(ports_params, route)

        errors[:route_port] = sub_errors if sub_errors.present?

        raise SmartValidateError.new(errors) if errors.present?

        route
      end
    end

  end
end
