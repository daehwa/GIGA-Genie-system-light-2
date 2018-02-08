//callback 방식으로, 즉시 음성 인식을 할 경우
var aaa = function(){
	var options={};
  gigagenie.voice.getVoiceText(options,function(result_cd,result_msg,extra){
    if(result_cd===200){
				//command는 반드시 "[디바이스이름] [번호] [액션]"으로 이루어져야한다.
				// ex) "[조명] [1번] [켜줘] "
				var command = extra.voicetext;
				var arr = command.split(" ");
				var device = arr[0];
				var num = arr[1].split("번")[0];
				var action = arr[2];
				alert(action);
				switch(action){
					case "꺼줘":
					case "켜줘":
						handlePowerControl(device,num,action);
						break;
					case "따뜻하게":
					case "차갑게":
						handleColortempControl(device,num,action);
						break;
					case "밝게":
					case "어둡게":
						handleBrightnessControl(device,num,action);
						break;
					default:
						alert("다시해보세요");
				}
    } else {
      alert("다시해보세요");
    }
  });
};
$("#tts-btn").click(function(){
	aaa();
});

function handlePowerControl(device,num,action){
	switch(action){
		case "켜줘":
			alert("on");
			turnOnOff("light"+num,"off");
			break;
		case "꺼줘":
			alert("off");
			turnOnOff("light"+num,"on");
			break;
	}
};

function handleColortempControl(device,num,action){
  switch(action){
    case "따뜻하게":
      alert("warm");
			Colortemp("#ct3000",3000);
      break;
    case "차갑게":
      alert("cool");
      Colortemp("#ct6000",6000);
      break;
  }
};

function handleBrightnessControl(device,num,action){
	var e = {};
  switch(action){
    case "밝게":
      alert("bright");
			e = {
						currentTarget: {
							value: 100
						}
					};
      Brightness(e,"light"+num);
      break;
    case "어둡게":
      alert("dark");
      e = {
            currentTarget: {
              value: 10
            }
          };
      Brightness(e,"light"+num);
      break;
  }
};
