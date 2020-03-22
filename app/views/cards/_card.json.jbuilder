json.extract! card, :id, :list_id, :name, :position, :description, :created_at, :updated_at, :labels
json.url card_url(card, format: :json)
