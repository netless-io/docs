---
id: android-view
title: 视角同步
---

本文中的 API，都可以在 `Room` 类中查看。本文示例代码中的 `room` 即为 `whiteRoom` 的实例。

White SDK 提供的白板是向四方无限延伸的。同时也允许用户通过鼠标滚轮、手势等方式移动白板。因此，即便是同一块白板的同一页，不同用户的屏幕上可能看到的内容是不一样的。为了满足，所有用户观看同一内容的需求，本文引入了「`主播模式`」这个概念。

## 主播视角

sdk 支持将房间内的某一个人设为主播（其他用户会自动变成 `观众模式`），该用户屏幕上看到的内容即是其他所有观众看到的内容。
当主播进行视角的放缩、移动时，其他人的屏幕也会自动进行放缩、移动等操作，来保证，可以观看到主播端所有的可见内容。

* 观众端显示的内容，多于主播端的情况

主播模式中，主播所看到的内容，会全部同步到观众端。但是由于观众端屏幕比例可能与主播端不一致。为了完全显示主播端的内容，会进行缩放调整，类似于电影播放时，为了保持原始画面比例并保留原始内容，在某些显示器上，会进行比例缩放，会出现黑边。

## 视角模式 —— 主播，观众，自由（默认）

```Java
public class BroadcastState {
    // 当前视角模式，有如下：
    // 1."freedom" 自由视角，视角不会跟随任何人
    // 2."follower" 跟随视角，将跟随房间内的主播
    // 2."broadcaster" 主播视角，房间内其他人的视角会跟随我
    private ViewMode mode;

    // 房间主播 ID。
    // 如果当前房间没有主播，则为 undefined
    private Long broadcasterId;

    // 主播信息，可以自定义，具体参见下面的数据结构
    private MemberInformation broadcasterInformation;
    ... setter/getter
}

public class MemberInformation {
    // ID
    private Long id;
    // 昵称
    private String nickName;
    // 头像 URL
    private String avatar;
    ... setter/getter
}
```

### 设置视角模式

* 例子：设置当前用户为主播视角

```
// 主播模式
// 房间内其他人的视角模式会被自动修改成 follower，并且强制观看你的视角。
// 如果房间内存在另一个主播，该主播的视角模式也会被强制改成 follower。
// 就好像你抢了他/她的主播位置一样。
room.setViewMode(ViewMode.broadcaster);

// 自由模式
// 你可以自由放缩、移动视角。
// 即便房间里有主播，主播也无法影响你的视角。
room.setViewMode(ViewMode.freedom);

// 追随模式
// 你将追随主播的视角。主播在看哪里，你就会跟着看哪里。
// 在这种模式中如果你放缩、移动视角，将自动切回 freedom模式。
room.setViewMode(ViewMode.follower);
```

### 获取当前视角状态

```Java
room.getBroadcastState(new Promise<BroadcastState>() {
    @Override
    public void then(BroadcastState broadcastState) {
        showToast(broadcastState.getMode());
    }
    @Override
    public void catchEx(Exception t) {}
});
```

其获取的内容结构，如下图所示
```Java
public class BroadcastState {
    private ViewMode mode;
    private Long broadcasterId;
    private MemberInformation broadcasterInformation;
    
    ... getter/setter
}
```


## 相关文档

[主播一对多业务实现](/docs/advance/advance-broadcast?platform=Android)