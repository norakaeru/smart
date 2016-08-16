class CreateVoyageRoutes < ActiveRecord::Migration
  def change
    create_table :voyage_routes do |t|
      t.string :route_code
      t.string :route_name
      t.references :route_type, index: true
      t.string :operator
      t.string :remark

      t.timestamps
    end
  end
end
