export const FEATURES = [
    {
        icon: "auto_awesome",
        title: "Génération Low-Code IA",
        description: "Décrivez votre besoin en langage naturel. Katappult génère automatiquement les entités, services, API REST et interfaces en quelques secondes.",
    },
    {
        icon: "code",
        title: "Vibe Coding avec Claude Code",
        description: "Itérez en conversation avec Claude Code directement dans votre terminal. Chaque agent connaît votre architecture et respecte vos conventions.",
    },
    {
        icon: "rocket_launch",
        title: "Du prototype à la production",
        description: "Stack Java 21 + Spring Boot + Next.js 15 générée, testée et prête à déployer sur GCP en un seul pipeline.",
    },
];

function ClaudeCodeLogo() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Claude Code">
            <rect width="36" height="36" rx="8" fill="#CC785C" />
            <path
                d="M10 25L14.5 11H17L21.5 25H19L17.9 21.5H13.6L12.5 25H10ZM14.2 19.5H17.3L15.75 14.5L14.2 19.5Z"
                fill="white"
            />
            <path
                d="M22 19C22 16.24 24.24 14 27 14V16C25.34 16 24 17.34 24 19C24 20.66 25.34 22 27 22V24C24.24 24 22 21.76 22 19Z"
                fill="white"
            />
        </svg>
    );
}

export default function KatappultAiHome() {
    return <>
        <div style={{maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px"}}>

            {/* ── Hero logos ── */}
            <div className="flex items-center justify-center gap-4 mb-10">
                <img
                    src="/images/klog-blue.svg"
                    alt="Katappult"
                    style={{height: 44}}
                />
                <span style={{fontSize: 20, color: "var(--text-muted, #94a3b8)", fontWeight: 300}}>×</span>
                <div className="flex items-center gap-2">
                    <ClaudeCodeLogo/>
                    <span
                        className="font-bold"
                        style={{fontSize: 18, fontFamily: "Manrope, sans-serif", color: "var(--text-primary)"}}
                    >
                        Claude Code
                    </span>
                </div>
            </div>

            {/* ── Headline ── */}
            <div className="text-center mb-6">
                <h1
                    className="font-bold leading-tight mb-4"
                    style={{
                        fontSize: "clamp(28px, 5vw, 48px)",
                        fontFamily: "Manrope, sans-serif",
                        color: "var(--text-primary)",
                    }}
                >
                    La plateforme Low-Code IA<br/>
                    <span style={{color: "var(--color-1, #2563eb)"}}>propulsée par le Vibe Coding</span>
                </h1>
                <p
                    className="mx-auto"
                    style={{
                        fontSize: 17,
                        lineHeight: 1.7,
                        color: "var(--text-secondary, #64748b)",
                        maxWidth: 640,
                        fontFamily: "Manrope, sans-serif",
                    }}
                >
                    Katappult.ai est une plateforme Low-Code intégrée à Claude Code via MCP — elle génère
                    l'architecture, le code et les interfaces pendant que Claude Code itère pour affiner chaque détail.
                </p>
            </div>

            {/* ── Badge ── */}
            <div className="flex justify-center mb-12">
                <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                        background: "rgba(37, 99, 235, 0.08)",
                        color: "var(--color-1, #2563eb)",
                        fontFamily: "Manrope, sans-serif",
                        border: "1px solid rgba(37, 99, 235, 0.2)",
                    }}
                >
                    <span className="material-symbols-outlined" style={{fontSize: 16}}>bolt</span>
                    Générez · Itérez · Déployez
                </span>
            </div>

            {/* ── Feature cards ── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 20,
                }}
            >
                {FEATURES.map((feature) => (
                    <div
                        key={feature.icon}
                        className="rounded-2xl p-6"
                        style={{
                            background: "var(--card-bg, #ffffff)",
                            border: "1px solid var(--card-border, #e5e7eb)",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        }}
                    >
                        <div
                            className="flex items-center justify-center rounded-xl mb-4"
                            style={{
                                width: 44,
                                height: 44,
                                background: "rgba(37, 99, 235, 0.08)",
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{fontSize: 22, color: "var(--color-1, #2563eb)"}}
                            >
                                {feature.icon}
                            </span>
                        </div>
                        <h3
                            className="font-bold mb-2"
                            style={{
                                fontSize: 15,
                                fontFamily: "Manrope, sans-serif",
                                color: "var(--text-primary)",
                            }}
                        >
                            {feature.title}
                        </h3>
                        <p
                            style={{
                                fontSize: 13,
                                lineHeight: 1.65,
                                color: "var(--text-secondary, #64748b)",
                                margin: 0,
                            }}
                        >
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Footer note ── */}
            <p
                className="text-center mt-12"
                style={{
                    fontSize: 12,
                    color: "var(--text-muted, #94a3b8)",
                    fontFamily: "Manrope, sans-serif",
                }}
            >
                Propulsé par Katappult AI Platform · Agents alimentés par Claude Sonnet
            </p>
        </div>
    </>
}