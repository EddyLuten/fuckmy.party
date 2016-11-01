var FMP = (function() {
  var stats_generator,
      p_random_name,
      p_limits,
      min_input,
      max_input,
      names_data,
      button_generate_name;

  var init = function() {
    names_data = null;
    stats_generator = document.querySelector('#stats_generator');
    p_limits = document.querySelector('#limits');
    p_random_name = document.querySelector('#random_name');
    min_input = p_limits.querySelector('input[name=min]');
    max_input = p_limits.querySelector('input[name=max]');

    document.querySelector('#btn_go')
            .addEventListener('click', generateStats);
    button_generate_name =  document.querySelector('#generate_name');
    button_generate_name.addEventListener('click', generateRandomName);
  };

  var randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getNamesData = function(callback, onerror) {
    if (null !== names_data) {
      if (callback) {
        return callback();
      } else {
        return;
      }
    }

    var request = new XMLHttpRequest();

    request.open(
      'GET',
      'names.json?' + randomInt(1, Number.MAX_SAFE_INTEGER), // Avoid caching
      true
    );

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        names_data = JSON.parse(request.responseText);
        if (callback) {
          callback();
        }
      } else {
        if (onerror) {
          onerror();
        }
      }
    };

    request.onerror = function() {
      if (onerror) {
        onerror();
      }
    };

    request.send();
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
    getNamesData(function() {
      first_names = names_data["first_names"] || [];
      last_names = names_data["last_names"] || [];
      p_random_name.querySelector('.first').innerHTML =
        first_names[randomInt(0, Math.max(first_names.length - 1, 0))];
      p_random_name.querySelector('.last').innerHTML =
        last_names[randomInt(0, Math.max(last_names.length - 1, 0))];
    }, function() {
      alert('Sorry, something went wrong. Try again later.');
      button_generate_name.disabled = true;
    });
  };

  return {
    init: init
  }
}());

window.addEventListener('load', FMP.init);
