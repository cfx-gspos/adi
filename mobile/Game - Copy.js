function fixed(num) {
    return Number.parseFloat(num).toFixed(2);
}



var conflux;

var accounts;

var treasureContract;
window.lock = false;

$(function () {


    $('#g_link').attr('href', "https://confluxscan.io/address/"+ CONTRACT_ADDRESS)
    $('#g_poolname').html( POOL_NAME)
    $('title').html( POOL_NAME)
    //链接钱包
    $('#connWallet').click(function () {

        if (checkPortal()) {

            openPortal();

        } else {

        }
    })

    //存款
    $('#depositBtn').click(function () {

        sendTx();


    })

    //赞助
    $('#sponsorBtn').click(function () {

        sendSponsorTX();


    })


    if (checkPortal()) {

        openPortal()

        treasureContract = confluxJS.Contract({
            abi: CONTRACT_ABI,
            address: CONTRACT_ADDRESS,
        });

    }

    //定时获取链上数据并更新页面
    setInterval(function () {
        // queryCapitalInfo();
    }, 3000);

    //定时更新时间间距
    setInterval(function () {
        showIntervalTime();
    }, 500);


    var inviteAddress = getQueryVariable("invite");
    $("#referrer").attr('data', inviteAddress);





    ///////////////////////KKKKKKKKKKKKKKKK



    //**************************************************KO */


    // This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
    function Card(id, backgroundId, path, opened, selected) {
        this.id = ko.observable(id);
        this.backgroundId = ko.observable(backgroundId);
        this.path = ko.observable(path);
        this.opened = ko.observable(opened);
        this.selected = ko.observable(selected);
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    var opnedCards = [];
    async function getOpendCard() {


        function AppViewModel() {

            // construct the random card list,whichi should be read from contract.
            var idList = [];
            for (var i = 1; i < 55; i++) {
                idList.push(i);
            }
            idList = _.sample(idList, 54);

            var backgroundIdList = [];
            for (var i = 1; i < 55; i++) {
                backgroundIdList.push(i);
            }
            backgroundIdList = _.sample(backgroundIdList, 54);
            var self = this; 

            console.log(114)

            self.Try = async function () {
           

       //  console.log(129,reward.toString()/Math.pow(10,18).toString(10) )

                if (conflux && conflux.selectedAddress == null) {
                    try {
                        layer.msg('请重新登录Conflux Portal钱包')
                        openPortal()

                    } catch (err) {
                        console.log(err)
                    }
                    return;
                }



                window.lock = true;
                console.log('begin', 147)

                var vote=$('#balance').val();

                const receipt = await treasureContract.increaseStake((vote/1000).toString(10)).sendTransaction({
                    value: ((vote/1000).toString(10)*Math.pow(10,18)).toString(10)+"000",
                    from: conflux.selectedAddress,
                    gas: 15000000,
                    storageLimit: 3000,
                    gasPrice: 1

                }).confirmed();
                console.log('receipt', receipt)
                location.href=location.href;

                return;

                $('#btnTry').prop('disabled', 'disabled')
                var minnerInfo = $('#minnerReward').text();
                var winnerInfo = $('#winnerReward').text();

                var _playerCount = await treasureContract._playerCount();
                var _bid = await treasureContract.BID_LIST(_playerCount[0] == undefined ? 1 : _playerCount[0] + 1);

                var ticketAmountValue = _bid[0] / 1000 * Math.pow(10, 18);

                var url = new URL(location.href);
                var referrer = url.searchParams.get("invite");
                if (!referrer) {
                    referrer = '0x0000000000000000000000000000000000000000'
                }


                try {
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-rim', //加上边框
                        area: ['420px', '240px'], //宽高
                        content: '<div class="row"><div class="col-12 text-center" ><img src="./layer/theme/default/loading-0.gif" /></div><div class="col-12 text-center" > <h4> 合约交互中，请稍后，中途请勿关闭页面，合约执行后自动抽奖</h4></div></div>'
                    });
                    referrer = referrer.length > 0 ? referrer : '0x0000000000000000000000000000000000000000';
                    try {
                   
                    } catch (err) {
                        layer.closeAll();
                        
                        layer.msg('如果提示燃气费不足，请多试几次'+err.message,{time:20000})
                        $('#btnTry').prop('disabled', '')
                        return;
                    }



                    layer.closeAll();


                     
                     
                    window.lock = false;
                } catch (err) {
                    window.lock = false;
                    layer.alert(err.message);
                    $('#btnTry').prop('disabled', '')

                }



            }

        

        }

        let VM = new AppViewModel();
        ko.applyBindings(VM);

    }

    getOpendCard();

    $('#Copy').click(() => {
        copyToClipboard(document.getElementById("inviteLink"));
        layer.msg('已拷貝');
    });
    function copyToClipboard(elem) {
        // create hidden text element, if it doesn't already exist
        var targetId = "_hiddenCopyText_";
        var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            // must use a temporary form element for the selection and copy
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.textContent;
        }
        // select the content
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);

        // copy the selection
        var succeed;
        try {
            succeed = document.execCommand("copy");
        } catch (e) {
            succeed = false;
        }
        // restore original focus
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }

        if (isInput) {
            // restore prior selection
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // clear temporary content
            target.textContent = "";
        }
        return succeed;
    }










    /////////////////////////OOOOOOOOOOOOOOO


})

//检测是否安装
function checkPortal() {

    conflux == undefined ? window.conflux : conflux;
    if (typeof conflux == undefined) {
        return false;
    } else {
        return true;
    }
}
setInterval(() => {
    if (conflux && conflux.selectedAddress) {
        var myInviteLink='http://endisend.gitee.io/cfxtodamoon/' + '?invite=' + conflux.selectedAddress;
        $.post('https://www.bejson.com/Bejson/Api/ShortUrl/getShortUrl',{url:myInviteLink},function(ret){
        if(ret.data!=undefined){
            myInviteLink= ret.data.short_url;
        }  
        
$('#inviteLink').val('地址尾号' + conflux.selectedAddress.substr(conflux.selectedAddress.length - 4) + '邀请你玩区块链游戏：抽王八，1CFX起玩，最高获得615CFX,点击链接开始吧：' + myInviteLink);
        });
    } else {
    }
}, 10000);

//打开钱包插件
async function openPortal() {

    if (checkPortal()) {
        accounts = accounts != undefined ? accounts : await conflux.enable();
        if (conflux.selectedAddress == null) {
            await conflux.enable();
        }
        var _address = conflux.selectedAddress;
     
        var balance= (await confluxJS.getBalance(_address)).toString()/Math.pow(10,18);
        $('#spanBalance').html(balance.toFixed(2))
        $('#balance').val(Math.floor( balance/1000)*1000)

                var reward= (await treasureContract.userInterest( conflux.selectedAddress)).toString(10)/Math.pow(10,18).toString(10);                
                var vote=( await treasureContract.userSummary( conflux.selectedAddress))[0];
         $('#g_staked').html(vote*1000)
         $('#g_rewards').html(reward.toFixed(2))


        $('#walletAddressText').text(_address.substring(0, 6) + "..." + (_address.substring(36, 50)));
        var port = window.location.port;

        // var domain = port == '' ? window.location.href.split(':')[0] + '://' + document.domain : window.location.href.split(':')[0] + '://' + document.domain + ':' + port;

        // var referrerAddress = await treasureContract.getReferrer(conflux.selectedAddress);
        // $("#referrer").text(getFomatAddressTxt(referrerAddress));

        // var BASE_INVEST_AMOUNT = await treasureContract.BASE_INVEST_AMOUNT();
        // BASE_INVEST_AMOUNT = (parseInt(BASE_INVEST_AMOUNT) / Math.pow(10, 18));
        // $("#BASE_INVEST_AMOUNT").text(BASE_INVEST_AMOUNT + 'FC');

        // var BASE_NUM = await treasureContract.BASE_NUM();
        // $("#BASE_NUM").text(BASE_NUM + '次');

        // var BASE_AMOUNT_STEP = await treasureContract.BASE_AMOUNT_STEP();
        // BASE_AMOUNT_STEP = (parseInt(BASE_AMOUNT_STEP) / Math.pow(10, 18));
        // $("#BASE_AMOUNT_STEP").text(BASE_AMOUNT_STEP + 'FC');


        // var TIME_STEP = await treasureContract.TIME_STEP();
        // $("#TIME_STEP").text(parseInt(TIME_STEP / 60) + '分钟');


        // var SPONSOR_LIMIT_NUM = await treasureContract.SPONSOR_LIMIT_NUM();
        // $("#SPONSOR_LIMIT_NUM").text(SPONSOR_LIMIT_NUM + '名');


        // var SPONSOR_TICKET_AMOUNT = await treasureContract.SPONSOR_TICKET_AMOUNT();
        // SPONSOR_TICKET_AMOUNT = (parseInt(SPONSOR_TICKET_AMOUNT) / Math.pow(10, 18));
        // $("#SPONSOR_TICKET_AMOUNT").text(SPONSOR_TICKET_AMOUNT + 'FC');


        // var LIMIT_AMOUNT = await treasureContract.LIMIT_AMOUNT();
        // LIMIT_AMOUNT = (parseInt(LIMIT_AMOUNT) / Math.pow(10, 18));
        // $("#LIMIT_AMOUNT").text(LIMIT_AMOUNT + 'FC');


    } else {

        layer.msg('未安装钱包插件！');

    }

}
//累计时间
async function showIntervalTime() {

    var intervalTime = $('#intervalTime').attr('data-time');
    var timeStep = $('#intervalTime').attr('time-step');

    if (intervalTime == "0")
        return;

    var NowTime = new Date();
    var t = NowTime.getTime() - parseInt(intervalTime) * 1000;

    t = parseInt(timeStep) * 1000 - t;

    var h = Math.floor(t / 1000 / 60 / 60 % 24);
    h = h < 0 ? '00' : h.toString();
    var m = Math.floor(t / 1000 / 60 % 60).toString();
    m = m < 0 ? '00' : m.toString();
    var s = Math.floor(t / 1000 % 60).toString();
    s = s < 0 ? '00' : s.toString();

    $('#intervalTime').text((h.length == 1 ? '0' + h : h) + ":" + (m.length == 1 ? '0' + m : m) + ":" + (s.length == 1 ? '0' + s : s));

}



//获取合约数据
async function queryCapitalInfo() {

    if (checkPortal()) {


        if (window.lock) {
            return;
        }

        //****************** */
        var _playerCount = await treasureContract._playerCount();
        if (_playerCount[0] == undefined) {
            _playerCount[0] = 0;
        }
        var _bid = (await treasureContract.BID_LIST(_playerCount[0] + 1))[0];
        // var _times = (await treasureContract._times(_playerCount[0] +1));
        var winnerReward = 0;
        var minnerReward = 0;

        // if (_times[0].length == 0) {
        //     winnerReward = 3.6;
        //     minnerReward = 0;
        // } else {
        if ((await treasureContract._times(_playerCount[0]))[9][0] == undefined) {

            minnerReward = 0;
        } else {

        }
        var poolFund=(await treasureContract.poolFund())[0]*100;
        if(isNaN(poolFund) ){
            poolFund=0;
        }
        minnerReward = ((await treasureContract.BID_SUM_LIST(54))[0]+poolFund) * 0.9/2 / 53 / 1000;
        // winnerReward =   ((await treasureContract.BID_SUM_LIST(54))[0]+poolFund) *0.9*0.4  / 1000;

        winnerReward = ((await treasureContract.BID_SUM_LIST(_playerCount[0]+1))[0]+poolFund) * 0.9*0.4/ 1000;
        // minnerReward = (await treasureContract._times(_playerCount[0]  ))[9][0] / 1000;
        // }
        // console.log('playcount',_playerCount[0],'**');

        // console.log('bid',_bid[0],'**');
        // console.log('_times',_times,'**');

        $('#bidNumber').text(fixed(_bid / 1000) + ' CFX');
        $('#probability').text(fixed(1 / (54 - _playerCount[0]) * 100) + '%');
        $('#minnerReward').text(fixed(minnerReward) + ' CFX');
        $('#winnerReward').text(fixed(winnerReward) + ' CFX');

        // currentBalanceAmount = (parseInt(currentBalanceAmount) / Math.pow(10, 18));
        // $('#currentBalanceAmount').text(currentBalanceAmount);


        // //间隔时间
        // var intervalTime = await treasureContract.getCurrentTime();
        // $('#intervalTime').attr('data-time', intervalTime);


        // //总流水
        // var totalAmount = await treasureContract.getTotalAmount();
        // totalAmount = (parseInt(totalAmount) / Math.pow(10, 18));
        // $('#totalAmount').text(totalAmount);


        // //总开奖次数
        // var roundsNum = await treasureContract.getRounds();
        // $('#roundsNum').text(roundsNum);

        // //最近参与人
        // var currentAddress = await treasureContract.getCurrentAddress();
        // $('#currentAddress').text(getFomatAddressTxt(currentAddress));

        // //最近参与时间
        // var currentTime = await treasureContract.getCurrentTime();
        // $('#currentTime').text(formatDate(currentTime * 1000));

        // //最后得奖人
        // var lastwinner = await treasureContract.getLastwinner();
        // $('#lastwinner').text(getFomatAddressTxt(lastwinner));

        // //最后得奖时间
        // var lastTime = await treasureContract.getLastTime();
        // $('#lastTime').text(formatDate(lastTime * 1000));

        // //最后得奖金额
        // var lastAmount = await treasureContract.getLastAmount();
        // lastAmount = (parseInt(lastAmount) / Math.pow(10, 18));
        // $('#lastAmount').text(lastAmount);

        // //最后赞助人分红金额
        // var lastSponsorAmount = await treasureContract.getLastSponsorAmount();
        // lastSponsorAmount = (parseInt(lastSponsorAmount) / Math.pow(10, 18));
        // $('#lastSponsorAmount').text(lastSponsorAmount);

        // //参与总额
        // var accountAmount = await treasureContract.getAccountAmount(conflux.selectedAddress);
        // accountAmount = (parseInt(accountAmount) / Math.pow(10, 18));
        // $('#accountAmount').text(accountAmount);

        // //分红
        // var bonus = await treasureContract.getBonus(conflux.selectedAddress);
        // bonus = (parseInt(bonus) / Math.pow(10, 18));
        // $('#bonus').text(bonus);

        // //赞助人数据
        // var sponsorAddress = await treasureContract.getSponsorAddress();

        // $('#sponsorAddressCount').text(sponsorAddress.length);

        // //查询并显示当前参与的金额数量
        // var ticketAmountValue = await treasureContract.getTicketAmount();
        // ticketAmountValue = (parseInt(ticketAmountValue) / Math.pow(10, 18));
        // $('#depositBtn').text('参与 ' + ticketAmountValue + 'FC');

        // var sponsorTicketAmountValue = await treasureContract.SPONSOR_TICKET_AMOUNT();
        // sponsorTicketAmountValue = (parseInt(sponsorTicketAmountValue) / Math.pow(10, 18));
        // $('#sponsorBtn').text('赞助 ' + sponsorTicketAmountValue + 'FC');

        // var TIME_STEP = await treasureContract.TIME_STEP();
        // $('#intervalTime').attr('time-step', TIME_STEP);




    } else
        return;

}
//获取地址格式化数据
function getFomatAddressTxt(_address) {

    return _address.substring(0, 9) + "..." + (_address.substring(34, 42));
}

//获取请求的数据
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return ('');
}

//时间戳转换方法    date:时间戳数字
function formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD + " " + hh + mm + ss;
}
//发送fc
async function sendTx() {

    var _playerCount = await treasureContract._playerCount();
    var _bid = await treasureContract.BID_LIST(_playerCount[0]);

    var ticketAmountValue = _bid[0] / 1000 * Math.pow(10, 18);

    // var referrer = $("#referrer").attr('data');
    var referrer = '0x0000000000000000000000000000000000000000'


    try {
        referrer = referrer.length > 0 ? referrer : '0x0000000000000000000000000000000000000000';
        const receipt = await treasureContract.play(referrer).sendTransaction({
            value: ticketAmountValue,
            from: conflux.selectedAddress,
            gas: 15000000,
            storageLimit: 3000,
            gasPrice: 20000000

        }).confirmed();
    } catch (err) {

        alert(err.message);

    }



}



//发送fc
async function sendSponsorTX(callback) {

    var sponsorTicketAmountValue = await treasureContract.SPONSOR_TICKET_AMOUNT();

    var fcContract = confluxJS.Contract({
        abi: FC_ABI,
        address: FC_ADDRESS,
    });


    try {

        const receipt = await fcContract.transfer(CONTRACT_ADDRESS, sponsorTicketAmountValue).sendTransaction({
            from: conflux.selectedAddress,
            gas: 600000,
            gasPrice: 20000000
            //storageLimit: estimate.storageCollateralized
        }).confirmed();

    } catch (err) {

        alert(err.toString());

    }


}


