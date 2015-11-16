About Where@
===============

## Motivation
Where@ is a mobile app to help protesters communicate with each other in realtime during marches. It was born out of years of using (and becoming frustrated with) [Celly](https://cel.ly/) as a member of Occupy Wall Street's Direct Action Working Group, and a participant in recent #BlackLivesMatter marches in NYC.

Unlike Celly, Where@ is free and open source software, guaranteed to be tailored to the needs of activists, because it is made by activists. TLC will keep no data, sell no data, and back up privacy and security pledges with code you can inspect (and help write!)

## Roadmap

__In its mature form, Where@ will:__

* combine location-sharing notifications and a reactive map to allow protesters to maintain situational awareness of a march with multiple contingents spread throughout a city
* provide encrypted channels of communications and delete all records within 24 hours to protect communications from state surveillance
* use a peer-to-peer transmission strategy to diffuse messages through users' social networks without passing through a central server (and the costs and security risks that entails)
* offer APIs to other widely-used social media platforms like Facebook and Twitter for (insecure) large-scale message broadcasting

## Components

The app has the following components:

* [Server (Scala)](https://github.com/whereat/whereat-server)
* [Android client (Java)](https://github.com/whereat/whereat-android)
* (Mobile) web client  (this repo)
* IOS client (not started, will use React Native)
* [Simulation scripts (JS)](https://github.com/whereat/whereat-simulate)
