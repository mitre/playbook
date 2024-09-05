// This is where it all goes :)


const backToTopButton = document.querySelector('[data-js-hook="back-to-top-button"]');
const focusableElements = document.querySelectorAll('a');

const scrollOptions = {
  top: 0,
  left: 0,
  behavior: 'smooth'
};

const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;

function moveToTop(event) {
  event.preventDefault();

  // Scroll to top.
  supportsNativeSmoothScroll ? window.scrollTo(scrollOptions) : window.scrollTo(scrollOptions.left, scrollOptions.top);

  // Focus the first focusable element.
  focusableElements[0].focus({
    preventScroll: true,
  });
  focusableElements[0].blur();
  return false;
}
backToTopButton.addEventListener('click', moveToTop);

var siteindex = "/playbook/site.index.json"
$.getJSON(siteindex, function(data) {
  var index = populateIndex(data);
  searchSetup(index,data);
})

// Feed data into an empty lunr index and return the populated result
function populateIndex(data) {
  var index = lunr(function(){
    this.field('title', { boost: 10 });
    this.field('content');
    this.ref('id');
      var self = this;
    data.forEach(function(item) {
      self.add(item);
    });
  });
  return index;
}

function debounce(func, delay) {
    let timeout=null
    return () => {
        if(timeout) clearTimeout(timeout)

        timeout=setTimeout(() => {
            func()
        }, delay)
    }
}
function searchSetup(index, contents){
  const root = "/playbook/";
  // Set up Handlebars template
  var resultsTemplate = Handlebars.compile($("#results_template").html());

  $("#search_field").on("keyup", debounce(function(event){
    var query = $("#search_field").val();
    if (query.length < 2) {
      $("#search_results").hide();
      return;
    }
    var results = index.search(query);
    $("#search_results_list").empty();
    $.each(results, function(index, result){
      $("#search_results_list").append(resultsTemplate({
        title: contents[result.ref].title,
        url: root + contents[result.ref].url,
        query: query
      }));
      $("#search_results").show();
    });
  }, 400));
}


/*! URIGET - MIT license - Copyright 2017-2018 MrDioamDev */
(function ($) {
    $.extend({
        uriGet: function () {
          var url_string = location.href;
          var url = new URL(url_string);
          var val = url.searchParams.get(arguments[0]);
          return val;
        }
    });
})(jQuery);
  
$( document ).ready(function() {
  var playbookMenu = document.getElementById('playbook_menu');
  if (playbookMenu) {
    var scrollSpy = new bootstrap.ScrollSpy(jQuery('#content'), {
      target: document.getElementById('playbook_menu'),
      method: 'position'
    });
  }

  var term = $.uriGet('term');
  if (term) {
    var instance = new Mark(document.getElementById("content"));
    instance.mark(term.replace(/([^a-z0-9]+)/gi, ''), {});
  }
});