$(function(){

	var num = $(".songnumlist span");
	var datas = [
		{src:"media/1.mp3",name:"Tomorrow",author:"Avril Lavigne",duration:"03:50"},
		{src:"media/2.mp3",name:"She",author:"Groove Coverage",duration:"03:49"},
		{src:"media/3.mp3",name:"从头再来",author:"崔健",duration:"05:12"},
		{src:"media/4.mp3",name:"花房姑娘",author:"崔健",duration:"04:47"},
		{src:"media/5.mp3",name:"假行僧",author:"崔健",duration:"04:57"},
		{src:"media/6.mp3",name:"好男儿",author:"韩磊",duration:"03:45"},
		{src:"media/7.mp3",name:"山丘",author:"李宗盛",duration:"05:49"},
		{src:"media/8.mp3",name:"风雨无阻",author:"周华健",duration:"04:33"}
	];

	$(datas).each(function(i,v){
		$("<li><div class='song-name'>"+v.name+"</div><div class='artist'>"+v.author+"</div><div class='song-time'>"+v.duration+"</div><div class='op'><div class='like'></div><div class='share'></div><div class='shoucang'></div><div class='delete'></div></div></li>").appendTo(".play-list-content ul");
		num.text(datas.length);
	});
	var currentIndex;
	$(".play-list-content li").on("click",function(){
		currentIndex = $(this).index();
		audio.src = datas[currentIndex].src;
		audio.play();
	});		

	var audio = $("#audio").get(0);
	var $audio = $("#audio");
	var volume = $(".yinliang");
	var play = $(".play-button");
	var dian = $(".dian");
	var duan = $(".yinliangduan");
	var current = $(".currentVolume");
	//播放暂停
	play.on("click",function(){
		if(datas.length === 0){
			return;
		}
		if(currentIndex === undefined ){
			currentIndex = 0;
			audio.src = datas[currentIndex].src;
		}
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	});

	$audio.on("play",function(){
		play.addClass("play-pause");
		$(".play-list-content li")
		.removeClass("playing")
		.eq(currentIndex)
		.addClass("playing");			
		var v = datas[currentIndex];
		$(".music-name span").text(v.name);
		$(".singer-name span").text(v.author);
		$(".music-time span").text(v.duration);
	});
	$audio.on("ended",function(){
		if(model.hasClass('danqu')){
			audio.src = datas[currentIndex].src;
			$audio.trigger("play");
		}else if(model.hasClass('shunxu')){		
			if(currentIndex == datas.length-1){
				audio.src ="";
				$(".song-info .music-name span").text("QQ音乐");
				$(".song-info .singer-name span").text("听你想听的音乐");
				$(".song-info .music-time span").text("");
				play.removeClass("play-pause");	
				$(".play-list-content li").eq(datas.length-1).removeClass("playing");
				return;
			}else{
				next.trigger("click");
			}
		}else{
			next.trigger("click");
		}
	});
	$audio.on("pause",function(){
		play.removeClass("play-pause");
	});
	//键盘操作播放暂停
	$(document).on("keyup",function(e){
		if(e.keyCode == 80 && e.shiftKey){
			if(audio.paused){
				$audio.trigger("play");
			}else{
				$audio.trigger("pause");
			}
		}
	})


	//音量相关
	duan.on("click",function(e){
		audio.volume = e.offsetX / $(this).width();
	});
	volume.on("click",function(){
		if(!volume.attr("v")){
			volume.attr("v",audio.volume);
			audio.volume = 0;
		}else{
			audio.volume = volume.attr("v");
			volume.removeAttr("v");
		}
	})

	dian.on("click",function(e){
		e.stopPropagation();
	});
	//UI设置
	$audio.on("volumechange",function(){
		if(audio.volume === 0){
			$(".yinliang").addClass("mute");
		}else{
			$(".yinliang").removeClass("mute");
		}
		current.width(audio.volume * duan.width());
		dian.css({left:audio.volume * duan.width()-(dian.width()/2)});
	});
	//音量拖动
	dian.on("mousedown",function(e){
		e.preventDefault();
		var left = 	duan.offset().left;		
		$(document).on("mousemove",function(e){
			duan.addClass("moving");
			disX = e.pageX - left;
			var v = disX / duan.width();
			v = (v>1)?1:v;
			v = (v<0)?0:v;
			audio.volume = v;		
		})
		$(document).on("mouseup",function(){
			duan.removeClass("moving");
			$(document).off("mousemove");
		});
	});
	
	//歌曲进度条
	var jindutiao = $(".jindutiao");
	var width = jindutiao.width();
	var currentTime = $(".currentTime");
	var timeDian = $(".timeDian");
	jindutiao.on("click",function(e){
		var bili = e.offsetX/width;
		audio.currentTime = bili * audio.duration;
	});
	$audio.on("timeupdate",function(){
		var jindu = audio.currentTime/audio.duration;
		currentTime.width(jindu * width);
		timeDian.css({left:jindu * width-(timeDian.width()/2)});
	});
	timeDian.on("mousedown",function(e){
		e.preventDefault();
		$(document).on("mousemove",function(e){
			var dis = e.pageX - jindutiao.offset().left;
			audio.currentTime = (dis/jindutiao.width())*audio.duration;
		});
	});
	$(document).on("mouseup",function(){
		$(document).off("mousemove");
	});
	timeDian.on("click mousemove",function(e){
		e.stopPropagation();
	});
	//进度条的显示时间
	var timeBox = $(".timeBox");
	jindutiao.on("mouseover",function(e){
		$(this).on("mousemove",function(e){
			timeBox.css({display:'block',left:e.offsetX-timeBox.width()/2});
			var currentT = e.offsetX/jindutiao.width()*audio.duration;
			timeBox.find("span").html(formate(currentT));
		});
	});

	jindutiao.on("mouseout",function(){
		timeBox.css({display:'none'});
	});

	//上一首下一首
	var last = $(".last");
	var next = $(".next");
	last.on("click",function(){		
		if(currentIndex == undefined){
			currentIndex=datas.length;
		}
		currentIndex -= 1;
		if(currentIndex<0){
			currentIndex = datas.length-1;
		}
		if(model.hasClass('suiji')){
			currentIndex = Math.floor(Math.random()*datas.length);
		}
		audio.src = datas[currentIndex].src;
		audio.play();
	});
	next.on("click",function(){
		currentIndex += 1;
		if(model.hasClass('suiji')){
			currentIndex = Math.floor(Math.random()*datas.length);
		}
		if(!currentIndex){
			currentIndex=0;
		}
		if(currentIndex>=datas.length){
			currentIndex = 0;
		}
		audio.src = datas[currentIndex].src;
		audio.play();
	});

	//清空列表
	var moveAll = $(".play-list-title span");
	moveAll.on("click",function(){
		$(".play-list-content ul").empty();
		audio.src="";
		$(".song-info .music-name span").text("QQ音乐");
		$(".song-info .singer-name span").text("听你想听的音乐");
		$(".song-info .music-time span").text("");
		datas.splice(0,datas.length);
		num.text(datas.length);
		play.removeClass("play-pause");	
	});

	//删除
	var del = $(".op .delete");
	del.on("click",function(e){
		e.stopPropagation();
		var i = $(".op .delete").index(this);
		$(this).closest("li").remove();
		$(".song-info .music-name span").text("QQ音乐");
		$(".song-info .singer-name span").text("听你想听的音乐");
		$(".song-info .music-time span").text("");
		datas.splice(i,1);
		num.text(datas.length);
		console.log(currentIndex+','+i);
		audio.src="";
		play.removeClass("play-pause");
	});

	//循环模式
	var model = $(".xunhuan");
	var morexunhuan = $(".morexunhuan");
	var shunxu = $(".shunxubofang");
	var suiji = $(".suijibofang");
	var danqu = $(".danquxunhuan");
	var liebiao = $(".liebiaoxunhuan");
	model.on("click",function(){
		morexunhuan.css({display:'block'});
	});

	shunxu.on("click",function(){
		model.attr("class","xunhuan");
		model.addClass("shunxu");
		morexunhuan.css({display:'none'});
	});

	suiji.on("click",function(){
		model.attr("class","xunhuan");
		model.addClass("suiji");
		morexunhuan.css({display:'none'});
	});

	danqu.on("click",function(){
		model.attr("class","xunhuan");
		model.addClass("danqu");
		morexunhuan.css({display:'none'});
	});

	liebiao.on("click",function(){
		model.attr("class","xunhuan");
		model.addClass("liebiao");
		morexunhuan.css({display:'none'});
	});	


	//收起
	var playList = $(".play-list");
	var button = $(".button");
	button.on("click",function(){
		playList.toggleClass("hide");
	});


})

function formate(time){
	if(isNaN(time)){
		return '--:--';
	}
	var t = parseInt(time);
	var min = parseInt(time/60);
	min = (min<10)?'0'+min:min;
	var second = parseInt(time%60);
	second = (second<10)?'0'+second:second;
	return min +':'+second;
}
