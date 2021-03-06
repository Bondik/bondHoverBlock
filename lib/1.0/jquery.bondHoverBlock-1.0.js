/*
 bondHoverBlock - jQuery plugin
 Author: Bondarenko Aleksey
 Homepage: http://alex-bond.net
 */
(function ($) {
    $.fn.bondHoverBlock = function (options) {
        /*var constants = {
         fade : {fast:"fast", normal:"normal", slow:"slow"},
         direct:{next:"next",prev:"prev"}
         }*/
        var defaults = {
            topPosblock:0,
            topPosWindow:0,
            isCopy:!0,
            showSpeed:0,
            hideSpeed:0,
            showEasing:"linear",
            hideEasing:"linear",
            toggleClass:"bondFix",
            wrapClass:"bondWrap"
        }
        var options = $.extend(defaults, options);
        var this$ = this;
        var positionBlock = getOffset(this.get(0));
        var memory = {isFix:null};
        init();
        bindEvent();

        function init() {
            this$.data({"top":(this$.css("top") == "auto") ? "" : this$.css("top") });
            if (options.isCopy) {
                this$.data({"opacity": (this$.css("opacity")==1)? "": this$.css("opacity") });
                var wrapEl$ = $(document.createElement('div'));
                wrapEl$.css({
                    width:this$.outerWidth(true),
                    height:this$.outerHeight(true)
                });
                wrapEl$.addClass(options.wrapClass);
                this$.data({"wrap":wrapEl$ });
            }
        }

        function bindEvent() {
            $(window).scroll(function (e) {
                var windowScrollTop = $(window).scrollTop();
                if (windowScrollTop - options.topPosWindow >= positionBlock.top - options.topPosblock) {
                    if (!memory.isFix) {
                        this$.css({top:options.topPosblock});
                        this$.toggleClass(options.toggleClass);
                        memory.isFix = true;
                        if (options.isCopy) {
                            this$.css({opacity:0});
                            this$.wrap(this$.data("wrap"));
                            var effect = (jQuery.easing[options.showEasing] == null) ? "linear" : options.showEasing;
                            this$.stop().animate({opacity:1}, options.showSpeed, effect);
                        }
                    }
                }
                else {
                    if (memory.isFix) {
                        memory.isFix = false;
                        if (options.isCopy) {
                            var effect = (jQuery.easing[options.hideEasing] == null) ? "linear" : options.hideEasing;
                            this$.stop().animate({opacity:0}, options.hideSpeed, effect, function () {
                                //this$.toggleClass(options.toggleClass);
                                //this$.css({top:this$.data("top") });
                                anyfunc();
                                this$.css({opacity:this$.data("opacity")});
                                this$.unwrap();
                            });
                        }
                        else
                            anyfunc();

                    }
                }
                function anyfunc(){
                    this$.toggleClass(options.toggleClass);
                    this$.css({top:this$.data("top") });
                }
            });
        }

        function getOffset(elem) {
            if (elem.getBoundingClientRect) {
                // "правильный" вариант
                return getOffsetRect(elem)
            } else {
                // пусть работает хоть как-то
                return getOffsetSum(elem)
            }
        }

        function getOffsetSum(elem/*,isMargin*/) {
            var top = 0, left = 0
            while (elem) {
                top = top + parseInt(elem.offsetTop)
                left = left + parseInt(elem.offsetLeft)
                elem = elem.offsetParent
            }
            /*if (isMargin){
                top = top - (elem.outerHeight(true)-elem.height())/2 //!!!Opsss;
                left = left - (elem.outerWidth(true)-elem.width())/2;
            }*/
            return {top:top, left:left}
        }

        function getOffsetRect(elem) {
            // (1)
            var box = elem.getBoundingClientRect()

            // (2)
            var body = document.body
            var docElem = document.documentElement

            // (3)
            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

            // (4)
            var clientTop = docElem.clientTop || body.clientTop || 0
            var clientLeft = docElem.clientLeft || body.clientLeft || 0

            // (5)
            var top = box.top + scrollTop - clientTop
            var left = box.left + scrollLeft - clientLeft

            return { top:Math.round(top), left:Math.round(left) }
        }


    }
})(jQuery);
