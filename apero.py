#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from datetime import datetime, timezone
import pytz
import random
import json


def get_time():
    now = datetime.now(timezone.utc).astimezone()
    # tzname = now.tzname()
    # tzoffset = now.tzinfo.utcoffset(now)
    return now.hour, now.minute


def get_apero_timezone():
    apero_list = []

    for tz in pytz.common_timezones:
        timezone = pytz.timezone(tz)
        now = datetime.now(timezone)
        if now.hour == 18:
            apero_list.append(tz)

    return apero_list


def choose_apero_timezone(apero_list):
    return random.choice(apero_list)


def get_info_apero_timezone(apero_timezone, apero_file="./apero.json"):
    # sourcery skip: raise-specific-error
    tz = pytz.timezone("/".join(apero_timezone))
    apero_now = datetime.now(tz)

    with open(apero_file, "r") as f:
        apero_info = json.load(f)

    try:
        for zone in apero_timezone:
            apero_info = apero_info[zone]
        return apero_now.hour, apero_now.minute, apero_info

    except:
        raise Exception("Timezone {0} not in file {1}".format(
            "/".join(apero_timezone), apero_file))


def main():
    hour, minute = get_time()
    print("Il est actuellement {0}:{1} chez toi.".format(hour, minute))

    if hour == 18:
        print("Comme tu es chanceux, c'est déjà l'heure de l'apéro. Yec'hed mad !")
    elif hour < 18:
        print("Quel dommage il est encore un peu tôt, rassure toi car c'est déjà l'heure de l'apéro quelque part dans le monde !")
    else:
        print("L'heure de l'apéro est déjà passée, il existe encore des endroits dans ce monde où c'est à peine l'heure de l'apéro !")

    apero_list = get_apero_timezone()
    apero_timezone = choose_apero_timezone(apero_list)
    apero_zones = apero_timezone.split("/")
    apero_hour, apero_minute, apero_info = get_info_apero_timezone(apero_zones)
    print("C'est l'heure de l'apéro à {0} ({1}), il est déjà {2}:{3} et voici quelques infos sur ce lieu : {4}".format(
        apero_zones[-1], "/".join(apero_zones[:-1]), apero_hour, apero_minute, apero_info))
    print("Buvons à leur santé, yec'hed mad !")

    return


if __name__ == "__main__":
    sys.exit(main())
