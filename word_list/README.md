This uses One-hot encoding method

```bash
0: TurnOn
1: TurnOff
2: SetBrightness
3: IncreaseBrightness
4:DecreaseBrightness
5: SetColortemp
6: IncreaseColortemp
7: DecreaseColortemp
```


```bash
"낮춰": "00001001"
```

I means _"낮춰"_ can be used both DecreaseBrightness and DecreaseColortemperature.


After read a sentence, we use highest possibility one (one-hot)
