//callback 방식으로, 즉시 음성 인식을 할 경우
var getVoice = function(){
	var options={};
  gigagenie.voice.getVoiceText(options,function(result_cd,result_msg,extra){
    if(result_cd===200){
				var command = extra.voicetext;
				myRequest("/command-analysis/","PUT","command",command);
    }
  });
};

var sendVoice = function(speechText){
	//callback 방식
	var options={};
	options.ttstext=speechText;
	gigagenie.voice.sendTTS(options,function(result_cd,result_msg,extra){
    if(result_cd===200){
        //do next action
    } else {
        //extra.reason 에 voice 오류 전달.
    };
	});
};

$("#tts-btn").click(function(){
	getVoice();
});


