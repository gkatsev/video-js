var vjs = {};
var Component = require('./component.js');
var vjslib = require('./lib.js');

/**
 * Display that an error has occurred making the video unplayable
 * @param {vjs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
vjs.ErrorDisplay = Component.extend({
  init: function(player, options){
    Component.call(this, player, options);

    this.update();
    player.on('error', vjslib.bind(this, this.update));
  }
});

vjs.ErrorDisplay.prototype.createEl = function(){
  var el = Component.prototype.createEl.call(this, 'div', {
    className: 'vjs-error-display'
  });

  this.contentEl_ = vjslib.createEl('div');
  el.appendChild(this.contentEl_);

  return el;
};

vjs.ErrorDisplay.prototype.update = function(){
  if (this.player().error()) {
    this.contentEl_.innerHTML = this.player().error().message;
  }
};

module.exports = vjs.ErrorDisplay;
