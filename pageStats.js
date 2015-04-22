'use strict';

var pageStats = (function () {
  var currentTab;

  function init (callback) {
    sendData();
  }

  function sendData () {
    var data = {},
      times = chrome.loadTimes();
    data.numDOMElements = getNumberOfDOMElements();

    data.firstPaintTime =  Math.min(times.firstPaintTime - times.startLoadTime);

    chrome.runtime.sendMessage(JSON.stringify(data), function(response) {
    });
  }

  function getNumberOfDOMElements () {
    return document.getElementsByTagName('*').length;
  }

  return {
    Init: init
  };
}());

pageStats.Init();
