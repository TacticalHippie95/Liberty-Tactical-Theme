import utils from '@bigcommerce/stencil-utils';

const template = 'pages';

export default class CategoryProducts{

  constructor(){
	  this.catID;
    this.type;
    this.style = ((jQuery(".gb-grid").length)? true : false);
    this.page = 1;
    this.perRow = $('.category-selections').data('gbperrow');
    this.limit = $('.category-selections').data('gbloadin');
    this.token = $('#header').data('apitok');
  }


  setup(){
    $('.categoryProducts .productCarousel').empty();
    this.appendPlaceholderProducts();

    let catList = $('.category-selections li.active-cat');
    
    if(catList.length == 0){
      return;
    }
    
    this.catID = catList.data('gbcatid');
    this.type = catList.data('gbtype');

    this.request();
  }


  request(){
    let productGrid;
    utils.api.getPage(`/categories.php?category=${this.catID}&limit=${this.limit}&page=${this.page}&sort=${this.type}`, template, (err, resp) => {

      if(this.style){
        productGrid = $(resp).find(".productGrid");
      } else {
        productGrid = $(resp).find(".productGrid li");
      }

      this.display(productGrid);
    });
  }


  display(p){
    if(!this.style){
      $('.categoryProducts .productCarousel').removeClass('slick-initialized');
      $('.categoryProducts .productCarousel').removeClass('slick-slider');

      p.each((i,e) => {
        $(e).addClass("productCarousel-slide");
      });

      this.removePlaceholderProducts();
      p.appendTo('.categoryProducts .productCarousel');

      $(".categoryProducts .productCarousel").slick({
        infinite: true,
        mobileFirst: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        responsive: [
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: this.perRow,
              slidesToScroll: this.perRow,
            }
          },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          }
        }]
      });

    } else {
      this.removePlaceholderProducts();
      p.appendTo('.categoryProducts .productCarousel');
    }

    let card_ids = [];

    $(".categoryProducts .product-carousel-holder .card").each((i,e) =>{
      card_ids.push($(e).data('gbproduct-id'));
    });

    this.getOptions(this.token, card_ids);
  }


  activebtn(){
    $('.category-selections li a').on('click', (e) => {
      e.preventDefault();

      $('.category-selections li.active-cat').removeClass('active-cat');
      let parent = e.currentTarget.parentNode;
      $(parent).addClass('active-cat');

      this.setup();
    });
  }


  getOptions(t, f){
    var productSwatch = [];

    fetch('/graphql',{
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + t
      },
      body: JSON.stringify({
        query: `
        query SeveralProductsByID {
        site {
          products(first: 20, entityIds: [${f}]) {
            edges {
              node {
                entityId
                name
                productOptions(first: 5) {
                  edges {
                    node {
                      entityId
                      displayName
                      isRequired
                      ... on CheckboxOption {
                        checkedByDefault
                      }
                      ... on MultipleChoiceOption {
                        values(first: 10) {
                          edges {
                            node {
                              entityId
                              label
                              isDefault
                              ... on SwatchOptionValue {
                                hexColors
                                imageUrl(width: 200)
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              }
            }
          }
        }`
      })
    }).then(res => res.json()).then(data => {
      var productE = data.data.site.products.edges;

      productE.forEach((item, i) => {
        var productO = item.node.productOptions.edges;
        var product_ID = item.node.entityId;

        productO.forEach((options, x) => {
            if(productSwatch[product_ID]){
              return;
            }

            var optionVal = options.node.values.edges;

            if ('hexColors' in options.node.values.edges[0].node === true) {
              productSwatch[product_ID] = [];

              optionVal.forEach((color, ii) => {

                productSwatch[product_ID].push([color.node.hexColors, color.node.imageUrl]);
              });

            }

        });

      });

      this.colorSwatchSetUp(productSwatch);

    }).catch((error) => {
      console.log(error);
    });
  }


  colorSwatchSetUp(ps){
    ps.forEach((item, i) => {
      var total = item.length;

      item.forEach((ite, r) => {
        $('.categoryProducts .card[data-gbproduct-id="' + i + '"]').each(function(){
          var swatch = $('<div/>').addClass('form-option-wrapper');

          if (ite[1]) {
              var label = $('<label/>').addClass('form-option form-option-swatch gb-swatch-pattern');
              var span = $('<span/>').addClass('form-option-variant form-option-variant--pattern');

              span.attr('style', 'background-image: url(' + ite[1] + ')');
              label.append(span);
          } else {
            var label = $('<label/>').addClass('form-option form-option-swatch');

            for(var n = 0; n < ite[0].length; n++){
              var span = $('<span/>').addClass('form-option-variant form-option-variant--color');
              span.css('background-color', ite[0][n]);
              label.append(span);
            }
          }

          swatch.append(label);

          $(this).find('.form-field').append(swatch);
        });
      });

      if(total > 5){
        total = total - 5;
        $('.categoryProducts .card[data-gbproduct-id="' + i + '"] .form-field swatch-total').remove();
        $('.categoryProducts .card[data-gbproduct-id="' + i + '"] .form-field').append('<span class="swatch-total">+' + total + '</span>');
      }
    });
  }

  appendPlaceholderProducts() {
    const placeholderItem = `
    <li class="product productCarousel-slide">
      <article class="card">
        <figure class="card-figure">
          <div class="card-img-container skeleton"></div>
        </figure>
        <div class="card-body skeleton-bg">
          <div class="card-swatch" data-cardtype="featured">
            <div class="form-field" data-product-attribute="swatch">
              <div class="form-option-wrapper">
                <label class="form-option form-option-swatch">
                  <span class="form-option-variant form-option-variant--color skeleton"></span>
                </label>
              </div>
              <div class="form-option-wrapper">
                <label class="form-option form-option-swatch">
                  <span class="form-option-variant form-option-variant--color skeleton"></span>
                </label>
              </div>
              <div class="form-option-wrapper">
                <label class="form-option form-option-swatch">
                  <span class="form-option-variant form-option-variant--color skeleton"></span>
                </label>
              </div>
              <div class="form-option-wrapper">
                <label class="form-option form-option-swatch">
                  <span class="form-option-variant form-option-variant--color skeleton"></span>
                </label>
              </div>
              <div class="form-option-wrapper">
                <label class="form-option form-option-swatch">
                  <span class="form-option-variant form-option-variant--color skeleton"></span>
                </label>
              </div>
              <div class="form-option-wrapper">
                <label class="form-option form-option-swatch">
                  <span class="form-option-variant form-option-variant--color skeleton"></span>
                </label>
              </div>
              <div class="form-option-wrapper">
                <label class="form-option form-option-swatch">
                  <span class="form-option-variant form-option-variant--color skeleton"></span>
                </label>
              </div>
            </div>
          </div>
          <p class="card-text card-brandname skeleton skeleton-text skeleton-short skeleton-text-small" data-test-info-type="brandName"></p>
          <h3 class="card-title skeleton skeleton-text-medium"></h3>
          <h3 class="card-title skeleton skeleton-text-medium"></h3>
          <p class="card-text skeleton skeleton-medium skeleton-text-medium" data-test-info-type="productRating"></p>
          <br>
          <div class="card-text" data-test-info-type="price">
            <div class="skeleton skeleton-text-medium"></div>
            <div class="skeleton skeleton-text-medium"></div>
          </div>
        </div>
        <div class="addtocart-btn skeleton skeleton-text-large"></div>
      </article>
    </li>`;

    const placeholderList = `
    <ul class="productGrid productGrid--maxCol4">
      ${placeholderItem.repeat(4)}
    </ul>`;

  $('.categoryProducts .productCarousel').append(placeholderList);
  }

  removePlaceholderProducts() {
    $('.categoryProducts .productCarousel').empty();
  }
}
