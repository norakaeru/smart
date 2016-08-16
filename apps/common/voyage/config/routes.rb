Voyage::Engine.routes.draw do

  resources :routes do
    collection do
      delete 'multi_delete'
      get 'route_ports'
    end
  end

  resources :ports, :route_types do
    delete 'multi_delete', :on => :collection
  end

end
