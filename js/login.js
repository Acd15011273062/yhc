//账号验证
function checkphone() {
	var uname = document.getElementById("uname").value;
	var showPhone = document.getElementById("showPhone");
	if(!(/^1[34578]\d{9}$/.test(uname))) {
		showPhone.style.display = 'block';
	} else {
		showPhone.style.display = 'none';
	}
};
$(function(){
	//localstorgr取值
	var strName = localStorage.getItem('keyName');
    var strPass = localStorage.getItem('keyPass');
    if(strName){
        $('#uname').val(strName);
    }if(strPass){
        $('#pwd').val(strPass);
    }
	
//账号点击清除
	//账号一输入就有一个 deletion图标
	$('#uname').on('input',function(){
		$('.closeUname').show();
	})
	//失去焦点 
	$('#uname').on('blur',function(){
		if($(this).val() == ""){
			$('.closeUname').hide();
		}
	})
	$('.closeUname').on('click',function(){
		$('#uname').val('');
	})

//密码显示与隐藏
	//点击眼睛 换背景
	$('#eyes').on('click',function() {
		//this 在这里获取的是 dom对象 需要转换成jquery对象
		var $this = $(this);
		var $pwd = $($("#pwd")); //输入密码
		//右侧眼睛的逻辑
		if($this.hasClass("not")) {
			//right ---> input的type值应该是password
			$this.removeClass('not')
				.addClass("right");
			$pwd.attr("type", "text");
		} else {
			$this.removeClass('right')
				.addClass("not");
			$pwd.attr("type", "password");
		}

	});
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
    //获取host
    var host = window.location.host;
    
var type = getParam('type')
//企业名称取值
$.ajax({
	url:'http://'+host+'/u/api/typename',
	type:'get',
	async:'true',
	dataType:'json',
	contentType:'json',
	data:{type:type},
	success:function(res){
		if (res.code=="A00000") {
			$(".enterpriseName").text(res.data.name);
		}
	}
})

//	RSA加密
function getEntryptPwd(pwd, key) {
	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(key);
	return encrypt.encrypt(pwd);
}

//获取地址栏的 nextpage 参数
if(getParam('redirect_url') != null) {
	var next_url = getParam('redirect_url');
} else {
	//没有nextpage的话 回主页 
	var next_url = 'http://'+host+'/'+type;
}

//记住密码提示
$("#remember").on('click',function(){
	var $isChecked = $("#remember").is(":checked");
	if($isChecked == true){
		$(".autoPrompt").show();
	}else{
		$(".autoPrompt").hide();
	}
	
})
//提交表单
$("#sbmBtn").on("click", function() {
	//local
	var strName = $('#uname').val();
    var strPass = $('#pwd').val();
    localStorage.setItem('keyName',strName);
    if($('#remember').is(':checked')){
        localStorage.setItem('keyPass',strPass);
    }else{
        localStorage.removeItem('keyPass');
    }
	//提交
	var key = $('meta[name=key]').attr('content');
	var pwd = getEntryptPwd($('#pwd').val(), key);
	var type = getParam('type')
	var agenttype = getParam('agenttype')
	//console.log(type)
	var is_remember = '';
	if($('#checkCli').prop('checked')) {
     	is_remember = 1
 	}else{
 		is_remember = 0
 	}
 	var data = JSON.stringify({
 			agenttype: agenttype,
			type:type,
			phone:$('#uname').val(),
			pwd:pwd,
			is_remember:is_remember
 	})
	$.ajax({
		url:'http://'+host+'/u/login',
		type:'POST',
		async:'true',
		contentType:'json',
		dataType:'json',
		data:data,
		success:function(res){
			if (res.code=="A00000") {
				location.href=next_url;
			}else{
				$('.prompt').show();
			}
		}
	})
})

})