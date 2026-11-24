# 奥利奥之家

宠物洗护展示站和预约邮件表单，使用 Next.js App Router 和 Node.js 24。

## 本地运行

```sh
npm ci
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。原单页 HTML 保存在 `legacy/index.html`。

## 预约邮件

将 `.env.example` 复制为 `.env.local`，也可以直接在服务器配置环境变量。

| 环境变量 | 用途 |
| --- | --- |
| `BOOKING_TIME_ZONE` | 门店 IANA 时区，默认 `Asia/Shanghai` |
| `BOOKING_OWNER_EMAIL` | 预约邮件收件地址，默认占位邮箱 `bookings@pet-care.invalid`，正式使用时请设置为可收信的地址 |
| `BOOKING_FROM_EMAIL` | Resend 已验证域名下的发件地址 |
| `RESEND_API_KEY` | Resend 发送密钥 |

部署时使用 Node.js 服务器并通过 HTTPS 提供站点。应用每个进程每分钟最多尝试发送 10 封预约邮件，公开部署时可以在反向代理为 `/api/bookings` 加上每 IP 速率限制。配置完成后提交一笔测试预约，核对店主邮箱的收件情况。

预约意向通过邮件转达，由店主联系客户确认。浏览器仅保存服务、宠物种类和意向日期供下次回填。

```sh
npm test
npm run build
npm start
```

自动化测试使用模拟邮件服务。
