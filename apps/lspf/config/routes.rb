Lspf::Application.routes.draw do
  root :to => "home#index"
  post '/', :to => 'home#index'

  resources :user_sessions

  match '/login' => 'user_sessions#create' , via: [:post]
  match '/login' => 'user_sessions#new', via: [:get]
  match '/logout' => 'user_sessions#destroy', via: [:get]

  resources :users, :groups, :roles, :menus do
    delete 'multi_delete', :on => :collection
  end

  resources :groups do
    collection do
      post 'add_users'
      post 'remove_users'
      post 'update_menus'
      post 'update_permissions'
    end

    member do
      get 'group_menus'
      get 'group_permissions'
    end
  end


  mount SmartDoc::Engine => '/smart_doc'
  mount Voyage::Engine => '/voyage'
end
