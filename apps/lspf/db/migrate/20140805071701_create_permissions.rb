class CreatePermissions < ActiveRecord::Migration
  def change
    create_table :permissions do |t|
      t.string :code
      t.string :name
      t.string :controller
      t.integer :permission_module_id

      t.timestamps
    end
  end
end
