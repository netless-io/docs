---
id: dosage
title: Dosage
---

## I. Purpose

Clarify clear measurement rules to control costs

## Second, how to measure the whiteboard

For each active (heartbeat) long connection, a dot will be scored every minute, and the sum of the cumulative dot data will be the total usage time of the customer.

- Question 1: Do you start billing when you create a room? Answer: No, there is no charge if there is no customer access in the created room
- Question 2: How to exit the room. Answer: Call the disconnect () method under the room object
- Question 3: What will happen to the whiteboard if `disconnect ()` is not called. Answer: If the client has actually disconnected, it will follow a 30-second timeout logic and then stop billing.
- Question 4: Will students always be charged if they do not quit, and if so, what to do. Answer: There will be billing, because the bottom layer only determines whether there is an active long connection. You can use [ban-api](docs/server/api/server-whiteboard-base#disable-and-restore-whiteboard) to force everyone to quit

## Third, how to choose the most suitable usage

1. Large class (50 or more people) turn on read-only mode
2. Leave disconnect and call disconnect ()
3. Force everyone to quit after the course is over, use [ban-api](docs/server/api/server-whiteboard-base#disable-and-restore-whiteboard)
