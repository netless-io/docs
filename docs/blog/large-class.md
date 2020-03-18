---
id: large-class
title: Large class
---

## 1. Design differences between read-only mode and interactive mode

### 1.1 Interactive Mode Design Architecture

![isWritable_true](/img/isWritable_true.png)

- Advantages:
  - Accelerate the direct connection between the network and the core computer room through the netless link, with low latency and good interaction performance.
  - Each client has a peer-to-peer function, can send and receive all messages, and use all APIs.
- Problem description:
  - The number of directly connected rooms in the core room is limited. After reaching the upper limit, there will be a single point of performance.
  - Netless link acceleration network costs are high.

### 1.2 Read-only design architecture

![isWritable_false](/img/isWritable_false.png)

- Advantages:
  - The number of subscriptions is only related to the size of the getway cluster. Removing single points can host very large classes.
  - Use the public cloud's long connection to accelerate the link and lower the cost of fees.
- Problem description:
  - The delay will increase accordingly.
  - The subscription client does not have the function of writing to the server, and the core SDK methods cannot be called basically, only subscription to watch.

## 2. How to choose which mode to enable

- Interactive mode is recommended for small groups of 1 & 50 people.
- Large classes with more than 50 students & open classes with unlimited number of people are recommended to use read-only mode.
- The read-only mode does not theoretically limit the maximum number of people. The course size is really large. You can contact us to communicate first.

## 3. How to achieve this in code

- [web specific code implementation](/docs/javascript/features/js-readonly)
- [iOS specific code implementation](/docs/ios/guides/ios-readonly/)
- [Android code implementation](/docs/android/guides/android-readonly/)
