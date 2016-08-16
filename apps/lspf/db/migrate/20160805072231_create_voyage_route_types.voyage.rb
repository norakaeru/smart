# This migration comes from voyage (originally 20140425025404)
class CreateVoyageRouteTypes < ActiveRecord::Migration
  def change
    create_table :voyage_route_types do |t|
      t.string :type_code
      t.string :type_name
      t.string :operator
      t.string :remark

      t.timestamps
    end
  end
end
