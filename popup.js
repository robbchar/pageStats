var state = {
		loaded: false
	};

chrome.tabs.executeScript(null, {
    file: "pageStats.js"
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var pageStats = JSON.parse(request),
      notLoaded = document.querySelector('.notLoaded'),
      timings = document.querySelector('.timings');

    if(sender.tab && sender.tab.selected === true && sender.tab.status === 'complete' && state.loaded === false) {
      state.loaded = true;
      timings.classList.remove('hide');
      notLoaded.classList.add('hide');
      
      document.querySelector('.numDomElements').innerHTML = pageStats.numDOMElements;
      document.querySelector('.firstPaintTime').innerHTML = Math.round10(pageStats.firstPaintTime, -3);
    } else {
      timings.classList.add('hide');
      notLoaded.classList.remove('hide');
      
      document.querySelector('.timings').attributes['style'] = 'display:none;';
      document.querySelector('.notLoaded').attributes['style'] = 'display:block;';
    }
});

// Math library wrapper from mozilla
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();