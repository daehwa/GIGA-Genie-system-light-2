//callback 방식으로, 즉시 음성 인식을 할 경우
var aaa = function(){
	var options={};
  gigagenie.voice.getVoiceText(options,function(result_cd,result_msg,extra){
    if(result_cd===200){
				var command = extra.voicetext;
				myRequest("/command-analysis/","PUT","command",command);
    }
  });
};

$("#tts-btn").click(function(){
	aaa();
});
