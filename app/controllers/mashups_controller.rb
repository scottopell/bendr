class MashupsController < ApplicationController
  def index
    @mashups = Mashup.all
  end
 
  def show
    @mashup = Mashup.find(params[:id])
    respond_to do |format|
      format.json do
        render json: custom_list_for_mashup(@mashup)
      end
    end
  end

  def persist
    create
  end

  def create
    @mashup = Mashup.new
    first_song = Song.find(params[:first])
    second_song = Song.find(params[:second])
    @mashup.song << first_song
    @mashup.song << second_song

    creation_response = {}
    if @mashup.save
      creation_response[:mashup_path] = root_url + 'listen_mashup/' + @mashup.id.to_s
    else
      creation_response[:error_code] = 1
      creation_response[:error_msg] = "Mashup could not be saved"
    end

    respond_to do |format|
      format.json do
        render json: creation_response.to_json
      end
    end
  end

  private

  def mashup_params 
    params.require(:mashup).permit(:query, :song_ids)
  end

  def custom_list_for_mashup mashup
    list = {} 
    list[:first] = get_song_json(mashup.song.first)
    list[:list] = []
    list[:list]  << get_song_json(mashup.song.second)
    list[:sentinel] = "mashup_view"
    list
  end

  def get_song_json(song)
    {
      id: song.id,
      title: song.title,
      tempo: song.tempo,
      url: Song.path(song.file_name)
    }
  end

end
