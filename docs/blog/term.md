---
id: blog-term
title: Term
---

## sdkToken

1. Description
    
   - sdkToken is the identity authentication of the registered company, and also a prerequisite for using all Netless services. If we compare our service to a mall, then sdkToken is equivalent to proof of occupancy.

2. How to get
    
   - If you haven't registered a business account yet: Go to <a target="_blank" href="https://console.herewhite.com"> Admin Console </a> to register an account.
   - If you have registered a business account:
   ![sdkTokenGet](/img/sdkTokenGet.jpg)

3. Notes on use
    
   - Since sdkToken has very large permissions, it is recommended to keep it on the server. Because once the client is decompiled or obtained by other hacking methods, the sdkToken may cause a certain cost loss to the user.


## roomToken

1.Description

   - roomToken is a voucher for entering a real-time room, which can be understood as a room key in real life.
   
2.How to get

   - Can be obtained when [Api to create whiteboard room](../server/api/whiteboard-base.md).

## uuid

1.Description

   - uuid is the unique identifier of the room, which maps to the house number that can be understood in real life.
   
2.How to get

  - Can be obtained when [Api to create whiteboard room](../server/api/whiteboard-base.md).