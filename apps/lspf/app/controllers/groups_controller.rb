# encoding: utf-8
class GroupsController < ApplicationController
  load_and_authorize_resource
  before_action :set_group, only: [:show, :edit, :update, :destroy, :group_menus, :group_permissions]

  # GET /groups
  def index
    model = params[:group]
    pages = {page: params[:page], pageSize: params[:pageSize]}
    @groups = Group.paging_select(model, pages)
  end

  # GET /groups/1
  def show
    render json: {group: @group}
  end

  # GET /groups/new
  def new
    render partial: 'form'
  end

  # GET /groups/1/edit
  def edit
  end

  # POST /groups
  def create
    @group = Group.new(group_params)
    if @group.save
      render json: {group: @group, notice: '保存成功'}
    else
      raise SmartValidateError.new({group: @group.errors}) if @group.errors.any?
    end
  end

  # PATCH/PUT /groups/1
  def update
    if @group.update(group_params)
      render json: {group: @group, notice: '保存成功'}
    else
      raise SmartValidateError.new({group: @group.errors}) if @group.errors.any?
    end
  end

  # DELETE /groups/1
  def destroy
    @group.destroy
    render json: {notice: '删除成功'}
  end

  def multi_delete
    Group.multi_delete params[:ids]
    render json: {notice: '删除成功'}
  end

  #添加用户
  def add_users
    GroupUser.add_users(params[:group_id], params[:ids])
    render json: {notice: '保存成功'}, status: :created
  end

  #移除用户
  def remove_users
    GroupUser.remove_users(params[:group_id], params[:ids])
    render json: {notice: '删除成功'}
  end

  #组菜单
  # GET /groups/1/group_menus
  def group_menus
    menu_ids = @group.menus.pluck(:id)
    render json: menu_ids
  end

  #组权限
  # GET /groups/1/group_permissions
  def group_permissions
    permission_ids = @group.permissions.pluck(:id)
    render json: permission_ids
  end

  #更新菜单
  def update_menus
    GroupMenu.update_by_group(params[:group_id], params[:menu_ids])
    render json: {notice: '保存成功'}
  end

  #更新权限
  def update_permissions
    GroupPermission.update_by_group(params[:group_id], params[:permission_ids])
    render json: {notice: '保存成功'}
  end


  private
  # Use callbacks to share common setup or constraints between actions.
  def set_group
    @group = Group.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def group_params
    params.require(:group).permit(:name, :code)
  end
end
