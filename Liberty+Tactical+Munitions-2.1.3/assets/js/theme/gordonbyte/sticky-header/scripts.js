export default function (){
    if($('.headerSticky').length > 0 ){
      var header = $("#header");
      var bodyElement = $("#main-content");
      var headerHeight = $("#header").outerHeight();

      $(window).on('scroll', myFunction);

      // Get the offset position of the navbar
      var offsetpos = header.offset();
      var sticky = offsetpos.top;

      
      function myFunction() {
        if (window.pageYOffset > sticky) {
          header.addClass("sticky");
          bodyElement.css("padding-top", (headerHeight) + "px");
        } else {
          header.removeClass("sticky");
          bodyElement.css("padding-top", 0);
        }
      }
    }
}
