class SearchController < ApplicationController

  def search
    arr = []
    songs = Song.where("LOWER(title) LIKE ?", "#{params[:q]}%")
    songs.each { |s| arr << { id: s.id, title: s.title } }
    render json: arr
  end

end
