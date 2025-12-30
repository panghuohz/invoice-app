"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

type Item = {
  id: number;
  name: string;
  amount: number;
};

export default function Table2ImageMobile() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const [title, setTitle] = useState(`${month} 月账单发票`);
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "饮食伙食", amount: 0 },
    { id: 2, name: "购物消费", amount: 0 },
    { id: 3, name: "娱乐休闲", amount: 0 },
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [tab, setTab] = useState<"编辑" | "预览">("编辑");

  const total = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setItems([
      ...items,
      { id: Date.now(), name: newCategory.trim(), amount: 0 },
    ]);
    setNewCategory("");
  };

  const exportImage = async () => {
    // 根据当前tab选择导出内容
    const elementId = tab === "预览" ? "previewContent" : "editContent";
    const element = document.querySelector<HTMLDivElement>(`#${elementId}`);
    if (!element) {
      alert("请确保内容已经渲染");
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${title}.png`;
      link.click();
    } catch (err) {
      console.error("导出图片失败:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E2E8F0]">
        <h1 className="text-lg font-bold tracking-tight">账单发票</h1>
        <button
          onClick={exportImage}
          className="bg-[#0F172A] text-white px-4 py-2 text-sm font-medium rounded"
        >
          导出
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {tab === "编辑" && (
          <div id="editContent" className="p-4 space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#94A3B8]">
                账单标题
              </label>
              <input
                className="w-full text-sm font-medium border border-[#E2E8F0] rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="space-y-1">
                  <label className="text-xs font-medium text-[#94A3B8]">
                    {item.name}
                  </label>
                  <input
                    type="number"
                    className="w-full border border-[#E2E8F0] rounded px-3 py-2 text-sm"
                    value={item.amount === 0 ? "" : item.amount}
                    placeholder="0"
                    onFocus={(e) => {
                      if (item.amount === 0) e.target.value = "";
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItems((prev) =>
                        prev.map((p) =>
                          p.id === item.id
                            ? { ...p, amount: val === "" ? 0 : Number(val) }
                            : p,
                        ),
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                className="flex-1 border border-[#E2E8F0] rounded px-3 py-2 text-sm"
                placeholder="新增消费类目（如：交通出行）"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-[#0F172A] text-white text-sm rounded"
              >
                添加
              </button>
            </div>

            <div className="text-right text-sm font-medium">
              当前合计：¥ {total.toFixed(2)}
            </div>
          </div>
        )}

        {tab === "预览" && (
          <div className="p-4 flex justify-center">
            <div
              id="previewContent"
              className="w-full max-w-md bg-white text-[#0F172A] p-4 flex flex-col gap-2"
            >
              <h2 className="text-lg font-bold mb-3 wrap-break-word">
                {title}
              </h2>
              <div className="w-full text-sm flex flex-col gap-2">
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span className="wrap-break-word pr-2">{i.name}</span>
                    <span>¥ {i.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center font-bold border-t pt-3 mt-2">
                  <span>总计</span>
                  <span>¥ {total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-[#94A3B8] text-right opacity-30">
                {new Date().toLocaleDateString()} · 账单发票
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="flex border-t border-[#E2E8F0] bg-white">
        <button
          onClick={() => setTab("编辑")}
          className={`flex-1 py-3 text-sm font-medium ${tab === "编辑" ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
        >
          编辑
        </button>
        <button
          onClick={() => setTab("预览")}
          className={`flex-1 py-3 text-sm font-medium ${tab === "预览" ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
        >
          预览
        </button>
      </nav>
    </div>
  );
}
