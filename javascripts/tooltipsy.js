/* tooltipsy by Brian Cray
 * Lincensed under GPL2 - http://www.gnu.org/licenses/gpl-2.0.html
 * Option quick reference:
 *  - alignTo: "element" or "cursor" (Defaults to "element")
 *  - offset: Tooltipsy distance from element or mouse cursor, dependent on alignTo setting. Set as array [x, y] (Defaults to [0, -1])
 *  - content: HTML or text content of tooltip. Defaults to "" (empty string), which pulls content from target element's title attribute
 *  - show: function(event, tooltip) to show the tooltip. Defaults to a show(100) effect
 *  - hide: function(event, tooltip) to hide the tooltip. Defaults to a fadeOut(100) effect
 *  - css: object containing CSS properties and values. Defaults to {} to use stylesheet for styles
 *  - className: DOM class for styling tooltips with CSS. Defaults to "tooltipsy"
 * More information visit http://tooltipsy.com/
 */
 
(function($){
    $.tooltipsy = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.random = parseInt(Math.random()*10000);
        this.ready = false;
        this.shown = false;
        this.width = 0;
        this.height = 0;

        this.$el.data("tooltipsy", this);
        this.init();
    };

    $.tooltipsy.prototype.init = function () {
        var base = this;

        base.settings = $.extend({}, base.defaults, base.options);

        if (typeof base.settings.content === 'function') {
            base.readify(); 
        }
        
        base.$el.bind('mouseenter', function (e) {
            if (base.ready === false) {
                base.readify();
            }
            if (base.shown === false) {
                if ((function (o) {
                    var s = 0, k;
                    for (k in o) {
                        if (o.hasOwnProperty(k)) {
                            s++;
                        }
                    }
                    return s;
                })(base.settings.css) > 0) {
                    base.$tip.css(base.settings.css);
                }
                base.width = base.$tipsy.outerWidth();
                base.height = base.$tipsy.outerHeight();
            }

            if (base.settings.alignTo == 'cursor') {
                var tip_position = [e.pageX + base.settings.offset[0], e.pageY + base.settings.offset[1]];
                if(tip_position[0] + base.width > $(window).width()) {
                    var tip_css = {top: tip_position[1] + 'px', right: tip_position[0] + 'px', left: 'auto'};
                }
                else {
                    var tip_css = {top: tip_position[1] + 'px', left: tip_position[0] + 'px', right: 'auto'};
                }
            }
            else {
                var tip_position = [
                    (function (pos) {
                        if (base.settings.offset[0] < 0) {
                            return pos.left - Math.abs(base.settings.offset[0]) - base.width;
                        }
                        else if (base.settings.offset[0] == 0) {
                            return pos.left - ((base.width - base.$el.outerWidth()) / 2);
                        }
                        else {
                            return pos.left + base.$el.outerWidth() + base.settings.offset[0];
                        }
                    })(base.offset(base.$el[0])),
                    (function (pos) {
                        if (base.settings.offset[1] < 0) {
                            return pos.top - Math.abs(base.settings.offset[1]) - base.height;
                        }
                        else if (base.settings.offset[1] == 0) {
                            return pos.top - ((base.height - base.$el.outerHeight()) / 2);
                        }
                        else {
                            return pos.top + base.$el.outerHeight() + base.settings.offset[1];
                        }
                    })(base.offset(base.$el[0]))
                ];
            }
            base.$tipsy.css({top: tip_position[1] + 'px', left: tip_position[0] + 'px'});
            base.settings.show(e, base.$tipsy.stop(true, true));
        }).bind('mouseleave', function (e) {
            if (e.relatedTarget == base.$tip[0]) {
                base.$tip.bind('mouseleave', function (e) {
                    if (e.relatedTarget == base.$el[0]) {
                        return;
                    }
                    base.settings.hide(e, base.$tipsy.stop(true, true));
                });
                return;
            }
            base.settings.hide(e, base.$tipsy.stop(true, true));
        });
    };

    $.tooltipsy.prototype.readify = function () {
        this.ready = true;
        this.title = this.$el.attr('title') || '';
        this.$el.attr('title', '');
        this.$tipsy = $('<div id="tooltipsy' + this.random + '">').appendTo('body').css({position: 'absolute', zIndex: '999'}).hide();
        this.$tip = $('<div class="' + this.settings.className + '">').appendTo(this.$tipsy);
        this.$tip.data('rootel', this.$el);
        this.$tip.html(this.settings.content != '' ? this.settings.content : this.title);
    };

    $.tooltipsy.prototype.offset = function (el) {
        var ol = ot = 0;
        if (el.offsetParent) {
            do {
                ol += el.offsetLeft;
                ot += el.offsetTop;
            } while (el = el.offsetParent);
        }
        return {left : ol, top : ot};
    }

    $.tooltipsy.prototype.defaults = {
        alignTo: 'element',
        offset: [0, -1],
        content: '',
        show: function (e, $el) {
            $el.css('opacity', '1').show(100);
        },
        hide: function (e, $el) {
            $el.fadeOut(100);
        },
        css: {},
        className: 'tooltipsy'
    };

    $.fn.tooltipsy = function(options) {
        return this.each(function() {
            new $.tooltipsy(this, options);
        });
    };

})(jQuery);