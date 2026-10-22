# Site vitrine DCR — Domingues Construction Rénovation

Site statique (HTML, CSS, JavaScript, sans outil de compilation), construit d’après l’export Claude Design « Site vitrine DCR Domingues ».

## Fichiers

```
index.html      la page
css/style.css   la mise en forme
js/main.js      menu mobile, avant/après, avis, formulaire, animations
images/         les photos
```

Pour le voir : double-cliquez sur `index.html`. Pour le mettre en ligne : envoyez tout le dossier chez un hébergeur de sites statiques (Netlify, OVH, o2switch, GitHub Pages…).

## Remplacer les photos

Pour remplacer une photo, gardez **le même nom de fichier**.

**Photos de DCR (vrais chantiers).** Les photos de l’avant / après sont des miniatures de 229 px, c’est pourquoi elles restent affichées en petit format. Remplacez-les par les originaux dès que possible :

| Fichier | Emplacement |
|---|---|
| `hero-detail-robinetterie.jpg` | Détail à côté du texte d’accueil (découpé dans `hero-douche-faience.jpg`, la seule photo HD de DCR, qui n’est plus affichée mais reste dans le dossier) |
| `avant-apres-sdb-avant.jpg` / `avant-apres-sdb-apres.jpg` | Comparateur avant / après |

**Photos d’illustration (Unsplash, libres de droits).** Elles sont utilisées dans les cartes « Savoir-faire » et « Réalisations ». Ce ne sont pas des chantiers DCR : remplacez celles des Réalisations par vos propres photos dès que possible. La licence Unsplash n’exige pas de crédit, mais les voici :

| Fichier | Photographe | Source |
|---|---|---|
| `hero-terrasse.jpg` (grande photo de l’accueil) | Tile Merchant Ireland | unsplash.com/photos/sTNjUy-vyT0 |
| `savoir-faire-cuisine.jpg` | Clay Banks | unsplash.com/photos/XU_ODlSO9ac |
| `savoir-faire-salle-de-bains.jpg` | Smart Renovations | unsplash.com/photos/Ies-rhvusTs |
| `savoir-faire-interieurs.jpg` | Jean-Luc Benazet | unsplash.com/photos/oOvzE2L-n1A |
| `savoir-faire-construction.jpg` | Brett Jordan | unsplash.com/photos/jEP4vsHrSM8 |
| `realisation-salle-de-bains.jpg` | Protex Plastering | unsplash.com/photos/hWEEDRZxBDg |
| `realisation-terrasse.jpg` | Tile Merchant Ireland | unsplash.com/photos/bMOwrJLFQJY |
| `realisation-cuisine.jpg` | Clay Banks | unsplash.com/photos/mhDeeOvBs9o |
| `realisation-douche.jpg` | Lotus Design N Print | unsplash.com/photos/g51F6-WYzyU |

Pas encore de photo : le portrait d’Alexandre Domingues (pour l’instant, c’est la carte au logo DCR).

Pour ajouter un chantier au comparateur avant / après, dupliquez le bouton `ba-tab` dans `index.html` et changez ses attributs `data-before`, `data-after` et `data-caption`. Les onglets apparaissent dès qu’il y a deux chantiers.

## Formulaire de devis

- **Sur Netlify** : il marche tel quel (Netlify Forms). Les demandes arrivent dans le tableau de bord Netlify, qui peut les renvoyer par e-mail.
- **Ailleurs** : créez un formulaire gratuit sur formspree.io, puis ajoutez son adresse sur la balise `<form>` : `action="https://formspree.io/f/xxxxxxx"`.
- Tant que rien n’est branché (ou en ouvrant le fichier directement), un message invite le visiteur à appeler le 06 69 97 77 27.

## À compléter

- Pages « Mentions légales » et « Confidentialité » (obligatoires pour une entreprise). Elles sont affichées en pied de page, mais pas encore rédigées.
- Adresse définitive du site, à ajouter dans les balises `og:` une fois le nom de domaine choisi.
