class System < ActiveRecord::Base
  attr_accessor :default_menu

  def url
    default_menu.nil?? '#' : '/' + default_menu.route
  end
end
