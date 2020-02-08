---
id: prefetch
title: 预热器（三端）
---

Android 2.5.3，iOS 2.5.8 新增 API，web 2.5.8 后，会自动进行预热。

## Web

预热器在调用初始化时，自动启动。joinRoom 会等待预热器请求完毕后，才执行加入房间操作。

## iOS

新增`WhiteOriginPrefetcher fetchConfigAndPrefetchDomains`API，执行预热器。
`WhiteOriginPrefetcher`提供单例，调用`fetchConfigAndPrefetchDomains`方法后，可以通过其`prefetchDelgate`属性，来接受三种回调:

```Objective-C
@protocol WhiteOriginPrefetcherDelegate <NSObject>

/** 当触发`originPrefetcherFetchOriginConfigsFail:`回调时，说明从服务器获取服务器配置信息失败，预热器停止不再执行操作。此时与服务器连通性不佳，即使加入房间，也可能会比较慢，或者失败 */
- (void)originPrefetcherFetchOriginConfigsFail:(NSError *)error;

/** 当触发`originPrefetcherFetchOriginConfigsSuccess:`回调时，说明预热器成功从服务器获取配置信息，将继续下一步：对获取到的地址，进行连接性测试。（每个域名的请求超时时间为 30s） */
- (void)originPrefetcherFetchOriginConfigsSuccess:(NSDictionary *)dict;

/**
 当触发`originPrefetcherFinishPrefetch:`回调时，说明预热器加载完成。回调的`result`（`sdkStrategyConfig`属性）即为每个服务器需要最后的连接情况，在初始化sdk时，将该配置信息传递给`WhiteSdkConfiguration`的`sdkStrategyConfig`属性，即可将 native 预热结果，传递给 sdk。 */
- (void)originPrefetcherFinishPrefetch:(NSDictionary *)result;
@end
```

>建议提前进行预热操作，确保在创建 SDK 时，预热行为已经完成。

## Android

2.5.3 版本

预热器：`com.herewhite.sdk.Utils.PreFetcher` 类。

创建实例后，设置实现 `Prefetcher.ResultCallback` 接口的类，在

```Java
    public interface ResultCallback {

//从服务器获取服务器配置信息失败，预热器停止后续操作。
void fetchOriginConfigFail(Exception exception);
//说明预热器成功从服务器获取配置信息，将继续下一步：对获取到的地址，进行连接性测试。（每个域名的请求超时时间为 30s），此处JsonObject为从服务器中获取的配置列表。
void fetchOriginConfigSuccess(JsonObject jsonObject);
//说明预热器加载完成。回调的`jsonObject`（`sdkStrategyConfig`属性）即为每个服务器需要最后的连接情况，在初始化sdk时，将该配置信息传递给`WhiteSdkConfiguration`的`sdkStrategyConfig`属性，即可将 native 预热结果，传递给 sdk。
void finishPrefetch(JsonObject jsonObject);
```

在初始化 SDK 时，将`prefetcher``finishPrefetch`返回的`jsonObject`通过`WhiteSdkConfiguration``setSdkStrategyConfig`方法，传递给 sdk。
>2.5.4版本提供该 API