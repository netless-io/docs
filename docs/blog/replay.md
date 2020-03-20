---
id: replay
title: Whiteboard playback principle
---

## 1. How was the whiteboard recorded

When the client declares `historied` when creating a room, netless will start an instance to serialize and store all the actions that occur in the whiteboard as a binary file while the room is interacting, and strictly stamp the UTC time stamp.

Because we and the audio and video are not on the same server as the parameter recording file, we must have a common reference for the reference frame to be fully aligned. We all use UTC's absolute timestamps around the public frame of reference.

## 2. How the whiteboard plays back

The content saved on the whiteboard is not a video but a private structured data, which can be analogized as dota2 or LOL. Replay the elements and actions in the whiteboard in time series.

## 3. Why choose this option

- Recording into a video must perform the encoding process, cpu is expensive and expensive.
- HD and low traffic, relatively low recording cost.

## 4. How to use cloud recording

### 4.1 What do we need to do in class

 ![realtime](/img/real-time-en.png)

- The process of starting a class is: 1. Create a whiteboard 2. Teacher joins 3. Teacher opens the video 4. Students join 5. Start the class and record.
- The process of ending the class is: 1. Click to end the recording 2. Exit the classroom.

So recording needs to do three things

1. Record the UTC time when the server starts recording.
2. Record the UTC time on the server when recording ends.
3. Get the URL of audio and video recording

### 4.2 What do we need to do when we look back

 ![realtime](/img/replay-en.png)

Pass the above three important values ​​into the method

``` ts
    const player = await whiteWebSdk.replayRoom(
                {
                    room: uuid,
                    roomToken: roomToken,
                    mediaURL: mediaUrl, // Recording media data returned by the rtc manufacturer
                    beginTimestamp: beginTimestamp, // start UTC time of recording
                    duration: duration, // (end-start)
                }
                ）
 ```
