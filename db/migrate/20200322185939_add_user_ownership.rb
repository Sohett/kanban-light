class AddUserOwnership < ActiveRecord::Migration[5.2]
  def change
    add_reference :lists, :user, foreign_key: true
    add_reference :labels, :user, foreign_key: true
  end
end
