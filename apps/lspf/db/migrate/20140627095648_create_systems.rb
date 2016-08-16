class CreateSystems < ActiveRecord::Migration
  def change
    create_table :systems do |t|
      t.string :system_code
      t.string :system_name

      t.timestamps
    end
  end
end
