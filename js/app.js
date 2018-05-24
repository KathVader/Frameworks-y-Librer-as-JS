$(document).ready(function(){

  $('.btn-reinicio').on('click',function(){
      if(this.innerHTML == 'Iniciar'){
        this.innerHTML = 'Reiniciar';
        Dulces.iniGame();
      }else{
        Dulces.reiniGame();
      }
    });

  animacionTitulo(function(){
    $('img').css({ 'width':'90px', 'height':'90px' })
  });
});

function animacionTitulo(){
  var div = $('h1');
  var color1 = '#DCFF0E';
  var color2 = '#FFFFFF';

  div.animate({color: color1}, 700, function()
  {
    div.animate({color: color2}, 700, function()
    {
      animacionTitulo();
    });
  });
}

//Temporizador
$("#timer").empty()
$("#timer").append("<span class=min>02</>")
$("#timer").append("<span class=min>:</>")
$("#timer").append("<span class=sec>00</>")

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var sec = Math.floor((t / 1000) % 60);
  var min = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'min': min,
    'sec': sec
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var minutesSpan = clock.querySelector('.min');
  var secondsSpan = clock.querySelector('.sec');
  var pScore = document.getElementsByClassName('panel-score')[0];
  var pTablero = document.getElementsByClassName('panel-tablero')[0];


$(pTablero).animate(
    {
      width: "70%"
    },{
      step: function(now, fx){
        $(pScore).css('width','25%');
      },
      duration: 1,
      complete: function() {
        $(pTablero).show();
      }
    }
  );
  
  function updateClock() {
    var t = getTimeRemaining(endtime);
    minutesSpan.innerHTML = ('0' + t.min).slice(-2);
    secondsSpan.innerHTML = ('0' + t.sec).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
        $(pTablero).animate(
          {
            width: "0%"
          },{
            step: function(now, fx){
              $(pScore).css('width','90%');
            },
            duration: 5,
            complete: function() {
              $(this).hide();
            }
          }
        );
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}


var rows = 7;
var cols = 7;
var movimientos = 0;
var score = 0;
var tablero = [];
var cnt = null;
var bndR = false;
var bndC = false;
var interval;

var Dulces = {
  iniGame: function(){
    cnt = this;
    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < cols; j++) {
        var altr = Math.floor(Math.random() * (5 - 1)) + 1;
        var elemento = $('<img id="'+i+'-'+j+'" src="image/'+altr+'.png" class="elemento" data-item="bloque-'+altr+'" />');
        row[j] = elemento;
        $('.col-'+(j+1)).append(elemento);
        this.Eventos(elemento);
      }
      tablero[i] = row;
    }

    var tiempo = new Date(Date.parse(new Date()) + 2* 60 * 1000);
    initializeClock('timer', tiempo);

    this.Columnnas();
    this.Filas();
    interval = setInterval(cnt.nuevos, 500);
  },

  Eventos: function(elemento){
    var cnt = this;
    $(elemento).draggable({revert:"invalid", snap:".elemento", snapMode:"inner", zIndex:9, helper:"clone", cursor:"move"});
    $(elemento).droppable({
      drop: function(event, ui ) {
        movimientos++;
        $('#movimientos-text').html(movimientos);

        var idItemA = ui.draggable.attr('id');
        var idItemB = $(this).attr('id');
        var posItemA = idItemA.split('-');
        var posItemB = idItemB.split('-');

        var dragElem = $(ui.draggable).clone().replaceAll(this);
        $(this).replaceAll(ui.draggable);

        dragElem.attr('id',idItemB);
        $(this).attr('id',idItemA);

        tablero[posItemA[0]][posItemA[1]] = $(this);
        tablero[posItemB[0]][posItemB[1]] = dragElem;

        cnt.Eventos(this);
        cnt.Eventos(dragElem);
        
        cnt.Columnnas();
        cnt.Filas();
      }
    });
  },

  Columnnas: function(){
    for (var i = 0; i < rows; i++) {
      var tmpPrev,tmpNext = null
      for (var j = 0; j < cols; j++) {
          var actual = tablero[i][j];
          if(j!=0){
            tmpPrev = tablero[i][j-1]
          }else {
            tmpPrev = null;
          }
          if(j!=(cols-1)){
            tmpNext = tablero[i][j+1];
          }else{
            tmpNext = null;
          }
          if(tmpPrev && tmpNext){
            var oB1 = actual.attr('data-item');
            var oB2 = tmpPrev.attr('data-item');
            var oB3 = tmpNext.attr('data-item');

            if(oB1 == oB2 && oB1 == oB3){
              score += 100;
              $('#score-text').html(score);
              this.remove(tmpPrev);
              this.remove(actual);
              this.remove(tmpNext);
            }
          }
        }
    }
    bndC = true;
  },
  Filas: function(){
    var bndRemove = false;
    for (var i = 0; i < cols; i++) {
      var tmpPrev,tmpNext = null
      for (var j = 0; j < rows; j++) {
          var actual = tablero[j][i];
          tmpPrev = null
          if(j!=0){
            tmpPrev = tablero[j-1][i]
          }else {
            tmpPrev = null;
          }
          if(j!=(rows-1)){
            tmpNext = tablero[j+1][i];
          }else{
            tmpNext = null;
          }
          if(tmpPrev && tmpNext){
            var oB1 = actual.attr('data-item');
            var oB2 = tmpPrev.attr('data-item');
            var oB3 = tmpNext.attr('data-item');

            if(oB1 == oB2 && oB1 == oB3){
              score += 100;
              bndRemove = true;
              $('#score-text').html(score);
              this.remove(tmpPrev);
              this.remove(actual);
              this.remove(tmpNext);
            }
          }
        }
    }
    bndR =true;
  },
  remove: function(elemento,bandera) {
      elemento
        .animate(
          {
            opacity: 0.15,
            width: "-=50px"
          },{
            step: function(now, fx){
              $(this).addClass('animacion');
            },
            duration: 1000,
            complete: function() {
              $(this).removeClass('animacion');
              $(this).remove();
            }
          }
        )

  },
  nuevos: function(){
    if(bndR==true && bndC ==true){
        for (var j = 0; j < cols; j++) {
          var col = $('.col-'+(j+1)+' > img');
          for (var i = col.length; i < cols; i++) {
            var altr = Math.floor(Math.random() * (5 - 1)) + 1;
            var elemento = $('<img src="image/'+altr+'.png" class="elemento" data-item="bloque-'+altr+'" />');
            $('.col-'+(j+1)).prepend(elemento);
            cnt.Eventos(elemento);
          }
        }
        var i=0;
        var j=-1;
        $('.elemento').each(function(altr, el) {
          if(altr%cols == 0){
            j++;
            i=0;
          }else{
            i++;
          }
          $(el).attr('id',i+"-"+j);
          tablero[i][j] = $(el);
        });
        bndR=false;
        bndC=false;
        cnt.Filas();
        cnt.Columnnas();
      }
  },
  reiniGame: function(){
    for (var i = 0; i < cols; i++) {
      $('.col-'+(i+1)).empty();
    }
    $('#movimientos-text').html('0');
    $('#score-text').html('0');
    rows = 7;
    cols = 7;
    movimientos = 0;
    score = 0;
    tablero = [];
    cnt = null;
    bndR = false;
    bndC = false;
    interval;
    this.iniGame();
  }

}
