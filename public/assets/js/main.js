/**
* Template Name: Anyar - v2.2.1
* Template URL: https://bootstrapmade.com/anyar-free-multipurpose-one-page-bootstrap-theme/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  // Preloader
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow');
    }
  });

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 2;
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header' || $(this).attr("href") == 'index.html#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-md-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
      $('#topbar').addClass('topbar-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
      $('#topbar').removeClass('topbar-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
    $('#topbar').addClass('topbar-scrolled');
  }

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Intro carousel
  var heroCarousel = $("#heroCarousel");

  heroCarousel.on('slid.bs.carousel', function(e) {
    $(this).find('h2').addClass('animate__animated animate__fadeInDown');
    $(this).find('p, .btn-get-started').addClass('animate__animated animate__fadeInUp');
  });

  // Clients and team carousel (uses the Owl Carousel library)
  $(".clients-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 2
      },
      768: {
        items: 4
      },
      900: {
        items: 6
      }
    }
  });

  $(".team-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      992: {
        items: 2
      }
    }
  });

  // Porfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
      aos_init();
    });

    // Initiate venobox (lightbox feature used in portofilo)
    $(document).ready(function() {
      $('.venobox').venobox();
    });
  });

  // Scroll to a section with hash in url
  $(window).on('load', function() {

    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var target_hash = $(initial_nav);
        var scrollto_hash = target_hash.offset().top - $('#header').outerHeight();
        $('html, body').animate({
          scrollTop: scrollto_hash
        }, 1500, 'easeInOutExpo');
        $('.nav-menu .active, .mobile-nav .active').removeClass('active');
        $('.nav-menu, .mobile-nav').find('a[href="' + initial_nav + '"]').parent('li').addClass('active');
      }
    }

  });

  $(window).on('load', async function() {
    await cargarCards();
  });

  // Portfolio details carousel
  $(".portfolio-details-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out-back",
      once: true
    });
  }
  $(window).on('load', function() {
    aos_init();
  });

})(jQuery);


/* ************** CODIGO AGREGADO ************** */

  $("#login_password").on("keypress", function(e){ //para poder entrar apretando ENTER
    if(e.keyCode == 13){
      ingresar();
    }
  });

  async function ingresar(){
    $('#preloader').show();
    let body = {
      username: $("#login_usuario").val(),
      password: $("#login_password").val()
    }

    const data = await $.post("/login", body);

    if(data.type == "error"){
      $('#preloader').fadeOut('slow');
      Swal.fire({
          icon: data.type,
          title: data.title,
          text: data.text
      })
    }
    else{
      if (data.user.niveles === 'Administrador') window.location = '/home';
      else window.location = '/';
    }
}

async function cargarCards() {
  const articulos = await $.get('/articulos/lista/todos');
  let cards = $('#cards');
  cards.append(`
    <div class="col-md-12">
      <h3>Todos los articulos</h3>
    </div>  
  `);
  articulos.forEach(articulo => {
    const precio = articulo.precio + articulo.precio * articulo.iva / 100;
    let img = '/assets/img/no_image.jpg';
    if (articulo.img) img = articulo.img;
    cards.append(`
      <div class="col-md-3">
        <div class="card" style="width: 18rem; margin-top: 20px;">
          <div class="card-img-top" style="width: 286px; height: 286px; background-image: url('/assets/img/no_image.jpg'); background-repeat: no-repeat; background-size: cover;">
            <div style="width: 100%; height: 100%; background-image: url(${img}); background-repeat: no-repeat; background-size: cover;"></div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${articulo.descripcion}</h5>
            <div class="card-text">Rubro: ${articulo.rubro}</div>
            <div>Precio: ${precio}</div>
            <a href="#" class="btn btn-primary mt-3" onclick="AgregarCarrito(${articulo.id})">Agregar al carrito</a>
          </div>
        </div>
      </div>  
    `);
  });
}

async function AgregarCarrito(item) {
  const session = await $.get(`/session/carrito/${item}`);
  if (session.sesionIniciada) {
    window.location = '/carrito'
  } else {
    $('#modalLogin').modal('show');
  }
}

function crearCuenta() {
  $('#modalRegistro').modal('show');
}

function changeInputEvent(id) {
  $(id).removeClass('input-wrong');
  $('#error-hint').text('');
}

async function registrarUsuario() {
  const nombre = $('#registro_nombre');
  const apellido = $('#registro_apellido');
  const email = $('#registro_email');
  const tel = $('#registro_tel');
  const registro_password = $('#registro_password');
  const registro_password2 = $('#registro_password2');
  if (nombre.val().trim() === '') {
    $('#error-hint').text('No puede haber campos vacios');
    nombre.addClass('input-wrong');
  }
  if (apellido.val().trim() === '') {
    $('#error-hint').text('No puede haber campos vacios');
    apellido.addClass('input-wrong');
  }
  if (email.val().trim() === '') {
    $('#error-hint').text('No puede haber campos vacios');
    email.addClass('input-wrong');
  }
  if (tel.val().trim() === '') {
    $('#error-hint').text('No puede haber campos vacios');
    tel.addClass('input-wrong');
  }
  if (registro_password.val().trim() === '') {
    $('#error-hint').text('No puede haber campos vacios');
    registro_password.addClass('input-wrong');
  }
  if (registro_password2.val().trim() === '') {
    $('#error-hint').text('No puede haber campos vacios');
    registro_password2.addClass('input-wrong');
  }
  if ($('#error-hint').text() != '') return;
  if (registro_password.val().trim() != registro_password2.val().trim()) {
    $('#error-hint').text('Las contraseñas no son iguales');
    registro_password.addClass('input-wrong');
    registro_password2.addClass('input-wrong');
  }
  if ($('#error-hint').text() != '') return;
  if (registro_password.val().trim().length < 6) {
    $('#error-hint').text('La contraseña debe tener al menos 6 caracteres');
    registro_password.addClass('input-wrong');
    registro_password2.addClass('input-wrong');
  }
  if ($('#error-hint').text() != '') return;
  const body = {
    nombre: nombre.val(),
    apellido: apellido.val(),
    email: email.val(),
    tel: tel.val(),
    pass: registro_password.val()
  };
  $("#preloader").show();
  const res = await $.post('/clientes/registro', body);
  $("#preloader").hide();
  Swal.fire({
    icon: res.type,
    title: res.title,
    text: res.text
  }).then(() => {
      if (res.type == "success") $('#modalRegistro').modal('hide');
  });
}

function changePass() {
  Swal.fire({
    title: 'Cambiar clave',
    html: `
      <br>
      <div class="form-group">
          <input class="form-control" maxlength="50" type="password" id="claveActual" placeholder="Clave actual" autocomplete="off">
      </div>
      <div class="form-group">
          <input class="form-control" maxlength="50" type="password" id="claveNueva" placeholder="Nueva contraseña" autocomplete="off">
      </div>
      <div class="form-group">
          <input class="form-control" maxlength="50" type="password" id="claveNueva2" placeholder="Confirme nueva contraseña" autocomplete="off">
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      if ($('#claveNueva').val() != $('#claveNueva2').val()) {
          Swal.showValidationMessage(`Las contraseñas nuevas deben ser iguales`);
      }
      return;
    }
  }).then(async result => {
    if (result.value) {
      $("#preloader").show();
      const body = {
        actual: $('#claveActual').val(),
        nueva: $('#claveNueva').val(),
        nuevaConfirm: $("#claveNueva2").val(),
        cliente: true
      };
      const res = await $.post("/changePass", body);
      $("#preloader").hide();
      Swal.fire({
        icon: res.type,
        title: res.title,
        text: res.text
      });
    }
  });
}