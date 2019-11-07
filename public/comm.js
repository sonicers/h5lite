var fileBasePath = 'public/';

var fileList = [
    'load-bg.jpg',
    'load-icon.png',
    'load-line.png',
    'load-play.png',
    'load-txt.png',
    'end-bg.jpg',
    'end-btn-1.png',
    'end-btn-2.png',
    'end-slogan.png',
    'video-skip.png',
    'video.jpg'
];

var loader = new WxMoment.Loader();

for (var i = 0; i < fileList.length; i++) {
    loader.addImage(fileBasePath + fileList[i]);
}

loader.addProgressListener(function(e) {
    if (e.completedCount == 5) {
        $('#load').addClass('show');
    }
    var percent = Math.round((e.completedCount / e.totalCount) * 100);
    $('#load .line span i').css({
        'width': percent + '%'
    });
});

loader.addCompletionListener(function() {
    setTimeout(function() {
        $('#load .txt').addClass('hide');
        $('#load .line').addClass('hide');
        $('#load button').addClass('show');
    }, 500);
    // vivoStat.stat('load_end');
    // vivoStat.load.end();
});

var ua = navigator.userAgent.toLowerCase();
var iOS = /iPad|iPhone|iPod/.test(navigator.platform) || ua.indexOf('iphone') >= 0;
var isAndroid = ua.indexOf('android') > -1 || ua.indexOf('adr') > -1;
var isWeiXin = false;
if (ua.indexOf('micromessenger') > -1) {
    isWeiXin = true;
}

var isMobile = /iphone|nokia|sony|ericsson|mot|samsung|sgh|lg|philips|panasonic|alcatel|lenovo|cldc|midp|wap|mobile/i.test(ua) && !/pc=1/.test(location.search);

var htmlWidth;
var htmlHeight;
var designWidth;
var designScale;
var htmlScale;
var video;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

var adtag = getQueryVariable('ADTAG');

$(function() {

    // if (!isMobile) {
    //     $('#linkpro').show();
    //     $('#linkpro .ifpc').show();
    //     $('#linkpro .ifpc-qr').html('<img src="http://qr.liantu.com/api.php?text=' + baseLink + '">')
    // } else {
    //     loader.start();
    //     vivoStat.stat('load_start');
    // }

    loader.start();
    // vivoStat.stat('load_start');

    function isIphoneX() {
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375);
    }

    var isX = isIphoneX();

    if (isX) {
        $('.wrap').addClass('iphonex');
    }

    if (isAndroid) {
        $('.wrap').addClass('android');
    }

    if (!isWeiXin) {
        $('.wrap').addClass('noweixin');
    }

    if (isWeiXin) {
        $('.wrap').addClass('weixin');
    }

    function landscapeSetting() {
        var handler = function() {
            switch (window.orientation) {
                case 0:
                case 180:
                    $('#linkpro').hide();
                    $('#linkpro .ifhs').hide();
                    break;
                case -90:
                case 90:
                    $('#linkpro').show();
                    $('#linkpro .ifhs').show();
                    break;
            }
        };

        handler();
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handler, false);
    }

    landscapeSetting()

    reSize();

    $(window).resize(function() {
        reSize();
    });

    function reSize() {
        htmlWidth = $('html').width();
        htmlHeight = $('html').height();
        designWidth = 750;
        designScale = 1334 / 750;
        htmlScale = htmlHeight / htmlWidth;
        // console.log('屏幕高度:' + htmlHeight);

        $('#video video').css({
            'width': htmlWidth + 'px',
            'height': htmlWidth * designScale + 'px',
            'margin': -htmlWidth * designScale / 2 + 'px 0 0 -' + htmlWidth / 2 + 'px'
        })

        if (htmlScale > designScale) {
            var scale = htmlScale / designScale;
            $('.zoom').css({
                '-webkit-transform': 'scale3d(' + scale + ', ' + scale + ', 1)',
                'transform': 'scale3d(' + scale + ', ' + scale + ', 1)'
            })
            if ( isAndroid && isWeiXin ) {
                var scaleAndroid = ( scale - 1 ) / 2 + 1;
                $('#video-content').css({
                    '-webkit-transform': 'scale3d(' + scaleAndroid + ', ' + scaleAndroid + ', 1)',
                    'transform': 'scale3d(' + scaleAndroid + ', ' + scaleAndroid + ', 1)'
                })
            }
            $('.wrap').addClass('long');
        } else {
            $('.wrap').removeClass('long');
        }

        $('html').css({
            'font-size': htmlWidth / designWidth * 100 + 'px'
        });

    }

    $('.wrap').on('touchmove', function(e) {
        e.preventDefault()
    })

    switch (adtag) {
        case 'weixin':
            $('#end').addClass('end-1');
            break;
        case 'apppush':
            break;
        case 'ipush':
            break;
        case 'brower':
            break;
        case 'itheme':
            break;
        case 'qywx':
            $('#end').addClass('end-2');
            break;
    }

    // var vConsole = new VConsole();

    video = document.getElementById('video-content');

    if (iOS && !isWeiXin) {
        enableInlineVideo(video);
    }

    $('#load button').one('touchend', function(event) {
        event.preventDefault();
        $('#video').addClass('show');
        video.play();
        setTimeout(function() {
            $('#load').remove();
            $('#btn-skip').addClass('show');
        }, 1000);
        $('#audio-bgm')[0].load();
        // vivoStat.stat('btn_play');
    });

    $('#btn-skip').bind('touchend', function(event) {
        event.preventDefault();
        $('#btn-skip').removeClass('show');
        video.pause();
        $('#end').addClass('show');
        if ( isAndroid && isWeiXin ) {
            $('#video').remove();
        } else {
            setTimeout(function() {
                $('#video').remove();
            }, 1000);
        }
        $('#audio-bgm')[0].play();
        // vivoStat.stat('btn_skip');
    });

    video.addEventListener('ended', function() {
        $('#end').addClass('show');
        video.pause();
        if ( isAndroid && isWeiXin ) {
            $('#video').remove();
        } else {
            setTimeout(function() {
                $('#video').remove();
            }, 1000);
        }
        $('#audio-bgm')[0].play();
        // vivoStat.stat('video_end');
    });

    video.addEventListener('pause', function() {
        if (isAndroid) {
            if (isWeiXin) {
                $('#end').addClass('show');
                $('#audio-bgm')[0].play();
                if ( isAndroid && isWeiXin ) {
                    $('#video').remove();
                } else {
                    setTimeout(function() {
                        $('#video').remove();
                    }, 1000);
                }
            }
        }
    });

    $('#end #btn-1').bind('touchend', function(event) {
        event.preventDefault();
        setTimeout(function() {
            window.open('https://shop.vivo.com.cn/wap/product/10000534?colorSkuid=101610&cid=h-1-vivo_shequ-x27');
        }, 200);
        // vivoStat.stat('btn_shop', {
        //     'channel': adtag
        // });
    });

    $('#end #btn-2').bind('touchend', function(event) {
        event.preventDefault();
        setTimeout(function() {
            window.open('https://bbs.vivo.com.cn/forum.php?mod=viewthread&tid=5529143');
        }, 200);
        // vivoStat.stat('btn_act', {
        //     'channel': adtag
        // });
    });

    if (isWeiXin) {
        document.addEventListener('WeixinJSBridgeReady', function() {
            video.load();
        }, false)
    }

});
