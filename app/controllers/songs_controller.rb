class SongsController < ApplicationController
  def show
    song = Song.find(params[:id])
    arr = []
    song.find_similar.each do |s|
      arr << get_song_json(s)
    end
    res = {
      first: get_song_json(song),
      list: arr
    }
    render json: res
  end

  private 
  def get_song_json(song)
    {
      id: song.id,
      title: song.title,
      tempo: song.tempo,
      url: Song.path(song.file_name)
    }
  end



end
