class RemoveCardFromTrello < ActiveRecord::Migration[5.2]
  def change
    remove_column :labels, :card_id
  end
end
