SmartDoc::Engine.routes.draw do
  get 'docs/smart_fluid_layout' => 'docs#smart_fluid_layout'
  get 'docs/smart_fixed_layout' => 'docs#smart_fixed_layout'
  get 'docs/smart_input' => 'docs#smart_input'
end
