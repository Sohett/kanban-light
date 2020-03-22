class List < ApplicationRecord
  has_many :cards, -> { order(position: :asc)}, dependent: :destroy
  belongs_to :user

  scope :sorted, -> { order(position: :asc)}
  validates :name, presence: true
  validates :user, presence: true
  acts_as_list
end
