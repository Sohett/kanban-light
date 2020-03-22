class Label < ApplicationRecord
  has_many :labels_cards
  has_many :cards, through: :labels_cards

  belongs_to :user

  validates :name, presence: true
  validates :user, presence: true
end
