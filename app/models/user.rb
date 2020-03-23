class User < ApplicationRecord
  after_create :set_example
  has_many :labels
  has_many :lists
  has_many :cards, through: :lists
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  def set_example
    list = self.lists.create(name: '👋Example List')
    card = list.cards.create(name: 'Example card', description: 'You can modify this example')
    self.labels.create(name: '🔥Topic')
    label = self.labels.create(name: '🧸Soft')
    card.labels << label
    card.save
  end
end
