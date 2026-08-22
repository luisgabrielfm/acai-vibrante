/**
 * Uva-Doce Pop: landing page brasileira de açaí com cartazes sobrepostos,
 * blocos de roxo intenso, amarelo-manteiga, creme e rosa chiclete.
 */
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  Bike,
  ChevronRight,
  Clock3,
  Instagram,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const STORE_PHONE = "5511999999999";
const WHATSAPP_URL = `https://wa.me/${STORE_PHONE}`;

const productMenu = [
  {
    id: "morango",
    name: "Morango & Granola",
    ingredients: "Açaí, morango, banana, granola e leite em pó.",
    price: 19.9,
    image: "/manus-storage/acai-vibrante-morango-granola_be3585b7.png",
    tone: "cream",
  },
  {
    id: "pacoca",
    name: "Paçoca Cremosa",
    ingredients: "Açaí, paçoca, Nutella, banana e leite em pó.",
    price: 22.9,
    image: "/manus-storage/acai-vibrante-pacoca-nutella_4a242e5f.png",
    tone: "yellow",
  },
  {
    id: "choco",
    name: "Banana Choco",
    ingredients: "Açaí, banana, granola, chocolate e calda especial.",
    price: 21.9,
    image: "/manus-storage/acai-vibrante-banana-choco_da865e53.png",
    tone: "pink",
  },
];

const sizes = {
  300: { label: "300ml", price: 14.9, caption: "pra matar a vontade" },
  500: { label: "500ml", price: 18.9, caption: "o queridinho" },
  700: { label: "700ml", price: 23.9, caption: "fome de verdade" },
} as const;

const toppings = [
  { id: "morango", label: "Morango", price: 2.5, color: "#ff5c93" },
  { id: "banana", label: "Banana", price: 2, color: "#f4c842" },
  { id: "granola", label: "Granola", price: 2.5, color: "#f3b13b" },
  { id: "leite", label: "Leite em pó", price: 2, color: "#fff7e7" },
  { id: "pacoca", label: "Paçoca", price: 2.5, color: "#d79442" },
  { id: "nutella", label: "Nutella", price: 3.5, color: "#8b513b" },
  { id: "chocolate", label: "Chocolate", price: 2.5, color: "#5c342c" },
  { id: "kiwi", label: "Kiwi", price: 2.5, color: "#83c86b" },
] as const;

type SizeKey = keyof typeof sizes;
type ToppingId = (typeof toppings)[number]["id"];
type CartItem = {
  id: string;
  name: string;
  extras: string[];
  unitPrice: number;
  quantity: number;
};

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

function Sticker({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={`sticker ${className}`}>{children}</span>;
}

export default function Home() {
  const [selectedSize, setSelectedSize] = useState<SizeKey>(500);
  const [selectedToppings, setSelectedToppings] = useState<ToppingId[]>([
    "banana",
    "granola",
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const customPrice = useMemo(() => {
    const toppingPrice = toppings
      .filter((topping) => selectedToppings.includes(topping.id))
      .reduce((sum, topping) => sum + topping.price, 0);
    return sizes[selectedSize].price + toppingPrice;
  }, [selectedSize, selectedToppings]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const toggleTopping = (toppingId: ToppingId) => {
    setSelectedToppings((current) =>
      current.includes(toppingId)
        ? current.filter((id) => id !== toppingId)
        : [...current, toppingId],
    );
  };

  const addToCart = (name: string, unitPrice: number, extras: string[] = []) => {
    const matchingItem = cart.find(
      (item) =>
        item.name === name &&
        item.unitPrice === unitPrice &&
        item.extras.join("|") === extras.join("|"),
    );

    if (matchingItem) {
      setCart((current) =>
        current.map((item) =>
          item.id === matchingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart((current) => [
        ...current,
        {
          id: `${Date.now()}-${name}`,
          name,
          extras,
          unitPrice,
          quantity: 1,
        },
      ]);
    }
    toast.success("Entrou no seu copo!", {
      description: `${name} foi adicionado ao carrinho.`,
    });
  };

  const addCustomAçaí = () => {
    const extras = selectedToppings.map(
      (id) => toppings.find((topping) => topping.id === id)?.label ?? id,
    );
    addToCart(`Açaí do seu jeito — ${sizes[selectedSize].label}`, customPrice, extras);
  };

  const updateQuantity = (id: string, direction: 1 | -1) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + direction }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const scrollToBuilder = () => {
    document.getElementById("monte")?.scrollIntoView({ behavior: "smooth" });
  };

  const finishOrder = () => {
    if (cart.length === 0) {
      toast.error("Seu carrinho ainda está vazio.", {
        description: "Escolha um açaí ou monte o seu para continuar.",
      });
      scrollToBuilder();
      return;
    }

    const lines = cart.flatMap((item) => [
      `• ${item.quantity}x ${item.name} — ${formatBRL(item.unitPrice * item.quantity)}`,
      ...(item.extras.length ? [`  Complementos: ${item.extras.join(", ")}`] : []),
    ]);
    const message = [
      "Oi, Açaí Vibrante! Quero fazer este pedido:",
      "",
      ...lines,
      "",
      `Total: ${formatBRL(total)}`,
      "",
      "Pode confirmar o prazo de entrega?",
    ].join("\n");
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const openWhatsApp = () => {
    if (cart.length) {
      finishOrder();
      return;
    }
    window.open(
      `${WHATSAPP_URL}?text=${encodeURIComponent("Oi, Açaí Vibrante! Quero pedir meu açaí. 🍇")}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fff6df] text-[#331046]">
      <header className="relative z-30 bg-[#4c146d] text-[#fff6df]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Açaí Vibrante, início">
            <img
              src="/manus-storage/acai-vibrante-logo_b6b85965.png"
              alt="Símbolo Açaí Vibrante"
              className="h-11 w-11 object-contain md:h-12 md:w-12"
            />
            <span className="font-display text-xl tracking-[-0.08em] md:text-2xl">AÇAÍ<br />VIBRANTE</span>
          </a>

          <nav className="hidden items-center gap-7 font-body text-xs font-extrabold uppercase tracking-[0.14em] lg:flex">
            <a className="nav-link" href="#cardapio">Cardápio</a>
            <a className="nav-link" href="#monte">Monte o seu</a>
            <a className="nav-link" href="#delivery">Delivery</a>
          </nav>

          <button
            onClick={scrollToBuilder}
            className="cart-trigger"
            aria-label={`Abrir montagem, ${totalItems} item(ns) no carrinho`}
          >
            <ShoppingBag size={18} strokeWidth={2.8} />
            <span className="hidden sm:inline">SEU COPO</span>
            <span className="cart-count">{totalItems}</span>
          </button>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero-shell relative isolate overflow-hidden bg-[#4c146d] text-[#fff6df]">
          <div className="hero-dot-pattern" aria-hidden="true" />
          <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#ff5c93] opacity-95 md:-left-12 md:top-40" aria-hidden="true" />
          <div className="absolute -right-16 top-2 h-44 w-44 rounded-full border-[16px] border-[#f5c942]" aria-hidden="true" />
          <div className="absolute right-[22%] top-20 text-[#f5c942]" aria-hidden="true"><Sparkles size={58} fill="currentColor" strokeWidth={1.5} /></div>

          <div className="mx-auto grid min-h-[640px] max-w-[1440px] items-center gap-3 px-5 pb-16 pt-10 md:min-h-[690px] md:grid-cols-[0.95fr_1.05fr] md:px-10 md:pb-24 md:pt-12">
            <div className="relative z-10 order-2 max-w-2xl md:order-1">
              <div className="mb-6 flex items-center gap-3 font-body text-[11px] font-black uppercase tracking-[0.18em] text-[#f5c942]">
                <span className="h-[2px] w-12 bg-[#f5c942]" />
                todo dia é dia de açaí
              </div>
              <h1 className="font-display max-w-[760px] text-[clamp(3.6rem,8.3vw,8.4rem)] leading-[0.83] tracking-[-0.078em]">
                AÇAÍ DO<br />
                <span className="inline-block text-[#f5c942] [-webkit-text-stroke:2px_#331046]">JEITO</span> QUE<br />
                VOCÊ AMA<span className="text-[#ff5c93]">!</span>
              </h1>
              <p className="mt-7 max-w-md font-body text-base font-semibold leading-relaxed text-[#fff6df]/90 md:text-lg">
                Monte seu copo, escolha seus complementos e peça agora. Cremoso, geladinho e com a sua cara.
              </p>
              <button onClick={scrollToBuilder} className="cta-button mt-8">
                MONTAR MEU AÇAÍ <ArrowDownRight size={22} strokeWidth={3} />
              </button>
            </div>

            <div className="relative order-1 mx-auto flex h-[360px] w-full max-w-xl items-center justify-center md:order-2 md:h-[600px] md:max-w-2xl">
              <div className="hero-blob" aria-hidden="true" />
              <img
                src="/manus-storage/acai-vibrante-hero_c360181f.png"
                alt="Copo grande de açaí cremoso com frutas, granola, paçoca e chocolate"
                className="hero-product relative z-10 h-[420px] w-auto object-contain drop-shadow-[0_24px_28px_rgba(20,1,35,0.42)] md:h-[650px]"
              />
              <Sticker className="absolute left-1 top-10 -rotate-[14deg] bg-[#f5c942] text-[#331046] md:left-4 md:top-24">TÁ<br />GELADO</Sticker>
              <Sticker className="absolute bottom-7 right-0 rotate-[9deg] bg-[#ff5c93] text-[#fff6df] md:bottom-16 md:right-1">TOPPINGS<br />A MAIS</Sticker>
              <span className="absolute bottom-1 left-1/4 font-display text-4xl text-[#fff6df] md:bottom-8 md:text-6xl">YUM!</span>
            </div>
          </div>
          <div className="relative z-10 -mb-px h-12 bg-[#fff6df] [clip-path:polygon(0_52%,8%_72%,18%_42%,32%_69%,44%_35%,55%_70%,72%_37%,84%_75%,100%_45%,100%_100%,0_100%)]" />
        </section>

        <section id="cardapio" className="relative bg-[#fff6df] px-5 pb-24 pt-14 md:px-10 md:pb-32 md:pt-20">
          <div className="absolute left-0 top-16 h-40 w-40 rounded-full bg-[#ff5c93]/20 blur-3xl" aria-hidden="true" />
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-10 flex flex-col items-start justify-between gap-5 md:mb-14 md:flex-row md:items-end">
              <div>
                <span className="section-kicker bg-[#ff5c93] text-[#fff6df]">SEU MOMENTO FAVORITO</span>
                <h2 className="section-title mt-5 text-[#4c146d]">ESCOLHA<br />SEU AÇAÍ</h2>
              </div>
              <p className="max-w-sm font-body text-base font-semibold leading-relaxed text-[#5a3867] md:pb-2">
                Combinações que já chegam prontas pra fazer seu dia mais gostoso.
              </p>
            </div>

            <div className="grid gap-7 md:grid-cols-3 md:gap-8">
              {productMenu.map((product, index) => (
                <article className={`menu-card menu-card-${product.tone}`} key={product.id}>
                  <div className="relative h-[292px] overflow-hidden border-b-[3px] border-[#331046] md:h-[330px]">
                    <span className="absolute left-5 top-5 z-10 rounded-full border-[2px] border-[#331046] bg-[#fff6df] px-3 py-1 font-body text-[10px] font-black uppercase tracking-[0.14em] text-[#331046]">
                      {index === 0 ? "mais pedido" : index === 1 ? "viciado em paçoca" : "novo queridinho"}
                    </span>
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center transition duration-500 hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#331046]/20 to-transparent" />
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-3xl leading-[0.88] tracking-[-0.055em] text-[#331046]">{product.name}</h3>
                      <span className="shrink-0 font-display text-2xl tracking-[-0.06em] text-[#4c146d]">{formatBRL(product.price)}</span>
                    </div>
                    <p className="mt-3 min-h-11 font-body text-sm font-semibold leading-snug text-[#5a3867]">{product.ingredients}</p>
                    <button className="add-button mt-5 w-full" onClick={() => addToCart(product.name, product.price)}>
                      ADICIONAR <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="monte" className="relative bg-[#f5c942] px-5 py-20 md:px-10 md:py-28">
          <div className="builder-lines" aria-hidden="true" />
          <div className="mx-auto grid max-w-[1320px] gap-9 lg:grid-cols-[1.08fr_.72fr] lg:items-start">
            <div className="relative z-10">
              <span className="section-kicker bg-[#4c146d] text-[#fff6df]">LIVRE PRA CAPRICHAR</span>
              <h2 className="section-title mt-5 text-[#331046]">MONTE<br />SEU AÇAÍ</h2>
              <p className="mt-4 max-w-lg font-body text-base font-bold leading-relaxed text-[#4a243d]">
                Escolhe o tamanho, joga os complementos e deixa o copo com a sua cara.
              </p>

              <div className="builder-panel mt-8">
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="builder-label">1. QUAL É A FOME?</h3>
                    <span className="font-body text-xs font-black uppercase tracking-wider text-[#4c146d]">açaí bem cremoso</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {([300, 500, 700] as SizeKey[]).map((size) => {
                      const item = sizes[size];
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`size-choice ${selectedSize === size ? "size-choice-active" : ""}`}
                          aria-pressed={selectedSize === size}
                        >
                          <span className="font-display text-3xl tracking-[-0.07em]">{item.label}</span>
                          <span className="font-body text-xs font-extrabold">{item.caption}</span>
                          <strong>{formatBRL(item.price)}</strong>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-9">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="builder-label">2. O QUE VAI JUNTO?</h3>
                    <span className="font-body text-xs font-black uppercase tracking-wider text-[#4c146d]">cada extra soma no total</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {toppings.map((topping) => {
                      const active = selectedToppings.includes(topping.id);
                      return (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping.id)}
                          className={`topping-choice ${active ? "topping-choice-active" : ""}`}
                          aria-pressed={active}
                        >
                          <span className="topping-dot" style={{ backgroundColor: topping.color }} />
                          {topping.label}
                          <b>+{formatBRL(topping.price)}</b>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-9 flex flex-col justify-between gap-5 border-t-[3px] border-dashed border-[#331046]/50 pt-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-body text-xs font-black uppercase tracking-[0.12em] text-[#5a3867]">seu copo tá dando</p>
                    <p className="font-display text-5xl tracking-[-0.07em] text-[#4c146d]">{formatBRL(customPrice)}</p>
                  </div>
                  <button onClick={addCustomAçaí} className="cta-button cta-button-dark">
                    ADICIONAR AO COPO <ShoppingBag size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            <aside className="cart-panel relative z-10 lg:sticky lg:top-5" aria-label="Seu carrinho">
              <div className="flex items-center justify-between border-b-[3px] border-[#331046] pb-4">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={25} strokeWidth={2.8} />
                  <h3 className="font-display text-3xl tracking-[-0.06em]">SEU COPO</h3>
                </div>
                <span className="rounded-full bg-[#ff5c93] px-3 py-1 font-body text-xs font-black text-[#fff6df]">{totalItems} ITENS</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-dashed border-[#4c146d] text-[#4c146d]"><ShoppingBag size={28} /></div>
                  <p className="mt-4 font-display text-2xl tracking-[-0.06em] text-[#4c146d]">TÁ VAZIO<br />POR ENQUANTO</p>
                  <p className="mx-auto mt-2 max-w-[220px] font-body text-sm font-semibold leading-snug text-[#5a3867]">Escolhe uma combinação ou monta o seu copo aqui do lado.</p>
                </div>
              ) : (
                <div className="max-h-[360px] divide-y-2 divide-[#331046]/15 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div className="py-4" key={item.id}>
                      <div className="flex gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-body text-sm font-black leading-tight text-[#331046]">{item.name}</h4>
                          {item.extras.length > 0 && <p className="mt-1 font-body text-xs font-semibold leading-snug text-[#5a3867]">{item.extras.join(" · ")}</p>}
                        </div>
                        <button onClick={() => removeItem(item.id)} className="rounded-full p-1.5 text-[#5a3867] transition hover:bg-[#ff5c93] hover:text-white" aria-label={`Remover ${item.name}`}><Trash2 size={15} /></button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item.id, -1)} aria-label="Diminuir quantidade"><Minus size={14} strokeWidth={3} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} aria-label="Aumentar quantidade"><Plus size={14} strokeWidth={3} /></button>
                        </div>
                        <strong className="font-display text-xl tracking-[-0.06em] text-[#4c146d]">{formatBRL(item.unitPrice * item.quantity)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 border-t-[3px] border-[#331046] pt-4">
                <div className="flex items-end justify-between">
                  <span className="font-body text-xs font-black uppercase tracking-[0.15em]">total</span>
                  <strong className="font-display text-4xl tracking-[-0.07em]">{formatBRL(total)}</strong>
                </div>
                <button onClick={finishOrder} className="whatsapp-button mt-5 w-full">
                  <MessageCircle size={20} fill="currentColor" /> FINALIZAR PEDIDO
                </button>
                <p className="mt-3 text-center font-body text-[11px] font-bold leading-snug text-[#5a3867]">Você confere tudo no WhatsApp antes da confirmação.</p>
              </div>
            </aside>
          </div>
        </section>

        <section id="delivery" className="relative overflow-hidden bg-[#ff5c93] px-5 py-20 text-[#331046] md:px-10 md:py-28">
          <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[20px] border-[#f5c942]" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-[#4c146d] [clip-path:polygon(0_100%,0_42%,15%_69%,30%_31%,43%_65%,59%_25%,76%_71%,88%_38%,100%_61%,100%_100%)]" aria-hidden="true" />
          <div className="relative z-10 mx-auto grid max-w-[1320px] items-center gap-10 md:grid-cols-[1fr_.7fr]">
            <div>
              <span className="section-kicker bg-[#fff6df] text-[#4c146d]">DELIVERY PRA VALER</span>
              <h2 className="section-title mt-5 max-w-2xl text-[#331046]">PEDIU,<br />CHEGOU! <span className="inline-block -rotate-12">🚀</span></h2>
              <p className="mt-5 max-w-md font-body text-lg font-bold leading-relaxed text-[#4a243d]">Seu açaí favorito chegando rapidinho na sua porta. Só escolher e chamar.</p>
              <button onClick={openWhatsApp} className="cta-button cta-button-dark mt-8">PEDIR PELO WHATSAPP <ChevronRight size={22} strokeWidth={3} /></button>
            </div>
            <div className="relative mx-auto flex aspect-square max-w-[350px] items-center justify-center rounded-[42%_58%_44%_56%/55%_42%_58%_45%] border-[5px] border-[#331046] bg-[#f5c942] shadow-[10px_11px_0_#331046]">
              <Bike size={158} strokeWidth={2.2} />
              <Sticker className="absolute -right-8 top-3 rotate-[13deg] bg-[#4c146d] text-[#fff6df]">CHEGA<br />GELADO</Sticker>
              <Sparkles className="absolute bottom-7 left-7 text-[#ff5c93]" size={44} fill="currentColor" strokeWidth={1.5} />
            </div>
          </div>
        </section>

        <section className="relative bg-[#fff6df] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="section-kicker bg-[#f5c942] text-[#331046]">COMUNIDADE VIBRANTE</span>
                <h2 className="section-title mt-5 text-[#4c146d]">O QUE A GALERA<br />ACHOU? <span className="text-[#ff5c93]">♥</span></h2>
              </div>
              <p className="max-w-xs font-body text-sm font-bold leading-relaxed text-[#5a3867]">Avaliações reais aparecem aqui depois de confirmadas com quem pediu.</p>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {["Sua próxima colherada", "O primeiro pedido da semana", "A foto mais gostosa do feed"].map((label, index) => (
                <article className={`review-reserved review-reserved-${index + 1}`} key={label}>
                  <span className="font-body text-[10px] font-black uppercase tracking-[0.18em] text-[#5a3867]">ESPAÇO PARA AVALIAÇÃO VERIFICADA</span>
                  <p className="mt-5 font-display text-3xl leading-[0.94] tracking-[-0.06em] text-[#331046]">{label} pode aparecer aqui.</p>
                  <div className="mt-6 flex items-center gap-2 border-t-2 border-[#331046]/20 pt-4 font-body text-xs font-black uppercase tracking-wider text-[#4c146d]">
                    <Instagram size={16} /> marque @acaivibrante
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-[#331046] px-5 pb-24 pt-14 text-[#fff6df] md:px-10 md:pb-14 md:pt-16">
        <div className="absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-[#ff5c93]" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[1.15fr_.8fr_.8fr_.8fr]">
          <div>
            <a href="#inicio" className="inline-flex items-center gap-3">
              <img src="/manus-storage/acai-vibrante-logo_b6b85965.png" alt="" className="h-14 w-14 object-contain" />
              <span className="font-display text-3xl leading-[0.83] tracking-[-0.08em]">AÇAÍ<br />VIBRANTE</span>
            </a>
            <p className="mt-5 max-w-xs font-body text-sm font-semibold leading-relaxed text-[#fff6df]/75">Copo cheio, dia feliz. Um açaí por vez, do nosso jeito bem gostoso.</p>
          </div>
          <div>
            <h3 className="footer-label">ONDE ESTAMOS</h3>
            <p className="footer-copy"><MapPin size={17} /> Rua da Fruta, 124<br />Vila do Sol — SP</p>
          </div>
          <div>
            <h3 className="footer-label">TAMO ABERTO</h3>
            <p className="footer-copy"><Clock3 size={17} /> Terça a domingo<br />12h às 22h</p>
          </div>
          <div>
            <h3 className="footer-label">CHAMA A GENTE</h3>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="footer-copy footer-link"><MessageCircle size={17} /> (11) 99999-9999</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-copy footer-link mt-3"><Instagram size={17} /> @acaivibrante</a>
          </div>
        </div>
        <div className="relative z-10 mx-auto mt-12 max-w-[1320px] border-t border-[#fff6df]/20 pt-5 font-body text-[11px] font-bold uppercase tracking-[0.13em] text-[#fff6df]/50">© 2026 Açaí Vibrante. Feito pra dar vontade.</div>
      </footer>

      <div className="mobile-cart-bar md:hidden">
        <button onClick={scrollToBuilder} className="flex min-w-0 items-center gap-2 text-left">
          <ShoppingBag size={19} />
          <span className="truncate font-body text-xs font-black uppercase tracking-wider">{totalItems ? `${totalItems} item(ns) · ${formatBRL(total)}` : "Monte seu copo"}</span>
        </button>
        <button onClick={finishOrder} className="rounded-full bg-[#f5c942] px-4 py-2 font-body text-[11px] font-black text-[#331046]">PEDIR</button>
      </div>

      <button onClick={openWhatsApp} className="whatsapp-float" aria-label="Pedir pelo WhatsApp">
        <MessageCircle size={26} fill="currentColor" strokeWidth={2.5} />
      </button>
    </div>
  );
}
