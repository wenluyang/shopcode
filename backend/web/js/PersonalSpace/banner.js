$(function () {
    var banner = []
    ysAjax.get('/system/set', "", "json", function (res) {
        console.log(res)
        if (res.code == '0000') {
            if(res.data==null){
                // 头部LOGO
                $(".navbar-brand").find('img').attr("src",'../../images/logo/newLogo.png')
                

                // 标签页名称图片

                $("link[rel='shortcut icon']").attr("href",'../../images/logo/favicon.ico')

                $("title").text('商城管理系统')

                //banner图设置默认显示

                
                settingComm(".swiper-wrapper")
                swiperBg() 


            }  else{
            }
        }

    })
    
})
// 递归解决异步方法问题。
function getRealImg2(eleArr,data,i,callback){
    if(data.length == i){
        callback && callback()
    } else {
        var type = type?type:"src";
        src = imgApi + "/file/explore?gid=" + data[i]
        var xhr = new XMLHttpRequest();
        xhr.open("get",src,true);
        xhr.setRequestHeader("Content-type", "application/json;");
        xhr.responseType = "blob"; //返回类型blob
        xhr.onload = function () {
            if (this.status === 200) {
                var blob = this.response;
                $(eleArr[i]).css("background-image",`url(${window.URL.createObjectURL(blob)})`)
                getRealImg2(eleArr,data,i+1,callback)
            }
        }
        xhr.send();
    }
}
// 普通获取图片。
function getRealImg(ele,str,type,onOff,callback){
    var type = type?type:"src";
    src = imgApi + "/file/explore?gid=" + str
    var xhr = new XMLHttpRequest();
    xhr.open("get",src,true);
    xhr.setRequestHeader("Content-type", "application/json;");
    xhr.responseType = "blob"; //返回类型blob
    xhr.onload = function () {
        if (this.status === 200) {
            var blob = this.response;
            if(onOff){
                $(ele).css(type,`url(${window.URL.createObjectURL(blob)})`)
                callback && callback()
            } else {
                $(ele).attr(type, window.URL.createObjectURL(blob))
            }
        }
    }
    xhr.send();
}
function settingComm(obj) {
    var bannerBG = []
    var imgArr = ['../../images/index/banner_1.png', '../../images/index/banner_2.png', '../../images/index/banner_3.png']
    $.each(imgArr, function (i, e) {
        bannerBG.push("<div class='swiper-slide slide" + (i + 1) + " '></div>")

    })
    $(obj).append(bannerBG.join(""))
    $.each(imgArr, function (i, e) {
        // bannerError.push("<div class='swiper-slide slide"+(i+1)+" '></div>")
        $(".swiper-slide").eq(i).css({
            "background-image": "url(" + e + ")"
        })


    })
}

function swiperBg() {
    console.log("11")
    var mySwiper = new Swiper('.swiper-container', {
                pagination: '.pagination',
                paginationClickable: true,
                autoplay: 4000,
                speed: 1,
                loop: true,
                simulateTouch: false,
                grabCursor: true,
                autoplayDisableOnInteraction: false,
                onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
                    swiperAnimateCache(swiper); //隐藏动画元素 
                    swiperAnimate(swiper); //初始化完成开始动画
                },
                onSlideChangeEnd: function (swiper) {
                    swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
                }
            })
            $('.arrow-left').on('click', function (e) {
                e.preventDefault()
                mySwiper.swipePrev()
            })
            $('.arrow-right').on('click', function (e) {
                // alert("11")
                console.log(e)
                e.preventDefault()
                mySwiper.swipeNext()
            })
}