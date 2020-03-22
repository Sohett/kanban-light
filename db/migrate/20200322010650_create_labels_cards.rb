class CreateLabelsCards < ActiveRecord::Migration[5.2]
  def change
    create_table :labels_cards do |t|
      t.belongs_to :card
      t.belongs_to :label
      t.timestamps
    end
  end
end
