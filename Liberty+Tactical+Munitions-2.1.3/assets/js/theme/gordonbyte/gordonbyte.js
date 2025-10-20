import featuredProductSlider from './featured-product-slider/scripts';
import categoryProducts from './category-products/scripts';
import FeaturedProduct from './featured-product/scripts';
import Instagram from './instagram/scripts';
import StickyHeader from './sticky-header/scripts';
import Swatches from './swatches/scripts';
import Reorder from './reorder/scripts';
import Hero from './hero/scripts';
import lity from 'lity';

export default function(){
	Instagram();
	StickyHeader();
	Reorder();
	Hero();
}

const featuredProduct = new FeaturedProduct();
featuredProduct.request();

const categoryProd = new categoryProducts();
categoryProd.setup();
categoryProd.activebtn();

featuredProductSlider();

window.addEventListener("load", (event) => {
	if($('.swatch-endabled')[0]){
		const swatches = new Swatches();
		swatches.filter();
		swatches.getOptions();
	}

	if($('.HomepageProductSlider .productSlider')[0]){
		$('.HomepageProductSlider .productSlider').slick({
			"mobileFirst": true,
			"slidesToShow": 1,
			"slidesToScroll": 1,
			"infinite": true,
			"dots": false,
			"speed":6000,
			"autoplay": true,
			"autoplaySpeed": 0,
			"centerMode": true,
			"cssEase": "linear",
			"slidesToShow": 1,
			"slidesToScroll": 1,
			"initialSlide": 1,
			"pauseOnHover": false,
			"responsive": [
			{
			"breakpoint": 1301,
			"settings": {
				"slidesToShow": 4,
				"slidesToScroll": 4
			}
			},
			{
			"breakpoint": 992,
			"settings": {
				"slidesToShow": 3,
				"slidesToScroll": 3
			}
			},
			{
			"breakpoint": 768,
			"settings": {
				"slidesToShow": 2,
				"slidesToScroll": 2
			}
			},
			{
			"breakpoint": 600,
			"settings": {
				"slidesToShow": 1,
				"slidesToScroll": 1
			}
			}
			],
			"lazyLoad": "anticipated",
			"slide": ".product-carouselinfo",
			"prevArrow": ".product-carousel-prev-arrow",
			"nextArrow": ".product-carousel-next-arrow"
		});
	}
});
