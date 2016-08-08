(function () {
  'use strict';

  var imagesLoaded = require('imagesloaded');

  var ProjectService = require('./data-access');

  var _ = require('./util')._;
  var template = require('../templates/gallery.jade');
  var emitter = require('./mediator');
  var dom = require('./util').dom;

  var options,
      gallery = false;

  function init(opts) {
    options = opts;
    createGallery();
    render();
    imagesLoaded(options.el, show);
    registerHandlers();
  }

  function createGallery() {
    options.el = dom.create('section', 'gallery-hidden', document.body);
    options.close = dom.create('button', 'gallery-toggle', options.el);
    options.close.setAttribute('aria-label', 'Close');
    options.list = dom.create('ul', 'gallery-list', options.el);
    dom.addClass(options.el, 'gallery-container');
  }

  function registerHandlers() {
    options.close.addEventListener('click', toggle);
    options.list.addEventListener('click', itemHandler);
    emitter.on('gallery:close', hide);
    emitter.on('zoomtofullextent', show);
  }

  function render() {
    options.list.innerHTML = template({
      galleryItems: options.data
    });
  }

  function show() {
    gallery = true;
    options.el.classList.remove('gallery-hidden');
    emitter.emit('infowindow:close', false);
  }

  function hide() {
    gallery = false;
    options.el.classList.add('gallery-hidden');
  }

  function toggle() {
    gallery ? hide() : show(); // jshint ignore:line
  }

  function itemHandler(e) {
    var el = e.target;
    var projectName;
    while (el && el.tagName !== 'LI') {
       el = el.parentNode;
    }
    projectName = el.getAttribute('data-name');
    emitter.emit('project:click', ProjectService.getProject(projectName));
  }

  module.exports.init = init;
  module.exports.show = show;
  module.exports.hide = hide;
  module.exports.toggle = toggle;
})();
