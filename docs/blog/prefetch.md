---
id: prefetch
title: Prefetch
---

Android 2.5.3 and iOS 2.5.8 add APIs. After web 2.5.8, it will automatically warm up.

## Web

The preheater starts automatically when the initialization is called. joinRoom waits for the preheater request to complete before performing the join room operation.

## iOS

Added `WhiteOriginPrefetcher fetchConfigAndPrefetchDomains` API to execute preheater.
`WhiteOriginPrefetcher` provides a singleton. After calling the` fetchConfigAndPrefetchDomains` method, you can accept three callbacks through its `prefetchDelgate` property:

```Objective-C
@protocol WhiteOriginPrefetcherDelegate <NSObject>

/** When the `originPrefetcherFetchOriginConfigsFail:` callback is triggered, it means that the server configuration information from the server failed to be obtained, and the preheater stops performing operations. At this time, the connection to the server is not good. Even if you join the room, it may be slow or fail */
- (void)originPrefetcherFetchOriginConfigsFail:(NSError *)error;

/** When the `originPrefetcherFetchOriginConfigsSuccess:` callback is triggered, it means that the preheater successfully obtained the configuration information from the server and will continue to the next step: perform a connectivity test on the obtained address. (The request timeout for each domain name is 30s) */
- (void)originPrefetcherFetchOriginConfigsSuccess:(NSDictionary *)dict;

/**
 When the `originPrefetcherFinishPrefetch:` callback is triggered, the preheater loading is completed. The `result` (`sdkStrategyConfig` property) of the callback is the last connection situation for each server. When the sdk is initialized, the configuration information is passed to the `sdkStrategyConfig` property of` WhiteSdkConfiguration`, which can warm up the result. Passed to sdk. */
- (void)originPrefetcherFinishPrefetch:(NSDictionary *)result;
@end
```

> It is recommended to perform the warm-up operation in advance to ensure that the warm-up behavior is completed when the SDK is created.

## Android

2.5.3 version

Preheater: `com.herewhite.sdk.Utils.PreFetcher` class.

After creating the instance, set up a class that implements the `Prefetcher.ResultCallback` interface.

```Java
    public interface ResultCallback {

// Failed to obtain the server configuration information from the server, the preheater stops subsequent operations.
void fetchOriginConfigFail(Exception exception);
// Indicates that the preheater successfully obtained the configuration information from the server, and will continue to the next step: perform a connectivity test on the obtained address. (The request timeout time for each domain name is 30s), here JsonObject is the configuration list obtained from the server.
void fetchOriginConfigSuccess(JsonObject jsonObject);
// Indicates that the preheater is loaded. The `jsonObject` (` sdkStrategyConfig` property) of the callback is the last connection situation for each server. When the sdk is initialized, the configuration information is passed to the `sdkStrategyConfig` property of` WhiteSdkConfiguration`, which can warm up the result natively. Passed to sdk.
void finishPrefetch(JsonObject jsonObject);
```

When initializing the SDK, pass the `jsonObject` returned by` prefetcher``finishPrefetch` to the sdk via the `WhiteSdkConfiguration` setSdkStrategyConfig` method.
> 2.5.4 version provides the API