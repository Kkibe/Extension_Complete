$(function () {
  $(".source").each(function (e) {//direct to a function and store used IDs and call when a new source is added to make new sources work
    $(this).attr("source-id", e);
    var color = $(this).attr("particle-color").split(','); //get colours
    var styleString = ""; //to give the particles the colour
    for (var i = 0; i < color.length; i++) {//admitedly just having an extra element would be easier
      styleString += `.source[source-id="${e}"] .particle-color-${i}:before { background-color:${color[i]} !important }`;
    }
    $(this).append(`<style>${styleString}</style>`); //but it's neat

    for (var i = 0; i < parseInt($(this).attr("particle-count")); i++) {
      var angle = Math.random() * 360;
      $(this).append(`<div class="particle-wrapper" style="transform:rotate(${angle}deg)"><div class="particle particle-color-${getRandomInt(color.length)}" style="height:${getRandomArbitrary(parseInt($(this).attr("particle-distance")) / 10, parseInt($(this).attr("particle-distance")))}px; animation-duration: ${getRandomArbitrary(1, 4)}s; animation-delay:-2s;"></div></div>`);
      //This creates a particle wrapper with a random angle, then inside the particle with a random height and animation duration; there is a negative animation delay of -2s to randomise the particles for the demo
    }
  });

  /*Demo*/
  if (window.location.href.indexOf("fullcpgrid") !== -1) {
    setTimeout(function () {
      $(`.example-blue`).addClass("particle-do");
      setTimeout(function () {
        $(`.example-blue`).removeClass("particle-do");
      }, 2000);
    }, 1);
  }
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/*Stuff for the pen*/
/*If I actually use this I won't need this stuff and just do add and remove class*/
$(document).on("click", "[particle-do]", function () {
  var attr = $(this).attr("particle-do");
  $this = $(this);
  if (!$(attr).hasClass("do") && !$this.hasClass("disabled")) {
    console.log("ok");
    if (isNaN(attr)) {
      if ($(attr).length > 0) {
        $(attr).addClass("particle-do");
        $this.addClass("disabled");
        $this.addClass($this.attr("particle-set-class-on-do"));
        setTimeout(function () {
          $this.removeClass();
          $(attr).removeClass("particle-do");
        }, 2000);
      } else {
        console.warn(`Particle source "${attr}" not found.`);
      }
    }
  }
});
$("[set-attr-target]").click(function () {
  if (!$(this).is("[set-attr-target][set-attr]")) {
    console.warn("This set-attr-target is not correctly set up");
    return;
  }
  var target = $(this).attr("set-attr-target");
  $(".select-color").removeClass("selected");
  $(this).addClass("selected");
  var attr = $(this).attr("set-attr").split(';').map(function (x) {return x.split(',');});
  for (var i = 0; i < attr.length; i++) {
    if (attr[i].length == 2) {
      $(target).attr(attr[i][0], attr[i][1]);
    }
  }
});