let counter = document.getElementById("counter")

class SideBar {
  static toggleUI() {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
    }    
  }

  static toggleState() {
    localStorage.setItem('was-navbar-visible', localStorage.getItem('was-navbar-visible') != "true");
  }

  static toggle() {
    this.toggleState();
    this.toggleUI();
  }
}

(function($) {
  "use strict"; // Start of use strict  

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }

  if (localStorage.getItem('was-navbar-visible') == "true") {
      SideBar.toggleUI();
  }

  const param = $(location).attr("pathname");

  $("ul#accordionSidebar>li>a").each(function() {
    if (param === $(this).attr('href')) {
      $(this).parent().addClass('active');
    }    
  });

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
      SideBar.toggle();
  });  

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

  // Database initialization
  window.fdb = new ForerunnerDB();
  window.db = fdb.db('commonsampledb');

  // Redirect to get started page if no timetable is found
  // db.collection('timetables').load(function() {
  //   if (db.collection('timetables').find().length == 0) {
  //     window.location.href = "/getstarted";
  //   }
  // })

  

  // Do something after the collection gets loaded
  // db.collection('counter').load(function() {

  //   if (!db.collection('counter').findOne({"count":{'$exists': 'true'}})) {
  //       db.collection('counter').setData({"count": 0});
  //       db.collection('counter').save();
  //       console.log("Created yc");
  //   }

  //   counter.innerHTML = db.collection('counter').findOne({"count":{'$exists': 'true'}})['count'];

  //   counter.onclick = function () {
  //     var c = db.collection('counter').findOne({"count":{'$exists': 'true'}})['count'] + 1;
        
  //     db.collection('counter').setData({'count': c});
  //     db.collection('counter').save();

  //     counter.innerText = c.toString();
  //   }
  // });
  


})(jQuery); // End of use strict
