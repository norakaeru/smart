# encoding: utf-8
module MenusHelper

  def curr_system
    session[:curr_system]
  end

  def curr_module_menu
    session[:curr_module_menu]
  end

  def curr_group_menu
    session[:curr_group_menu]
  end

  def curr_leaf_menu
    session[:curr_leaf_menu]
  end

  def current_module_menus
    Menu.filter_module_menus(curr_system, user_menu_ids)
  end

  def group_menus(module_menu)
    Menu.filter_group_menus(module_menu, user_menu_ids)
  end

  def leaf_menus(module_or_group_menu)
    Menu.filter_leaf_menus(module_or_group_menu, user_menu_ids)
  end

end
