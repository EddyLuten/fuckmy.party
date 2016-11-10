var FMP = (function() {
  var stats_generator,
      p_random_name,
      p_limits,
      p_random_taverns,
      p_random_town,
      p_random_plot,
      min_input,
      max_input,
      names_data,
      tavern_data,
      town_data,
      plot_data,
      button_generate_name,
      button_generate_tavern,
      button_generate_town,
      button_generate_plot;

  var q = function(query, context) {
    return (context || document).querySelector(query);
  };

  var a = function(query, context) {
    return (context || document).querySelectorAll(query);
  };

  var init = function() {
    names_data = null;
    stats_generator = q('#stats_generator');
    p_limits = q('#limits');
    p_random_name = q('#random_name');
    p_random_taverns = q('#random_tavern');
    p_random_town = q('#random_town');
    p_random_plot = q('#random_plot');
    min_input = q('input[name=min]', p_limits);
    max_input = q('input[name=max]', p_limits);

    q('#btn_go').addEventListener('click', generateStats);

    button_generate_name = q('#generate_name');
    button_generate_name.addEventListener('click', generateRandomName);

    button_generate_tavern = q('#generate_tavern');
    button_generate_tavern.addEventListener('click', generateRandomTavernName);

    // button_generate_town = q('#generate_town');
    // button_generate_town.addEventListener('click', generateRandomTownName);

    button_generate_plot = q('#generate_plot');
    button_generate_plot.addEventListener('click', generateRandomPlot);
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

  var generateStats = function() {
    min_input.classList.remove('error');
    max_input.classList.remove('error');

    var min = parseInt(min_input.value, 10);
    var max = parseInt(max_input.value, 10);

    if (isNaN(min) || min > max) {
      return min_input.classList.add('error');
    } else if (isNaN(max) || max < min) {
      return max_input.classList.add('error');
    }

    var stats = a('span', stats_generator);
    for (var i = 0; i < stats.length; ++i) {
      stats[i].innerHTML = randomInt(min, max);
    }
  };

  var generateRandomName = function() {
    getNamesData(function() {
      first_names = names_data["first_names"] || [];
      last_names = names_data["last_names"] || [];
      q('.first', p_random_name).innerHTML = randomElement(first_names);
      q('.last', p_random_name).innerHTML = randomElement(last_names);
    },
    function() {
      alert('Sorry, something went wrong. Try again later.');
      button_generate_name.disabled = true;
    });
  };

  var generateRandomTavernName = function () {
    getTavernData(function() {
      prefixes = tavern_data["prefixes"] || [];
      modifiers = tavern_data["modifiers"] || [];
      subjects = tavern_data["subjects"] || [];
      tavern_types = tavern_data["tavern_types"] || [];

      q('.prefix', p_random_taverns).innerHTML = randomElement(prefixes);
      q('.modifier', p_random_taverns).innerHTML = randomElement(modifiers);
      q('.modifier', p_random_taverns).innerHTML = randomElement(modifiers);
      q('.subject', p_random_taverns).innerHTML = randomElement(subjects);
      q('.tavern_type', p_random_taverns).innerHTML = randomElement(tavern_types);
     },
     function() {
      alert('Sorry, something went wrong. Try again later.');
      button_generate_tavern.disabled = true;
    })
  };

  var generateRandomTownName = function() {
    getTownData(function() {
      prefixes = town_data["prefixes"] || [];
      suffixes = town_data["suffixes"] || [];

      q('.prefix', p_random_town).innerHTML = randomElement(prefixes);
      q('.suffix', p_random_town).innerHTML = randomElement(suffixes);
    },
    function() {
     alert('Sorry, something went wrong. Try again later.');
     button_generate_town.disabled = true;
    })
  };

  var generateRandomPlot = function() {
    getPlotData(function() {
      var elements = a('span', p_random_plot);
      for (var i = 0; i < elements.length; ++i) {
        var name = elements[i].className;
        elements[i].innerHTML = randomElement(plot_data[name]);
      }
      elements[elements.length - 1].innerHTML += '.';
    },
    function() {
      alert('Sorry, something went wrong. Try again later.');
      button_generate_plot.disabled = true;
    });
  };

  return { init: init };
}());

window.addEventListener('load', FMP.init);
