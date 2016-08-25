class System < ActiveRecord::Base
  #以system_code作为主外键，默认是id
  has_many :menus, :foreign_key => :system_code, :primary_key => :system_code

  attr_accessor :default_menu

  def url
    default_menu.nil?? '#' : '/' + default_menu.route
  end

end
