require_dependency "voyage/application_controller"

module Voyage
  class PortsController < ApplicationController
    load_and_authorize_resource
    before_action :set_port, only: [:show, :edit, :update, :destroy]

    # GET /ports
    def index
      model = params[:port]
      pages = {page: params[:page], pageSize: params[:pageSize]}
      sort = params[:sort]
      filter = params[:filter]
      @ports = Port.paging_select(model, pages, sort, filter)
    end

    # GET /ports/1
    def show
      render json: {port: @port}
    end

    # GET /ports/new
    def new
      render partial: 'form'
    end

    # GET /ports/1/edit
    def edit
    end

    # POST /ports
    def create
      @port = Port.new(port_params)
      if @port.save
        render json: {port: @port, notice: '保存成功'}
      else
        raise SmartValidateError.new({port: @port.errors}) if @port.errors.any?
      end
    end

    # PATCH/PUT /ports/1
    def update
      if @port.update(port_params)
        render json: {port: @port, notice: '保存成功'}
      else
        raise SmartValidateError.new({port: @port.errors}) if @port.errors.any?
      end
    end

    # DELETE /ports/1
    def destroy
      @port.destroy
      render json: {notice: '删除成功'}
    end

    # DELETE /ports/multi_delete
    def multi_delete
      Port.multi_delete params[:ids]
      render json: {notice: '删除成功'}
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_port
        @port = Port.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def port_params
        params.require(:port).permit(:port_code, :port_name_en, :port_name_cn, :operator, :remark)
      end
  end
end
