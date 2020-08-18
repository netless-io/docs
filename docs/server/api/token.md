---
id: server-token
title: 生成 Token
---

## `POST` 生成 SDK Token

```bash
https://shunt-api.netless.link/v5/tokens/teams
```

### <span style="color: #5b908e">Request</span>

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| accessKey |`required` | `string` |  Access Key |
| secretAccessKey |`required` | `string` |  Secret Access Key |
| lifespan |`required` | `integer` | 有效时间（ms）设为 0 表示永久有效 |
| role |`required` | `string` | 权限角色，可取 admin、writer、reader |

### <span style="color: #5b908e">Response</span>

#### 201:Created

创建成功、返回房间描述对象。

```json
    NETLESSSDK_YWs9MzRsNzBoQ2dINFkxZ1BCYWpqbU5Ick9qM3FGeDFMWE5GY3R0Jm5vbmNlPTE1OTA3MzkyOTgwOTUwMCZyb2xlPTAmc2lnPTY0NGY5ODQwMDMzZDA1MjcxNWE2NDc0MWQyMTExNzFhMGY0NWQ2YzZhZjZlZTc2YTA4YjNkNjFmZDc1NTJkMDM
```

## `POST` 生成 Room Token

```bash
https://shunt-api.netless.link/v5/tokens/rooms/:uuid
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | 房间的 UUID |

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| ak | `optional` | `string` | Access Key |
| lifespan | `required` | `integer` | 有效时间（ms）0 标示永久有效 |
| role | `required` | `string` | 权限角色，可取 admin、writer、reader |

### <span style="color: #5b908e">Response</span>

#### 201:Created

创建成功、返回房间描述对象。

```json
    NETLESSROOM_YWs9eGQxSE5UY2h3REozaG44M1V1SmZ4OE15cWxmOTlkSU9WRUVzJm5vbmNlPTE1OTA3Mzk3NjUxNjQwMCZyb2xlPTAmc2lnPWNmZWUwMmEzYWE5NjY5NzVmNGJhZTQwMjJiODcxYzg4MzQ3MTIwMWRmYzI2MThjMjRhOTg3ODFmMTVkNmNkYWQmdXVpZD0xNzFmZWYxMDdlMDAxMWVhYTU1ZTZkOWE0ZTA3OGRhNA
```

## `POST` 生成 Task Token

```bash
https://shunt-api.netless.link/v5/tokens/tasks/:uuid
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` | SDK Token |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | 转换任务的 UUID |

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| ak | `optional` | `string` | Access Key |
| lifespan | `required` | `integer` | 有效时间（ms）0 标示永久有效 |
| role | `required` | `string` | 权限角色，可取 admin、writer、reader |

### <span style="color: #5b908e">Response</span>

#### 201:Created

创建成功、返回房间描述对象。

```json
    NETLESSTASK_YWs9eGQxSE5UY2h3REozaG44M1V1SmZ4OE15cWxmOTlkSU9WRUVzJm5vbmNlPTE1OTA3NDAyMjg4ODEwMCZyb2xlPTAmc2lnPTUyMTY0ZjRlZmE5NzViYWJlNjgyOWU0ZDE5MGUzNDhhZjBiYzY5N2Q3NWM3ZThmNjFjNzExZTJjMjYwODI3ZjImdXVpZD0wMGQ0ZTAxNWRmNGM0ODg0ODBjM2Y4YTI0ZDA1M2ViMQ
```
