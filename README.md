# project-swimm-server

A project I did as a freelancer which consists of an endpoint that returns the
temperatures of several pools in London.

Pools usually report their temperature in their Twitter account, so this project
uses Twit and the Twitter API to retrieve the tweets, and then processes them,
extracting the reported temperature. Only tweets from the current day (London
Time) are considered. It is built to be resilient and adapt to any change in the
tweet format.

To reduce the number of requests, temperatures are cached, expiring after a minute.

Additionally, it also returns the weather temperature, using an OpenWeather API.

It has a single endpoint, /api/v1/temperatures. A live version can be seen
[here](https://busy-ruby-jay-hem.cyclic.app/api/v1/temperatures).
