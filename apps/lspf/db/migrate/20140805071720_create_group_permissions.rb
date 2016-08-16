class CreateGroupPermissions < ActiveRecord::Migration
  def change
    create_table :group_permissions do |t|
      t.references :group, index: true
      t.references :permission, index: true

      t.timestamps
    end
  end
end
