# nester

To install dependencies needed on an ≈Ubuntu 18.04 machine, run the following:

```
sudo apt-get update
sudo apt-get install -y unzip xvfb libxi6 libgconf-2-4
sudo curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
sudo echo "deb [arch=amd64]  http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
sudo apt-get -y update
sudo apt-get -y install google-chrome-stable
wget https://chromedriver.storage.googleapis.com/77.0.3865.40/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
sudo mv chromedriver /usr/bin/chromedriver
sudo chown root:root /usr/bin/chromedriver
sudo chmod +x /usr/bin/chromedriver
sudo apt-get install -y python3-pip
pip3 install selenium
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

There's a site in the site folder used to support [my site](http://barking.devingaffney.com) - if you want to run that, you'll have to do some `npm install`'ing. Otherwise, the meat of the "exctraction" code required to pluck your own data from Nest's system is in `nest_extractor.py`. Note that you *cannot use this with Google sign-in* nor can you use it with *two factor auth* because again, Nest is a garbage company that is no longer allowing *any type of easy* access to your own data. Anyways.