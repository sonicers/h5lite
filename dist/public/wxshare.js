//分享缩略图
const thumbnail = "https://uss.sonicers.com/sike/public/weixin.jpg"

//随机分享享标题
const shareT = [
    '约么？来看个超级无敌舒服酸爽的……椅子',
    '在吗？我想约你一起去买个椅子，看完会很热的那种……',
    '为什么这个椅子，让女神的心都融化了？',
    '舒舒舒舒服……女神都化了……'
]

//随机分享文案，个数必须与分享标题一致，不想一致自己改代码
const shareA = [
    '来探探究竟？',
    '等不及了……',
    '融化她的不仅有热情，还有……',
    '不敢相信，她竟然变成了这个样子！'
]

const baseLink = window.location.href.replace(/%26/g, '&')
console.log("baseLink:" + baseLink)

const randomShare = Math.floor(Math.random() * shareT.length)

//自定义微信分享
window.shareData = {
    url: baseLink,
    picUrl: thumbnail,
    title: shareT[randomShare],
    desc: shareA[randomShare],
    timelineTitle: shareT[randomShare],

    callback: function (type) {//分享成功回调，可以在这里做统计

    }
}

function refreshShareData() {
    axios.get('https://api.sonicers.com/release/get_signature', {
        params: {
            reqUrl: window.location.href
        }
    }).then((res) => {
        console.log("res=========", res)
        let data = res.data
        console.log("data==========", data)
        console.log("data.appId==========", data.appId)
        console.log("data.timestamp==========", data.timestamp)
        console.log("data.nonceStr==========", data.nonceStr)
        console.log("data.signature==========", data.signature)
        wx.config({
            debug: false, // 开启调试模式
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
    }).catch((error) => {
        console.log(error)
    })
    wx.ready(function () {

        wx.onMenuShareTimeline({
            title: window.shareData.timelineTitle,
            link: window.shareData.url,
            imgUrl: window.shareData.picUrl,
            success: function () {
                window.shareData.callback("sharetimeline")
            },
            cancel: function () {
            }
        })

        wx.onMenuShareAppMessage({
            title: window.shareData.title,
            desc: window.shareData.desc,
            link: window.shareData.url,
            imgUrl: window.shareData.picUrl,
            success: function () {
                window.shareData.callback("shareappmessage")
            },
            cancel: function () {
            }
        })

        wx.onMenuShareQQ({
            title: window.shareData.title,
            desc: window.shareData.desc,
            link: window.shareData.url,
            imgUrl: window.shareData.picUrl,
            success: function () {
                window.shareData.callback("shareqq")
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        })
        wx.onMenuShareWeibo({
            title: window.shareData.title,
            desc: window.shareData.desc,
            link: window.shareData.url,
            imgUrl: window.shareData.picUrl,
            success: function () {
                window.shareData.callback("shareweibo")
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        })
    })

}

refreshShareData()
