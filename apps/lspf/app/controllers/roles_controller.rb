# encoding: utf-8
class RolesController < ApplicationController
  load_and_authorize_resource
  before_action :set_role, only: [:show, :edit, :update, :destroy]

  # GET /roles
  def index
    model = params[:role]
    pages = {page: params[:page], pageSize: params[:pageSize]}
    @roles = Role.paging_select(model, pages)
  end

  # GET /roles/1
  def show
    render json: {role: @role}
  end

  # GET /roles/new
  def new
    render partial: 'form'
  end

  # GET /roles/1/edit
  def edit
  end

  # POST /roles
  def create
    @role = Role.new(role_params)
    if @role.save
      render json: {role: @role, notice: '保存成功'}
    else
      raise SmartValidateError.new({role: @role.errors}) if @role.errors.any?
    end
  end

  # PATCH/PUT /roles/1
  def update
    if @role.update(role_params)
      render json: {role: @role, notice: '保存成功'}
    else
      raise SmartValidateError.new({role: @role.errors}) if @role.errors.any?
    end
  end

  # DELETE /roles/1
  def destroy
    @role.destroy
    render json: {notice: '删除成功'}
  end

  def multi_delete
    Role.multi_delete params[:ids]
    render json: {notice: '删除成功'}
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_role
    @role = Role.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def role_params
    params.require(:role).permit(:name, :code)
  end
end
