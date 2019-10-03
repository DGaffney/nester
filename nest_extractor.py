# sudo apt-get update
# sudo apt-get install -y unzip xvfb libxi6 libgconf-2-4
# sudo curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
# sudo echo "deb [arch=amd64]  http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
# sudo apt-get -y update
# sudo apt-get -y install google-chrome-stable
# wget https://chromedriver.storage.googleapis.com/77.0.3865.40/chromedriver_linux64.zip
# unzip chromedriver_linux64.zip
# sudo mv chromedriver /usr/bin/chromedriver
# sudo chown root:root /usr/bin/chromedriver
# sudo chmod +x /usr/bin/chromedriver
# sudo apt-get install -y python3-pip
# pip3 install selenium
# wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
# echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
# sudo apt-get update
# sudo apt-get install -y mongodb-org

import time
import random
import os
import json
import pymongo
import datetime
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument("--window-size=1920x1080")
driver = webdriver.Chrome(chrome_options=chrome_options)
credentials = {"username": "itsme@devingaffney.com", "password": "Bototo13."}
client = pymongo.MongoClient("localhost", 27017)
db = client.nest
def login(driver, credentials):
    driver.get("https://home.nest.com/login/?next=https://home.nest.com/")
    time.sleep(random.uniform(1,3))
    driver.find_element_by_class_name("_nest-sign-in_1f0amb").click()
    for char in credentials["username"]:
        actions = ActionChains(driver)
        actions = actions.send_keys(char)
        actions.perform()
        time.sleep(random.uniform(0.01,0.1))
    time.sleep(random.uniform(1,3))
    actions = ActionChains(driver)
    actions = actions.send_keys(Keys.TAB)
    actions.perform()
    time.sleep(random.uniform(1,3))
    for char in credentials["password"]:
        actions = ActionChains(driver)
        actions = actions.send_keys(char)
        actions.perform()
        time.sleep(random.uniform(0.01,0.1))
    driver.find_element_by_class_name("spin-button").click()
    driver.save_screenshot("blah.png")

def request_data(driver):
    driver.get("https://myaccount.nest.com/mynestdata/request")
    for toggle in driver.find_elements_by_class_name("_native-control_13mho6"):
        time.sleep(random.uniform(0.1,0.3))
        toggle.click()
    time.sleep(random.uniform(8,10))
    button = [b for b in driver.find_elements_by_tag_name("button") if b.text == "Create Archive"][0]
    button.click()

def download_latest_dump(driver):
    exhausted = False
    try_count = 0
    while not exhausted:
        try:
            driver.get("https://myaccount.nest.com/mynestdata")
            try_count += 1
            time.sleep(random.uniform(8,10))
            button = [b for b in driver.find_elements_by_tag_name("button") if b.text == "DOWNLOAD"][1]
            button.click()
            exhausted = True
        except:
            print("Button Not Found!")
            if try_count > 3:
                exhausted = True

def extract_latest_events():
    os.popen("rm -r NEST_DATA")
    most_recent_file = sorted([e for e in os.popen("ls").read().split("\n") if "NEST_DATA" in e])[-1]
    os.popen("unzip "+most_recent_file)
    relevant_file = os.popen("find . | grep cuepoints.json").read().strip()
    data = json.loads(open(relevant_file).read())
    events = [e for e in data if e["importance_triggers"] and e["detectors"] == "[100003]"]
    for event in events:
        found_cases = list(db.events.find({"event_id": event['id']}))
        if not found_cases:
            db.events.insert({
                "event_id": event["id"],
                "importance": event["importance"],
                "peak_sound_intensity": event["peak_sound_intensity"],
                "duration": event["duration"],
                "time": datetime.datetime.fromtimestamp(int(event["_timestamp"]))
            })

def run():
    login(driver, credentials)
    download_latest_dump(driver)
    request_data(driver)
    extract_latest_events()

run()
