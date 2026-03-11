"use client";

import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Activity, Bot, MapPin, Percent, TrendingUp } from "lucide-react";
import { fetchLeads, type Lead, type Sentiment } from "@/lib/api";

const getSentimentBadge = (sentiment: string | null) => {
  if (!sentiment) return { variant: "outline" as const, label: "—" };

  switch (sentiment) {
    case "Positive":
      return { variant: "positive" as const, label: "Positivo" };
    case "Neutral":
      return { variant: "neutral" as const, label: "Neutro / Misto" };
    case "Price Objection":
      return { variant: "negative" as const, label: "Objeção: Preço" };
    case "Timing Objection":
      return { variant: "negative" as const, label: "Objeção: Tempo" };
    default:
      return { variant: "outline" as const, label: sentiment };
  }
};

const chartData = [
  { region: "SP", pharmaciesPer100k: 95, gdpPerCapita: 48000 },
  { region: "RJ", pharmaciesPer100k: 82, gdpPerCapita: 42000 },
  { region: "MG", pharmaciesPer100k: 70, gdpPerCapita: 35000 },
  { region: "PR", pharmaciesPer100k: 68, gdpPerCapita: 34000 },
  { region: "RS", pharmaciesPer100k: 64, gdpPerCapita: 33000 },
  { region: "BA", pharmaciesPer100k: 55, gdpPerCapita: 26000 },
  { region: "PE", pharmaciesPer100k: 52, gdpPerCapita: 25000 }
];

const FALLBACK_LEADS: Lead[] = [
  {
    name: "Drogaria Paulista 24h",
    city: "São Paulo - SP",
    whatsapp: "(11) 98765-4321",
    maps_rating: 4.6,
    last_analyzed_review: "Equipe atenciosa, estoque completo e entrega super rápida.",
    ai_sentiment: "Positive"
  },
  {
    name: "Farmácia Popular Minas Pharma",
    city: "Belo Horizonte - MG",
    whatsapp: "(31) 99999-8888",
    maps_rating: 4.1,
    last_analyzed_review: "Bom atendimento, mas poderia melhorar o tempo de espera no caixa.",
    ai_sentiment: "Neutral"
  },
  {
    name: "Drogaria Rio Mais",
    city: "Rio de Janeiro - RJ",
    whatsapp: "(21) 97777-6666",
    maps_rating: 3.4,
    last_analyzed_review: "Faltam alguns medicamentos básicos e o atendimento é demorado.",
    ai_sentiment: "Timing Objection"
  }
];

function sentimentBadgeVariant(sentiment: Sentiment) {
  if (sentiment === "positive") return "positive" as const;
  if (sentiment === "negative") return "negative" as const;
  return "neutral" as const;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>(FALLBACK_LEADS);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLeadsLoading(true);
    setLeadsError(null);
    fetchLeads()
      .then((data) => {
        if (!cancelled) setLeads(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLeadsError(err instanceof Error ? err.message : "Failed to load leads");
          setLeads(FALLBACK_LEADS);
        }
      })
      .finally(() => {
        if (!cancelled) setLeadsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border/60 bg-gradient-to-b from-slate-950/80 to-slate-900/80 px-6 py-5 md:flex">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/40">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/70">
              SMB Market Intel
            </p>
            <p className="text-sm text-muted-foreground">Brazil · Farma</p>
          </div>
        </div>

        <nav className="space-y-1 text-sm text-muted-foreground/90">
          <div className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
            Overview
          </div>
          <button className="flex w-full items-center justify-between rounded-md bg-secondary/60 px-3 py-2 text-xs font-medium text-foreground shadow-sm ring-1 ring-emerald-500/20">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Painel de Inteligência
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-emerald-300">
              Live
            </span>
          </button>

          <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs hover:bg-secondary/40">
            <span className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Playbooks de Aquisição
            </span>
          </button>

          <div className="mt-6 mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
            Filtros
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-md border border-border/50 bg-black/10 px-3 py-2">
              <span className="text-muted-foreground/80">Segmento</span>
              <span className="text-foreground/90">Farmácias</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border/50 bg-black/10 px-3 py-2">
              <span className="text-muted-foreground/80">Região</span>
              <span className="text-foreground/90">Brasil · urbano</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border/50 bg-black/10 px-3 py-2">
              <span className="text-muted-foreground/80">Ticket médio</span>
              <span className="text-foreground/90">R$ 18 - R$ 65</span>
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-100">
            <p className="mb-1 font-medium uppercase tracking-[0.16em] text-emerald-300">
              AI Coverage
            </p>
            <p className="text-[0.7rem] text-emerald-100/90">
              87% das farmácias mapeadas já possuem análise de sentimento em
              tempo real.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-4 md:px-7 md:py-6">
        {/* Top bar */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              Inteligência de Mercado · SMB Farma
            </h1>
            <p className="text-xs text-muted-foreground">
              Sinais de demanda local, densidade de farmácias e retorno
              estimado por microrregião no Brasil.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1 text-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Atualizado há 7 min
            </span>
            <span className="hidden md:inline text-muted-foreground/70">
              Base: Google Maps · IBGE · Receita Federal
            </span>
          </div>
        </header>

        {/* Metric row */}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="border-border/70 bg-gradient-to-br from-slate-900/70 to-slate-950/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total de Farmácias</CardTitle>
              <MapPin className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold tracking-tight">
                  138.742
                </p>
                <span className="text-[0.7rem] text-muted-foreground">
                  CNPJs ativos · Brasil
                </span>
              </div>
              <p className="mt-2 text-[0.7rem] text-emerald-300/90">
                +4.2% de abertura líquida nos últimos 12 meses.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-gradient-to-br from-slate-900/70 to-slate-950/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Taxa de Conversão por IA</CardTitle>
              <Percent className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold tracking-tight">19,8%</p>
                <span className="text-[0.7rem] text-muted-foreground">
                  Campanhas com roteiros otimizados
                </span>
              </div>
              <p className="mt-2 text-[0.7rem] text-sky-300/90">
                +6,1 p.p. vs. roteiro manual em cohorts equivalentes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-gradient-to-br from-emerald-900/40 via-slate-950/40 to-emerald-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>ROI Estimado</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold tracking-tight">4,7x</p>
                <span className="text-[0.7rem] text-muted-foreground">
                  Janela de 12 meses
                </span>
              </div>
              <p className="mt-2 text-[0.7rem] text-emerald-300/90">
                Playbooks focados em regiões com alta densidade e baixo share
                da marca.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Chart + side panel */}
        <section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Card className="border-border/70 bg-gradient-to-br from-slate-950/80 to-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle>Density vs. GDP</CardTitle>
                <p className="text-[0.7rem] text-muted-foreground">
                  Relação entre densidade de farmácias por 100k habitantes e
                  PIB per capita por UF.
                </p>
              </div>
            </CardHeader>
            <CardContent className="h-[260px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 8, left: -12, bottom: 4 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.25)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="region"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "rgba(148, 163, 184, 0.9)", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "rgba(148, 163, 184, 0.9)", fontSize: 11 }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "rgba(148, 163, 184, 0.8)", fontSize: 10 }}
                    tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(15 23 42)",
                      borderRadius: 8,
                      border: "1px solid rgba(148, 163, 184, 0.25)",
                      padding: 10
                    }}
                    labelStyle={{
                      color: "rgba(148, 163, 184, 0.9)",
                      fontSize: 11
                    }}
                    itemStyle={{
                      fontSize: 11
                    }}
                    formatter={(value, name) =>
                      name === "gdpPerCapita"
                        ? [`R$ ${Number(value).toLocaleString("pt-BR")}`, "PIB per capita"]
                        : [`${value} / 100k hab.`, "Densidade de farmácias"]
                    }
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="pharmaciesPer100k"
                    stroke="#34d399"
                    strokeWidth={2.2}
                    dot={{ strokeWidth: 1.5, r: 4, stroke: "#22c55e", fill: "#0f172a" }}
                    activeDot={{ r: 5.2 }}
                    name="Densidade"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="gdpPerCapita"
                    stroke="#38bdf8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                    name="PIB per capita"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-gradient-to-br from-slate-950/80 to-slate-900/80">
            <CardHeader className="space-y-1 pb-3">
              <CardTitle>Recomendações de Mercado</CardTitle>
              <p className="text-[0.7rem] text-muted-foreground">
                Regiões com alta densidade, bom PIB per capita e sentimento
                positivo em reviews.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2.5">
                <div>
                  <p className="text-[0.75rem] font-medium text-emerald-100">
                    SP · Pinheiros · Vila Madalena
                  </p>
                  <p className="text-[0.7rem] text-emerald-100/80">
                    Alta concentração de farmácias independentes com boa
                    avaliação e baixa penetração de grandes redes.
                  </p>
                </div>
                <Badge variant="positive" className="whitespace-nowrap">
                  Prioridade A
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border/60 bg-black/20 px-3 py-2.5">
                <div>
                  <p className="text-[0.75rem] font-medium">
                    BH · Savassi · Funcionários
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground">
                    Ticket médio elevado, alta densidade, mas reclamações de
                    ruptura de estoque.
                  </p>
                </div>
                <Badge variant="neutral" className="whitespace-nowrap">
                  Testar roteiro AI
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border/60 bg-black/20 px-3 py-2.5">
                <div>
                  <p className="text-[0.75rem] font-medium">
                    RJ · Barra da Tijuca
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground">
                    Densidade alta, reviews negativos sobre atendimento. Oportuno
                    para playbook de experiência.
                  </p>
                </div>
                <Badge variant="negative" className="whitespace-nowrap">
                  Risco · Experiência
                </Badge>
              </div>

              <div className="mt-2 flex items-center justify-between text-[0.7rem] text-muted-foreground">
                <span>
                  Modelos fine-tuned em{" "}
                  <span className="text-emerald-300">720k reviews</span> e{" "}
                  <span className="text-emerald-300">42k leads</span>.
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Leads table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Leads mapeados · Google Maps
              </h2>
              <p className="text-[0.7rem] text-muted-foreground">
                Amostra das farmácias capturadas via scraping, enriquecidas com
                sentimento de review via IA.
              </p>
            </div>
            <span className="hidden text-[0.7rem] text-muted-foreground md:inline">
              Ordenado por relevância · últimos 30 dias
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drogaria/Farmácia</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Avaliação Maps</TableHead>
                <TableHead>Última Avaliação Analisada</TableHead>
                <TableHead>Sentimento da Objeção</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    Carregando leads…
                  </TableCell>
                </TableRow>
              ) : leadsError ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-amber-300">
                    {leadsError} (exibindo amostra estática)
                  </TableCell>
                </TableRow>
              ) : null}
              {!leadsLoading && leads.map((lead) => (
                <TableRow key={lead.whatsapp || lead.name}>
                  {/* 1. Name */}
                  <TableCell className="font-medium text-foreground">
                    {lead.name}
                  </TableCell>
                  
                  {/* 2. City (Removed the fake neighborhood) */}
                  <TableCell>
                    {lead.city}
                  </TableCell>

                  {/* 3. WhatsApp (New!) */}
                  <TableCell>
                    {lead.whatsapp}
                  </TableCell>

                  {/* 4. Maps Rating */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">
                        {lead.maps_rating != null
                          ? Number(lead.maps_rating).toFixed(1)
                          : "—"}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[0.7rem] text-muted-foreground">
                        / 5.0
                      </span>
                    </div>
                  </TableCell>

                  {/* 5. Review */}
                  <TableCell className="max-w-md text-[0.7rem] text-muted-foreground">
                    “{lead.last_analyzed_review ?? "—"}”
                  </TableCell>

                  {/* 6. Sentiment Badge */}
                  <TableCell>
                    <Badge variant={getSentimentBadge(lead.ai_sentiment).variant}>
                      {getSentimentBadge(lead.ai_sentiment).label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
}

