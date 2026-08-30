/** Shop — a small 3D expedition market for recovery items and companion cosmetics. */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Coins,
  HeartPulse,
  PackageOpen,
  Plus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { ShopItemIllustration } from "@/components/ShopItemIllustration";
import { useGame } from "@/contexts/GameContext";
import {
  COMPANION_COSMETIC_SETS,
  GUARDIANS,
  SHOP_ITEMS,
  type ShopItem,
} from "@/game/gameData";
import { getGuardianElementLabel } from "@/game/guardianBranding";

function productCategory(item: ShopItem) {
  if (item.kind === "healing") return "HỒI PHỤC";
  return item.slot === "outfit" ? "TRANG PHỤC" : "HIỆU ỨNG";
}

export default function ShopPage() {
  const {
    profile,
    gold,
    inventory,
    guardianHp,
    purchaseItem,
    useHealingItem,
    equippedCosmetics,
    equipCosmetic,
  } = useGame();
  const owned = useMemo(
    () =>
      profile
        ? GUARDIANS.filter(guardian =>
            profile.collectedGuardianIds.includes(guardian.id)
          )
        : [],
    [profile]
  );
  const [selectedGuardian, setSelectedGuardian] = useState("");
  const [message, setMessage] = useState("");
  const [rewardSetId, setRewardSetId] = useState<string | null>(null);

  if (!profile) {
    const dexo = GUARDIANS.find(guardian => guardian.id === "dexo");
    return (
      <section className="stats-blank-dossier shop-v2">
        <header className="grid gap-5 lg:grid-cols-[1fr_250px]">
          <div>
            <p className="section-kicker">QUẦY TIẾP TẾ · CHỜ KÝ TÊN</p>
            <h1 className="font-display text-4xl font-black">
              Shop chỉ mở cho nhật ký đã niêm phong.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#476275]">
              Tạo hoặc vào hồ sơ để nhận Gold từ câu trả lời đúng, mở kho 3D và
              chăm sóc guardian trên mỗi tuyến học.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="border-2 border-[#172a48] bg-[#fff8da] p-3">
                <b className="font-display text-xl">15+</b>
                <small className="mt-1 block text-xs text-[#58708b]">
                  vật phẩm sưu tầm
                </small>
              </div>
              <div className="border-2 border-[#172a48] bg-[#e7f2e5] p-3">
                <b className="font-display text-xl">3D</b>
                <small className="mt-1 block text-xs text-[#58708b]">
                  di vật & phụ kiện
                </small>
              </div>
              <div className="border-2 border-[#172a48] bg-[#eef1fb] p-3">
                <b className="font-display text-xl">5</b>
                <small className="mt-1 block text-xs text-[#58708b]">
                  bộ phong cách
                </small>
              </div>
            </div>
          </div>
          <aside className="relative rotate-[2deg] overflow-hidden border-2 border-[#172a48] bg-[#fff8da] p-3 shadow-[3px_3px_0_#172a48]">
            <span className="field-tag">SPECIMEN 01 · PENDING</span>
            <div className="mx-auto mt-2 grid h-28 w-28 place-items-center rounded-full border-2 border-dashed border-[#172a48] bg-[#e8f0e4]">
              <img
                src={dexo?.sprite}
                alt="Tiêu bản guardian đang niêm phong"
                className="h-20 w-20 object-contain grayscale-[.45]"
              />
            </div>
            <p className="mt-2 border-t border-dashed border-[#a99870] pt-2 font-mono text-[9px] font-bold tracking-[.12em] text-[#58708b]">
              {dexo?.name ?? "GUARDIAN"} ·{" "}
              {dexo
                ? (getGuardianElementLabel(dexo.id) ?? dexo.element)
                : "NGŨ HÀNH"}{" "}
              · KHO 3D
            </p>
          </aside>
        </header>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_250px]">
          <div>
            <div className="stats-blank-route">
              <span className="is-active">
                01
                <br />
                <small>Vào game</small>
              </span>
              <i />
              <span>
                02
                <br />
                <small>Nhận Gold</small>
              </span>
              <i />
              <span>
                03
                <br />
                <small>Tiếp tế</small>
              </span>
            </div>
            <div className="mt-5 border-y-2 border-dashed border-[#d7d0bf] bg-[#fff8da] p-4">
              <p className="section-kicker">PHIẾU ĐỔI THƯỞNG</p>
              <p className="mt-1 text-sm leading-relaxed text-[#476275]">
                Một lời giải đúng → Gold được đóng dấu → vật phẩm 3D được ghi
                vào kho. Trang phục và hiệu ứng chỉ là phần thưởng sưu tầm,
                không thay đổi điểm Toán.
              </p>
            </div>
          </div>
          <aside className="border-2 border-dashed border-[#172a48] bg-[#172a48] p-4 text-white">
            <p className="font-mono text-[10px] font-bold tracking-[.15em] text-[#f6b73c]">
              LÔ HÀNG ĐẦU TUYẾN
            </p>
            <b className="mt-3 block font-display text-2xl">Kho vật phẩm 3D</b>
            <small className="mt-2 block leading-relaxed text-[#d5dfed]">
              Bình hồi phục · áo choàng · dấu chân · bộ Ngũ hành
            </small>
          </aside>
        </div>
        <Link href="/start" className="stats-blank-cta">
          Ký tên để mở quầy tiếp tế
        </Link>
      </section>
    );
  }

  const activeId = selectedGuardian || owned[0]?.id || "";
  const activeGuardian = owned.find(guardian => guardian.id === activeId);
  const hp = activeGuardian ? guardianHp(activeGuardian.id) : 0;
  const activeSet = COMPANION_COSMETIC_SETS.find(
    set =>
      set.itemIds.includes(equippedCosmetics.outfit ?? "potion-25") &&
      set.itemIds.includes(equippedCosmetics.trail ?? "potion-25")
  );
  const rewardSet = COMPANION_COSMETIC_SETS.find(set => set.id === rewardSetId);
  const cosmeticItems = SHOP_ITEMS.filter(item => item.kind === "cosmetic");
  const healingItems = SHOP_ITEMS.filter(item => item.kind === "healing");

  const buy = (item: ShopItem) => {
    const result = purchaseItem(item.id);
    setMessage(result.message);
    setRewardSetId(result.setReward?.id ?? null);
  };

  return (
    <section className="shop-v2">
      <header className="shop-hero flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="section-kicker">
            <ShoppingBag size={14} /> QUẦY TIẾP TẾ · 3D FIELD MARKET
          </p>
          <h1 className="font-display text-4xl font-black">Shop & Kho đồ</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#58708b]">
            Mở rộng hành trình bằng vật phẩm có hình khối riêng: chăm sóc
            guardian, sưu tầm phụ kiện và ghép đủ bộ phong cách để nhận thưởng.
          </p>
        </div>
        <div className="border-2 border-[#172a48] bg-[#fff0b6] px-4 py-3 font-display text-3xl font-black shadow-[3px_3px_0_#172a48]">
          <Coins className="mr-2 inline text-[#b17a3d]" size={24} />
          {gold} <span className="font-sans text-sm">Gold</span>
        </div>
      </header>

      <div className="shop-showcase mt-5 grid gap-4 border-2 border-[#172a48] bg-[#172a48] p-4 text-white shadow-[5px_5px_0_#f6b73c] md:grid-cols-[1fr_230px] md:items-center">
        <div>
          <span className="field-tag border-white/40 bg-white/10 text-white">
            <Sparkles size={13} /> LÔ HÀNG MỚI · NGŨ HÀNH
          </span>
          <h2 className="mt-3 font-display text-3xl font-black">
            Sưu tầm để companion có câu chuyện riêng.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#d5dfed]">
            Các món 3D mới được chia thành hồi phục, trang phục và hiệu ứng.
            Hoàn tất một bộ đôi để nhận thêm Gold và XP hồ sơ.
          </p>
        </div>
        <img
          src="/shop/3d/element-chest.webp"
          alt="Rương kho báu Ngũ hành 3D"
          className="shop-showcase-chest mx-auto h-40 w-40 object-cover mix-blend-screen"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-y-2 border-dashed border-[#c9b88c] bg-[#fff8da] px-3 py-2 font-mono text-[10px] font-bold tracking-[.13em] text-[#476275]">
        <span className="border border-[#172a48] bg-[#f6b73c] px-2 py-1 text-[#172a48]">
          ĐÚNG → GOLD
        </span>
        <i className="w-7 border-t-2 border-dotted border-[#172a48]" />
        <span className="border border-[#172a48] bg-white px-2 py-1">
          MUA VẬT PHẨM 3D
        </span>
        <i className="w-7 border-t-2 border-dotted border-[#172a48]" />
        <span className="border border-[#172a48] bg-[#e8f0e4] px-2 py-1">
          GHÉP BỘ → THƯỞNG
        </span>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="paper-stack border-2 border-[#172a48] bg-[#fffdf6] p-5 shadow-[5px_5px_0_#172a48]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShoppingBag size={19} />
              <div>
                <p className="section-kicker">CATALOGUE · 3D OBJECTS</p>
                <h2 className="font-display text-3xl font-black">
                  Sổ hàng tiếp tế
                </h2>
              </div>
            </div>
            <span className="field-tag">{SHOP_ITEMS.length} món</span>
          </div>
          <div className="shop-product-grid mt-5 grid gap-4">
            {SHOP_ITEMS.map(item => (
              <article
                key={item.id}
                className={`shop-product-card relative overflow-hidden border-2 border-[#172a48] p-3 shadow-[3px_3px_0_#172a48] ${item.tone}`}
              >
                <div className="shop-product-visual relative grid place-items-center overflow-hidden border-2 border-dashed border-[#172a48]/60">
                  <ShopItemIllustration
                    itemId={item.id}
                    className="h-40 w-full"
                  />
                  <span className="shop-category-tag absolute left-2 top-2">
                    {productCategory(item)}
                  </span>
                </div>
                <div className="shop-product-copy">
                  <p className="mt-3 font-display text-2xl font-black leading-none">
                    {item.label}
                  </p>
                  <p className="mt-2 min-h-11 text-xs leading-relaxed text-[#476275]">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <b className="whitespace-nowrap">
                      <Coins className="mr-1 inline" size={14} />
                      {item.price}
                    </b>
                    <button
                      type="button"
                      disabled={
                        item.kind === "cosmetic" && inventory[item.id] > 0
                      }
                      onClick={() => buy(item)}
                      className="border-2 border-[#172a48] bg-white px-3 py-2 text-xs font-black shadow-[2px_2px_0_#172a48] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      <Plus className="mr-1 inline" size={13} />
                      {item.kind === "cosmetic" && inventory[item.id] > 0
                        ? "Đã có"
                        : "Mua"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 border-t-2 border-dashed border-[#d7d0bf] pt-4 text-xs font-bold text-[#58708b]">
            Bình hồi phục chỉ dùng ngoài trận Boss. Trang phục và dấu vết là
            phần thưởng thẩm mỹ; sức mạnh vẫn đến từ lời giải Toán chính xác.
          </p>
        </section>

        <aside className="border-2 border-[#172a48] bg-[#172a48] p-5 text-white shadow-[4px_4px_0_#f6b73c]">
          <PackageOpen className="text-[#f6b73c]" />
          <p className="mt-3 text-xs font-bold tracking-[.15em] text-[#f6b73c]">
            KHO ĐỒ CÁ NHÂN
          </p>
          <div className="shop-inventory-list">
            {SHOP_ITEMS.map(item => (
              <div
                className="shop-inventory-item mt-3 flex justify-between gap-2 border-b border-dashed border-white/25 pb-2 text-sm"
                key={item.id}
              >
                <span className="min-w-0 truncate">{item.label}</span>
                <b>× {inventory[item.id]}</b>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#d5dfed]">
            Trang phục đã trang bị:{" "}
            <strong>
              {SHOP_ITEMS.find(item => item.id === equippedCosmetics.outfit)
                ?.label ?? "Chưa chọn"}
            </strong>
            <br />
            Dấu vết:{" "}
            <strong>
              {SHOP_ITEMS.find(item => item.id === equippedCosmetics.trail)
                ?.label ?? "Chưa chọn"}
            </strong>
          </p>
        </aside>
      </div>

      {rewardSet && (
        <div
          className="mt-6 border-2 border-[#172a48] bg-[#172a48] p-4 text-white shadow-[5px_5px_0_#f6b73c]"
          role="status"
        >
          <p className="font-mono text-[10px] font-black tracking-[.15em] text-[#f6b73c]">
            DẤU MỐC SƯU TẬP MỚI
          </p>
          <b className="mt-1 block font-display text-2xl">
            {rewardSet.motif} {rewardSet.label} hoàn tất!
          </b>
          <p className="mt-1 text-sm text-[#d5dfed]">
            Đã đóng dấu thưởng một lần:{" "}
            <strong className="text-[#f6b73c]">
              +{rewardSet.bonusGold} Gold · +{rewardSet.bonusXp} XP
            </strong>
            .
          </p>
        </div>
      )}

      <section
        className={`mt-6 border-2 border-[#172a48] p-5 shadow-[4px_4px_0_#172a48] ${activeSet ? "bg-[#fff0b6]" : "bg-[#eef1fb]"}`}
      >
        <p className="section-kicker">TỦ TRANG PHỤC · COMPANION</p>
        <h2 className="font-display text-3xl font-black">
          Đeo dấu hiệu cho hành trình
        </h2>
        {activeSet && (
          <div className="mt-4 border-2 border-[#172a48] bg-[#172a48] p-3 text-white shadow-[3px_3px_0_#f6b73c]">
            <b className="font-display text-xl text-[#f6b73c]">
              {activeSet.motif} {activeSet.label} đã hoàn tất!
            </b>
            <p className="mt-1 text-xs text-[#d5dfed]">
              {activeSet.note} Companion của em đang tỏa sáng trên tuyến đường.
            </p>
          </div>
        )}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {cosmeticItems.map(item => {
            const isEquipped = equippedCosmetics[item.slot!] === item.id;
            return (
              <article
                key={item.id}
                className="shop-wardrobe-card flex items-center justify-between gap-3 border-2 border-[#172a48] bg-[#fffdf6] p-3"
              >
                <ShopItemIllustration
                  itemId={item.id}
                  className="h-16 w-16 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <b className="font-display text-xl">{item.label}</b>
                  <p className="mt-1 text-xs text-[#476275]">
                    {inventory[item.id]
                      ? "Đã lưu trong Kho đồ."
                      : "Chưa mua tại Shop."}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!inventory[item.id]}
                  onClick={() => setMessage(equipCosmetic(item.id).message)}
                  className={`border-2 border-[#172a48] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#172a48] disabled:opacity-40 ${isEquipped ? "bg-[#f6b73c]" : "bg-white"}`}
                >
                  {isEquipped ? "Đang dùng" : "Trang bị"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6 border-2 border-[#172a48] bg-[#e8f0e4] p-5 shadow-[5px_5px_0_#172a48]">
        <div className="flex items-center gap-2">
          <HeartPulse size={18} />
          <div>
            <p className="section-kicker">PHIẾU CHĂM SÓC GUARDIAN</p>
            <h2 className="font-display text-3xl font-black">
              Hồi sinh lực đội của em
            </h2>
          </div>
        </div>
        {owned.length === 0 ? (
          <p className="mt-4 border-2 border-dashed border-[#172a48] bg-[#fffdf6] p-4 text-sm">
            Em chưa có guardian nào trong Bộ sưu tập. Hoàn thành một trạm để thu
            phục bạn đồng hành đầu tiên.
          </p>
        ) : (
          <>
            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {owned.map(guardian => {
                const currentHp = guardianHp(guardian.id);
                return (
                  <button
                    type="button"
                    key={guardian.id}
                    onClick={() => setSelectedGuardian(guardian.id)}
                    className={`min-w-36 border-2 border-[#172a48] p-2 text-left shadow-[2px_2px_0_#172a48] ${guardian.id === activeId ? "bg-[#172a48] text-white" : "bg-[#fffdf6]"}`}
                  >
                    <img
                      src={guardian.sprite}
                      alt=""
                      className="mx-auto h-16 w-16 object-contain"
                    />
                    <b className="mt-1 block text-sm">{guardian.name}</b>
                    <small
                      className={
                        guardian.id === activeId
                          ? "text-[#f6b73c]"
                          : "text-[#58708b]"
                      }
                    >
                      {currentHp}/100 HP
                    </small>
                  </button>
                );
              })}
            </div>
            {activeGuardian && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-2 border-[#172a48] bg-[#fffdf6] p-4">
                <div>
                  <b className="font-display text-2xl">{activeGuardian.name}</b>
                  <p className="mt-1 text-sm text-[#476275]">
                    Sinh lực tự hồi <strong>20 HP mỗi giờ</strong> từ lần bị sát
                    thương gần nhất.
                  </p>
                  <div className="mt-3 h-3 w-64 max-w-full overflow-hidden border border-[#172a48] bg-[#f5efdf]">
                    <div
                      className="h-full bg-[#ee6b4e]"
                      style={{ width: `${hp}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {healingItems.map(item => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        setMessage(
                          useHealingItem(item.id, activeGuardian.id).message
                        )
                      }
                      disabled={!inventory[item.id]}
                      className="border-2 border-[#172a48] bg-[#f6b73c] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#172a48] disabled:opacity-40"
                    >
                      Dùng {item.heal} HP
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {message && (
          <p
            className="mt-4 flex items-center gap-2 border border-[#244e4a] bg-[#fffdf6] p-3 text-sm font-bold text-[#244e4a]"
            role="status"
          >
            <Sparkles size={15} /> {message}
          </p>
        )}
      </section>
    </section>
  );
}
