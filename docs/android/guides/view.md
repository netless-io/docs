---
id: android-view
title: 视角操作
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

```java
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
room.getBroadcastState();
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

## 调整视角

>2.2.0新增 API，2.3.2 增加动画选项；回放 replay 与 实时房间 room 都支持该 API

```Java
public class Displayer {
    // 调整视角中心
    public void moveCamera(CameraConfig camera);
    // 调整视觉矩形
    public void moveCameraToContainer(RectangleConfig rectange);
}
```

<span id="moveCamera">
### 调整视角中心

`moveCamera` API，可以用来调整视角，参数均为可选参数。SDK 会根据传入参数，调整视角中心与缩放比例。

```Java
// 视角中心移动参数
public class CameraConfig extends WhiteObject {

    public AnimationMode getAnimationMode() {
        return animationMode;
    }
    // 默认连续动画，可以设置为瞬间切换
    public void setAnimationMode(AnimationMode animationMode) {
        this.animationMode = animationMode;
    }

    private AnimationMode animationMode;

    public Double getCenterX() {
        return centerX;
    }
    
    //可选参数，如果不填，则不会发生变化
    public void setCenterX(Double centerX) {
        this.centerX = centerX;
    }

    public Double getCenterY() {
        return centerY;
    }

    //可选参数，如果不填，则不会发生变化
    public void setCenterY(Double centerY) {
        this.centerY = centerY;
    }

    public Double getScale() {
        return scale;
    }

    //可选参数，如果不填，则不会发生变化，替代 zoomScale
    public void setScale(Double scale) {
        this.scale = scale;
    }

    private Double centerX;
    private Double centerY;
    private Double scale;
}
```

<span id="moveCameraToContain">
### 调整视觉矩形

除了调整视角中心，SDK 还提供调整视觉矩形API。

> 视觉矩形表示你的视角必须容纳的区域。当你设置好视觉矩形后，视角会自动调整到刚好可以完整展示视觉矩形所表示的范围。

```Java
public class RectangleConfig extends WhiteObject {
    private Double originX;
    private Double originY;
    private Double width;
    private Double height;

    public RectangleConfig(Double width, Double height, AnimationMode mode) {
        this(width, height);
        this.animationMode = mode;
    }

    // 中心点为初始位置
    public RectangleConfig(Double width, Double height) {
        this.width = width;
        this.height = height;
        this.originX = - width / 2.0d;
        this.originY = - height / 2.0d;
    }

    public RectangleConfig(Double originX, Double originY, Double width, Double height) {
        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
    }

    public RectangleConfig(Double originX, Double originY, Double width, Double height, AnimationMode mode) {
        this(originX, originY, width, height);
        this.animationMode = mode;
    }

    public Double getOriginX() {
        return originX;
    }

    public void setOriginX(Double originX) {
        this.originX = originX;
    }

    public Double getOriginY() {
        return originY;
    }

    public void setOriginY(Double originY) {
        this.originY = originY;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public AnimationMode getAnimationMode() {
        return animationMode;
    }

    public void setAnimationMode(AnimationMode animationMode) {
        this.animationMode = animationMode;
    }

    private AnimationMode animationMode;
}
```

## ppt 铺满当前屏幕

>2.4.22

```Java
// displayer.java
// room player 通用

/**
* 以连续动画的形式，等比例缩放ppt，保证ppt所有内容都在容器内。
* @since 2.4.22
*/
public void scalePptToFit() {
    bridge.callHandler("displayer.scalePptToFit", new Object[]{});
}

/**
* 等比例缩放ppt，保证ppt所有内容都在容器内。
* @param mode 缩放时，动画行为
* @since 2.4.28
*/
public void scalePptToFit(AnimationMode mode) {

```

## 禁止视角变化<span class="anchro" id="disableCameraTransform">

>2.2.0 新增 API

开发者可以通过如下方法禁止用户手动调整视角（使用鼠标滚轮缩放、Touch 板手势移动，缩放、移动端双指操作移动）。

```Java
// 禁止用户主动改变视野
room.disableCameraTransform(true);
// 恢复用户视野变化权限
room.disableCameraTransform(false);
```

## 相关文档

[主播一对多业务实现](/docs/doc/broadcast)
