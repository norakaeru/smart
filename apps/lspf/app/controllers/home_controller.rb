class HomeController < ApplicationController

  def index
    render 'index', layout: "smart_home_application"
  end

end
