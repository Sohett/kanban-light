Rails.application.routes.draw do
  resources :labels
  resources :cards do
    member do
      patch :move
      patch :add_label
      patch :remove_label
    end
  end
  resources :lists do
    member do
      patch :move
    end
  end
  devise_for :users
  root to: 'lists#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
