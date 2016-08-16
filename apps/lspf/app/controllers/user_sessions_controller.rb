# encoding: utf-8
class UserSessionsController < ApplicationController
  layout false
  skip_before_filter :require_login, :only => [:new, :create, :destroy]

  # GET /user_sessions/new
  def new
    @user_session = UserSession.new
  end

  # POST /user_sessions
  def create
    user_session_params = params[:user_session]
    user = User.find_by_account(user_session_params[:account])
    @user_session = UserSession.new(user_session_params)

    if user && @user_session.save
      redirect_to '/'
    else
      render 'new'
    end
  end

  # DELETE /user_sessions/1
  def destroy
    @user_session = UserSession.find
    @user_session.destroy if @user_session

    cookies.delete :user_info_secret
    session[:user_info_secret] = nil

    redirect_to '/'
  end

end