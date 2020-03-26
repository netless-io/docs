---
id: about-log
title: Log
---

## I. Purpose

If you want to accurately locate the customer ’s problem, you need a detailed client log report service to understand the specific situation of the problem.

## Second, what information will we collect on the client

```ts
    ip // network ip of the device, in order to obtain the network operator
    timestamp // timestamp, in order to get the time of occurrence
    akkoVersion // The underlying synchronization engine version of the whiteboard, in order to obtain the problem version
    level // log level
    message // log information
    os // operating system of the device
    platform // device system
    sdkVersion // sdk version
    userId // user id (optional), in order to locate specific customer issues
    uuid // uuid of whiteboard room
```

The log obtains the specific information of the above fields in order to completely restore the entire fault scene, and help netless and customers quickly lock down the problem.

## Third, where will the collected information be uploaded and how will it be used?

1.Netless will upload this information to the data warehouse and set strict security protection.
2. Follow-up will allow customers to query their reporting logs on the management console.

## Fourth, what should we do if we are sensitive about reporting log information

1. Turn off the client log reporting function (Note: it will make troubleshooting difficult)

    ```ts
    {
        // Whether to disable upload, default upload
        disableReportLog: false,
        // The level of uploaded logs, default info
        reportLevelMask: "info",
        // Print log level, default info
        printLevelMask: "info";
    }

    {
        disableReportLog?: boolean,
        reportLevelMask?: "debug" | "info" | "warn" | "error",
        printLevelMask?: "debug" | "info" | "warn" | "error";
    }
    ```

    [Document link](docs/javascript/parameters/js-sdk#loggeroptions-log-report-configuration)

2. In the future, we will consider launching the function of uploading to the customer's own data warehouse. (This function is not currently available, and subsequent configuration is supported.)
