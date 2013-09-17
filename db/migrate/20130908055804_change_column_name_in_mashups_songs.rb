class ChangeColumnNameInMashupsSongs < ActiveRecord::Migration
  def change
    rename_column :mashups_songs, :user_id, :song_id
  end
end
