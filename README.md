# invoice-app

## 项目概述

本项目是一个移动端账单发票管理与导出工具，基于 React (Next.js) 和 TypeScript 开发，用户可以编辑账单项目、输入金额，并将账单内容导出为图片。

主要功能：

* 编辑账单标题和消费项目
* 新增自定义消费类目
* 实时计算总计金额
* 切换“编辑”与“预览”页面
* 将当前页面内容导出为 PNG 图片

## 技术栈

* **React / Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **html2canvas**：用于将 DOM 元素渲染为图片

## 功能说明

### 1. 账单编辑

* 用户可以输入账单标题。
* 默认账单类别包括“饮食伙食”、“购物消费”和“娱乐休闲”，用户可以为每一类输入金额。
* 用户可以新增自定义类别，例如“交通出行”。
* 当前总计金额会根据用户输入实时更新。

### 2. 预览页面

* 将编辑完成的账单以可视化卡片形式展示。
* 显示每一类金额及总计金额。
* 右下角显示日期和账单发票文字水印。

### 3. 导出功能

* 点击“导出”按钮，将当前页面的内容渲染为 PNG 图片。
* 编辑页面导出时，会将当前输入的内容生成临时 DOM 并渲染成图片。
* 预览页面导出时，直接渲染预览卡片内容。
* 图片可下载，文件名为当前账单标题。

## 核心代码结构

```typescript
const [title, setTitle] = useState(`${month} 月账单发票`);
const [items, setItems] = useState<Item[]>([...] );
const [tab, setTab] = useState<'编辑' | '预览'>('编辑');

const total = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
```

* `title`：账单标题
* `items`：账单项目列表
* `tab`：当前显示页面
* `total`：总金额

### 添加新类别

```typescript
const addCategory = () => {
  if (!newCategory.trim()) return;
  setItems([...items, { id: Date.now(), name: newCategory.trim(), amount: 0 }]);
  setNewCategory('');
};
```

### 导出图片

```typescript
const exportImage = async () => {
  const tempDiv = document.createElement('div');
  // 设置临时 div 样式并填充内容
  document.body.appendChild(tempDiv);

  const canvas = await html2canvas(tempDiv, { backgroundColor: '#ffffff', useCORS: true, allowTaint: true });
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${title}.png`;
  link.click();
  document.body.removeChild(tempDiv);
};
```

## 页面布局

* **Header**：显示应用名称和导出按钮
* **Main**：根据 `tab` 渲染“编辑”或“预览”内容
* **Nav**：切换页面标签

## 使用方法

1. 克隆项目到本地

```bash
git clone <repository-url>
```

2. 安装依赖

```bash
npm install
```

3. 运行开发服务器

```bash
npm run dev
```

4. 打开浏览器访问移动端界面，编辑账单并导出图片。

## 注意事项

* 编辑页面导出的是当前输入的内容，而不是预览页面的内容。
* 图片导出时会生成一个临时 DOM 元素，完成后自动移除。
* 确保浏览器支持 `html2canvas`。

## Git 提交说明示例

```bash
git add .
git commit -m "feat: 添加移动端账单编辑与导出功能"
git push origin main
```
