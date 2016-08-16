class CreateGroupMenus < ActiveRecord::Migration
  def change
    create_table :group_menus do |t|
      t.references :group, index: true
      t.references :menu, index: true

      t.timestamps
    end
  end
end
