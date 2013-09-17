#Bendr
Bendr is a lovable cartoon robot...no, that's not right.
Bendr is a automatic music mashup generator.
Simply add some music, type in some old song that you're sick of, hit 'Bend'and listen to the new and (hopefully) improved version.

Bendr was developed for PennApps 2013f by a team consisting of Scott Opell, Rick Button, Kirby Kohlmorgen and Brittany Vacchiano.

Note: Due to technical limitations of all the music services we explored, we weren't able to integrate this with Rdio, spotify, or anything like that, hence the need for your own music.

##Usage
The basic steps are as follows, clone this repo, bundle, put music(mp3s only) in public/music and the run db:migrate and db:seed.

Note about the seed file, it isn't the most reliable script we've ever written, it is liable to crash, but you should simply be able to restart it and it will pick up where it left off.

###Steps
`cd ~`

`git clone git@github.com:scottopell/bendr.git`  or whichever one of our forks has the most recent version, I'll try to merge in PRs promptly.

`cd bendr`

`rvm use ruby-2.0` 

`bundle install`

`find ~/path/to/my/music -type f -name '*.mp3' ~/bendr/public/music` or just do this manually, you probably don't want ALL your music.

`rake db:migrate`

`rake db:seed`

`rails s`

This should get you up and running on localhost:3000

Enjoy!
