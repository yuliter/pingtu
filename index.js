var stop = 0;
var used = [];
var backgroundImge = "";
// var mainImge = "http://www.jq22.com/tp/15667e64-8ba7-43dc-8de1-3ec9ae13a457.jpg";
var mainImge = "https://file.5rs.me/oss/uploadfe/jpg/db2120e68f0d0c9a125da5ba00b0f4b5.jpg";
var td = [];
var Margin=0;
var makeTable = [];
var clock;
window.onload=function (){
    $(".game").hide();
    $(".finish").hide();
    $(".fail").hide();
    td = document.getElementsByTagName('td');
    // Margin = parseInt(document.getElementById('img').currentStyle ? parseInt(screen.availWidth) * 0.31 : window.getComputedStyle(document.getElementById("img"), null)['marginLeft']);
// console.log(!!document.getElementById('img').currentStyle)
    //重置游戏
//     document.getElementById('restartGame').addEventListener('click', function() {
//         // location.reload(true);
//     });
//开始游戏
    document.getElementById('startGame').addEventListener('click', function() {
        var Timer = setTimeout(function(){
            $(".game").hide();
            if (!isWin()) {
                $(".fail").show()
            }
        },31000);
        //随机分割图片
        clock = setInterval("random_disorder()", 40);
        //监听td部分鼠标拖动
        for (i = 0; i < td.length; i++) {
            td[i].addEventListener('touchstart', function() {
                //拖拽
                drag(event.target, event.changedTouches[0].clientX, event.changedTouches[0].clientY, successFunction);
            });
        }
    });
    initTable();
}
//拼图成功后的提示。
function successFunction(){
    var Timer = setTimeout(function(){
                $(".game").hide()
                $(".finish").show()
    },1000);
}
function random_disorder() {
    initTable();
    used = [];
    for (i = 0, td = document.getElementsByTagName('td'); i < td.length; i++) {
        //打乱拼图块:设置td class（包含背景图定位），id为当前td位置，class，trueid为实际位置
        var class_id;
        do {

            class_id = get_Random(9);
            if (used.length == 9)
                break;
        }
        while (contains(used, class_id));
        td[i].setAttribute('class', 'img' + class_id);
        td[i].setAttribute('trueId', class_id);
        used[i] = class_id;
    }
    if (stop >= 12) {
        clearInterval(clock);
        stop = 0;
    } else
        stop++;
}
function initTable(_col, _row) {
    //添加图片
    document.getElementsByTagName("body")[0].style.backgroundImage = "url(" + backgroundImge + ")";
    for (i = 0; i < td.length; i++) {
        td[i].style.backgroundImage = "url(" + mainImge + ")";
    }
    //
    _col = _col ? _col : 3;
    _row = _row ? _row : 3;
    var table_cellSpacing = parseInt(document.getElementsByTagName('table')[0].getAttribute('cellspacing'));
    //实现自定义数量，需要增加创建td,和*class数组
    for (i = 0, td = document.getElementsByTagName('td'); i < td.length; i++) {
        td[i].setAttribute('class', 'img' + i);
        td[i].setAttribute('id', i);
        td[i].style.height = "168px";
        td[i].style.width = "168px";
        td[i].style.position = "absolute";
        td[i].style.left = i % _row * (168 + table_cellSpacing) + (parseInt(i % _row / _row) + 1) * Margin + "px";
        td[i].style.top = parseInt(i / _col) * (168 + table_cellSpacing) + "px";
        //确定td位置
        makeTable[i] = new Object();
        makeTable[i].left = parseInt(td[i].style.left);
        makeTable[i].top = parseInt(td[i].style.top);
        makeTable[i].right = parseInt(td[i].style.left) + parseInt(td[i].style.width);
        makeTable[i].bottom = parseInt(td[i].style.top) + parseInt(td[i].style.height);
        makeTable[i].middleX = (makeTable[i].left + makeTable[i].right) / 2;
        makeTable[i].middleY = (makeTable[i].top + makeTable[i].bottom) / 2;
    }
}
function isWin() {

    for (i = 0, td = document.getElementsByTagName('td'); i < td.length; i++) {
        if (td[i].getAttribute('id') != td[i].className.slice(3)) {
            return false;
        }
    }
    return true;
}
function get_Random(maxNum) {
    return Math.floor(Math.random() * maxNum);
}
function drag(obj, mouseX, mouseY, successAction) {
    obj.style.zIndex = "2";
    obj.style.zIndex = "2";
    var templateObj = {
        left: getCss(obj, 'left'),
        top: getCss(obj, 'top'),
        currentX: mouseX,
        currentY: mouseY,
        flag: true
    };
    document.ontouchmove = function(event) {
        // console.log("in touchmove",event)
        var e = event ? event : window.event;
        if (templateObj.flag) {
            var nowX = e.changedTouches[0].clientX,
                nowY = e.changedTouches[0].clientY;
            var disX = nowX - templateObj.currentX,
                disY = nowY - templateObj.currentY;
            // console.log(templateObj.currentX,"dd")
            obj.style.left = parseInt(templateObj.left) + disX + "px";
            obj.style.top = parseInt(templateObj.top) + disY + "px";
            if (event.defaultPrevented) {
                // event.preventDefault();
            }
            return false;
        }
        if (typeof callback == "function") {
            callback(parseInt(templateObj.left) + disX, parseInt(templateObj.top) + disY);
        }
    }
    for (i = 0; i < td.length; i++) {
        td[i].ontouchend = function() {
            obj.style.zindex = "0";
            obj.style.zIndex = "0";
            templateObj.flag = false;

            var oLI = getOverlay(obj);
            var OverLay = makeTable[oLI];

            if (getCss(obj, "left") !== "auto") {
                //表格定位
                obj.style.left = makeTable[obj.id].left + "px";
                //图片定位（交换class）
                var oldClass = obj.getAttribute('class');
                //alert(oLI);
                obj.setAttribute('class', document.getElementById(oLI.toString()).getAttribute('class'));
                document.getElementById(oLI).setAttribute('class', oldClass);

            }
            if (getCss(obj, "top") !== "auto") {
                //表格定位
                obj.style.top = makeTable[obj.id].top + "px";
            }
            //addTitle();
            if (isWin()) {
                successAction();
            }
        };
    }

}
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
function getOverlay(_hover) {
    var _Hover = new Object();
    _Hover.middleX = parseInt(getCss(_hover, 'left')) + parseInt(getCss(_hover, 'width')) / 2;
    _Hover.middleY = parseInt(getCss(_hover, 'top')) + parseInt(getCss(_hover, 'height')) / 2;
    for (i = 0; i < makeTable.length; i++) {

        if ((makeTable[i].left < _Hover.middleX && _Hover.middleX < makeTable[i].right) && (makeTable[i].top < _Hover.middleY && _Hover.middleY < makeTable[i].bottom)) {
            return i;
        }
    }
}
function getCss(elementObj, key) {
    return elementObj.currentStyle ? elementObj.currentStyle[key] : window.getComputedStyle(elementObj, false)[key];
}

