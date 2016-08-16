# encoding: utf-8
class MenusController < ApplicationController
  load_and_authorize_resource
  before_action :set_menu, only: [:show, :edit, :update, :destroy]

  # GET /menus
  def index
    model = params[:menu]
    pages = {page: params[:page], pageSize: params[:pageSize]}
    @menus = Menu.paging_select(model, pages)
  end

  # GET /menus/1
  def show
    render json: {menu: @menu}
  end

  # GET /menus/new
  def new
    render partial: 'form'
  end

  # GET /menus/1/edit
  def edit
  end

  # POST /menus
  def create
    @menu = Menu.new(menu_params)
    if @menu.save
      render json: {menu: @menu, notice: '保存成功'}
    else
      raise SmartValidateError.new({menu: @menu.errors}) if @menu.errors.any?
    end
  end

  # PATCH/PUT /menus/1
  def update
    if @menu.update(menu_params)
      render json: {menu: @menu, notice: '保存成功'}
    else
      raise SmartValidateError.new({menu: @menu.errors}) if @menu.errors.any?
    end
  end

  # DELETE /menus/1
  def destroy
    @menu.destroy
    render json: {notice: '删除成功'}
  end

  def multi_delete
    Menu.multi_delete params[:ids]
    render json: {notice: '删除成功'}
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_menu
    @menu = Menu.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def menu_params
    params.require(:menu).permit(:system_code, :plugin_code, :label, :route, :controller, :action, :menu_type, :parent_menu_id)
  end
end
