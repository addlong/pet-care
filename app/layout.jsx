import './globals.css';

export const metadata = {
  title: "奥利奥之家 Oreo's HOME · 宠物洗护",
  description: '奥利奥之家宠物洗护店，提供犬猫基础洗护、全套美容和毛发护理。',
};

export const viewport = { themeColor: '#fffaf7' };

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
