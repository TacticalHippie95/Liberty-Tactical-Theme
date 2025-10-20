import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import StencilDropDown from '../../global/stencil-dropdown';

export default function () {
    const TOP_STYLING = 'top: 49px;';
    const $quickSearchResults = $('.quickSearchResults');
    const $quickSearchForms = $('[data-quick-search-form]');
    const $quickSearchExpand = $('#quick-search-expand');
    const $searchQuery = $quickSearchForms.find('[data-search-quick]');
    const stencilDropDownExtendables = {
        hide: () => {
            $quickSearchExpand.attr('aria-expanded', false);
            $searchQuery.trigger('blur');
        },
        show: (event) => {
            $quickSearchExpand.attr('aria-expanded', true);
            $searchQuery.trigger('focus');
            event.stopPropagation();
        },
    };
    const stencilDropDown = new StencilDropDown(stencilDropDownExtendables);
    stencilDropDown.bind($('[data-search="quickSearch"]'), $('#quickSearch'), TOP_STYLING);

    $('.navUser-action--quickSearch, .closeSearch-btn').on('click', () => {
        $('.top-bar').toggleClass("quickSearch-active");
		$('body').toggleClass("scroll-lock");
		$('.announcementBar').toggleClass("z-low");
    });

    $('.closeSearch-btn').on('click', () => {
			stencilDropDown.hide($('#quickSearch'));
			$('.announcementBar').removeClass("z-low");
    });

    stencilDropDownExtendables.onBodyClick = (e, $container) => {
        if ($(e.target).closest('[data-prevent-quick-search-close], .modal-background').length === 0) {
            stencilDropDown.hide($container);
        }
    };

    const debounceWaitTime = 200;
    const doSearch = _.debounce((searchQuery) => {
        utils.api.search.search(searchQuery, { template: 'gordonbyte/search/quick-results' }, (err, response) => {
            if (err) {
                return false;
            }

            $('.quickSearchResults').empty();

            let ul, li, a, img, name, main;

            main = $("<div/>");
            ul = $("<ul/>");
            main.addClass("searchproduct-holder searchproduct-result");

            let resp = $(response).find("li.product");
            let resplength = resp.length;

            $(resp).each((i,e) =>{

              li = $("<li/>");
              a = $("<a/>");
              img = $("<div/>");
              name = $("<div/>");
              li.addClass("searchproduct-list");
              img.addClass("searchproduct-img");
              name.addClass("searchproduct-name");
              img.append($(e).find('.card-img-container img'));
              name.append($(e).find('.card-title a'));

              li.append(a);
              a.append(img);
              a.append(name);
              ul.append(li);
            });
            main.append(ul);

            $quickSearchResults.append("<h3>" + resplength + " results</h3>");
            $quickSearchResults.append(main);
        });
    }, debounceWaitTime);

    utils.hooks.on('search-quick', (event, currentTarget) => {
        const searchQuery = $(currentTarget).val();

        if (searchQuery.length < 3) {
            return;
        }

        doSearch(searchQuery);
    });

    $quickSearchForms.on('submit', event => {
        event.preventDefault();

        const $target = $(event.currentTarget);
        const searchQuery = $target.find('input').val();
        const searchUrl = $target.data('url');

        if (searchQuery.length === 0) {
            return;
        }

        window.location.href = `${searchUrl}?search_query=${encodeURIComponent(searchQuery)}`;
    });
}
