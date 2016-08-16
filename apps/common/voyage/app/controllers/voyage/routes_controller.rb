require_dependency "voyage/application_controller"

module Voyage
  class RoutesController < ApplicationController
    before_action :set_route, only: [:show, :edit, :update, :destroy, :route_ports ]

    # GET /routes
    def index
      model = params[:route]
      pages = {page: params[:page], pageSize: params[:pageSize]}
      @routes = Route.paging_select(model, pages)
    end

    # GET /routes/1
    def show
      render json: {route: @route}
    end

    # GET /routes/new
    def new
      render partial: 'form'
    end

    # GET /routes/1/edit
    def edit
    end

    # POST /routes
    def create
      @route = Route.multi_save(params[:id], route_params, params[:route_port])
      render json: {route: @route, notice: '保存成功'}
    end

    # PATCH/PUT /routes/1
    def update
      @route = Route.multi_save(params[:id], route_params, params[:route_port])
      render json: {route: @route, notice: '保存成功'}

    end

    # DELETE /routes/1
    def destroy
      @route.destroy
      render json: {notice: '删除成功'}
    end

    # DELETE /ports/multi_delete
    def multi_delete
      Route.multi_delete params[:ids]
      render json: {}
    end

    # GET
    def route_ports
      render json: @route.route_ports
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_route
        @route = Route.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def route_params
        params.require(:route).permit(:route_code, :route_name, :route_type_id, :operator, :remark)
      end
  end
end
