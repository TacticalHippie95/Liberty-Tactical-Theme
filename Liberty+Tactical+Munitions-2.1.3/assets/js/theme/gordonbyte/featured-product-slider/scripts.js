export default function(){
	var respWidth = window.innerWidth;
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("safari/") !== -1 && ua.indexOf("chrom") === -1) {
		respWidth = $(window).width();
	}
	
	$('.HomepageProductSlider.hps-overlay .productSlider').on('init', function(event, slick, currentSlide){
		if($('.HomepageProductSlider').length > 0 ){
			var headerHeight = $(".HomepageProductSlider").outerHeight();

			if (respWidth > 990) {
				$(".HomepageProductSlider .slick-track").css("height", headerHeight);
				$(".HomepageProductSlider").css("margin-top", "-" + headerHeight + "px");
			}
		}
	});
}
