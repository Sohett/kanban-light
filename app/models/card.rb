class Card < ApplicationRecord
  belongs_to :list
  has_many :labels_cards
  has_many :labels, through: :labels_cards

  validates :name, presence: true
  acts_as_list scope: :list
end
