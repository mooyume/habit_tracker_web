# 体重管理 App - API 接口文档

## 📋 文档说明

本文档定义了体重管理 App 所需的后端 API 接口规范。

**基础信息：**
- Base URL: `https://api.example.com/v1`
- 认证方式: Bearer Token
- 请求格式: `application/json`
- 响应格式: `application/json`
- 字符编码: `UTF-8`

**通用响应格式：**
```json
{
  "code": 0,           // 0: 成功, 非0: 失败
  "message": "success",
  "data": {}           // 具体数据
}
```

---

## 1. 用户认证模块

### 1.1 用户注册

**接口地址：** `POST /auth/register`

**请求参数：**
```json
{
  "phone": "13800138000",      // 手机号
  "password": "123456",         // 密码（6-20位）
  "verifyCode": "123456"        // 短信验证码
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "userId": "user_123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200           // token 有效期（秒）
  }
}
```

---

### 1.2 用户登录

**接口地址：** `POST /auth/login`

**请求参数：**
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "userId": "user_123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200
  }
}
```

---

## 2. 体重目标管理

### 2.1 获取用户目标

**接口地址：** `GET /weight/goal`

**请求头：**
```
Authorization: Bearer {token}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "targetWeight": 65.0,      // 目标体重 (kg)
    "height": 175,             // 身高 (cm)
    "startWeight": 72.5,       // 开始体重 (kg)
    "startDate": "2024-01-01"  // 开始日期
  }
}
```

**说明：**
- 首次使用时返回空数据或默认值
- `targetWeight` 为 0 表示未设置目标

---

### 2.2 设置/更新目标

**接口地址：** `POST /weight/goal`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "targetWeight": 65.0,
  "height": 175,
  "startWeight": 72.5,
  "startDate": "2024-01-01"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "设置成功",
  "data": {
    "targetWeight": 65.0,
    "height": 175,
    "startWeight": 72.5,
    "startDate": "2024-01-01"
  }
}
```

---

## 3. 体重记录管理

### 3.1 获取体重记录列表

**接口地址：** `GET /weight/records`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```
startDate: 2024-01-01  // 可选，开始日期
endDate: 2024-12-31    // 可选，结束日期
limit: 30              // 可选，返回条数，默认30
offset: 0              // 可选，偏移量，默认0
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 45,
    "records": [
      {
        "id": "weight_001",
        "date": "2024-12-17",
        "weight": 72.5,
        "note": "早起空腹",
        "createdAt": "2024-12-17T06:30:00Z"
      },
      {
        "id": "weight_002",
        "date": "2024-12-16",
        "weight": 72.8,
        "note": "运动后",
        "createdAt": "2024-12-16T18:30:00Z"
      }
    ]
  }
}
```

---

### 3.2 添加体重记录

**接口地址：** `POST /weight/records`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "date": "2024-12-17",
  "weight": 72.5,
  "note": "早起空腹"        // 可选
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "添加成功",
  "data": {
    "id": "weight_001",
    "date": "2024-12-17",
    "weight": 72.5,
    "note": "早起空腹",
    "createdAt": "2024-12-17T06:30:00Z"
  }
}
```

**说明：**
- 同一天只能有一条记录，重复添加会覆盖
- `weight` 精度为一位小数
- `date` 不能晚于当前日期

---

### 3.3 更新体重记录

**接口地址：** `PUT /weight/records/{id}`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "weight": 72.3,
  "note": "早起空腹（已修正）"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": "weight_001",
    "date": "2024-12-17",
    "weight": 72.3,
    "note": "早起空腹（已修正）",
    "createdAt": "2024-12-17T06:30:00Z"
  }
}
```

---

### 3.4 删除体重记录

**接口地址：** `DELETE /weight/records/{id}`

**请求头：**
```
Authorization: Bearer {token}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "删除成功",
  "data": null
}
```

---

### 3.5 获取指定日期的记录

**接口地址：** `GET /weight/records/{date}`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `date`: 日期，格式 `YYYY-MM-DD`，如 `2024-12-17`

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "weight_001",
    "date": "2024-12-17",
    "weight": 72.5,
    "note": "早起空腹",
    "createdAt": "2024-12-17T06:30:00Z"
  }
}
```

**说明：**
- 如果当天没有记录，返回 `data: null`

---

## 4. 统计数据

### 4.1 获取统计数据

**接口地址：** `GET /weight/stats`

**请求头：**
```
Authorization: Bearer {token}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "current": 72.5,          // 当前体重
    "previous": 72.8,         // 前一天体重
    "change": -0.3,           // 与前一天对比
    "weekChange": -0.5,       // 本周变化
    "monthChange": -1.2,      // 本月变化
    "highest": 74.0,          // 最高体重
    "lowest": 71.5,           // 最低体重
    "average": 72.8,          // 平均体重
    "totalDays": 45,          // 已记录天数
    "bmi": 23.7               // BMI 指数
  }
}
```

**说明：**
- 所有统计数据基于用户的历史记录计算
- BMI 计算公式：`体重(kg) / (身高(m) ^ 2)`

---

### 4.2 获取图表数据

**接口地址：** `GET /weight/chart`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```
range: week    // 时间范围: week(7天) | month(30天) | year(365天)
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "range": "week",
    "dataPoints": [
      {
        "date": "2024-12-11",
        "weight": 73.2
      },
      {
        "date": "2024-12-12",
        "weight": 73.0
      },
      {
        "date": "2024-12-13",
        "weight": 72.8
      },
      {
        "date": "2024-12-14",
        "weight": 72.7
      },
      {
        "date": "2024-12-15",
        "weight": 72.5
      },
      {
        "date": "2024-12-16",
        "weight": 72.8
      },
      {
        "date": "2024-12-17",
        "weight": 72.5
      }
    ]
  }
}
```

**说明：**
- 返回指定时间范围内的所有记录点
- 数据按日期升序排列
- 如果某天没有记录，该天不会出现在数据点中

---

## 5. 习惯管理模块（预留）

> **注意：** 当前版本主要聚焦体重管理功能，习惯管理模块为预留功能，接口定义供后续开发参考。

### 5.1 获取习惯列表

**接口地址：** `GET /habits`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```
archived: false    // 可选，是否包含已归档，默认false
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "habits": [
      {
        "id": "habit_001",
        "name": "早起",
        "emoji": "🌅",
        "color": "#FF6B6B",
        "type": "check",              // check: 打卡型 | count: 计数型 | timer: 计时型
        "group": "health",            // 分组
        "repeatType": "daily",        // daily: 每天 | weekday: 工作日 | custom: 自定义
        "repeatDays": null,           // 自定义重复日期 [0-6]，0=周日
        "targetCount": null,          // 计数型目标
        "targetMinutes": null,        // 计时型目标（分钟）
        "reminderTime": "06:00",      // 提醒时间
        "reminderEnabled": true,      // 是否启用提醒
        "sortOrder": 1,               // 排序
        "archived": false,            // 是否归档
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

### 5.2 创建习惯

**接口地址：** `POST /habits`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "name": "早起",
  "emoji": "🌅",
  "color": "#FF6B6B",
  "type": "check",
  "group": "health",
  "repeatType": "daily",
  "repeatDays": null,
  "targetCount": null,
  "targetMinutes": null,
  "reminderTime": "06:00",
  "reminderEnabled": true
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "创建成功",
  "data": {
    "id": "habit_001",
    "name": "早起",
    "emoji": "🌅",
    "color": "#FF6B6B",
    "type": "check",
    "group": "health",
    "repeatType": "daily",
    "repeatDays": null,
    "targetCount": null,
    "targetMinutes": null,
    "reminderTime": "06:00",
    "reminderEnabled": true,
    "sortOrder": 1,
    "archived": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 5.3 获取打卡记录

**接口地址：** `GET /habits/records`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```
date: 2024-12-17      // 可选，指定日期
habitId: habit_001    // 可选，指定习惯ID
startDate: 2024-12-01 // 可选，开始日期
endDate: 2024-12-31   // 可选，结束日期
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "record_001",
        "habitId": "habit_001",
        "date": "2024-12-17",
        "completed": true,
        "count": null,
        "minutes": null,
        "note": "今天起得很早",
        "mood": "😊",
        "completedAt": "2024-12-17T06:15:00Z"
      }
    ]
  }
}
```

---

### 5.4 打卡/更新记录

**接口地址：** `POST /habits/records`

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "habitId": "habit_001",
  "date": "2024-12-17",
  "completed": true,
  "count": null,          // 计数型时必填
  "minutes": null,        // 计时型时必填
  "note": "今天起得很早",
  "mood": "😊"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "打卡成功",
  "data": {
    "id": "record_001",
    "habitId": "habit_001",
    "date": "2024-12-17",
    "completed": true,
    "count": null,
    "minutes": null,
    "note": "今天起得很早",
    "mood": "😊",
    "completedAt": "2024-12-17T06:15:00Z"
  }
}
```

---

## 6. 错误码说明

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 0 | 成功 | - |
| 1001 | 参数错误 | 检查请求参数格式 |
| 1002 | 缺少必填参数 | 补充必填参数 |
| 2001 | 未登录 | 跳转到登录页 |
| 2002 | token 已过期 | 刷新 token 或重新登录 |
| 2003 | 无权限 | 提示用户权限不足 |
| 3001 | 用户不存在 | 提示用户注册 |
| 3002 | 密码错误 | 提示用户重新输入 |
| 3003 | 验证码错误 | 提示用户重新获取 |
| 4001 | 记录不存在 | 提示用户记录已删除 |
| 4002 | 日期格式错误 | 使用 YYYY-MM-DD 格式 |
| 4003 | 数据超出范围 | 检查体重、身高等数值范围 |
| 5000 | 服务器错误 | 提示用户稍后重试 |

---

## 7. 数据类型说明

### WeightRecord（体重记录）
```typescript
interface WeightRecord {
  id: string;              // 记录ID
  date: string;            // 日期 "YYYY-MM-DD"
  weight: number;          // 体重 (kg)，精度1位小数
  note?: string;           // 备注（可选）
  createdAt: string;       // 创建时间 ISO 8601
}
```

### WeightGoal（体重目标）
```typescript
interface WeightGoal {
  targetWeight: number;    // 目标体重 (kg)
  height: number;          // 身高 (cm)
  startWeight: number;     // 开始体重 (kg)
  startDate: string;       // 开始日期 "YYYY-MM-DD"
}
```

### WeightStats（统计数据）
```typescript
interface WeightStats {
  current: number;         // 当前体重
  previous: number;        // 前一天体重
  change: number;          // 与前一天对比
  weekChange: number;      // 本周变化
  monthChange: number;     // 本月变化
  highest: number;         // 最高体重
  lowest: number;          // 最低体重
  average: number;         // 平均体重
  totalDays: number;       // 已记录天数
  bmi: number;             // BMI 指数
}
```

---

## 8. 接口调用示例

### 8.1 完整的首次设置流程

```javascript
// 1. 用户注册/登录
const loginResponse = await fetch('https://api.example.com/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone: '13800138000',
    password: '123456'
  })
});
const { data: { token } } = await loginResponse.json();

// 2. 设置目标
await fetch('https://api.example.com/v1/weight/goal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    targetWeight: 65.0,
    height: 175,
    startWeight: 72.5,
    startDate: '2024-01-01'
  })
});

// 3. 添加第一条体重记录
await fetch('https://api.example.com/v1/weight/records', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    date: '2024-01-01',
    weight: 72.5,
    note: '早起空腹'
  })
});
```

---

### 8.2 获取首页数据

```javascript
// 并发请求多个接口
const [goalRes, recordsRes, statsRes] = await Promise.all([
  fetch('https://api.example.com/v1/weight/goal', {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  fetch('https://api.example.com/v1/weight/records?limit=30', {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  fetch('https://api.example.com/v1/weight/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
]);

const goal = await goalRes.json();
const records = await recordsRes.json();
const stats = await statsRes.json();
```

---

## 9. 注意事项

1. **日期格式**：所有日期统一使用 `YYYY-MM-DD` 格式
2. **时间戳**：所有时间戳使用 ISO 8601 格式（UTC）
3. **体重精度**：体重数据保留一位小数
4. **身高范围**：100-250 cm
5. **体重范围**：30-200 kg
6. **同日记录**：同一天只能有一条体重记录，重复添加会覆盖
7. **未来日期**：不允许添加未来日期的记录
8. **Token 刷新**：Token 过期前应主动刷新，避免用户操作中断
9. **并发请求**：首页数据建议使用并发请求提升性能
10. **错误处理**：所有接口调用都应处理错误情况并给用户友好提示

---

## 10. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2024-12-17 | 初始版本，定义体重管理核心接口 |

---

**文档维护：** 开发团队  
**最后更新：** 2024-12-17
