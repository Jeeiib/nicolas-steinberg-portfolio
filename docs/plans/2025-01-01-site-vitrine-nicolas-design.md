# Site Vitrine Nicolas Steinberg — Design Document

## Vue d'ensemble

Site vitrine personal branding pour Nicolas Steinberg, professionnel de l'hôtellerie de luxe 5 étoiles (Guest Experience Leader). L'objectif est de créer une présence digitale élégante incarnant son style : "Quiet Luxury", précision, leadership calme.

**Style** : Old Money / Minimalisme Aristocratique / Luxe non-ostentatoire

---

## Stack Technique

```
Next.js 14 (App Router)
├── Tailwind CSS (styling)
├── Framer Motion (animations)
├── TypeScript (type safety)
└── next/font (polices optimisées)
```

**Hébergement** : Vercel + domaine OVH

---

## Structure du Projet

```
src/
├── app/
│   ├── layout.tsx          # Layout principal + fonts
│   ├── page.tsx            # Page unique (one-page)
│   └── globals.css         # Variables CSS + Tailwind
├── components/
│   ├── Header.tsx          # Sticky nav glassmorphism
│   ├── Hero.tsx            # Section 100vh
│   ├── Philosophy.tsx      # Les 3 principes
│   ├── Expertise.tsx       # Domaines stratégiques
│   ├── Stratege.tsx        # Section outil IA Gems
│   ├── Portfolio.tsx       # Réalisations chiffrées
│   ├── Contact.tsx         # Email + LinkedIn
│   └── Footer.tsx          # Copyright minimal
├── lib/
│   └── animations.ts       # Variants Framer Motion réutilisables
└── assets/
    └── images/             # Photos de Nicolas
```

---

## Palette de Couleurs

| Variable | Hex | Usage |
|----------|-----|-------|
| `--obsidian` | `#0D0D0D` | Fond principal |
| `--emerald-dark` | `#1B4332` | Accents |
| `--brass` | `#B8860B` | Détails luxe |
| `--paper` | `#FAF9F6` | Texte principal |
| `--paper-muted` | `#A8A8A0` | Texte secondaire |

---

## Typographie

| Usage | Police | Desktop | Mobile |
|-------|--------|---------|--------|
| Nom (Hero) | Playfair Display | 72px | 40px |
| Titres sections | Playfair Display | 48px | 32px |
| Sous-titres | DM Sans Medium | 24px | 18px |
| Corps | DM Sans Regular | 18px | 16px |
| Navigation | DM Sans Medium | 14px | 12px |

---

## Espacements

- **Entre sections** : 200px desktop / 120px mobile
- **Padding sections** : 80px horizontal desktop / 24px mobile
- **Max-width contenu** : 1200px (centré)

---

## Header

- Sticky, ultra-fin
- Glassmorphism : `rgba(13, 13, 13, 0.7)` + `backdrop-filter: blur(12px)`
- Border bottom : `1px solid rgba(184, 134, 11, 0.1)` (laiton subtil)
- Menu : Philosophie — Expertise — Stratège — Réalisations — Contact
- Navigation par ancres avec smooth scroll

---

## Sections

### 1. Hero (100vh)

- Photo portrait centrée
- Nom : **NICOLAS STEINBERG** (Playfair Display, 72px)
- Signature : *"L'art de la précision. L'exigence du détail. La maîtrise de l'invisible."*
- Indicateur scroll subtil (flèche ou chevron animé)

### 2. Philosophie

**Titre** : Principes Directeurs

**Contenu** :
1. **I. On ne présume jamais.**
   L'anticipation est la clé de l'excellence. Dans l'hôtellerie de luxe, le silence de l'invité n'est pas une satisfaction, c'est une donnée à interpréter.

2. **II. Oui ou Non.**
   La clarté est une marque de respect. L'entre-deux est une perte de temps opérationnelle. Décider vite, agir avec justesse.

3. **III. Rien n'est grave.**
   Le sang-froid est le socle de l'autorité. Maîtriser l'imprévisible avec distance pour garantir la continuité de l'expérience.

**Conclusion** : *"Le luxe n'est pas une question de moyens, mais de standards."*

**Layout** : 3 blocs empilés verticalement, séparés par des lignes fines laiton

### 3. Expertise

**Titre** : Expertise Stratégique

**Domaines** :
1. **Standards d'Excellence** — Définition et implémentation de protocoles opérationnels de haut niveau. Formation aux pratiques et codes du luxe international.

2. **Ingénierie de la Réputation** — Pilotage stratégique de l'image de marque et optimisation chirurgicale des classements et de la e-réputation.

3. **Management & Leadership** — Direction d'équipes en environnements complexes et haute gestion de la performance opérationnelle.

**Layout** : 3 colonnes desktop / empilées mobile

### 4. Stratège (Outil IA)

**Ancre** : `#stratege`

**Design spécifique** : Fond Noir Obsidienne (légère rupture visuelle)

**Sur-titre** (couleur Laiton) : INGÉNIERIE NUMÉRIQUE

**Titre** : STRATÈGE

**Description** : *"Modélisation exclusive de mes méthodes d'analyse et standards opérationnels. J'ai condensé mon expertise au sein d'un Gems personnalisé pour offrir un accès direct à ma vision stratégique et à mes recommandations, de manière instantanée."*

**Bouton CTA** :
- Texte : ACCÉDER AU GEMS "STRATÈGE" (VIA GEMINI)
- Style : Ghost Button (contour 1px Laiton brossé)
- Icône : Flèche de sortie ↗ (indique lien externe)
- Action : Ouvre dans nouvel onglet → `https://gemini.google.com/gem/15BXEgs3nCiF4ZO9Vv6M1lkNvCgj6apBN?usp=sharing`

**Note de bas de section** (typographie très petite, paper-muted) :
*"Outil propriétaire développé sur l'interface Google Gemini. Nécessite un compte Google."*

**Contraintes** :
- Aucun logo Google coloré — tout monochrome (Blanc/Noir/Laiton)
- Design qui reflète autorité et technologie sans paraître "gadget"
- Responsive : texte percutant + bouton cliquable sur mobile

### 5. Réalisations

**Titre** : Performances

**Contenu** :
1. **Performance Opérationnelle** — Restructuration des flux de service pour une hausse mesurable de la satisfaction client et de la fluidité des opérations.

2. **Positionnement Marché** — Remontée stratégique dans les classements de référence.

3. **Optimisation des Standards** — Mise en conformité d'établissements de luxe avec les exigences de qualité les plus strictes du secteur.

**Animation spéciale** :
- Ligne horizontale fine (1px) couleur laiton
- Extrémité gauche : 1200 (gris anthracite discret)
- Extrémité droite : 100 (noir, s'illumine à l'arrivée)
- Point/barre dorée se déplace de 1200 vers 100
- Durée : 3 secondes, déclenchée au scroll
- Légende : *"Passage du 1200ème rang au Top 100 des établissements de référence."*

### 6. Contact

**Titre** : Discrétion & Collaboration

**Texte** : *"Pour toute collaboration d'exception, une seule voie de contact :"*

**Actions** :
- Bouton email : nicolas.steinberg.pro@gmail.com
- Bouton LinkedIn : lien profil

**Style boutons** : Ghost (bordure fine, fond transparent)

### 7. Footer

```
© 2025 Nicolas Steinberg. Tous droits réservés.
```

Minimaliste, centré, typographie petite.

---

## Animations

### Framer Motion Defaults

- **Fade-in** : durée 0.8s, ease-out, trigger à 20% viewport
- **Stagger** : 0.15s entre éléments d'une liste
- **Animation ranking** : 3s, ease-in-out, déclenchée au scroll

### Variants réutilisables

```typescript
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}
```

---

## Responsive

- Breakpoint principal : 768px (md)
- Mobile-first approach
- Toutes les colonnes → empilées sur mobile
- Réduction typographie selon tableau ci-dessus
- Header : menu hamburger optionnel (ou scroll horizontal discret)

---

## Assets requis

- [ ] Photo portrait Nicolas (haute résolution)
- [ ] Photo secondaire optionnelle (pour Hero ou autre section)

---

## Notes

- Aucun stock-shot générique
- Ton : Direct, professionnel, sans fioriture émotionnelle
- Navigation : fade-in uniquement, aucune animation ostentatoire
