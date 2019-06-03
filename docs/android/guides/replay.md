---
id: android-replay
title: 回放
---

**创建房间时，需要设置为可回访房间。由于回放房间会占用更多资源，需要开发者主动设置。**

**具体请在 [服务器文档](../../server/api/request.md) 中查看 创建白板 API**

## 创建回放——快速开始

```Java
Intent intent = getIntent();
final String uuid = intent.getStringExtra("uuid");
final String m3u8 = intent.getStringExtra("m3u8");

whiteBroadView = (WhiteBroadView) findViewById(R.id.playWhite);
WhiteSdk whiteSdk = new WhiteSdk(
        whiteBroadView,
        PlayActivity.this,
        new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1));
PlayerConfiguration playerConfiguration = new PlayerConfiguration();
playerConfiguration.setRoom(uuid);
playerConfiguration.setAudioUrl(m3u8);

whiteSdk.createPlayer(playerConfiguration, new AbstractPlayerEventListener() {
    @Override
    public void onPhaseChanged(PlayerPhase phase) {
        showToast(gson.toJson(phase));
    }

    @Override
    public void onLoadFirstFrame() {
        showToast("onLoadFirstFrame");
    }

    @Override
    public void onSliceChanged(String slice) {
        showToast(slice);
    }

    @Override
    public void onPlayerStateChanged(PlayerState modifyState) {
        showToast(gson.toJson(modifyState));
    }

    @Override
    public void onStoppedWithError(SDKError error) {
        showToast(error.getJsStack());
    }

    @Override
    public void onScheduleTimeChanged(long time) {
        showToast(time);
    }

    @Override
    public void onCatchErrorWhenAppendFrame(SDKError error) {
        showToast(error.getJsStack());
    }

    @Override
    public void onCatchErrorWhenRender(SDKError error) {
        showToast(error.getJsStack());
    }

    @Override
    public void onCursorViewsUpdate(UpdateCursor updateCursor) {
        showToast(gson.toJson(updateCursor));
    }
}, new Promise<Player>() {
    @Override
    public void then(Player player) {
        player.play();
    }

    @Override
    public void catchEx(SDKError t) {
        Logger.error("create player error, ", t);
    }
});
```

* 以上代码，可以在 [white-demo-android](https://github.com/duty-os/white-demo-android) Demo 中的 PlayActivity 中查看。