class LabelsCard < ApplicationRecord
  belongs_to :label
  belongs_to :card
end
