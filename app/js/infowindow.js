(function () {
  'use strict';
  var imagesLoaded = require('imagesloaded');

  var dom = require('./util').dom;
  var emitter = require('./mediator');
  var template  = require('../templates/detail.jade');

  var visible = false,
      options = {};

  function init() {
    createWindow();
    registerHandlers();
  }

  function createWindow() {
    options.container = dom.create('aside', 'info-window-container', document.body);
    options.content = dom.create('section', 'info-window-content', options.container);
    options.toggle = dom.create('button', 'info-window-toggle', options.container);
    options.toggle.setAttribute('aria-label', 'Close');
  }

  function registerHandlers() {
    document.body.addEventListener('keydown', keydownHandler);
    options.toggle.addEventListener('click', toggle);
    emitter.on('project:click', render);
    emitter.on('infowindow:close', hide);
  }

  function keydownHandler(e) {
    // Close the infowindow if the user hits escape
    if (visible && e.keyCode === 27) hide();
  }

  function show() {
    dom.addClass(options.container, 'active');
    visible = true;
    emitter.emit('gallery:close', false);
  }

  function hide() {
    dom.removeClass(options.container, 'active');
    visible = false;
  }

  function toggle() {
    visible ? hide() : show(); //jshint ignore:line
  }

  function render(project) {
    imagesLoaded(options.content, show);
    options.content.innerHTML = template({ project: project.properties });
  }

  module.exports.init = init;
  module.exports.show = show;
  module.exports.hide = hide;
  module.exports.toggle = toggle;
})();
