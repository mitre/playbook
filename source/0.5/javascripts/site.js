// This is where it all goes :)

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
          
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
      $('.sidebar-menu .back-to-top-list-item').removeClass('invisible');
      $('.sidebar-menu .back-to-top-list-item').addClass('visible');
    } else {
      $('.sidebar-menu .back-to-top-list-item').removeClass('visible');
      window.setTimeout(function(){$('.sidebar-menu .back-to-top-list-item').css("visibility","hidden")},1000)
    }
  });

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
    let mark = document.querySelector('mark[data-markjs="true"]');
    if (mark) {mark.scrollIntoView();}
  }
});

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

const root = "/playbook/0.5/";
const siteIndex = root + "site.index.json";

// ---------------- JTD search

window.jtd = window;

jtd.addEvent = function(el, type, handler) {
  if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
}
jtd.removeEvent = function(el, type, handler) {
  if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
}
jtd.onReady = function(ready) {
  // in case the document is already rendered
  if (document.readyState!='loading') ready();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', ready);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function(){
      if (document.readyState=='complete') ready();
  });
}

const searchInput = document.getElementById('search_field');

function initSearch() {
  var request = new XMLHttpRequest();
  request.open('GET', siteIndex, true);

  request.onload = function(){
    if (request.status >= 200 && request.status < 400) {
      var docs = JSON.parse(request.responseText);
  
      lunr.tokenizer.separator = /[\s\-/]+/
  
      var index = lunr(function(){
        this.ref('id');
        this.field('title', { boost: 200 });
        this.field('content', { boost: 2 });
        this.metadataWhitelist = ['position']
  
        for (var i in docs) {
          this.add({
            id: i,
            title: docs[i].title,
            content: docs[i].content,
          });
        }
      });
  
      searchLoaded(index, docs);
    } else {
      console.log('Error loading ajax request. Request status:' + request.status);
    }
};

request.onerror = function(){
  console.log('There was a connection error');
};

request.send();
}


function searchLoaded(index, docs) {
var index = index;
var docs = docs;
var searchInput = document.getElementById('search_field');
var searchResults = document.getElementById('search_results');
var currentInput;
var currentSearchIndex = 0;

function showSearch() {
  document.documentElement.classList.add('search-active');
}

function hideSearch() {
  document.documentElement.classList.remove('search-active');
}

function update() {
  currentSearchIndex++;

  var input = searchInput.value;
  if (input === '') {
    hideSearch();
  } else {
    showSearch();
    // scroll search input into view, workaround for iOS Safari
    window.scroll(0, -1);
    setTimeout(function(){ window.scroll(0, 0); }, 0);
  }
  if (input === currentInput) {
    return;
  }
  currentInput = input;
  searchResults.innerHTML = '';
  if (input === '') {
    return;
  }

  var results = index.query(function (query) {
    var tokens = lunr.tokenizer(input)
    query.term(tokens, {
      boost: 10
    });
    query.term(tokens, {
      wildcard: lunr.Query.wildcard.TRAILING
    });
  });

  if ((results.length == 0) && (input.length > 2)) {
    var tokens = lunr.tokenizer(input).filter(function(token, i) {
      return token.str.length < 20;
    })
    if (tokens.length > 0) {
      results = index.query(function (query) {
        query.term(tokens, {
          editDistance: Math.round(Math.sqrt(input.length / 2 - 1))
        });
      });
    }
  }

  if (results.length == 0) {
    var noResultsDiv = document.createElement('div');
    noResultsDiv.classList.add('search-no-result');
    noResultsDiv.innerText = 'No results found';
    searchResults.appendChild(noResultsDiv);

  } else {
    var resultsList = document.createElement('ul');
    resultsList.classList.add('search-results-list');
    searchResults.appendChild(resultsList);

    addResults(resultsList, results, 0, 10, 100, currentSearchIndex);
  }

  function addResults(resultsList, results, start, batchSize, batchMillis, searchIndex) {
    if (searchIndex != currentSearchIndex) {
      return;
    }
    for (var i = start; i < (start + batchSize); i++) {
      if (i == results.length) {
        return;
      }
      addResult(resultsList, results[i]);
    }
    setTimeout(function() {
      addResults(resultsList, results, start + batchSize, batchSize, batchMillis, searchIndex);
    }, batchMillis);
  }

  function addResult(resultsList, result) {
    var doc = docs[result.ref];

    var resultsListItem = document.createElement('li');
    resultsListItem.classList.add('search-results-list-item');
    resultsList.appendChild(resultsListItem);

    var resultLink = document.createElement('a');
    resultLink.classList.add('search-result');
    resultLink.setAttribute('href', root + doc.url + "?term=" + input);
    resultsListItem.appendChild(resultLink);

    var resultTitle = document.createElement('div');
    resultTitle.classList.add('search-result-title');
    resultLink.appendChild(resultTitle);

    // note: the SVG svg-doc is only loaded as a Jekyll include if site.search_enabled is true; see _includes/icons/icons.html
    var resultDoc = document.createElement('div');
    resultDoc.classList.add('search-result-doc');
//    resultDoc.innerHTML = '<svg viewBox="0 0 24 24" class="search-result-icon"><use xlink:href="#svg-doc"></use></svg>';
    resultTitle.appendChild(resultDoc);

    var resultDocTitle = document.createElement('div');
    resultDocTitle.classList.add('search-result-doc-title');
    resultDocTitle.innerHTML = doc.doc;
    resultDoc.appendChild(resultDocTitle);
    var resultDocOrSection = resultDocTitle;

    if (doc.doc != doc.title) {
      resultDoc.classList.add('search-result-doc-parent');
      var resultSection = document.createElement('div');
      resultSection.classList.add('search-result-section');
      resultSection.innerHTML = doc.title;
      resultTitle.appendChild(resultSection);
      resultDocOrSection = resultSection;
    }

    var metadata = result.matchData.metadata;
    var titlePositions = [];
    var contentPositions = [];
    for (var j in metadata) {
      var meta = metadata[j];
      if (meta.title) {
        var positions = meta.title.position;
        for (var k in positions) {
          titlePositions.push(positions[k]);
        }
      }
      if (meta.content) {
        var positions = meta.content.position;
        for (var k in positions) {
          var position = positions[k];
          var previewStart = position[0];
          var previewEnd = position[0] + position[1];
          var ellipsesBefore = true;
          var ellipsesAfter = true;
          // k < {{ site.search.preview_words_before | default: 5 }}
          for (var k = 0; k < 5; k++) {
            var nextSpace = doc.content.lastIndexOf(' ', previewStart - 2);
            var nextDot = doc.content.lastIndexOf('. ', previewStart - 2);
            if ((nextDot >= 0) && (nextDot > nextSpace)) {
              previewStart = nextDot + 1;
              ellipsesBefore = false;
              break;
            }
            if (nextSpace < 0) {
              previewStart = 0;
              ellipsesBefore = false;
              break;
            }
            previewStart = nextSpace + 1;
          }
          // k < {{ site.search.preview_words_after | default: 10 }}
          for (var k = 0; k < 10; k++) {
            var nextSpace = doc.content.indexOf(' ', previewEnd + 1);
            var nextDot = doc.content.indexOf('. ', previewEnd + 1);
            if ((nextDot >= 0) && (nextDot < nextSpace)) {
              previewEnd = nextDot;
              ellipsesAfter = false;
              break;
            }
            if (nextSpace < 0) {
              previewEnd = doc.content.length;
              ellipsesAfter = false;
              break;
            }
            previewEnd = nextSpace;
          }
          contentPositions.push({
            highlight: position,
            previewStart: previewStart, previewEnd: previewEnd,
            ellipsesBefore: ellipsesBefore, ellipsesAfter: ellipsesAfter
          });
        }
      }
    }

    if (titlePositions.length > 0) {
      titlePositions.sort(function(p1, p2){ return p1[0] - p2[0] });
      resultDocOrSection.innerHTML = '';
      addHighlightedText(resultDocOrSection, doc.title, 0, doc.title.length, titlePositions);
    }

    if (contentPositions.length > 0) {
      contentPositions.sort(function(p1, p2){ return p1.highlight[0] - p2.highlight[0] });
      var contentPosition = contentPositions[0];
      var previewPosition = {
        highlight: [contentPosition.highlight],
        previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
        ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
      };
      var previewPositions = [previewPosition];
      for (var j = 1; j < contentPositions.length; j++) {
        contentPosition = contentPositions[j];
        if (previewPosition.previewEnd < contentPosition.previewStart) {
          previewPosition = {
            highlight: [contentPosition.highlight],
            previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
            ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
          }
          previewPositions.push(previewPosition);
        } else {
          previewPosition.highlight.push(contentPosition.highlight);
          previewPosition.previewEnd = contentPosition.previewEnd;
          previewPosition.ellipsesAfter = contentPosition.ellipsesAfter;
        }
      }

      var resultPreviews = document.createElement('div');
      resultPreviews.classList.add('search-result-previews');
      resultLink.appendChild(resultPreviews);

      var content = doc.content;
      // j < Math.min(previewPositions.length, {{ site.search.previews | default: 3 }})
      for (var j = 0; j < Math.min(previewPositions.length, 3); j++) {
        var position = previewPositions[j];

        var resultPreview = document.createElement('div');
        resultPreview.classList.add('search-result-preview');
        resultPreviews.appendChild(resultPreview);

        if (position.ellipsesBefore) {
          resultPreview.appendChild(document.createTextNode('... '));
        }
        addHighlightedText(resultPreview, content, position.previewStart, position.previewEnd, position.highlight);
        if (position.ellipsesAfter) {
          resultPreview.appendChild(document.createTextNode(' ...'));
        }
      }
    }
  }

  function addHighlightedText(parent, text, start, end, positions) {
    var index = start;
    for (var i in positions) {
      var position = positions[i];
      var span = document.createElement('span');
      span.innerHTML = text.substring(index, position[0]);
      parent.appendChild(span);
      index = position[0] + position[1];
      var highlight = document.createElement('span');
      highlight.classList.add('search-result-highlight');
      highlight.innerHTML = text.substring(position[0], index);
      parent.appendChild(highlight);
    }
    var span = document.createElement('span');
    span.innerHTML = text.substring(index, end);
    parent.appendChild(span);
  }
}

jtd.addEvent(searchInput, 'focus', function(){
  setTimeout(update, 0);
});

jtd.addEvent(searchInput, 'keyup', function(e){
  switch (e.keyCode) {
    case 27: // When esc key is pressed, hide the results and clear the field
      searchInput.value = '';
      break;
    case 38: // arrow up
    case 40: // arrow down
    case 13: // enter
      e.preventDefault();
      return;
  }
  update();
});

jtd.addEvent(searchInput, 'keydown', function(e){
  switch (e.keyCode) {
    case 38: // arrow up
      e.preventDefault();
      var active = document.querySelector('.search-result.active');
      if (active) {
        active.classList.remove('active');
        if (active.parentElement.previousSibling) {
          var previous = active.parentElement.previousSibling.querySelector('.search-result');
          previous.classList.add('active');
        }
      }
      return;
    case 40: // arrow down
      e.preventDefault();
      var active = document.querySelector('.search-result.active');
      if (active) {
        if (active.parentElement.nextSibling) {
          var next = active.parentElement.nextSibling.querySelector('.search-result');
          active.classList.remove('active');
          next.classList.add('active');
        }
      } else {
        var next = document.querySelector('.search-result');
        if (next) {
          next.classList.add('active');
        }
      }
      return;
    case 13: // enter
      e.preventDefault();
      var active = document.querySelector('.search-result.active');
      if (active) {
        active.click();
      } else {
        var first = document.querySelector('.search-result');
        if (first) {
          first.click();
        }
      }
      return;
  }
});

jtd.addEvent(document, 'click', function(e){
  if (e.target != searchInput) {
    hideSearch();
  }
});
}

initSearch();

