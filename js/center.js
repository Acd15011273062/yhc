
//tab(左)点击切换content(右)内容
$(".nav_list li").click(function(){
	
	$(this).addClass("selected").siblings().removeClass();
	$(".content_right li").hide().eq($('.nav_list li').index(this)).show();

})
//显示隐藏修改密码
$(".modifyPwd").click(function(){
	$(".form").show();
	$(this).animate({opacity:0/100},500);
})
$(".reset").click(function(){
	$(".form").hide();
	$(".modifyPwd").animate({opacity:100/100},500);
})
$(function() {
	//获取url参数
    var getParam = function(name){
        var search = document.location.search;
        var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if(null != matcher){
            try{
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            }catch(e){
                try{
                        items = decodeURIComponent(matcher[1]);
                }catch(e){
                        items = matcher[1];
                }
            }
        }
        return items;
    };
    //页面显示修改密码
    var cp = getParam('cp');
    if(cp==1){
    	$("#cp").addClass("selected").siblings().removeClass('selected');
		$(".content_right li").hide().eq($('.nav_list li').index(this)).show();
		$(".nav_list li").eq(0).removeClass("selected");
		$(".nav_list li").eq(1).addClass("selected");
		$(".form").show();
    }
	//获取倒数第2个/字符所在位置及其后的所有字符串
	var arr = location.pathname.split("/"),
		type = arr[1];
		
	//获取authcookie
	var authcookie = getcookie("_yhcp00001");
	
	//UTC时间转换
	function timetrans(date) {
		var date = new Date(date * 1000); //如果date为10位不需要乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
		var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
		return Y + M + D + h + m + s;
	}
	
	//获取host
    var host = window.location.host;
	//获取用户信息
	$.ajax({
		url: "http://"+host+"/api/user/base?type="+type+"&authcookie="+authcookie,
		type: "get",
		dataType:"json",
		success: function(res) {
			if(res['code'] == "A00000"){
				var data = res.data;
				//console.log(data);
				$(".nav_name").html(data.name);
				$(".user").html(data.username);
				$(".phonenum").html(data.phone);
				$(".lasttime").html(timetrans(data.last_seen));
			}
			
		}
	})
	
	//获取公司信息
	$.ajax({
		url: "http://"+host+"/u/api/typename",
		type: "get",
		dataType:"json",
		data: { type: type },
		success: function(res) {
			//console.log(res)
			if(res['code'] == 'A00000') {
				$('.header').find('h1').html(res.data.name);
			}
		}
	})
	//console.log(type)
	$('.goNext').on('click', function() {
		//点击产品链接到这个地址 
		location.href = "http://"+host+"/" + type + "/";
		return false;
	})

	//获取coolie的方法
	function getcookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}
	//退出登录的 authcookie
	var authcookie = getcookie("_yhcp00001");

	//退出登录
	$('.header').on('click', '.header_quit', function() {
		var data = JSON.stringify({
			type: type,
			agenttype: "1",
			authcookie: authcookie
		})
		//console.log(data);
		$.ajax({
			type: 'post',
			url: 'http://'+host+'/u/logout',
			contentType: 'json',
			dataType: 'json',
			data: data,
			success: function(res) {
				//退出成功之后调到登录页面 
				if(res.code != "A00000"){
					window.location.href = "http://"+host+"/u/login?type=" + type + "&agenttype=1";
				}
			}
		})
	})
	//RSA加密
	function getEntryptPwd(pwd, key) {
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(key);
		return encrypt.encrypt(pwd);
	}
	//获取cookie
	var authcookie = getcookie("_yhcp00001");
	//console.log(authcookie)
	//修改密码
	$(".prese").on("click",function(){
		var key = $('meta[name=key]').attr('content');
		var oldpwd = getEntryptPwd($("[name=oldpwd").val(), key);
		var newpwd = getEntryptPwd($("[name=newpwd]").val(), key);
		var newpwd1 = $("[name=newpwd]").val();
		var confirmpwd = $("[name=confirmpwd]").val();
		//判断密码是否一致
		if(newpwd1!=confirmpwd){
			$(".notpwd").show();
			return false;
		}else{
			$(".notpwd").hide();
			var data=JSON.stringify({
				agenttype:"1",
				type:type,
				oldpwd:oldpwd,
				newpwd:newpwd,
				authcookie:authcookie
			})
			console.log(data)
			$.ajax({
				type:"POST",
				url:"http://"+host+"/u/changepwd",
				dataType:"json",
				contentType: "application/json;charset=utf-8",
				data:data,
				success:function(res){
					console.log(res)
					if(res.code == "A00000"){
						alert("修改成功");					
						$(".form").hide();
					}else{
						alert(res.msg);
					}
				}
			})
		}
		
	})
	

})