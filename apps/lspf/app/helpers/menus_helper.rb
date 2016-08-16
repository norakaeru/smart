# encoding: utf-8
module MenusHelper

  def curr_system
    session[:curr_system]
  end

  def curr_module_menu
    session[:curr_module_menu]
  end

  def curr_leaf_menu
    session[:curr_leaf_menu]
  end

  def curr_group_menu
    if curr_leaf_menu
      group_menu = curr_leaf_menu.parent_menu
      if group_menu && group_menu.menu_type == 'GROUP'
        group_menu
      end
    end
  end

  def current_module_menus
    Menu.filter_module_menus(curr_system)
  end

  def current_group_menus
    Menu.filter_group_menus(curr_module_menu)
  end

  def group_menus(module_menu)
    Menu.filter_group_menus(module_menu)
  end

  def leaf_menus(module_or_group_menu)
    Menu.filter_leaf_menus(module_or_group_menu)
  end

  def user_systems
    session[:user_systems] || []
  end

end
