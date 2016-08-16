class HomeController < ApplicationController
  def index
    render 'index', layout: nil
  end
end
