/**
 * Created by johnny on 2017/12/25.
 */
const VueSmartDragMover = {};


const isPc = function () {
    var uaInfo = navigator.userAgent;
    var agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var i = 0; i < agents.length; i++) {
        if (uaInfo.indexOf(agents[i]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}()
let start, end, move
if (isPc) {
    start = 'mousedown'
    move = 'mousemove'
    end = 'mouseup'
} else {
    start = 'touchstart'
    move = 'touchmove'
    end = 'touchend'
}

let startE, endE, moveE

function bindEvent(dom, event, callback, useCapture) {
    function remove() {
        dom.removeEventListener(event, icc, useCapture)
    }

    function icc(e) {
        if (callback(e) === true) {
            remove();
        }
    }

    dom.addEventListener(event, icc, useCapture);
    return remove;
}

function touchstart(e, self) {
    let tapObj = self.tapObj;

    tapObj.e = e;
    if (e.type === 'touchstart') {
        let touches = e.touches[0];
        tapObj.pageX = touches.pageX;
        tapObj.pageY = touches.pageY;
        tapObj.clientX = touches.clientX;
        tapObj.clientY = touches.clientY;

    } else {
        tapObj.pageX = e.pageX;
        tapObj.pageY = e.pageY;
        tapObj.clientX = e.clientX;
        tapObj.clientY = e.clientY;
    }
    tapObj.distanceX = 0
    tapObj.distanceY = 0

    tapObj.startE()
    tapObj.moveE = bindEvent(self, move, function (e) {
        touchmove(e, self);
    }, false);

    tapObj.endE = bindEvent(self, end, function (e) {
        return touchend(e, self);
    }, false);
    self.handler(tapObj.x, tapObj.y)
}


function touchmove(e, self) {
    let tapObj = self.tapObj;
    tapObj.e = e;
    if (!isPc) {
        let touches = e.changedTouches[0];
        tapObj.distanceX = tapObj.pageX - touches.pageX;
        tapObj.distanceY = tapObj.pageY - touches.pageY;
    } else {
        tapObj.distanceX = tapObj.pageX - e.pageX;
        tapObj.distanceY = tapObj.pageY - e.pageY;
    }

    self.handler( -tapObj.distanceX+tapObj.x, -tapObj.distanceY+tapObj.y)

}



function touchend(e, self) {
    let tapObj = self.tapObj;

    tapObj.startE = bindEvent(self, start, function (e) {
        touchstart(e, self);
    }, false);

    tapObj.endE()
    tapObj.moveE()

    if (e.type === 'touchend') {
        let touches = e.changedTouches[0];
        tapObj.distanceX = tapObj.pageX - touches.pageX;
        tapObj.distanceY = tapObj.pageY - touches.pageY;
    } else {
        tapObj.distanceX = tapObj.pageX - e.pageX;
        tapObj.distanceY = tapObj.pageY - e.pageY;
    }
    if(tapObj.remember===true){
        tapObj.x=Math.max(Math.min(tapObj.x-tapObj.distanceX,tapObj.maxX),tapObj.minX);
        tapObj.y=Math.max(Math.min(tapObj.y-tapObj.distanceY,tapObj.maxY),tapObj.minY);
    }
   // self.handler( -tapObj.distanceX, -tapObj.distanceY)
}

function extend(obj) {
    let length = arguments.length;
    obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (let index = 1; index < length; index++) {
        let source = arguments[index]
        for (let key in source) {
            obj[key] = source[key];
        }
    }
    return obj
}


VueSmartDragMover.install = function (Vue,option) {
    Vue.directive('dragmove', {
        bind: function (el, binding) {
            el.tapObj = extend({remember:false,x:0,y:0,minX:0,maxX:100,minY:0,maxY:100},option);
            el.style['user-select'] = 'none'
            el.style['-webkit-user-select'] = 'none'
            el.style['-ms-user-select'] = 'none'
            el.handler = function (x,y) { //This directive.handler
                x=Math.max(Math.min(x,el.tapObj.maxX),el.tapObj.minX)
                y=Math.max(Math.min(y,el.tapObj.maxY),el.tapObj.minY)
                binding.value(x,y);

            };

            el.tapObj.moveE = el.tapObj.endE = function () {
            }
            el.tapObj.startE = bindEvent(el, start, function (e) {
                touchstart(e, el);
            }, false);

        },
        unbind: function (el) {
            // 卸载，别说了都是泪
            let tapObj = el.tapObj;
            tapObj.startE()
            tapObj.endE()
            tapObj.moveE()
        }
    });
};

// Why don't you export default?
// https://github.com/webpack/webpack/issues/3560
export default VueSmartDragMover
export {VueSmartDragMover}