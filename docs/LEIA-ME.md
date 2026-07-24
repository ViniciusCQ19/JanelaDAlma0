# Site Janela D'Alma

Pasta pronta para publicar no GitHub Pages (ou outro host estático) e apontar um domínio.

A página inicial do site é `index.html` (na raiz desta pasta).

## Estrutura

```
site-janela-dalma/
├── index.html                          ← Início (desktop)
├── inicio-mobile.html                  ← Início (versão mobile de referência)
├── LEIA-ME.md
├── assets/
│   ├── css/                            ← Estilos (hero, fold, crônicas, contos…)
│   ├── js/                             ← Scripts (GSAP, hero, fold, pensadores)
│   ├── imagens/
│   │   ├── logos/                      ← Logo Janela D'Alma
│   │   ├── inicio/                     ← Fotos e cards da home
│   │   ├── cronicas/                   ← Retrato / imagens das crônicas
│   │   ├── culturas/                   ← Retrato / imagens de Culturas da Humanidade
│   │   └── pensadores/                 ← Retratos dos pensadores
│   └── midia/
│       └── videos/                     ← Vídeo de transição do hero
└── paginas/
    ├── 01-cronicas-da-existencia/
    │   ├── index.html                  ← Grade de crônicas
    │   └── contos/
    │       └── 12-saida-pela-direita/
    │           └── index.html          ← Conto publicado
    ├── 02-culturas-da-humanidade/
    │   └── index.html                  ← Culturas / Momentos que viraram memórias
    └── 03-pensadores/
        └── index.html                  ← Galeria de pensadores
```

## Como publicar no GitHub Pages

O GitHub Pages só aceita pasta `/` (raiz) ou `/docs`.

Neste repositório, o site publicado fica em **`docs/`**.

1. Em **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **`/docs`** (obrigatório)
5. Salve e aguarde 1–2 minutos
6. Abra: `https://viniciuscq19.github.io/JanelaDAlma0/`
7. Em **Custom domain**, informe o domínio desejado (opcional)

## Mapa rápido das seções

| Pasta / arquivo | Conteúdo |
|-----------------|----------|
| `index.html` | Home Janela D'Alma |
| `paginas/01-cronicas-da-existencia/` | Crônicas da Existência |
| `paginas/01-…/contos/12-saida-pela-direita/` | Conto “Saída pela Direita” |
| `paginas/02-culturas-da-humanidade/` | Culturas da Humanidade |
| `paginas/03-pensadores/` | Pensadores |
| `assets/` | CSS, JS, imagens e vídeo |

## Observação

Os arquivos HTML originais na raiz do repositório (`JaneladaAlma1.html`, `HorizontesDaMinhaM.html`, etc.) continuam no projeto de trabalho.  
**Para o site público e o domínio, use apenas `site-janela-dalma/`.**
