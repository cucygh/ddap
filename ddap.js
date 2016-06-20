/**
 * 首页广告分发
 */
(function(win, undefined) {
    'use strict';
    /**
     * [Q 广告分发命名空间]
     * @type {Object}
     */
    var Q = {
        //广告配置存储
        ads: {},
        // 广告脚本加载完毕回调
        loaded: function() {
            var args = [].slice.call(arguments, 0);
            var name = args[0];
            var type = args[1];
            var file = args[2];
            if (name && Q.ads[name]) {
                Q.sendToGA(['ad', name, type, file].join('_'));
                if (!Q.ads[name].installed) {
                    Q.ads[name].installed = true;
                    Q.sendToGA(['ad', name, 'installed'].join('_'));
                }
            }
        }
    };
    /**
     * [function 创建script节点]
     * @param  {[type]} src [description]
     * @return {[type]}     [description]
     */
    var createScript = function(src, name) {
        var script = document.createElement('script');
        var head = document.getElementsByTagName("head")[0];
        var file = [].concat(src.url.match(/[a-zA-Z0-9]+(?=\.js$)/g))[0];
        script.async = true;
        script.type = 'text/javascript';
        script.charset = src.charset || 'utf8';
        script.id = src.id || '';
        script.onload = function() {
            Q.loaded.call(Q.ads, name, 'success', file);
        };
        script.onerror = function() {
            Q.loaded.call(Q.ads, name, 'error', file);
        };
        if (src.url) {
            script.src = src.url;
            if (head) {
                head.insertBefore(script, head.firstChild);
            }
            return script;
        } else {
            return false
        }
    };
    /**
     * [function 增加广告代码]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    Q.addScript = function(name) {
        var ad = Q.ads[name];
        if (!!ad) {
            var list = ad.scripts,
                before = ad.before;
            if (before && typeof before == 'function') {
                before.call(ad);
            }
            for (var i = 0, len = list.length; i < len; i++) {
                createScript(list[i], name);
            }
        }
    };
    /**
     * [function 向第三方发送统计数据]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    Q.sendToGA = function(name, args) {
        var ga = window.ga;
        var cnzz = window._czc;
        var path = document.location.pathname;
        if (ga) {
            ga('send', 'event', path, name, '');
        }
        if (cnzz) {
            // http://open.cnzz.com/a/new/setcustomvar/
            cnzz.push(['_trackEvent', name, '广告', '加载', 1, '']);
        }
    };
    /**
     * [function 定义广告]
     * @param  {[type]} name      [description]
     * @param  {[type]} scripts   [description]
     * @param  {[type]} beforeFun [description]
     * @return {[type]}           [description]
     */
    Q.insertAd = function(config) {
        Q.ads[config.name] = {
            name: config.name,
            scripts: config.scripts,
            before: config.beforeFun,
            installed: false
        };
    };
    /**
     * [function 安装指定内容的广告脚本]
     * @param  {[type]} name    [description]
     * @param  {[type]} timeout [description]
     * @return {[type]}         [description]
     */
    Q.start = function(name, timeout) {
        setTimeout(function() {
            Q.addScript(name);
        }, timeout || 0);
    };
    /**
     * [function 流量控制]
     * @return {[type]} [description]
     */
    Q.transfer = function() {
        var hit;
        var sum = function() {
            var args = Array.prototype.slice.call(arguments, 0),
                t = 0,
                v;
            for (var i = 0, len = args.length; i < len; i++) {
                v = args[i] * 1;
                if (v) t += v;
            }
            return t;
        };
        var getPerHit = function() {
            var base = ('' + [].concat(document.cookie.match(/tt_webid\=\ds+/g))[0]).split('=')[1] * 1;
            if (base) {
                base = sum(base);
            } else {
                base = Math.floor(Math.random() * 100);
            }
            base = base % 100;
            if (base <= 25) {
                hit = 'tb';
            } else if (base < 45) {
                hit = 'bd'
            } else if (base < 75) {
                hit = 'hz'
            }
            return hit
        };
        return getPerHit()
    };
    /**
     * [将广告代码挂在到tt_ddap.Q]
     */
    (window['tt_ddap'] = window['tt_ddap'] || {})['Q'] = Q;;
})(window);
