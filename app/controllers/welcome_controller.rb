class WelcomeController < ApplicationController
  def index
    @mashup = Mashup.new
    if params[:id]
      @mashup_id = params[:id]
    end
  end
end
