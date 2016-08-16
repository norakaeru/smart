require_dependency "voyage/application_controller"

module Voyage
  class RouteTypesController < ApplicationController
    before_action :set_route_type, only: [:show, :edit, :update, :destroy]

    # GET /route_types
    def index
      model = params[:route_type]
      pages = {page: params[:page], pageSize: params[:pageSize]}
      sort = params[:sort]
      filter = params[:filter]
      @route_types = RouteType.paging_select(model, pages, sort, filter)
    end

    # GET /route_types/1
    def show
      render json: {route_type: @route_type}
    end

    # GET /route_types/new
    def new
      render partial: "form"
    end

    # GET /route_types/1/edit
    def edit
    end

    # POST /route_types
    def create
      @route_type = RouteType.new(route_type_params)

      if @route_type.save
        render json: {route_type: @route_type, notice: '保存成功'}
      else
        raise SmartValidateError.new({route_type: @route_type.errors}) if @route_type.errors.any?
      end
    end

    # PATCH/PUT /route_types/1
    def update
      if @route_type.update(route_type_params)
        render json: {route_type: @route_type, notice: '保存成功'}
      else
        raise SmartValidateError.new({route_type: @route_type.errors}) if @route_type.errors.any?
      end
    end

    # DELETE /route_types/1
    def destroy
      @route_type.destroy
      render json: {notice: '删除成功'}
    end

    # DELETE /ports/multi_delete
    def multi_delete
      RouteType.multi_delete params[:ids]
      render json: {}
    end


    private
      # Use callbacks to share common setup or constraints between actions.
      def set_route_type
        @route_type = RouteType.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def route_type_params
        params.require(:route_type).permit(:type_code, :type_name, :operator, :remark)
      end
  end
end
