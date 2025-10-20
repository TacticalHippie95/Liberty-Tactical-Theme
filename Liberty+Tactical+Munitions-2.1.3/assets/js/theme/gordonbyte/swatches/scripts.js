import utils from '@bigcommerce/stencil-utils';

const template = 'gordonbyte/products/quick-view';

export default class Swatches{

  constructor(){
	  this.product, this.allIds, this.finalIds;
    this.token = jQuery('#header').data('apitok');
  }

  filter(){
    this.product = $('.card');
    this.allIds = [];
    this.finalIds = [];

	  this.product.each((i,e) => {
      let prodID = $(e).data("gbproduct-id");
      this.allIds.push(prodID);

      this.finalIds = this.allIds.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      });
    });
  } 


  getOptions(){
    var productSwatch = [];

    fetch('/graphql',{
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
      },
      body: JSON.stringify({
        query: `
        query SeveralProductsByID {
        site {
          products(first: 20, entityIds: [${this.finalIds}]) {
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

        $('.card[data-gbproduct-id="' + i + '"]').each(function(){
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
        $('.card[data-gbproduct-id="' + i + '"] .form-field').append('<span class="swatch-total">+' + total + '</span>');
      }

    });

  }
} 
