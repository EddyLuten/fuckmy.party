var FMP = (function() {
  var stats_generator,
      p_random_name,
      p_limits,
      min_input,
      max_input;

  var init = function() {
    stats_generator = document.querySelector('#stats_generator');
    p_limits = document.querySelector('#limits');
    p_random_name = document.querySelector('#random_name');
    min_input = p_limits.querySelector('input[name=min]');
    max_input = p_limits.querySelector('input[name=max]');

    document.querySelector('#btn_go')
            .addEventListener('click', generateStats);
    document.querySelector('#generate_name')
            .addEventListener('click', generateRandomName);
  };

  var randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

    var stats = stats_generator.querySelectorAll('span');
    for (var i = 0; i < stats.length; ++i) {
      stats[i].innerHTML = randomInt(min, max);
    }
  };

  var generateRandomName = function() {
    var request = new XMLHttpRequest();
    request.open(
      'GET',
      'names.json?' + randomInt(1, Number.MAX_SAFE_INTEGER), // Avoid caching
      true
    );

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        first_names = data["first_names"] || [];
        last_names = data["last_names"] || [];
        p_random_name.querySelector('.first').innerHTML =
          first_names[randomInt(0, Math.max(first_names.length - 1, 0))];
        p_random_name.querySelector('.last').innerHTML =
          last_names[randomInt(0, Math.max(last_names.length - 1, 0))];
      } else {
        alert('Sorry, something is wrong. We fucked up.');
      }
    };

    request.onerror = function() {
      alert('Sorry, something is wrong. We fucked up.');
    };

    request.send();
  };

  return {
    init: init
  }
}());

window.addEventListener('load', FMP.init);
