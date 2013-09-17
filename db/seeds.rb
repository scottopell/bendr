# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'net/http'
require 'json'
require 'echowrap'

rails_dir = File.dirname(File.dirname(__FILE__))
music_dir = "#{rails_dir}/public/music"
files = Dir["#{music_dir}/*.*"]

Echowrap.configure do |config|
  config.api_key =       'Q7FN5RXJQEU2I5NJW'
  config.consumer_key =  '1a31b693704b6841c1041763d0e2948d'
  config.shared_secret = 'ukB4xET1SEKBAO/yjYHR/A'
end

n = 1
files.each do |file|
  file = File.expand_path(file)
  puts "track #{n} - #{file}"

  song = Song.find_by_file_name(File.basename(file))
  if song
    puts "already in db, skipping"
  else
    cont = true
    while cont do
      track = Echowrap.track_upload(track: File.new(file), filetype: 'mp3', bucket: 'audio_summary')

      options = {
        title: track.title,
        artist: track.artist,
        release: track.release,
        duration: track.audio_summary.duration.to_f,
        echonest_id: track.id,
        danceability: track.audio_summary.danceability.to_f,
        energy: track.audio_summary.energy.to_f,
        key: track.audio_summary.key.to_i,
        loudness: track.audio_summary.loudness.to_f,
        mode: track.audio_summary.mode.to_i,
        speechiness: track.audio_summary.speechiness.to_f,
        acousticness: track.audio_summary.acousticness.to_f,
        liveness: track.audio_summary.liveness.to_f,
        tempo: track.audio_summary.tempo.to_f,
        time_signature: track.audio_summary.time_signature.to_i,
        release_image: track.release_image,
        file_name: File.basename(file)
      }

      if track.audio_summary.loudness.to_f == 0
        cont = true
        puts "FAILED RETRYING"
      else
        cont = false
        puts options[:title]
        Song.create(options)

      end

    end
  end

  n += 1
end
