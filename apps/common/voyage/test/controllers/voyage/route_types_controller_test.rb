require 'test_helper'

module Voyage
  class RouteTypesControllerTest < ActionController::TestCase
    setup do
      @route_type = route_types(:one)
    end

    test "should get index" do
      get :index
      assert_response :success
      assert_not_nil assigns(:route_types)
    end

    test "should get new" do
      get :new
      assert_response :success
    end

    test "should create route_type" do
      assert_difference('RouteType.count') do
        post :create, route_type: { operator: @route_type.operator, remark: @route_type.remark, type_code: @route_type.type_code, type_name: @route_type.type_name }
      end

      assert_redirected_to route_type_path(assigns(:route_type))
    end

    test "should show route_type" do
      get :show, id: @route_type
      assert_response :success
    end

    test "should get edit" do
      get :edit, id: @route_type
      assert_response :success
    end

    test "should update route_type" do
      patch :update, id: @route_type, route_type: { operator: @route_type.operator, remark: @route_type.remark, type_code: @route_type.type_code, type_name: @route_type.type_name }
      assert_redirected_to route_type_path(assigns(:route_type))
    end

    test "should destroy route_type" do
      assert_difference('RouteType.count', -1) do
        delete :destroy, id: @route_type
      end

      assert_redirected_to route_types_path
    end
  end
end
