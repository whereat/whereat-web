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

* [Server (Scala)](https://github.com/the-learning-collective/whereat-server)
* [Android client (Java)](https://github.com/the-learning-collective/whereat-android)
* (Mobile) web client  (this repo)
* IOS client (not started, will use React Native)
* [Simulation scripts (JS)](https://github.com/the-learning-collective/whereat-simulate)

## Another clue:

* I run the simulation once with 150 users and 2 dynos.
* After running to completion, I use postman to hit the `locations/delete` endpoint
* I expect to receive a notice: `Database erased. 150 record(s) deleted.`
* Instead, I get:

```shell
Database erased. 71 record(s) deleted.
```

* Then, hitting the erase endpoint 3 more times, I get the following output:

```
Database erased. 0 record(s) deleted.
Database erased. 0 record(s) deleted.
Database erased. 79 record(s) deleted.
```

71 and 79 sum to 150.

Intruiged, I ran a similar experiment with 4 dynos and 15 overall records. It took several hits to `locations` erase to delete the database -- in 4 increments (3, 4, 2, and 6).

Which leads to this hypothesis:

* Each dyno is running a separare instance of the app, each with its own DB (since the DB is in-memory, this would make sense). The first of the first three requests above are hitting the first dyno, while the fourth is hitting the second dyno. Since each dyno is keeping a separate instance of the data store, that any given post to the API -- assuming it is running more than one dyno (which it *has* to to handle loads greater than ~50 concurrent users) will have non-deterministic results.

If true, this hypothesis would also explain why when running a simulation with 2x3 users but *4 dynos* (which -- with one dyno -- looks normal [more or less like this](https://vimeo.com/134266026)) the app gets all fubar and only shows pins moving every 3-5 ticks [like this](https://vimeo.com/134527276), instead of every tick, as programmed. On its face, this erratic behavior is hard to explain. However, if each API request is hitting a non-deterministic selection of 4 app isntances, each of which is returning a non-deterministic subset of the overall data store, then it makes perfect sense.

So... at least I'm close to this making sense. But I'm _MILES_ from knowing how to solve it. Anyone with experience running apps that use multiple dynos on heroku (or otherwise tackles scaling issues through parralelism) have any pointers? This is sort of an app-cratering bug if I can't fix it.

Does it point to any "deeper issues in computing" (perhaps regarding scaling, distributed computing, and/or concurrency more broadly) that it might be productive for the whole group to talk about?
