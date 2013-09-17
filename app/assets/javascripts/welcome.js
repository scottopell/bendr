var majorSource, minorSource = null;
var firstData, secondData = null;
var hasStarted = false;

var majorGain = audio.createGain();
var minorGain = audio.createGain();
minorGain.connect(proc);

function loadAudio(data) {
  console.log(data);
  if (hasStarted) {
    stop(majorSource, 0);
    stop(minorSource, 0);
  }
  if (data.sentinel == "mashup_view"){
    // we know that its displaying a previously saved mashup
    $(".typeahead").eq(0).val(data.first.title);
    $("#mashup_query").attr("data-id", data.first.id);
    console.log("mashup display view");
  }
  first = data.first.url;
  list = data.list;

  populateMatches(list);
  markPlayingMatch(0);

  if (list.length == 0) {
    alert("No matches found");
  } else {
    var json = data;
    console.log(data.first.title);
    console.log(list[0].title);
    loadStream(first, majorGain, function(firstSource) {
      majorSource = firstSource;
      loadStream(list[0].url, minorGain, function(secondSource) {
        minorSource = secondSource;
        firstData = data.first;
        secondData = data.list[0];
        resetPlaybackRates();
        modifyTempo(firstData.tempo, secondData.tempo);
        majorSource.mediaElement.play();
        minorSource.mediaElement.play();
        hasStarted = true;
      });
    });
  }
}

function resetPlaybackRates() {
  if (majorSource.playbackRate != undefined) {
    majorSource.playbackRate.value = 1.0
  } else {
    majorSource.mediaElement.playbackRate = 1.0
  }

  if (minorSource.playbackRate != undefined) {
    minorSource.playbackRate.value = 1.0
  } else {
    minorSource.mediaElement.playbackRate = 1.0
  }
}

function modifyTempo(x, y) {
  if (x > y) {
    z = y/x;
    if (majorSource.playbackRate != undefined) {
      majorSource.playbackRate.value = z;
    } else {
      majorSource.mediaElement.playbackRate = z;
    }
  } else {
    z=x/y;
    if (minorSource.playbackRate != undefined) {
      minorSource.playbackRate.value = z;
    } else {
      minorSource.mediaElement.playbackRate = z;
    }
  }
}

function stop(source, t) {
  if (source.mediaElement != undefined) {
    source.mediaElement.pause();
  } else {
    source.stop(t);
  }
}

function start(source, t) {
  if (source.mediaElement != undefined) {
    source.mediaElement.play();   
  } else {
    source.start(t);
  }
} 

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function populateMatches(list) {
  d = $(".list-group.matches")
  d.empty();
  for (i = 0; i < list.length; i++) {
    var randNum = getRandomInt(0,5)*(list.length-i);
    l = list[i];
    row = $("<a data-index='" + i + "'data-json='" + htmlEscape(JSON.stringify(l)) + "'class='list-group-item'>" +
      l.title + "<span class='badge'>" + randNum + "</span>" +
      "</a>");
    d.append(row);
    row.click(function() {
      i = $(this).attr('data-index');
      json = htmlUnescape($(this).attr('data-json'));
      if (hasStarted) {
        switchMix(i, json);
      }
    });
  }
  d.removeClass("hide");
}

function switchMix(i, json) {
  playPauseToggle();
  console.log(i)
  json = JSON.parse(json);
  stop(majorSource, 0);
  stop(minorSource, 0);
  markPlayingMatch(i);
  fixPlayButton();
  loadStream(firstData.url, majorGain, function(firstSource) {
    majorSource = firstSource;
    loadStream(json.url, minorGain, function(secondSource) {
      minorSource = secondSource;
      secondData = json;
      resetPlaybackRates();
      modifyTempo(firstData.tempo, secondData.tempo);
      start(majorSource, 0);
      start(minorSource, 0);
    });
  });
  
}

function markPlayingMatch(i) {
  $(".list-group.matches > a").removeClass("active");
  $(".list-group.matches > a:eq(" + i + ")").addClass("active");
}

function fixPlayButton() {
  if ($('.icon-play').is(':visible')) {
    $('.icon-play').toggle();
    $('.icon-pause').toggle();
  }
}

function loadStream(url, dest, callback) {
  var aud = new Audio();
  console.log(url);
  aud.src = url;
  document.body.appendChild(aud);
  source = audio.createMediaElementSource(aud);
  source.connect(dest);
  callback(source);
}

function htmlEscape(str) {
  return String(str)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
}

function htmlUnescape(value){
  return String(value)
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');
}

function buttonClicks(){
  $('.icon').click(function(){
    switch($(this).attr('class').split(' ')[0]){
      case 'icon-play':
        majorSource.mediaElement.play();
        minorSource.mediaElement.play();
        $('.icon-play').toggle();
        $('.icon-pause').toggle();
        break;
      case 'icon-pause':
        majorSource.mediaElement.pause();
        minorSource.mediaElement.pause();
        $('.icon-play').toggle();
        $('.icon-pause').toggle();
        break;
      case 'icon-volume-off':
        if(majorSource.mediaElement.muted || minorSource.mediaElement.muted){
          $('.icon-volume-off').removeClass("muted");
          majorSource.mediaElement.muted = false;
          minorSource.mediaElement.muted = false;
        }
        else{
          $('.icon-volume-off').addClass("muted");
          majorSource.mediaElement.muted = true;
          minorSource.mediaElement.muted = true;
        }
        break;
      case 'icon-volume-down':
        if (majorSource.mediaElement.volume > 0.0)
          majorSource.mediaElement.volume -= .1
        if (minorSource.mediaElement.volume > 0.0)
          minorSource.mediaElement.volume -= .1
        break;
      case 'icon-volume-up':
       console.log("oaoeaoeeu");
        if (majorSource.mediaElement.volume < 1.0)
          majorSource.mediaElement.volume += .1
        if (minorSource.mediaElement.volume < 1.0)
          minorSource.mediaElement.volume += .1
        break;
      case 'icon-share':
        $.post('mashups/persist',
              {first: firstData.id, second: secondData.id}, 
              function(data){
                console.log(data.mashup_path);
                if (data.error_id == 1){
                  alert("Cannot share mashup currently");
                } else {
                  $("#share_url_box").text(data.mashup_path);
                }
              }
        );
        $('#myModal').modal('show');
        break;
      case 'icon-thumbs-up':
        addUpThumb();
        break;
      case 'icon-thumbs-down':

        break;
    }
  });
}

function addUpThumb(){
  $('.matches').children().each(function(){
    if($(this).hasClass('active')){
      var curr = parseInt($(this).children('span').html());
      $(this).children('span').html(curr+1);
    }
  });
}

function doThatSound(){
  $('.icons').show();
  mashup_id = $("#mashupid").attr("data-mashupid");
  song_id = $("#mashup_query").attr("data-id");
  console.log(song_id);
  
  if (mashup_id != null){
    mashup_url = "http://" + window.location.host + "/mashups/" + mashup_id + ".json"
    $.get( mashup_url , loadAudio);
  } else {
    $.get('songs/' + song_id, loadAudio); 
  }
}

function playPauseToggle(){
  if( $('.icon-pause').is(':visible') ){
    $('.icon-pause').hide();
    $('.icon-play').show();
    majorSource.mediaElement.pause();
    minorSource.mediaElement.pause();
  }else{
    $('.icon-play').hide();
    $('.icon-pause').show();
    majorSource.mediaElement.play();
    minorSource.mediaElement.play();
  }
}

$(document).ready(function() {
  $('#mashup_query').typeahead({
    name: 'search',
    remote: '/search?q=%QUERY',
    valueKey: 'title',
    limit: 10
  });
  $('.typeahead.input-sm').siblings('input.tt-hint').addClass('hint-small');
  $('.typeahead.input-lg').siblings('input.tt-hint').addClass('hint-large');
  $("#mashup_query").on("typeahead:selected typeahead:autocompleted", function(e, datum) {
    $("#mashup_query").attr("data-id", datum.id);
  });
  $(".bend").on("click", function(event){
    doThatSound();0
  });
  
  $('.icons').hide();
  $('.icon-play').hide();
  buttonClicks();

  song_id = $("#mashupid").attr("data-mashupid");
  if (song_id != null){
    doThatSound();
  }
  
  if( $('.icon-pause').is(':visible') ){
    $('.icon-play').hide();
  }
  if( $('.icon-play').is(':visible') ){
    $('.icon-pause').hide();
  }
  
  $('.search-box').keydown(function(e) {
    var code = e.which;
    if(code==32||code==13||code==188||code==186||code==9){
      doThatSound();
      $("*").blur();
    }
  });

  $("*").keydown(function(e) {
    var code = e.which;
    if(code==32){
      playPauseToggle();
    }
  });

});
