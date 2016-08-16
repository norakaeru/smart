class CreatePermissionModules < ActiveRecord::Migration
  def change
    create_table :permission_modules do |t|
      t.string :name
      t.string :system_code
      t.integer :parent_module_id

      t.timestamps
    end
  end
end
