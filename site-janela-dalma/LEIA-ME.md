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

## Como publicar no GitHub

1. Crie um repositório no GitHub (ex.: `janela-dalma`).
2. Faça push **desta pasta** (ou do repositório inteiro, usando esta pasta como raiz do Pages).
3. Em **Settings → Pages**, escolha a branch `main` e a pasta `/` (raiz) **se** o repositório contiver só este site;  
   se o repositório for o “Banco de Referências” completo, configure Pages para servir `site-janela-dalma/` (ou publique só esta pasta em um repo separado).
4. Depois, em **Settings → Pages → Custom domain**, informe o domínio desejado.

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
