while true
  if Time.now.hour > 21 and Time.now.hour < 23
    `python3 nest_extractor.py`
    `pkill -f chrome`
    sleep(60*5)
  else
    sleep(60*10)
  end
end