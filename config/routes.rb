Bendr::Application.routes.draw do
  root 'welcome#index'

  get "listen_mashup/:id" => "welcome#index"
  resources :mashups, only: [:index, :show, :new]
  resources :songs, only: [:show]
  post "mashups/persist" => "mashups#persist"
  get 'search' => 'search#search'
end
