class CreateMashupsSongs < ActiveRecord::Migration
  def change
    create_table :mashups_songs, id: false do |t|
      t.integer :mashup_id
      t.integer :user_id
    end
  end
end
