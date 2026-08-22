import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, Shield, Zap, Droplet, Wind, Sparkles, Award, 
  ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Ruler, Scale, Filter, GitCompare, Info 
} from "lucide-react";
import { playAvatarSlideSound, playAvatarSelectSound, playFireworkPopSound } from "@/lib/magicAudio";
import { useGame } from "@/contexts/GameContext";

interface GeoPet {
  id: string;
  name: string;
  subtitle: string;
  element: "earth" | "wind" | "water";
  elementLabel: string;
  role: string;
  mathSkill: string;
  description: string;
  stats: {
    power: number;
    precision: number;
    speed: number;
    defense: number;
  };
  colorTheme: {
    bg: string;
    border: string;
    badge: string;
    glow: string;
    accent: string;
  };
  visualShape: string;
  mathConceptTooltip: string;
}

const GEOMETRY_PETS: GeoPet[] = [
  {
    id: "cubix",
    name: "Cubix (Khối Vuông Đạc)",
    subtitle: "Vệ Binh Đo Lường Hình Học",
    element: "earth",
    elementLabel: "Hệ Đất - Cố Định",
    role: "Chuyên gia Chu vi & Diện tích ($cm^2, m^2$)",
    mathSkill: "Tính chu vi và diện tích hình chữ nhật, hình vuông",
    description: "Khối lập phương gốm men ngọc nhám mờ với mắt thấu kính tinh xảo. Cubix giúp học sinh hình dung trực quan lưới ô vuông và cách đo đạc diện tích bằng thước gập kỳ diệu.",
    stats: { power: 88, precision: 95, speed: 65, defense: 92 },
    colorTheme: {
      bg: "from-emerald-950 via-teal-900 to-slate-950",
      border: "border-emerald-500/40",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      glow: "rgba(16, 185, 129, 0.3)",
      accent: "#10b981",
    },
    visualShape: "Kubernetes Cube 3D CSS Model",
    mathConceptTooltip: "Diện tích hình chữ nhật bằng chiều dài nhân chiều rộng (cùng đơn vị đo). Chu vi bằng tổng bốn cạnh.",
  },
  {
    id: "vane",
    name: "Gió Xoáy Góc (Vane)",
    subtitle: "Tinh Linh Thước Đo Độ",
    element: "wind",
    elementLabel: "Hệ Gió - Linh Hoạt",
    role: "Chuyên gia Góc Nhọn, Góc Tù & Thước Độ",
    mathSkill: "Nhận diện góc và đo độ bằng thước đo góc chuyên dụng",
    description: "Sinh linh chóp tam giác trong suốt đội mũ chong chóng ba cánh, tay cầm trượng bút chì khắc vạch độ. Vane làm cho việc học góc độ trở nên sinh động qua các cơn gió định hướng.",
    stats: { power: 82, precision: 90, speed: 96, defense: 70 },
    colorTheme: {
      bg: "from-amber-950 via-yellow-900 to-slate-950",
      border: "border-amber-500/40",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      glow: "rgba(245, 158, 11, 0.3)",
      accent: "#f59e0b",
    },
    visualShape: "Pyramid Apex 3D CSS Model",
    mathConceptTooltip: "Góc nhọn nhỏ hơn 90°, góc vuông bằng 90°, góc tù lớn hơn 90° và nhỏ hơn 180°, góc bẹt bằng 180°.",
  },
  {
    id: "scalera",
    name: "Cân Ốc Biển (Scalera)",
    subtitle: "Học Giả Quy Đổi Khối Lượng",
    element: "water",
    elementLabel: "Hệ Nước - Cân Bằng",
    role: "Chuyên gia Quy đổi Đơn vị Đo lường ($g, kg, mm, cm, m, km$)",
    mathSkill: "Quy đổi linh hoạt giữa các đơn vị đo độ dài và khối lượng",
    description: "Vỏ ốc xoắn ốc bằng gốm men ngọc bích khắc vạch chia độ phát sáng, mang theo chiếc cân đồng thau cổ điển. Scalera giúp học sinh tính toán chính xác tuyệt đối trong mọi bài toán.",
    stats: { power: 78, precision: 98, speed: 72, defense: 85 },
    colorTheme: {
      bg: "from-blue-950 via-cyan-900 to-slate-950",
      border: "border-cyan-500/40",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      glow: "rgba(6, 182, 212, 0.3)",
      accent: "#06b6d4",
    },
    visualShape: "Spiral Nautilus 3D CSS Model",
    mathConceptTooltip: "1kg = 1000g; 1m = 10dm = 100cm = 1000mm. Khi đổi từ đơn vị lớn sang nhỏ ta nhân, ngược lại ta chia.",
  },
];

export default function GeometryPetSelectionPage() {
  const [, navigate] = useLocation();
  const { audioEnabled } = useGame();
  const [filterElement, setFilterElement] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPet, setSelectedPet] = useState<GeoPet | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const filteredPets = useMemo(() => {
    if (filterElement === "all") return GEOMETRY_PETS;
    return GEOMETRY_PETS.filter((pet) => pet.element === filterElement);
  }, [filterElement]);

  const activePet = filteredPets[currentIndex] ?? filteredPets[0] ?? GEOMETRY_PETS[0];

  const handlePrev = () => {
    playAvatarSlideSound(audioEnabled);
    setCurrentIndex((prev) => (prev === 0 ? filteredPets.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playAvatarSlideSound(audioEnabled);
    setCurrentIndex((prev) => (prev === filteredPets.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (pet: GeoPet) => {
    playAvatarSelectSound(audioEnabled);
    playFireworkPopSound(audioEnabled);
    setSelectedPet(pet);
    setIsConfirming(true);
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121629] via-[#1a2238] to-[#0d111a] text-[#f3f4f6] p-4 md:p-8 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 z-15 mb-4 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Math4Fun Field Journal</span>
            <h1 className="text-xl md:text-2xl font-bold font-serif text-amber-100">Chọn Pet Hình Học & Đo Lường</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Element Quick Filters */}
          <div className="flex items-center bg-slate-900/80 border border-slate-700 rounded-xl p-1 gap-1">
            <Filter className="w-4 h-4 text-amber-400 ml-2" />
            {[
              { id: "all", label: "Tất cả" },
              { id: "earth", label: "Đất" },
              { id: "wind", label: "Gió" },
              { id: "water", label: "Nước" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setFilterElement(tab.id); setCurrentIndex(0); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filterElement === tab.id ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowComparison(true)}
            className="px-3.5 py-2 text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl flex items-center gap-1.5 transition"
          >
            <GitCompare className="w-4 h-4" /> So sánh chỉ số
          </button>

          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
          >
            Trang Chủ
          </button>
        </div>
      </header>

      {/* Main Content Carousel */}
      <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center z-10 my-auto">
        <div className="relative w-full flex items-center justify-center">
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 md:-left-6 z-30 p-3 rounded-full bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-amber-500/30 shadow-xl transition transform hover:scale-110 active:scale-95"
            aria-label="Pet trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-0 md:-right-6 z-30 p-3 rounded-full bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-amber-500/30 shadow-xl transition transform hover:scale-110 active:scale-95"
            aria-label="Pet tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Card Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePet.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`w-full max-w-2xl bg-gradient-to-b ${activePet.colorTheme.bg} border-2 ${activePet.colorTheme.border} rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md`}
              style={{ boxShadow: `0 20px 50px -15px ${activePet.colorTheme.glow}` }}
            >
              {/* Top Badge & Element */}
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${activePet.colorTheme.badge} flex items-center gap-1.5`}>
                  {activePet.element === "earth" && <Shield className="w-3.5 h-3.5" />}
                  {activePet.element === "wind" && <Wind className="w-3.5 h-3.5" />}
                  {activePet.element === "water" && <Droplet className="w-3.5 h-3.5" />}
                  {activePet.elementLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: PET-GEO-{activePet.id.toUpperCase()}</span>
              </div>

              {/* Grid Content: 3D Visual Preview & Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left: 3D CSS Model representation */}
                <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-900/60 rounded-2xl p-6 border border-slate-700/50 relative group">
                  <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent rounded-2xl pointer-events-none" />
                  
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-amber-500/30 flex flex-col items-center justify-center relative shadow-inner animate-float">
                    <div className="absolute -top-3 -right-3 px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-md shadow">
                      3D MODEL
                    </div>
                    {activePet.id === "cubix" && (
                      <div className="w-16 h-16 rounded-lg bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg transform rotate-12 transition group-hover:rotate-45 duration-700">
                        <Ruler className="w-8 h-8 text-emerald-300" />
                      </div>
                    )}
                    {activePet.id === "vane" && (
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-lg transform animate-spin-slow">
                        <Wind className="w-8 h-8 text-amber-300" />
                      </div>
                    )}
                    {activePet.id === "scalera" && (
                      <div className="w-16 h-16 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-lg transform hover:scale-110 transition">
                        <Scale className="w-8 h-8 text-cyan-300" />
                      </div>
                    )}
                    <span className="mt-3 text-xs font-mono text-slate-300">{activePet.visualShape}</span>
                  </div>

                  <div className="mt-4 w-full">
                    <div className="text-[11px] text-slate-400 mb-1 flex justify-between">
                      <span>Sức mạnh tổng hợp</span>
                      <span className="text-amber-300 font-bold">
                        {Math.round((activePet.stats.power + activePet.stats.precision + activePet.stats.speed + activePet.stats.defense) / 4)} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                        style={{ width: `${(activePet.stats.precision)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Info & Stats */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-serif text-white">{activePet.name}</h2>
                    <p className="text-sm text-amber-300/90 font-medium">{activePet.subtitle}</p>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                    {activePet.description}
                  </p>

                  {/* Math Skill Binding with Tooltip */}
                  <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl relative group">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>NĂNG LỰC TOÁN HỌC LỚP 4:</span>
                    </div>
                    <p className="text-xs text-amber-200/90 font-medium">{activePet.mathSkill}</p>
                    <div className="mt-2 pt-2 border-t border-amber-500/20 text-[11px] text-slate-300 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{activePet.mathConceptTooltip}</span>
                    </div>
                  </div>

                  {/* Stat Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Sức mạnh (Power)</span>
                      <span className="text-sm font-bold text-emerald-400">{activePet.stats.power}</span>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Độ chính xác</span>
                      <span className="text-sm font-bold text-amber-400">{activePet.stats.precision}</span>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Tốc độ (Speed)</span>
                      <span className="text-sm font-bold text-cyan-400">{activePet.stats.speed}</span>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Phòng thủ (Def)</span>
                      <span className="text-sm font-bold text-indigo-400">{activePet.stats.defense}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Pet nguyên bản bản quyền an toàn, mở khóa trọn đời cho hành trình Toán lớp 4.</span>
                </div>
                <button
                  onClick={() => handleSelect(activePet)}
                  disabled={isConfirming}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isConfirming ? "Đang triệu hồi pet..." : "Chọn Bạn Đồng Hành Này"}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center gap-3 mt-8">
          {filteredPets.map((pet, idx) => (
            <button
              key={pet.id}
              onClick={() => {
                playAvatarSlideSound(audioEnabled);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-8 bg-amber-400 shadow-glow" : "w-2.5 bg-slate-700 hover:bg-slate-600"
              }`}
              aria-label={`Chuyển tới ${pet.name}`}
            />
          ))}
        </div>
      </main>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border-2 border-indigo-500 p-6 md:p-8 rounded-3xl max-w-3xl w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                  <GitCompare className="w-5 h-5" /> So sánh chỉ số các Pet Hình Học
                </div>
                <button 
                  onClick={() => setShowComparison(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Đóng
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GEOMETRY_PETS.map((pet) => (
                  <div key={pet.id} className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">{pet.elementLabel}</span>
                      <h3 className="text-base font-bold text-white mt-2">{pet.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{pet.role}</p>
                    </div>

                    <div className="space-y-2 my-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sức mạnh:</span>
                        <span className="font-bold text-emerald-400">{pet.stats.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chính xác:</span>
                        <span className="font-bold text-amber-400">{pet.stats.precision}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tốc độ:</span>
                        <span className="font-bold text-cyan-400">{pet.stats.speed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phòng thủ:</span>
                        <span className="font-bold text-indigo-400">{pet.stats.defense}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowComparison(false);
                        const idx = filteredPets.findIndex((p) => p.id === pet.id);
                        if (idx !== -1) setCurrentIndex(idx);
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-semibold transition"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Success Overlay */}
      <AnimatePresence>
        {isConfirming && selectedPet && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
              <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400 animate-bounce">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-amber-100 mb-2">Triệu Hồi Thành Công!</h2>
              <p className="text-sm text-slate-300 mb-4">
                Bạn đã chính thức đồng hành cùng <span className="text-amber-400 font-bold">{selectedPet.name}</span> trong sứ mệnh chinh phục Hình học & Đo lường lớp 4!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-300 rounded-xl border border-amber-500/30 text-xs font-mono">
                <Sparkles className="w-4 h-4" /> Đang chuyển về bản đồ hành trình...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 pt-6 border-t border-slate-800/60 z-10">
        Math4Fun Field Journal Quest • Bộ Sưu Tập Pet Nguyên Bản (Geometry & Measurement Edition)
      </footer>
    </div>
  );
}
