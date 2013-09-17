class CreateMashupsSongsTable < ActiveRecord::Migration
  def up
    create_table :mashups_songs_tables, id: false do |t|
      t.integer :mashup_id
      t.integer :song_id
    end
  end
  def down
    drop_table :mashups_songs_tables
  end
end
