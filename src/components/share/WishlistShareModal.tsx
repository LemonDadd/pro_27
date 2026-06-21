import { useEffect, useState, useRef } from "react";
import { X, Download, Share2, Copy, Check, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import type { Destination } from "@/types";
import { BUDGET_SYMBOLS, TAG_LABELS, TAG_EMOJI, CONTINENT_LABELS } from "@/utils/display";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  accentBg: string;
  icon: React.ReactNode;
  items: Destination[];
}

export default function WishlistShareModal({
  open,
  onClose,
  title,
  subtitle,
  accentBg,
  icon,
  items,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!open) {
      setImageData(null);
      setIsGenerating(false);
      setCopied(false);
      setDownloaded(false);
      return;
    }

    const generate = async () => {
      if (!cardRef.current) return;
      setIsGenerating(true);
      try {
        await new Promise((r) => setTimeout(r, 100));
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#0C4A6E",
          scale: 2,
          useCORS: true,
          logging: false,
          imageTimeout: 15000,
          allowTaint: true,
        });
        const img = canvas.toDataURL("image/png");
        setImageData(img);
      } catch (err) {
        console.error("生成截图失败:", err);
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [open, items]);

  const handleDownload = () => {
    if (!imageData) return;
    const a = document.createElement("a");
    a.href = imageData;
    a.download = `我的${title}-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleCopy = async () => {
    if (!imageData) return;
    try {
      const blob = await (await fetch(imageData)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
      alert("复制失败，请尝试下载图片");
    }
  };

  if (!open) return null;

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-pop overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-sky-900" />
            <h2 className="font-serif text-xl font-bold text-sky-900">
              分享我的{title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center min-h-[420px]">
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/70 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
                <p className="text-sm text-slate-600 font-medium">
                  正在生成精美分享图...
                </p>
              </div>
            )}

            {imageData && (
              <img
                src={imageData}
                alt="分享预览"
                className="w-full h-auto max-h-[440px] object-contain animate-fade-in"
              />
            )}

            <div className="sr-only">
              <div
                ref={cardRef}
                className="w-[600px] bg-gradient-to-br from-[#0C4A6E] via-[#0B3D5A] to-[#F97316] p-10 text-white relative overflow-hidden"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
                <div className="absolute inset-0 opacity-20 bg-grid-dots" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl text-white",
                        accentBg,
                      )}
                    >
                      {icon}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/50 font-sans">
                        Wanderlust Travel
                      </div>
                      <div
                        className="text-3xl font-bold"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        我的{title}
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-white/70 mb-8 font-sans">{subtitle}</p>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {items.slice(0, 6).map((d) => (
                      <div
                        key={d.id}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10"
                      >
                        <div className="w-full h-20 rounded-xl overflow-hidden mb-2 bg-white/5">
                          <img
                            src={d.coverImage}
                            alt={d.name}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="flex items-end justify-between gap-1">
                          <div>
                            <div className="font-serif text-lg font-bold leading-tight">
                              {d.name}
                            </div>
                            <div className="text-[11px] text-white/60 font-sans">
                              {d.country} · {CONTINENT_LABELS[d.continent]}
                            </div>
                          </div>
                          <div
                            className="text-xl font-bold"
                            style={{ color: "#FB923C" }}
                          >
                            {BUDGET_SYMBOLS[d.budgetLevel]}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {[...new Set(d.tags)].slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-sans text-white/85"
                            >
                              {TAG_EMOJI[t]} {TAG_LABELS[t]}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {items.length > 6 && (
                    <div className="text-center text-sm text-white/60 font-sans mb-6">
                      还有 {items.length - 6} 个目的地等你探索...
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-white/15">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-[#0C4A6E] flex items-center justify-center font-bold text-sm">
                        W
                      </div>
                      <div>
                        <div className="font-serif text-base font-bold">
                          Wanderlust
                        </div>
                        <div className="text-[10px] text-white/50 font-sans uppercase tracking-wider">
                          旅行灵感探索
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-white/50 font-sans uppercase tracking-wider">
                        创建于
                      </div>
                      <div className="font-serif text-sm font-bold">
                        {dateStr}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                      <span className="text-sm font-sans font-medium">
                        共 {items.length} 个目的地
                      </span>
                      <span
                        className="w-px h-4 bg-white/20"
                      />
                      <span
                        className="text-sm font-sans font-bold"
                        style={{ color: "#FB923C" }}
                      >
                        wanderlust.app
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleCopy}
              disabled={!imageData}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all",
                copied
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white border-2 border-slate-200 text-sky-900 hover:border-sky-900",
                !imageData && "opacity-50 cursor-not-allowed",
              )}
            >
              {copied ? (
                <>
                  <Check size={16} /> 已复制到剪贴板
                </>
              ) : (
                <>
                  <Copy size={16} /> 复制图片
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={!imageData}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all",
                downloaded
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                  : "bg-gradient-to-br from-orange-500 to-orange-600 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5",
                !imageData && "opacity-50 cursor-not-allowed",
              )}
            >
              {downloaded ? (
                <>
                  <Check size={16} /> 已下载
                </>
              ) : (
                <>
                  <Download size={16} /> 保存为图片
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            提示：可将图片分享到朋友圈、微博、小红书等社交平台 🌍
          </p>
        </div>
      </div>
    </div>
  );
}
