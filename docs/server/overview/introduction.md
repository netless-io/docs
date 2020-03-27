---
id: server-introduction
title: Introduction
---

## Support business

The SDK client currently only has an API for content operation on the whiteboard, and no API for managing the whiteboard room.
Developers need to pass sdk token and whiteboard 

The sdk server interacts, performs room creation, obtains a series of room information, and room management operations.

## Incorporating RTC services

RTC vendors also generally have the concept of a room or a channel. A white board inside White is called a room, and the uuid attribute of room is globally unique. Users can associate the RTC room or channel with White's room one by one.