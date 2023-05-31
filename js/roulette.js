// Ruleta placeholder
var data = [
  { id: '', color: '#3f297e', text: 'Placeholder'},
  { id: '', color: '#1d61ac', text: 'Placeholder'},
  { id: '', color: '#169ed8', text: 'Placeholder'},
  { id: '', color: '#209b6c', text: 'Placeholder'},
  { id: '', color: '#60b236', text: 'Placeholder'},
  { id: '', color: '#efe61f', text: 'Placeholder'},
  { id: '', color: '#f7a416', text: 'Placeholder'},
  { id: '', color: '#e6471d', text: 'Placeholder'},
  { id: '', color: '#dc0936', text: 'Placeholder'},
  { id: '', color: '#e5177b', text: 'Placeholder'},
  { id: '', color: '#be107f', text: 'Placeholder'},
  { id: '', color: '#881f7e', text: 'Placeholder'}
];

// Definición del objeto ruleta
var RouletteWheel = function(el, items){
  this.$el = $(el);
  this.items = items || [];
  this._bis = false;
  this._angle = 0;
  this._index = 0;
  this.options = {
    angleOffset: -90
  }
}

_.extend(RouletteWheel.prototype, Backbone.Events);

// Función de giro de la ruleta
RouletteWheel.prototype.spin = function(_index){
  
  var count = this.items.length;
  var delta = 360/count;
  var index = !isNaN(parseInt(_index))? parseInt(_index) : parseInt(Math.random()*count);
  var spins = 4;
  var a = index * delta + ((this._bis)? 1440 : -1440);
  
  //a+=this.options.angleOffset;
  
  this._bis = !this._bis;
  this._angle = a % 360;
  this._index = index;
  
  var $spinner = $(this.$el.find('.spinner'));
  
  var _onAnimationBegin = function(){
    this.$el.addClass('busy');
    this.trigger('spin:start',this);
  }
  
  var _onAnimationComplete = function () {
    this.$el.removeClass('busy');
    this.trigger('spin:end', this);

  }
  
  
  $spinner
  .velocity('stop')
  .velocity({
    rotateZ: '+=' + a +'deg'
  },{
    //easing: [20, 7],
    //easing: [200, 20],
    easing: 'easeOutQuint',
    duration: 15000,
    begin: $.proxy(_onAnimationBegin,this),
    complete: $.proxy(_onAnimationComplete,this)
  });
  
}

// Función que renderiza la ruleta
RouletteWheel.prototype.render = function(){
  
  var $spinner = $(this.$el.find('.spinner'));
  var D = this.$el.width();
  var R = D*.5;

  var count = this.items.length;
  var delta = 360/count;
  
  for(var i=0; i<count; i++){
    
    var item = this.items[i];
    
    var color = item.color;
    var text = item.text;
    
    var html = [];
    html.push('<div class="item" ');
    html.push('data-index="'+i+'" ');
    html.push('>');
    html.push('<span class="label">');
    html.push('<span class="text">'+text+'</span>');
    html.push('</span>');
    html.push('</div>');
    
    var $item = $(html.join(''));
    
    var borderTopWidth = D + D*0.0025; //0.0025 extra :D
    var deltaInRadians = delta * Math.PI / 180;
    var borderRightWidth = D / ( 1/Math.tan(deltaInRadians) );
    
    var r = delta*(count-i) + this.options.angleOffset - delta*.5;
    
    $item.css({
      borderTopWidth: borderTopWidth,
      borderRightWidth: borderRightWidth,
      transform: 'scale(2) rotate('+ r +'deg)',
      borderTopColor: color
    });
    
    var textHeight = parseInt(((2*Math.PI*R)/count)*.5);
        
    $item.find('.label').css({
      //transform: 'translateX('+ (textHeight) +'px) translateY('+  (-1 * R) +'px) rotateZ('+ (90 + delta*.5) +'deg)',
      transform: 'translateY('+ (D*-.25) +'px) translateX('+  (textHeight*1.03) +'px) rotateZ('+ (90 + delta*.5) +'deg)',
      height: textHeight+'px',
      lineHeight: textHeight+'px',
      textIndent: (R*.05)+'px'
    });
    
    $spinner.append($item);
       
  }
  
  $spinner.css({
    fontSize: parseInt(R*0.04)+'px'
  })
  
  //this.renderMarker();

  
}

// Función que renderiza los Marcadores de la ruleta
RouletteWheel.prototype.renderMarker = function(){
  
  var $markers = $(this.$el.find('.markers'));
  var D = this.$el.width();
  var R = D*.5;

  var count = this.items.length;
  var delta = 360/count;
      
  var borderTopWidth = D + D*0.0025; //0.0025 extra :D
  var deltaInRadians = delta * Math.PI / 180;
  var borderRightWidth = (D / ( 1/Math.tan(deltaInRadians) ));

  var i = 0;  
  var $markerA = $('<div class="marker">');
  var $markerB = $('<div class="marker">');

  var rA = delta*(count-i-1) - delta*.5 + this.options.angleOffset;
  var rB = delta*(count-i+1) - delta*.5 + this.options.angleOffset;
    
  $markerA.css({
    borderTopWidth: borderTopWidth,
    borderRightWidth: borderRightWidth,
    transform: 'scale(2) rotate('+ rA +'deg)',
    borderTopColor: '#FFF'
  });
  $markerB.css({
    borderTopWidth: borderTopWidth,
    borderRightWidth: borderRightWidth,
    transform: 'scale(2) rotate('+ rB +'deg)',
    borderTopColor: '#FFF'
  })
  
  $markers.append($markerA);
  $markers.append($markerB);
  
}

RouletteWheel.prototype.bindEvents = function(){
  this.$el.find('.button').on('click', $.proxy(this.spin,this));
}

// Función que gestiona el orden de eventos
var spinner;
var selectedText = '';
$(window).ready(function(){
  
  spinner = new RouletteWheel($('.roulette'), data);
  spinner.render();
  spinner.bindEvents();
  
  spinner.on('spin:start', function(r){ 
    console.log('spin start!');
    var audioSpin = new Audio('sounds/spin_sound.wav');
    audioSpin.play();
    setTimeout(function() {
      var audioWin = new Audio('sounds/winner.mp3');
      audioWin.play();
    }, 14000);
  });
  
  spinner.on('spin:end', function(r) {
    console.log('spin end! -->', r._index);
  });
  
})

// Función para conseguir un color aleatorio, descartada
/*
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
*/

// Función para conseguir una progresión de colores
var initialHue = 0; // Valor inicial para la progresión de colores
var hueIncrement = 30; // Cantidad a incrementar por linea

function getColorFromProgression(index) {
  // Calcula el Hue en base al índice
  var hue = (initialHue + index * hueIncrement) % 360;

  // Convierte de color HSL a RGB
  var hslToRgb = function(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    var r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    var toHex = function(x) {
      var hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + toHex(r) + toHex(g) + toHex(b);
  };

  return hslToRgb(hue, 100, 50); // Usamos 100% de saturación y 50% de brillo
}

function parseText() {
  // Guarda el texto del campo de texto
  var text = document.getElementById('inputText').value;

  // Separa el texto en líneas
  var lines = text.split('\n');

  var items = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();

    // Añadimos el objeto si no está vacío
    if (line !== '') {
      items.push({
        id: '',
        color: getColorFromProgression(i),
        text: line,
      });
    }
  }

  // Mostramos la lista de nombres
  var output = document.getElementById('output');
  output.innerHTML = '<ul>';
  for (var j = 0; j < items.length; j++) {
    output.innerHTML += '<li>' + items[j].text + '</li>';
  }
  output.innerHTML += '</ul>';

  spinner.items = items; // Actualizamos la ruleta
  spinner.render(); // Renderizamos de nuevo la ruleta
  spinner.bindEvents(); // Reconectamos los eventos con la ruleta
  
}
