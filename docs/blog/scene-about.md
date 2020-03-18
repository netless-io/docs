---
id: scene-about
title: How to insert ppt, switch ppt
---

## 1. What is the scene

![scene](/img/scene.png)

For the end customer, the scenario is the "whiteboard" and "whiteboard pagination" above. For developers, it is the following data structure.

``` ts
    type WhiteScene = {
        name: string; // Scene name
        componentsCount: number; // The number of elements on the white board, the new empty scene is 0
        ppt?: PptDescription; // ppt resources
    };

    type PptDescription = {
        src: string; // Dynamic json, static url
        width: number; // Document width
        height: number; // Document height
    };
```

## 2. How to insert ppt into the scene

### 2.1 Core Methods of Scene Operations

1. Equivalent to "Save As" of daily computer operation, which is to save the scene in the corresponding address

    ``` ts
        room.putScenes(`/init`, scenes); // Insert ppt content
    ```

2. It is equivalent to the “open folder” of daily computer operation, which is to access the corresponding scene at the specified address

    ``` ts
        room.setScenePath(`/init/page2`); // The corresponding content is displayed: the second page under init
    ```

### 2.2 Processing method for temporary submission document conversion service

``` ts
    import {Room, PptConverter} from "white-web-sdk";
    const pptConverter = whiteWebSdk.pptConverter(roomToken);
    res = await pptConverter.convert({
            url: pptURL, // Source file address
            kind: kind, // Transcoding type
            onProgressUpdated: progress => {
                console.log(progress) // Transcoding progress
            },
        });

    // The convert method is to enter a document address and return an array of scenes [Scene, Scene, Scene]
    room.putScenes(`/init`, res.scenes);
    room.setScenePath(`/init/page2`);
```

### 2.3 Processing method of data obtained from server

``` ts
    // [url, url] or [json, json] interact after map processing
    const scenes: []Scene = [url, url].map()

    // The convert method is to enter a document address and return an array of scenes [Scene, Scene, Scene]
    room.putScenes(`/`, scenes);
    room.setScenePath(`/init/page2`);
```

## 3. How to switch ppt

``` ts
// Previous
 room.pptPreviousStep ();
 // next step
 room.pptNextStep ();
 // switch to the specified path
 room.setScenePath (`/ init / page2`);
 // If this method is in a dynamic ppt, then this is the next animation. If in static ppt, then the next page
```
