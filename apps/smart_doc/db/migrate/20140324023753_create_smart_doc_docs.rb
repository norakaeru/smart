class CreateSmartDocDocs < ActiveRecord::Migration
  def change
    create_table :smart_doc_docs do |t|

      t.timestamps
    end
  end
end
