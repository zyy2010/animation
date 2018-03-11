function animation(ele, attrs, duration=1000, fx='linear', callback=function(){}) {
    // 起始值 : 通过 ele 获取当前元素想要动画的属性
    // 现在我们要运动的属性可能会有多个，所以起始值需要把不同属性的b值进行分别存储
    // 不选择数组：在下面计算的时候，需要根据运动属性获取对应的b值，拿数组存的话，下面方便查找对应b值
    // 我使用key，value的形式去存，可以给每一个b值存不同的名字，方便下面进行获取
    var b = {};    //通过元素.style获取到的是元素的html属性 - 行间样式

    //因为attrs里面的个数和要运动的属性的名称是不定，所以我们要通过forin来遍历attrs，进行动态的获取
    for (var attr in attrs) {
        //根据attr获取到对应的初值，并赋值给b对应的属性
        b[attr] = parseInt(getComputedStyle(ele)[attr]);
    }

    // 总值 和初值类似，每个要运动的属性的 要运动距离（总值）是不一样的，所以 c 也需要每个属性单独存储
    var c = {};

    for (var attr in attrs) {
        // 总值：  当前要运动属性的目标 - 当前要运动的属性的初值
        c[attr] = attrs[attr] - b[attr];
    }

    // 持续时间 因为要运动的属性，需要同时到达，也就是共用一个持续时间，所以没有必要每个要运动的属性去单独的存储
    var d = duration;
    //获取开始运动的毫秒时间
    var startTime = Date.now();

    //如果timer是内部的局部变量，那么这个时候是清除不了的
    // clearInterval(ele.timer);

    if (ele.timer) {
        return;
    }

    //因为现在是通过一个定时器来同时运动多个属性，所以只需要一个定时器就够
    ele.timer = setInterval(function() {

        var t = Date.now() - startTime;

        if (t >= d) {
            t = d;
            clearInterval(ele.timer);
            ele.timer = null;
        }

        //现在是通过一个定时器来运动，所以，定时器没执行一次，那么就需要把运动的属性分别计算一次

        for (var attr in attrs) {
            var value = Tween[fx](t, b[attr], c[attr], d);

            //根据属性判断
            if (attr == 'opacity') {
                ele.style[attr] = value;
            } else {
                ele.style[attr] = value + 'px';
            }
        }

        t == d && typeof callback == 'function' && callback();

    }, 16);
}


var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;	//t/=d   t = t / d
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c;
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) *
            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
};