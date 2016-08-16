module Voyage
  class RoutePort < ActiveRecord::Base
    extend SmartUtils

    belongs_to :port
    belongs_to :route

    validates :port_type_id, :port_id, :presence => true

    def self.multi_save(params, route)
      errors = {}
      if route.present?
        self.transaction do
          if params.present?
            errors.merge! multi_create(params[:news], route)
            errors.merge! multi_update(params[:updates])
            multi_delete(params[:deletes])
          end
        end
      end
      errors
    end

    def self.multi_create(params, route)
      errors = {}
      if params.present?
        params.each do |_, port_params|
          obj = self.create(self.params(port_params).merge(route_id: route.id))

          errors.merge!({'row_' + port_params[:_row_index] => obj.errors}) if obj.errors.any?
        end
      end
      errors
    end

    def self.multi_update(params)
      errors = {}
      if params.present?
        params.each do |_, port_params|
          obj = self.find(port_params[:id])
          obj.update(self.params(port_params))

          errors.merge!({'row_' + port_params[:_row_index] => obj.errors}) if obj.errors.any?
        end
      end
      errors
    end

    private

    def self.params(params)
      params.slice(:id, :port_id, :port_type_id, :remark, :operator)
    end

  end
end
