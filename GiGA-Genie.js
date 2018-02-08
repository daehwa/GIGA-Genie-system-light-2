//callback 방식으로, 즉시 음성 인식을 할 경우
var aaa = function(){
	var options={};
  gigagenie.voice.getVoiceText(options,function(result_cd,result_msg,extra){
    if(result_cd===200){
				//command는 반드시 "[디바이스이름] [번호] [액션]"으로 이루어져야한다.
				// ex) "[조명] [1번] [켜줘] "
				var command = extra.voicetext;
				myRequest("/command-analysis/","PUT","command",command);
				/*var arr = command.split(" ");
				var device = arr[0];
				var num = arr[1].split("번")[0];
				var action = arr[2];*/
    }
  });
};

$("#tts-btn").click(function(){
	aaa();
});
