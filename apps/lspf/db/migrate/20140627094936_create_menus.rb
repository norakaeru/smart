class CreateMenus < ActiveRecord::Migration
  def change
    create_table :menus do |t|
      t.string :system_code
      t.string :plugin_code
      t.string :label
      t.string :route
      t.string :controller
      t.string :action
      t.string :menu_type
      t.integer :parent_menu_id

      t.timestamps
    end
  end
end
