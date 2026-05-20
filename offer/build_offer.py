"""
Génère le document d'offre commerciale ProjectView × Bad's Club.

Modèle :
- Setup : 3 000 € HT one-shot
- Abonnement : 500 € HT / mois (hébergement + maintenance + évolutions mineures)

Sections incluses :
- Page de garde
- Contexte / enjeux
- Comparatif Doinsport vs solution proposée
- Captures de la maquette
- Périmètre fonctionnel
- Architecture technique
- Planning par phases
- Tarification
- Conditions IP / propriété du code
- Prochaines étapes
"""

from pathlib import Path
from datetime import date

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
    Frame,
    BaseDocTemplate,
)

ROOT = Path(__file__).parent
SCREENS = ROOT / "screens"
OUT = ROOT / "ProjectView - Offre Bad's Club.pdf"

# ----- Brand palette -----
NAVY = colors.HexColor("#0b0f1a")
INK = colors.HexColor("#1d2540")
CREAM = colors.HexColor("#f4ede0")
LIME = colors.HexColor("#a8d423")  # darker lime, more printable
LIME_BG = colors.HexColor("#eef9c8")
AMBER = colors.HexColor("#c14d2a")
MUTED = colors.HexColor("#6b7280")
BORDER = colors.HexColor("#e5e7eb")
RED = colors.HexColor("#e74c3c")
BLUE = colors.HexColor("#3498db")
GREEN = colors.HexColor("#27ae60")

# ----- Styles -----
styles = getSampleStyleSheet()

def style(name, **kw):
    base = styles["Normal"]
    s = ParagraphStyle(name, parent=base)
    for k, v in kw.items():
        setattr(s, k, v)
    return s

S_COVER_TITLE = style("CoverTitle", fontName="Times-Italic", fontSize=48, leading=52, textColor=NAVY)
S_COVER_SUBTITLE = style("CoverSubtitle", fontName="Helvetica", fontSize=14, leading=20, textColor=MUTED)
S_COVER_META = style("CoverMeta", fontName="Helvetica", fontSize=9, leading=14, textColor=MUTED, alignment=TA_LEFT)
S_COVER_EYEBROW = style("CoverEyebrow", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=LIME)

S_H1 = style("H1", fontName="Times-Italic", fontSize=32, leading=36, textColor=NAVY, spaceAfter=4)
S_EYEBROW = style("Eyebrow", fontName="Helvetica-Bold", fontSize=8, leading=12, textColor=LIME, spaceAfter=6)
S_H2 = style("H2", fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=NAVY, spaceBefore=10, spaceAfter=6)
S_BODY = style("Body", fontName="Helvetica", fontSize=10, leading=15, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=6)
S_BODY_LEFT = style("BodyLeft", fontName="Helvetica", fontSize=10, leading=15, textColor=INK, alignment=TA_LEFT, spaceAfter=6)
S_MUTED = style("Muted", fontName="Helvetica", fontSize=9, leading=13, textColor=MUTED, spaceAfter=4)
S_NOTE = style("Note", fontName="Helvetica-Oblique", fontSize=9, leading=13, textColor=MUTED, spaceAfter=4)
S_CAPTION = style("Caption", fontName="Helvetica", fontSize=8, leading=10, textColor=MUTED, alignment=TA_CENTER)
S_BIG_PRICE = style("BigPrice", fontName="Times-Italic", fontSize=40, leading=44, textColor=LIME)
S_PRICE_LABEL = style("PriceLabel", fontName="Helvetica", fontSize=10, leading=14, textColor=INK)
S_CELL = style("Cell", fontName="Helvetica", fontSize=9, leading=12, textColor=INK)
S_CELL_BOLD = style("CellBold", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=NAVY)


# ----- Page templates -----
PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
MARGIN_Y = 18 * mm


def header_footer(canvas, doc):
    canvas.saveState()
    # Footer rule
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, MARGIN_Y - 4 * mm, PAGE_W - MARGIN_X, MARGIN_Y - 4 * mm)
    # Footer text
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN_X, MARGIN_Y - 9 * mm, "ProjectView · Offre Bad’s Club · Confidentiel")
    canvas.drawRightString(PAGE_W - MARGIN_X, MARGIN_Y - 9 * mm, f"Page {doc.page}")
    # Header rule (except first page)
    if doc.page > 1:
        canvas.setStrokeColor(BORDER)
        canvas.line(MARGIN_X, PAGE_H - MARGIN_Y + 4 * mm, PAGE_W - MARGIN_X, PAGE_H - MARGIN_Y + 4 * mm)
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(MARGIN_X, PAGE_H - MARGIN_Y + 6 * mm, "Refonte digitale Bad’s Club")
        canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - MARGIN_Y + 6 * mm, "ProjectView")
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState()
    # Background band
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - 90 * mm, PAGE_W, 90 * mm, fill=1, stroke=0)
    # Lime accent corner
    canvas.setFillColor(LIME)
    canvas.rect(0, PAGE_H - 8 * mm, PAGE_W, 8 * mm, fill=1, stroke=0)
    # Eyebrow on dark band
    canvas.setFont("Helvetica-Bold", 9)
    canvas.setFillColor(LIME)
    canvas.drawString(MARGIN_X, PAGE_H - 35 * mm, "OFFRE COMMERCIALE · MAI 2026")
    # Big title
    canvas.setFont("Times-Italic", 42)
    canvas.setFillColor(CREAM)
    canvas.drawString(MARGIN_X, PAGE_H - 55 * mm, "Refonte digitale")
    canvas.drawString(MARGIN_X, PAGE_H - 70 * mm, "Bad’s Club")
    # Subtitle on dark
    canvas.setFont("Helvetica", 11)
    canvas.setFillColor(CREAM)
    canvas.drawString(MARGIN_X, PAGE_H - 82 * mm, "Site, réservation, communauté, paiement, automatisation")
    # Lower content (light section)
    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica", 9)
    canvas.drawString(MARGIN_X, 110 * mm, "Préparée par")
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawString(MARGIN_X, 102 * mm, "ProjectView")
    canvas.setFont("Helvetica", 10)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN_X, 95 * mm, "Bernard Nguyen · backend & infra")
    canvas.drawString(MARGIN_X, 89 * mm, "Adelin · design & front")

    canvas.setFillColor(NAVY)
    canvas.setFont("Helvetica", 9)
    canvas.drawString(MARGIN_X, 75 * mm, "Destinataire")
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawString(MARGIN_X, 67 * mm, "Bad’s Club")
    canvas.setFont("Helvetica", 10)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN_X, 60 * mm, "43 rue Garibaldi · 69007 Lyon")
    canvas.drawString(MARGIN_X, 54 * mm, "Sport & Lounge depuis 1999")

    # Reference + date
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(PAGE_W - MARGIN_X, 40 * mm, f"Réf. PV-BADS-2026-001")
    canvas.drawRightString(PAGE_W - MARGIN_X, 34 * mm, f"Émis le {date.today().strftime('%d/%m/%Y')}")
    canvas.drawRightString(PAGE_W - MARGIN_X, 28 * mm, "Validité 30 jours")

    # Lime divider
    canvas.setStrokeColor(LIME)
    canvas.setLineWidth(2)
    canvas.line(MARGIN_X, 20 * mm, MARGIN_X + 60 * mm, 20 * mm)

    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN_X, 14 * mm, "Document confidentiel · réservé à Bad’s Club")
    canvas.restoreState()


# ----- Helpers -----

def h1(text, eyebrow=None):
    elems = []
    if eyebrow:
        elems.append(Paragraph(eyebrow.upper(), S_EYEBROW))
    elems.append(Paragraph(text, S_H1))
    elems.append(Spacer(1, 4 * mm))
    return elems


def h2(text):
    return Paragraph(text, S_H2)


def p(text):
    return Paragraph(text, S_BODY)


def screenshot(path, w_mm, caption=None):
    img = Image(str(path), width=w_mm * mm, height=(w_mm * mm) * 9 / 16)
    items = [img]
    if caption:
        items.append(Spacer(1, 2 * mm))
        items.append(Paragraph(caption, S_CAPTION))
    return KeepTogether(items)


def comparison_table():
    data = [
        [Paragraph("<b>Critère</b>", S_CELL_BOLD),
         Paragraph("<b>Doinsport (actuel)</b>", S_CELL_BOLD),
         Paragraph("<b>App Bad’s sur mesure</b>", S_CELL_BOLD)],

        [Paragraph("<b>Branding</b>", S_CELL_BOLD),
         Paragraph("Interface générique Doinsport · logo Bad’s en surimpression", S_CELL),
         Paragraph("Identité Bad’s 100 % · typo, couleurs et ton de marque cohérents", S_CELL)],

        [Paragraph("<b>Réservation terrain</b>", S_CELL_BOLD),
         Paragraph("Fonctionnelle · 5 sports · grille tarifaire par zone", S_CELL),
         Paragraph("Reprise complète · UX plus rapide · hold 8 min anti-conflits · live multi-utilisateurs", S_CELL)],

        [Paragraph("<b>Communauté / groupes</b>", S_CELL_BOLD),
         Paragraph("Module “Matchs” limité (pas de chat, pas de groupes thématiques)", S_CELL),
         Paragraph("Groupes thématiques · chat temps réel · récurrence automatique · réservation collective", S_CELL)],

        [Paragraph("<b>Paiement</b>", S_CELL_BOLD),
         Paragraph("Carnets de séances pré-payés", S_CELL),
         Paragraph("Stripe pay-as-you-go + remboursement automatique sur annulation", S_CELL)],

        [Paragraph("<b>Notifications</b>", S_CELL_BOLD),
         Paragraph("Email basique, pas de push", S_CELL),
         Paragraph("Push (PWA) + email + SMS Brevo · liste d’attente automatique sur annulation", S_CELL)],

        [Paragraph("<b>Communication marketing</b>", S_CELL_BOLD),
         Paragraph("Aucun outil intégré", S_CELL),
         Paragraph("Studio article · IA reformate pour Instagram / Facebook / LinkedIn · publication programmée", S_CELL)],

        [Paragraph("<b>App mobile</b>", S_CELL_BOLD),
         Paragraph("App store + web · double maintenance Doinsport", S_CELL),
         Paragraph("PWA installable directement depuis le site · pas de store · notifications push natives", S_CELL)],

        [Paragraph("<b>Évolutivité</b>", S_CELL_BOLD),
         Paragraph("Dépendant du roadmap Doinsport", S_CELL),
         Paragraph("Code propre à Bad’s · évolutions à la demande", S_CELL)],

        [Paragraph("<b>Coût mensuel</b>", S_CELL_BOLD),
         Paragraph("Abonnement Doinsport (~variable selon offre)", S_CELL),
         Paragraph("500 € HT / mois tout inclus (hébergement, maintenance, évolutions mineures)", S_CELL)],
    ]
    t = Table(data, colWidths=[36 * mm, 64 * mm, 74 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LIME_BG),
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, LIME),
        ("LINEABOVE", (0, 1), (-1, -1), 0.3, BORDER),
        ("LINEBELOW", (0, -1), (-1, -1), 0.3, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 1), (0, -1), colors.HexColor("#f9fafb")),
    ]))
    return t


def planning_table():
    data = [
        [Paragraph("<b>Phase</b>", S_CELL_BOLD),
         Paragraph("<b>Livrables</b>", S_CELL_BOLD),
         Paragraph("<b>Durée</b>", S_CELL_BOLD)],

        [Paragraph("<b>Phase 1<br/>MVP en ligne</b>", S_CELL_BOLD),
         Paragraph("Site vitrine refondu · auth membre/admin · réservation temps réel avec paiement Stripe · notifications email + push · espace membre · espace admin", S_CELL),
         Paragraph("4–5 semaines", S_CELL)],

        [Paragraph("<b>Phase 2<br/>Communauté</b>", S_CELL_BOLD),
         Paragraph("Groupes thématiques · chat temps réel · récurrence des sessions · file d’attente automatique · réservation collective", S_CELL),
         Paragraph("3 semaines", S_CELL)],

        [Paragraph("<b>Phase 3<br/>Studio comm’</b>", S_CELL_BOLD),
         Paragraph("Éditeur d’articles · reformatage IA pour Instagram / Facebook / LinkedIn · publication automatique · journal public", S_CELL),
         Paragraph("2 semaines", S_CELL)],

        [Paragraph("<b>Go-live</b>", S_CELL_BOLD),
         Paragraph("Migration des données depuis Doinsport · domaine custom · communication adhérents · formation admin · bascule en parallèle 1 semaine", S_CELL),
         Paragraph("1 semaine", S_CELL)],
    ]
    t = Table(data, colWidths=[35 * mm, 110 * mm, 28 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LIME_BG),
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, LIME),
        ("LINEABOVE", (0, 1), (-1, -1), 0.3, BORDER),
        ("LINEBELOW", (0, -1), (-1, -1), 0.3, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def pricing_table():
    data = [
        [Paragraph("<b>Setup initial</b><br/><font size=8 color='#6b7280'>One-shot · payé à la signature</font>", S_CELL_BOLD),
         Paragraph("Conception, développement, intégration, mise en ligne, formation et bascule depuis Doinsport.", S_CELL),
         Paragraph("<font name='Times-Italic' size='22'>3 000 €</font> HT", S_CELL)],

        [Paragraph("<b>Abonnement mensuel</b><br/><font size=8 color='#6b7280'>À partir du 2ème mois post-livraison</font>", S_CELL_BOLD),
         Paragraph("Hébergement, maintenance corrective, mises à jour de sécurité, évolutions mineures (jusqu’à 4h par mois), support email sous 48h ouvrées.", S_CELL),
         Paragraph("<font name='Times-Italic' size='22'>500 €</font> HT / mois", S_CELL)],

        [Paragraph("<b>Services tiers</b><br/><font size=8 color='#6b7280'>Refacturés au coût réel</font>", S_CELL_BOLD),
         Paragraph("Firebase (gratuit jusqu’à 50k utilisateurs actifs), Brevo (gratuit jusqu’à 9 000 emails/mois), Stripe (1,5 % + 0,25 € par transaction CB EU), SMS Brevo (~0,045 € par SMS).", S_CELL),
         Paragraph("Variable<br/><font size=8 color='#6b7280'>~5–15 € HT / mois estimés</font>", S_CELL)],

        [Paragraph("<b>Évolutions majeures</b><br/><font size=8 color='#6b7280'>Hors forfait mensuel</font>", S_CELL_BOLD),
         Paragraph("Nouveau module, refonte d’un parcours, intégration tierce : devis sur demande sur la base d’un taux journalier de 500 € HT.", S_CELL),
         Paragraph("Sur devis", S_CELL)],
    ]
    t = Table(data, colWidths=[48 * mm, 90 * mm, 35 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (-1, 0), 0.6, LIME),
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f9fafb")),
    ]))
    return t


def ip_table():
    data = [
        [Paragraph("<b>Élément</b>", S_CELL_BOLD),
         Paragraph("<b>Propriétaire après livraison</b>", S_CELL_BOLD),
         Paragraph("<b>Conditions</b>", S_CELL_BOLD)],

        [Paragraph("Code source applicatif", S_CELL),
         Paragraph("<b>Bad’s Club</b>", S_CELL_BOLD),
         Paragraph("Dépôt Git transféré ; licence d’exploitation perpétuelle, transférable, non exclusive cédée au client", S_CELL)],

        [Paragraph("Design, maquettes, identité visuelle dédiée", S_CELL),
         Paragraph("<b>Bad’s Club</b>", S_CELL_BOLD),
         Paragraph("Cession totale des droits patrimoniaux à compter du règlement final", S_CELL)],

        [Paragraph("Comptes des services tiers (Firebase, Brevo, Stripe, domaine)", S_CELL),
         Paragraph("<b>Bad’s Club</b>", S_CELL_BOLD),
         Paragraph("Créés au nom de Bad’s Club, ProjectView intervient comme administrateur délégué", S_CELL)],

        [Paragraph("Données utilisateurs et données métier", S_CELL),
         Paragraph("<b>Bad’s Club</b>", S_CELL_BOLD),
         Paragraph("Bad’s Club est responsable de traitement RGPD ; export libre à tout moment", S_CELL)],

        [Paragraph("Composants génériques et briques internes ProjectView", S_CELL),
         Paragraph("<b>ProjectView</b>", S_CELL_BOLD),
         Paragraph("Licence d’utilisation incluse dans le contrat, sans restriction d’usage pour Bad’s Club", S_CELL)],

        [Paragraph("Templates email / SMS / posts réseaux", S_CELL),
         Paragraph("<b>Bad’s Club</b>", S_CELL_BOLD),
         Paragraph("Modifiables librement par le client après livraison", S_CELL)],
    ]
    t = Table(data, colWidths=[55 * mm, 36 * mm, 83 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LIME_BG),
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, LIME),
        ("LINEABOVE", (0, 1), (-1, -1), 0.3, BORDER),
        ("LINEBELOW", (0, -1), (-1, -1), 0.3, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


# ----- Build -----

def build():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=MARGIN_Y + 6 * mm,
        bottomMargin=MARGIN_Y + 6 * mm,
        title="Offre Bad's Club — ProjectView",
        author="ProjectView",
    )

    frame_cover = Frame(0, 0, PAGE_W, PAGE_H, id="cover")
    frame_content = Frame(MARGIN_X, MARGIN_Y, PAGE_W - 2 * MARGIN_X, PAGE_H - 2 * MARGIN_Y - 6 * mm, id="content")

    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame_cover], onPage=cover_page),
        PageTemplate(id="content", frames=[frame_content], onPage=header_footer),
    ])

    story = []
    # Cover page is drawn by canvas onPage
    story.append(Spacer(1, 1))  # placeholder
    story.append(NextPageTemplate("content"))
    story.append(PageBreak())

    # ---- Section 1 : Contexte ----
    story += h1("Le contexte.", eyebrow="01 · Pourquoi ce projet")
    story.append(p(
        "Le Bad’s Club est installé depuis 1999 dans le 7ème arrondissement de Lyon, et propose "
        "13 terrains (badminton, squash, pétanque) ainsi qu’un tennis de table, un simulateur "
        "baseball et un bar-restaurant lounge. Le club fédère plus de 420 adhérents actifs."
    ))
    story.append(p(
        "La gestion des réservations et de la communication passe aujourd’hui par Doinsport, "
        "outil mutualisé qui répond aux besoins de base mais ne porte ni l’identité Bad’s, ni les "
        "fonctionnalités différenciantes qu’un club historique mérite : groupes thématiques, "
        "communication automatisée, expérience mobile native et marque cohérente."
    ))
    story.append(p(
        "Cette offre propose de construire — avec Bad’s Club et pour Bad’s Club — une application "
        "web et mobile sur mesure, capable de remplacer Doinsport et d’ouvrir de nouveaux leviers "
        "de fidélisation et de communication."
    ))

    story.append(Spacer(1, 6 * mm))
    story.append(h2("Les 5 piliers de la refonte"))
    pillars = [
        ("Site vitrine modernisé", "Une identité Bad’s assumée, en cohérence avec le sport-lounge et la marque historique."),
        ("Réservation temps réel", "Sur tous les sports, avec planning live, paiement Stripe et anti-conflit garanti."),
        ("Communauté d’adhérents", "Groupes thématiques (double mixte du jeudi, squash after-work, etc.), chat intégré, sessions récurrentes."),
        ("Paiement en ligne", "Stripe natif, tarification par zones temporelles, gestion des remboursements automatique."),
        ("Studio communication", "Éditeur d’articles avec reformatage IA pour Instagram, Facebook et LinkedIn ; publication programmée."),
    ]
    for title, desc in pillars:
        story.append(Paragraph(f"<b>{title}.</b> {desc}", S_BODY))

    story.append(PageBreak())

    # ---- Section 2 : Comparatif Doinsport ----
    story += h1("Doinsport vs solution Bad’s.", eyebrow="02 · Diagnostic et bénéfices")
    story.append(p(
        "L’étude ci-dessous compare votre outil actuel (Doinsport) à la solution sur mesure proposée. "
        "L’objectif n’est pas de remplacer pour remplacer mais d’apporter de la valeur sur les "
        "fonctionnalités qui font la différence : marque, communauté, communication, expérience mobile."
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(comparison_table())

    story.append(PageBreak())

    # ---- Section 3 : Maquette ----
    story += h1("La maquette en cours.", eyebrow="03 · Aperçu de la solution proposée")
    story.append(p(
        "Une maquette cliquable a été développée pour matérialiser la vision avant le démarrage. "
        "Elle couvre les 5 piliers listés ci-dessus, est testable en local et sera mise en ligne "
        "sur une URL de pré-production dès validation de cette offre. Les écrans ci-dessous sont "
        "fonctionnels, navigables, et donnent une bonne idée du rendu final."
    ))
    story.append(Spacer(1, 4 * mm))

    # Pairs of screenshots
    pairs = [
        ("01-home.png",              "Page d’accueil refondue · identité Bad’s 100 %"),
        ("02-reservation.png",       "Réservation temps réel · 5 sports · tarification par zones Rouge / Bleue / Verte"),
        ("03-communaute.png",        "Communauté d’adhérents · groupes thématiques"),
        ("04-groupe.png",            "Fiche d’un groupe · chat temps réel et réservation collective"),
        ("05-tarifs.png",            "Page tarifs publique · fidèle à la grille officielle"),
        ("10-mon-compte.png",        "Espace membre · réservations, abonnement, préférences notifications"),
        ("08-admin.png",             "Espace admin · éditeur d’article + reformatage IA + previews réseaux"),
        ("09-admin-notifications.png","Feed admin temps réel · toutes les notifications envoyées"),
    ]
    cell_w = 82 * mm
    cell_h = cell_w * 9 / 16
    for i in range(0, len(pairs), 2):
        left = pairs[i]
        right = pairs[i + 1] if i + 1 < len(pairs) else None

        img_left = Image(str(SCREENS / left[0]), width=cell_w, height=cell_h)
        img_left.hAlign = "LEFT"
        cap_left = Paragraph(left[1], S_CAPTION)

        if right:
            img_right = Image(str(SCREENS / right[0]), width=cell_w, height=cell_h)
            img_right.hAlign = "LEFT"
            cap_right = Paragraph(right[1], S_CAPTION)
        else:
            img_right = Paragraph("", S_CAPTION)
            cap_right = Paragraph("", S_CAPTION)

        row_table = Table(
            [[img_left, img_right], [cap_left, cap_right]],
            colWidths=[cell_w, cell_w],
            rowHeights=[cell_h, None],
        )
        row_table.setStyle(TableStyle([
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (0, 0), 0),
            ("TOPPADDING", (0, 1), (-1, 1), 2),
            ("BOTTOMPADDING", (0, 1), (-1, 1), 6),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        story.append(row_table)
        story.append(Spacer(1, 1 * mm))
        # Allow page break between pairs of rows
        if i in (2, 4, 6):
            pass  # natural flow will break

    story.append(PageBreak())

    # ---- Section 4 : Architecture ----
    story += h1("L’architecture technique.", eyebrow="04 · Choix techno et coûts services")
    story.append(p(
        "L’architecture proposée repose sur trois services tiers, choisis pour leur fiabilité, "
        "leur intégration native entre eux et leur coût marginal."
    ))
    arch_data = [
        [Paragraph("<b>Service</b>", S_CELL_BOLD),
         Paragraph("<b>Rôle</b>", S_CELL_BOLD),
         Paragraph("<b>Coût récurrent</b>", S_CELL_BOLD)],

        [Paragraph("<b>Firebase</b> (Google)", S_CELL_BOLD),
         Paragraph("Authentification, base de données temps réel (Firestore), stockage de fichiers, notifications push (FCM), fonctions serveur", S_CELL),
         Paragraph("0 € jusqu’à 50 000 utilisateurs actifs / mois", S_CELL)],

        [Paragraph("<b>Brevo</b> (ex-Sendinblue)", S_CELL_BOLD),
         Paragraph("Envoi d’emails transactionnels et de SMS via une seule API et un seul dashboard", S_CELL),
         Paragraph("0 € email jusqu’à 9 000/mois · SMS à 0,045 € pièce", S_CELL)],

        [Paragraph("<b>Vercel</b>", S_CELL_BOLD),
         Paragraph("Hébergement de l’application Next.js (front + API), CDN mondial, preview à chaque déploiement", S_CELL),
         Paragraph("0 € en formule Hobby · ~20 €/mois en formule Pro selon usage", S_CELL)],

        [Paragraph("<b>Stripe</b>", S_CELL_BOLD),
         Paragraph("Paiement carte bancaire, Apple Pay, Google Pay · remboursements automatiques", S_CELL),
         Paragraph("1,5 % + 0,25 € par transaction CB Europe · aucun frais fixe", S_CELL)],

        [Paragraph("<b>N8N</b> (déjà hébergé par ProjectView)", S_CELL_BOLD),
         Paragraph("Orchestration des notifications · routing email / SMS / Slack admin · automatisation publication réseaux", S_CELL),
         Paragraph("0 € (instance ProjectView)", S_CELL)],
    ]
    arch = Table(arch_data, colWidths=[40 * mm, 88 * mm, 46 * mm], repeatRows=1)
    arch.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LIME_BG),
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, LIME),
        ("LINEABOVE", (0, 1), (-1, -1), 0.3, BORDER),
        ("LINEBELOW", (0, -1), (-1, -1), 0.3, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(Spacer(1, 4 * mm))
    story.append(arch)
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(
        "<b>Application progressive (PWA).</b> L’application est conçue comme une Progressive Web App : "
        "elle s’installe en deux clics depuis le site, fonctionne hors-ligne pour consulter ses "
        "réservations, et envoie des notifications push natives — sans passer par les stores Apple et "
        "Google, sans coût et sans maintenance applicative double.",
        S_BODY,
    ))

    story.append(PageBreak())

    # ---- Section 5 : Planning ----
    story += h1("Le planning.", eyebrow="05 · 3 phases · 10 à 11 semaines")
    story.append(p(
        "Le projet est découpé en trois phases livrables indépendamment. Chaque phase est validée "
        "en démo et acceptée par Bad’s Club avant le passage à la suivante. Le client conserve la "
        "possibilité d’arrêter le projet entre deux phases."
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(planning_table())
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(
        "<b>Durée totale : 10 à 11 semaines</b> entre la signature et la mise en production complète. "
        "Le MVP (phase 1) est utilisable et facturable dès la fin de la 5ème semaine.",
        S_BODY,
    ))

    story.append(PageBreak())

    # ---- Section 6 : Tarification ----
    story += h1("La tarification.", eyebrow="06 · Transparent et prévisible")
    story.append(p(
        "Nous avons retenu un modèle simple, lisible et durable : un coût unique de mise en service, "
        "puis un abonnement mensuel fixe couvrant l’hébergement et la maintenance. Aucun frais caché, "
        "aucune surprise."
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(pricing_table())
    story.append(Spacer(1, 6 * mm))

    # Highlight box
    box_data = [[
        Paragraph(
            "<b>Économie attendue.</b> En remplaçant Doinsport, le Bad’s Club récupère le contrôle "
            "total de sa relation client, de sa marque et de sa donnée — sans pénalité financière "
            "puisque l’abonnement mensuel de 500 € HT couvre l’ensemble des coûts récurrents "
            "(hors transactions Stripe et SMS marginaux).",
            S_BODY_LEFT,
        )
    ]]
    box = Table(box_data, colWidths=[PAGE_W - 2 * MARGIN_X])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIME_BG),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LINEBEFORE", (0, 0), (0, -1), 2, LIME),
    ]))
    story.append(box)

    story.append(PageBreak())

    # ---- Section 7 : IP ----
    story += h1("Propriété intellectuelle.", eyebrow="07 · Le client est propriétaire")
    story.append(p(
        "Le Bad’s Club est intégralement propriétaire de la solution livrée : code, design, données, "
        "comptes des services tiers. ProjectView ne conserve aucune dépendance bloquante."
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(ip_table())
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(
        "<b>Conséquence pratique.</b> Si Bad’s Club décide à terme de changer de prestataire, le "
        "client part avec le code, la donnée et les comptes services. Aucune relocation, aucune "
        "renégociation, aucun verrouillage commercial.",
        S_BODY,
    ))

    story.append(PageBreak())

    # ---- Section 8 : Prochaines étapes ----
    story += h1("Et après ?", eyebrow="08 · Prochaines étapes")
    steps = [
        ("Validation de l’offre", "Retour de Bad’s Club sur cette proposition · signature ou demande d’ajustements."),
        ("Création des comptes services", "Bad’s Club crée les comptes Firebase, Brevo et Stripe (ProjectView assiste). Délais incompressibles : KYC Stripe (1 à 3 jours) et Sender ID SMS Brevo (24 à 48h)."),
        ("Kick-off projet", "Réunion de lancement, finalisation des derniers points : tarifs Tennis de table et Baseball, choix du sous-domaine, export des données Doinsport, désignation des administrateurs."),
        ("Démarrage Phase 1", "Wiring Firebase, intégration Stripe, mise en place des notifications. Démo intermédiaire à mi-parcours."),
        ("Mise en production progressive", "Bascule en parallèle de Doinsport pendant une semaine, communication adhérents, formation des admins, puis arrêt de Doinsport."),
    ]
    S_STEP_NUM = style("StepNum", fontName="Helvetica-Bold", fontSize=18, leading=20, textColor=LIME, alignment=TA_CENTER)
    S_STEP_BODY = style("StepBody", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, alignment=TA_LEFT)
    for i, (title, desc) in enumerate(steps, 1):
        story.append(Spacer(1, 1 * mm))
        # Divider line
        story.append(Table(
            [[""]],
            colWidths=[PAGE_W - 2 * MARGIN_X],
            rowHeights=[0.3],
            style=TableStyle([("LINEABOVE", (0, 0), (-1, 0), 0.3, BORDER)]),
        ))
        step_table = Table(
            [[
                Paragraph(f"{i:02d}", S_STEP_NUM),
                Paragraph(f"<b>{title}.</b> {desc}", S_STEP_BODY),
            ]],
            colWidths=[14 * mm, PAGE_W - 2 * MARGIN_X - 14 * mm],
        )
        step_table.setStyle(TableStyle([
            ("LEFTPADDING", (0, 0), (0, 0), 0),
            ("RIGHTPADDING", (0, 0), (0, 0), 4),
            ("LEFTPADDING", (1, 0), (1, 0), 0),
            ("RIGHTPADDING", (1, 0), (1, 0), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        story.append(step_table)

    story.append(Spacer(1, 12 * mm))

    # Signature block
    sig_data = [
        [Paragraph("<b>Bon pour accord — Bad’s Club</b>", S_CELL_BOLD),
         Paragraph("<b>ProjectView</b>", S_CELL_BOLD)],
        [Paragraph("Nom et fonction du signataire :", S_MUTED),
         Paragraph("Bernard Nguyen · Adelin", S_MUTED)],
        [Paragraph("<br/><br/><br/>", S_MUTED), Paragraph("<br/><br/><br/>", S_MUTED)],
        [Paragraph("Date et signature :", S_MUTED),
         Paragraph("Date et signature :", S_MUTED)],
        [Paragraph("<br/><br/><br/>", S_MUTED), Paragraph("<br/><br/><br/>", S_MUTED)],
    ]
    sig = Table(sig_data, colWidths=[(PAGE_W - 2 * MARGIN_X) / 2 - 4 * mm] * 2)
    sig.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOX", (0, 0), (0, -1), 0.5, BORDER),
        ("BOX", (1, 0), (1, -1), 0.5, BORDER),
        ("BACKGROUND", (0, 0), (-1, 0), LIME_BG),
    ]))
    story.append(sig)

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(
        "<font color='#6b7280' size=8><i>Cette proposition est valable 30 jours à compter de sa date "
        "d’émission. Tous les montants sont indiqués hors taxes. Conditions générales disponibles "
        "sur demande.</i></font>",
        S_NOTE,
    ))

    doc.build(story)
    print(f"PDF written: {OUT}")


if __name__ == "__main__":
    build()
