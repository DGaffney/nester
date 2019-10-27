while true
  if Time.now.hour > 21 and Time.now.hour < 23
    puts Time.now.to_s+" - running!!!"
    puts  `python3 nest_extractor.py`
    puts `pkill -f chrome`
    sleep(60*5)
  else
    puts Time.now.to_s+" - sleeping"
    sleep(60*10)
  end
end
