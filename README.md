# project-swimm-server

![Express](https://img.shields.io/badge/Made_with-Express.js-000000?style=for-the-badge&logo=express&labelColor=white&logoColor=000000)
![Node](https://img.shields.io/badge/Made_with-Node.js-339933?style=for-the-badge&logo=node.js&labelColor=white)
![Twitter API](https://img.shields.io/badge/Made_with-Twitter_API-1DA1F2?style=for-the-badge&logo=twitter&labelColor=white)
![JavaScript](https://img.shields.io/badge/Made_with-JavaScript-F0DB4F?style=for-the-badge&logo=javascript&labelColor=white)

![TypeScript](https://img.shields.io/badge/Lint-typescript-3178C6?style=for-the-badge&logo=typescript&labelColor=white)
![ESLint](https://img.shields.io/badge/Lint-ESLint-4B32C3?style=for-the-badge&logo=eslint&labelColor=white&logoColor=4B32C3)
![Prettier](https://img.shields.io/badge/code_style-Prettier-F7B93E?style=for-the-badge&logo=prettier&labelColor=white)

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
