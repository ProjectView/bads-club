# Rentabilité ProjectView — deal Bad's Club

> **Document interne ProjectView.** À ne pas envoyer au client.
> Permet de vérifier la marge sur le deal Bad's, sur 3 ans, infra incluse.

## Hypothèses

| Paramètre | Valeur |
|---|---|
| Prix de vente setup | 8 000 € HT |
| Loyer mensuel | 500 € HT |
| TJM moyen équipe ProjectView | 500 € HT (Bernard backend) / 400 € (Adelin design) |
| Charge dev setup phase 1+2+3+go-live | ~25 jours équivalent senior (mixte Bernard/Adelin) |
| Charge maintenance récurrente | 4 h/mois inclus = 0,5 jour/mois = 6 jours/an |
| Volume Bad's | ~1 500 tx/mois, ~100/jour, panier ~25 € |

## Revenus

| Période | Setup | Loyer (12 × 500 €) | **Revenus** |
|---|---|---|---|
| An 1 | 8 000 € | 6 000 € | **14 000 €** |
| An 2 | — | 6 000 € | **6 000 €** |
| An 3 | — | 6 000 € | **6 000 €** |
| **Total 3 ans** | 8 000 € | 18 000 € | **26 000 €** |

## Coûts

### Dev setup (one-shot an 1)

Estimation par phase (en jours équivalents 1 personne senior TJM 500 €) :

| Phase | Durée semaines | Charge dev |
|---|---|---|
| Phase 1 MVP (auth, résa, Crédit Mutuel, notifs, espace membre+admin) | 4-5 | 12 j |
| Phase 2 Communauté (groupes, chat, file d'attente, récurrence) | 3 | 7 j |
| Phase 3 Studio comm' (éditeur articles, IA reformat, publication) | 2 | 4 j |
| Go-live (migration data, formation, bascule) | 1 | 2 j |
| **Total** | **10-11 sem.** | **~25 j** |

**Coût dev** = 25 j × 500 € = **12 500 € HT**.

> ⚠️ Marge fine sur le setup : 8 000 − 12 500 = **−4 500 €**. C'est le coût d'acquisition de ce 1er client.
> Compensé par les loyers récurrents (cf. ROI ci-dessous) et amorti à 0 dès qu'on revend Pulse à un 2ᵉ club.

### Maintenance récurrente

4 h/mois incluses dans le loyer (maintenance + monitoring + mises à jour sécurité + évolutions mineures).

- 4 h/mois × 12 = 48 h/an = **6 jours/an**
- 6 × 500 = **3 000 €/an** de charge

### Infrastructure (services tiers)

Volume estimé pour Bad's (1 500 tx/mois, ~420 adhérents actifs, 20 000 clients en base) :

| Service | Plan | Coût mensuel | Coût annuel |
|---|---|---|---|
| **Firebase** Spark (free) — Auth, Firestore, FCM, Functions, Storage | Free jusqu'à 50k MAU | 0 € | 0 € |
| **Brevo** emails (< 9 000/mois inclus) | Free | 0 € | 0 € |
| **Brevo** SMS (rappel critique uniquement, ~200/mois × 0,045 €) | Pay-per-use | ~9 € | ~110 € |
| **Netlify** Starter (< 100 GB bandwidth) | Free | 0 € | 0 € |
| **Domaine** custom | OVH/Gandi | ~1 € | ~12 € |
| **N8N** hébergé chez ProjectView (mutualisé) | — | 0 € | 0 € |
| **Total infra** | | **~10 €/mois** | **~120 €/an** |

À mesure de la croissance (volumes plus élevés en an 2-3) :
- Firebase Blaze pay-as-you-go : ~5-10 €/mois supplémentaires
- Brevo plan Starter si > 9k emails/mois : +25 €/mois éventuel
- Netlify Pro si bandwidth dépassé : +19 €/mois éventuel

Estimation prudente :
- **An 1 : 10 €/mois = 120 €/an**
- **An 2 : 25 €/mois = 300 €/an**
- **An 3 : 40 €/mois = 480 €/an**

### Total coûts par année

| Année | Dev setup | Maintenance | Infra | **Coûts totaux** |
|---|---|---|---|---|
| An 1 | 12 500 € | 3 000 € | 120 € | **15 620 €** |
| An 2 | — | 3 000 € | 300 € | **3 300 €** |
| An 3 | — | 3 000 € | 480 € | **3 480 €** |
| **Total 3 ans** | 12 500 € | 9 000 € | 900 € | **22 400 €** |

## Marge nette ProjectView

| Année | Revenus | Coûts | **Marge nette** | Marge cumulée |
|---|---|---|---|---|
| An 1 | 14 000 € | 15 620 € | **−1 620 €** | −1 620 € |
| An 2 | 6 000 € | 3 300 € | **+2 700 €** | +1 080 € |
| An 3 | 6 000 € | 3 480 € | **+2 520 €** | +3 600 € |
| **Total 3 ans** | **26 000 €** | **22 400 €** | **+3 600 €** | |

**Analyse** :
- L'an 1 est légèrement déficitaire (−1 620 €) — le setup ne couvre pas entièrement le dev custom.
- Break-even atteint **mi-an 2** (récurrent rentable dès le 1er loyer).
- Marge brute sur 3 ans : **+3 600 €** (~14 % de marge nette sur les 26 k€ encaissés).

## Levier Pulse — mutualisation sur N clients

Bad's est le **1er client Pulse**. Le code, l'architecture, les composants, le design system sont construits une fois et réutilisables. Pour les clients suivants, le setup custom se réduit à :

- Personnalisation visuelle (logo, photos, copy) : ~3 jours
- Wiring spécifique (compte Firebase dédié, Crédit Mutuel négocié par le client) : ~2 jours
- Migration data depuis l'outil existant : ~3 jours
- Recette, formation, go-live : ~2 jours
- **Total** : **~10 jours = 5 000 €** de coût dev par client suivant

Avec setup à 8 000 € prix vente :
- Marge brute setup an 1 client n°2 : **+3 000 €** (vs −4 500 € pour Bad's)
- Marge nette an 1 client n°2 : 14 000 − 5 000 − 3 000 − 120 = **+5 880 €**

## Projection 3 ans avec 4 clients (1 + 3 nouveaux)

| Année | Clients actifs | Setups | Loyers (× 6 k€) | Coûts dev | Coûts maintenance | Coûts infra | **Marge nette** |
|---|---|---|---|---|---|---|---|
| An 1 | 1 (Bad's) | 8 k€ | 6 k€ | −12,5 k€ | −3 k€ | −0,1 k€ | **−1,6 k€** |
| An 2 | 2 (Bad's + #2) | 8 k€ | 12 k€ | −5 k€ | −6 k€ | −0,6 k€ | **+8,4 k€** |
| An 3 | 4 (Bad's + 3) | 16 k€ | 24 k€ | −10 k€ | −12 k€ | −1,6 k€ | **+16,4 k€** |
| **Total** | | **32 k€** | **42 k€** | **−27,5 k€** | **−21 k€** | **−2,3 k€** | **+23,2 k€** |

À mesure que la base de clients Pulse grandit, la marge s'accroît proportionnellement, avec **0 effort marketing additionnel** par client (le 1er client = vitrine).

## Conclusion

- **Sur Bad's seul : équilibre fin sur 3 ans**, marge modeste mais positive (+3 600 € net).
- **Avec mutualisation Pulse à 4 clients sur 3 ans : marge nette +23 k€**, soit ~25 % de marge sur les revenus.
- Bad's a une **valeur stratégique > valeur financière** sur ce deal : c'est notre case study, notre vitrine et notre socle Pulse v1.

## Leviers d'optimisation (si on veut creuser la marge)

1. **Réduire la charge dev setup** : 25 j → 18 j en réutilisant un design system pré-construit + composants génériques (gain : +3 500 € marge).
2. **Augmenter le loyer** : 500 € → 700 €/mois (gain : +2 400 €/an récurrent).
3. **Setup + 1ʳᵉ année packagé** : facturer 14 000 € en 1 fois à la signature (cashflow immédiat, sécurise an 1).
4. **Forfait setup variable selon volume** : 8 k€ jusqu'à 1500 tx/mois, +50% au-delà.
5. **Quick wins facturés au TJM** : chaque chatbot custom, intégration tierce, etc. = revenu additionnel hors forfait.
