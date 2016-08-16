class CreateVoyagePorts < ActiveRecord::Migration
  def change
    create_table :voyage_ports do |t|
      t.string :port_code
      t.string :port_name_en
      t.string :port_name_cn
      t.string :operator
      t.string :remark

      t.timestamps
    end
  end
end
