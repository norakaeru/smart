class CreateGroupRoles < ActiveRecord::Migration
  def change
    create_table :group_roles do |t|
      t.references :group, index: true
      t.references :role, index: true

      t.timestamps
    end
  end
end
