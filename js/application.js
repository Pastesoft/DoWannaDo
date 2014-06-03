/**
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne <brian@cherne.net>
*/
(function ($) { $.fn.hoverIntent = function (f, g) { var cfg = { sensitivity: 7, interval: 100, timeout: 0 }; cfg = $.extend(cfg, g ? { over: f, out: g} : f); var cX, cY, pX, pY; var track = function (ev) { cX = ev.pageX; cY = ev.pageY; }; var compare = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) { $(ob).unbind("mousemove", track); ob.hoverIntent_s = 1; return cfg.over.apply(ob, [ev]); } else { pX = cX; pY = cY; ob.hoverIntent_t = setTimeout(function () { compare(ev, ob); }, cfg.interval); } }; var delay = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); ob.hoverIntent_s = 0; return cfg.out.apply(ob, [ev]); }; var handleHover = function (e) { var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget; while (p && p != this) { try { p = p.parentNode; } catch (e) { p = this; } } if (p == this) { return false; } var ev = jQuery.extend({}, e); var ob = this; if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); } if (e.type == "mouseover") { pX = ev.pageX; pY = ev.pageY; $(ob).bind("mousemove", track); if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout(function () { compare(ev, ob); }, cfg.interval); } } else { $(ob).unbind("mousemove", track); if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout(function () { delay(ev, ob); }, cfg.timeout); } } }; return this.mouseover(handleHover).mouseout(handleHover); }; })(jQuery);


window.OG = {
    currentSection: null,
    currentItem: null,
    currentPiece: null,
    speed: 1
};

var nextPiece = function (anchor) {
    var oldPiece = OG.currentPiece;
    OG.currentPiece = OG.currentSection.find('article:eq(' + anchor.index() + ')');

    if (oldPiece === OG.currentPiece) {
        animatePiece(OG.currentPiece);
    } else {
        oldPiece.fadeOut(OG.speed * 400, function () {
            // console.debug(OG.currentPiece);
            // hide all things on old piece.

            animatePiece(OG.currentPiece);
        });
    }
};

var animatePiece = function (piece, callback) {
    piece.show(OG.speed * 0, function () {
        OG.currentSection.find('nav.anchors').fadeIn(OG.speed * 600);

    });
};

var expandHorizontal = function (element, callback) {
    element.animate({ width: '1000px' }, OG.speed * 600, function () {
        OG.currentPiece = element.find('article:first');
        OG.currentSection.find('a.anchor:first').addClass('active').siblings().removeClass('active');
        animatePiece(OG.currentPiece, callback);
    });
};


jQuery(document).ready(function ($) {


    $('#portfolio section:not(.selected)').live('click', function () {
        var oldCurrent = OG.currentSection;

        OG.currentSection = $(this).addClass('selected');

        oldCurrent.removeClass('selected');

        oldCurrent.find('article:visible:first').fadeOut(OG.speed * 100, function () {
            oldCurrent.find('nav.anchors').fadeOut(OG.speed * 100, function () {
                $(this).find('a.anchor.active').removeClass('active');
                oldCurrent.animate({ width: '40px' }, OG.speed * 800, function () {
                    expandHorizontal(OG.currentSection);
                    oldCurrent.find('article').hide();
                });

            });
        });
    });

    $('#portfolio a.anchor').live('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        nextPiece($(this));
        return false;
    });

    var showSelection = function (elem) {
        var piece = $(this).parent();
    };

    var hideSelection = function (elem) {
        var piece = $(this).closest('article');
    };







});

jQuery(window).load(function () {
    OG.currentSection = $('#portfolio section:first').addClass('selected');

    expandHorizontal(OG.currentSection, function () {
        OG.currentSection.find('a.anchor:first').addClass('active').siblings().removeClass('active');
    });

});

