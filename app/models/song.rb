class Song < ActiveRecord::Base
  has_and_belongs_to_many :mashup
  validates_presence_of :title, :duration, :echonest_id, :key, :mode, :tempo, :file_name

  def find_similar
    #Find in same key
    valid_keys = [(key - 1) % 12, key, (key + 1) % 12] 
    threshold = 10
    attrs = ["energy", "speechiness", "acousticness", "danceability", "loudness", "liveness"]
    sql = "((key IN (?) AND mode = ?) OR (key = ?)) AND tempo < ? + ? AND tempo > ? - ? AND id != ? "

    conditions = Hash.new
    conditions[:select] = "#{Song.quoted_table_name}.*, "
    selects = Array.new
    attrs.each do |attr|
      v = send(attr)
     selects << "ABS(#{v} - #{attr}) as diff_#{attr}"
    end
    conditions[:select] += selects.join(",")
    conditions[:limit] = 5
    conditions[:conditions] = "((key IN (#{valid_keys.join(',')}) AND mode = #{mode}) OR (key = #{key})) AND tempo < #{tempo} + #{threshold} AND tempo > #{tempo} - #{threshold} AND id != #{id}" 
    conditions[:order] = attrs.map{ |a| "diff_#{a} ASC" }.join(",")

    results = Song.all conditions
  end

  def self.path file_name
    if S3
      encoded = URI::encode(file_name)
      "https://s3.amazonaws.com/bendr-music/#{encoded}"
    else
      "/music/#{file_name}"
    end
  end

end
