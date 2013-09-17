class RemoveGenreFromSong < ActiveRecord::Migration
  def change
    remove_column :songs, :genre
  end
end
