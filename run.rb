while true
  `mv /root/nester/NEST_DATA*.zip /root/nester/nester`
  `python3 nest_extractor.py`
  sleep(60*60*24)
end