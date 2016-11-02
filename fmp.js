var FMP = (function() {
  var stats_generator,
      p_random_name,
      p_limits,
      p_random_taverns,
      min_input,
      max_input,
      names_data,
      tavern_data,
      button_generate_name,
      button_generate_tavern;

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
    min_input = q('input[name=min]', p_limits);
    max_input = q('input[name=max]', p_limits);

    q('#btn_go').addEventListener('click', generateStats);

    button_generate_name = q('#generate_name');
    button_generate_name.addEventListener('click', generateRandomName);

    button_generate_tavern = q('#generate_tavern');
    button_generate_tavern.addEventListener('click', generateRandomTavernName);
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
  }

  return { init: init };
}());

window.addEventListener('load', FMP.init);
