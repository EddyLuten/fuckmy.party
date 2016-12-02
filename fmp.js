var FMP = (function() {
  var
    names_data = null,
    tavern_data = null,
    town_data = null,
    plot_data = null;

  var init = function() {
    $(generate_stats).click(generateStats);
    $(generate_name).click(generateRandomName);
    $(generate_tavern).click(generateRandomTavernName);
    $(generate_plot).click(generateRandomPlot);
    $('.copy-text').click(copyText);
  };

  var copyText = function() {
    var $this = $(this);
    var text = $.map($this.data('source'), function(value) {
      return $.trim($(value).text().replace(/\s+/g, ' '));
    }).join($this.data('join')).trim();


    var oldText = $this.text();
    if (text) {
      var area = $('<textarea>').text(text);
      $('body').append(area);
      area.select();
      document.execCommand('copy');
      area.remove();

      $this.text('Copied!').addClass('okay');
      setTimeout(function () {
        $this.text(oldText);
        $this.removeClass('okay');
      }, 1500);
    } else {
      $this.text('Empty').addClass('nope');
      setTimeout(function () {
        $this.text(oldText);
        $this.removeClass('nope');
      }, 1500);
    }
  };

  var randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var randomLargeNumber = function() {
    return randomInt(1, Number.MAX_SAFE_INTEGER);
  };

  var randomElement = function(array) {
    return array[randomInt(0, Math.max(array.length - 1, 0))];
  };

  var getJSON = function(url, callback, onerror) {
    var request = new XMLHttpRequest();

    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        data = JSON.parse(request.responseText);
        if (callback) { callback(data); }
      } else { if (onerror) { onerror(); } }
    };

    request.onerror = function() { if (onerror) { onerror(); } };
    request.send();
  };

  var getNamesData = function(callback, onerror) {
    if (names_data) { return callback ? callback() : null; }

    getJSON(
      'names.json?' + randomLargeNumber(),
      function(data) {
        names_data = data;
        if (callback) { callback(); }
      },
      function() { onerror(); }
    );
  };

  var getTavernData = function(callback, onerror) {
    if (tavern_data) { return callback ? callback() : null; }

    getJSON(
      'taverns.json?' + randomLargeNumber(),
      function(data) {
        tavern_data = data;
        if (callback) {callback(); }
      },
      function() { onerror(); }
    )
  };

  var getTownData = function(callback, onerror) {
    if (town_data) { return callback ? callback() : null; }

    getJSON(
      'towns.json?' + randomLargeNumber(),
      function(data) {
        town_data = data;
        if (callback) {callback(); }
      },
      function() { onerror(); }
    )
  };

  var getPlotData = function(callback, onerror) {
    if (plot_data) { return callback ? callback() : null; }

    getJSON(
      'plots.json?' + randomLargeNumber(),
      function(data) {
        plot_data = data;
        if (callback) {callback(); }
      },
      function() { onerror(); }
    )
  };

  var generateStats = function () {
    var values = $(min_max).slider('getValue');
    $('span', stats_generator).each(function () {
      $(this).text(randomInt(values[0], values[1]));
    });
  };

  var generateRandomName = function() {
    getNamesData(function() {
      first_names = names_data["first_names"] || [];
      last_names = names_data["last_names"] || [];
      $('.first', random_name).text(randomElement(first_names));
      $('.last', random_name).text(randomElement(last_names));
    },
    function() {
      alert('Sorry, something went wrong. Try again later.');
      generate_name.disabled = true;
    });
  };

  var generateRandomTavernName = function () {
    getTavernData(function() {
      prefixes = tavern_data["prefixes"] || [];
      modifiers = tavern_data["modifiers"] || [];
      subjects = tavern_data["subjects"] || [];
      tavern_types = tavern_data["tavern_types"] || [];

      $('.prefix', random_tavern).html(randomElement(prefixes));
      $('.modifier', random_tavern).html(randomElement(modifiers));
      $('.modifier', random_tavern).html(randomElement(modifiers));
      $('.subject', random_tavern).html(randomElement(subjects));
      $('.tavern_type', random_tavern).html(randomElement(tavern_types));
     },
     function() {
      alert('Sorry, something went wrong. Try again later.');
      generate_tavern.disabled = true;
    })
  };

  var generateRandomPlot = function() {
    getPlotData(function() {
      var elements = $('span', random_plot);
      for (var i = 0; i < elements.length; ++i) {
        var name = elements[i].className;
        elements[i].innerHTML = randomElement(plot_data[name]);
      }
      elements[elements.length - 1].innerHTML += '.';
    },
    function() {
      alert('Sorry, something went wrong. Try again later.');
      generate_plot.disabled = true;
    });
  };

  return { init: init };
}());

window.addEventListener('load', FMP.init);
