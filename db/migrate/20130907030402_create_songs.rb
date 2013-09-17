class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :title
      t.string :artist
      t.string :release   #album
      t.float  :duration
      t.string :genre
      t.integer :echonest_id
      t.float  :danceability
      t.float  :energy
      t.integer :key
      t.integer :mode
      t.float  :loudness
      t.float  :speechiness
      t.float :acousticness
      t.float :liveness
      t.float :tempo
      t.integer :time_signature
      t.string :release_image
      t.string :file_name

      t.timestamps
    end
  end
end
