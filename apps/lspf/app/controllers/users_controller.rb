# encoding: utf-8
class UsersController < ApplicationController
  load_and_authorize_resource
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  # GET /users
  def index
    model = params[:user]
    pages = {page: params[:page], pageSize: params[:pageSize]}
    @users = User.paging_select(model, pages)
  end

  # GET /users/1
  def show
    render json: {user: @user}
  end

  # GET /users/new
  def new
    render partial: 'form'
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  def create
    @user = User.new(user_params)
    if @user.save
      render json: {user: @user, notice: '保存成功'}
    else
      raise SmartValidateError.new({user: @user.errors}) if @user.errors.any?
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: {user: @user, notice: '保存成功'}
    else
      raise SmartValidateError.new({user: @user.errors}) if @user.errors.any?
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
    render json: {notice: '删除成功'}
  end

  def multi_delete
    User.multi_delete params[:ids]
    render json: {notice: '删除成功'}
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def user_params
    params.require(:user).permit(:name, :account, :email, :crypted_password, :password_salt, :persistence_token, :password, :password_confirmation,
                                 :group_id )
  end
end
