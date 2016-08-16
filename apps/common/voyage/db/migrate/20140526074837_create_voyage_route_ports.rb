class CreateVoyageRoutePorts < ActiveRecord::Migration
  def change
    create_table :voyage_route_ports do |t|
      t.integer :port_type_id
      t.references :port, index: true
      t.references :route, index: true
      t.string :operator
      t.string :remark

      t.timestamps
    end
  end
end
