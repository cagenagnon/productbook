import './style.css'

const products = [
  {
    key: 'banana', number: '01', eyebrow: 'La douceur généreuse', name: 'Crêpe Banana\nLover',
    description: "Une crêpe dorée à la minute, drapée d'un voile de chocolat fondant et couronnée de fines rondelles de banane fraîche. Le duo banane-chocolat dans sa version la plus pure — gourmande, réconfortante, évidente.",
    ingredients: 'Crêpe maison · Chocolat fondu · Banane fraîche', price: '2 000', kind: 'banana', image: '/images/product2.jpeg', folio: '04', quote: "Chocolat et banane : l'un des accords les plus anciens de la pâtisserie de rue."
  },
  {
    key: 'mini', number: '02', eyebrow: 'Le format signature', name: 'Choco Fondant\nMini',
    description: 'Des rubans de crêpe effilés, empilés avec espièglerie et noyés sous un chocolat chaud qui coule encore. Le format idéal pour une pause gourmande en solo.',
    ingredients: 'Crêpe effilée · Chocolat chaud', price: '2 000', kind: 'mini', image: '/images/product4.jpeg', folio: '05', quote: 'Une bonne pâte à crêpe repose au moins 30 minutes avant la cuisson, pour plus de moelleux.'
  },
  {
    key: 'medium', number: '03', eyebrow: 'Pour les grandes faims', name: 'Choco Fondant\nMoyenne',
    description: 'La même générosité chocolatée, en format XL. Des rubans de crêpe empilés, noyés de chocolat fondant — parfaite à partager, ou pas.',
    ingredients: 'Crêpe effilée · Chocolat chaud · Format généreux', price: '4 000', kind: 'medium', image: '/images/product4.jpeg', folio: '06', quote: 'Plus généreuse, pour les grandes faims ou les grands partages.'
  },
  {
    key: 'strawberry', number: '04', eyebrow: 'La star de la saison', name: 'Crêpe Fraise\nDélice',
    description: "Une crêpe pliée avec soin, généreusement garnie de fraises fraîches tranchées et nappée d'un filet de chocolat. Fraîche, légère, irrésistiblement gourmande — la préférée du mois.",
    ingredients: 'Crêpe maison · Fraises fraîches · Nappage chocolat', price: '4 000', kind: 'strawberry', image: '/images/product4.jpeg', folio: '07', quote: 'La fraise atteint son pic de douceur en fin de saison chaude — d’où sa place de star du mois.'
  }
]

const contents = [
  ['01', 'Notre histoire', '03'], ['02', 'Crêpe Banana Lover', '04'], ['03', 'Choco Fondant Mini', '05'], ['04', 'Choco Fondant Moyenne', '06'],
  ['05', 'Crêpe Fraise Délice', '07'], ['06', 'Comment commander', '08'], ['07', 'Nos engagements', '09'], ['08', 'Nous commander', '10']
]

const app = document.querySelector('#app')

const productVisual = (kind, image) => `<div class="food-scene ${kind}" aria-label="Photographie gourmande de la crêpe">
  <img class="food-photo" src="${image}" alt="Création gourmande La Crêpière Enagnon">
  <div class="plate"></div><div class="food-base"></div><div class="sauce sauce-one"></div><div class="sauce sauce-two"></div>
  <div class="topping topping-one"></div><div class="topping topping-two"></div><div class="topping topping-three"></div>
  <span class="food-spark spark-one">✦</span><span class="food-spark spark-two">✧</span>
</div>`

const dots = '<span class="dot"></span>'.repeat(3)

const renderProduct = (product) => `<section class="page product-page ${product.kind}" id="${product.key}" data-page="${product.folio}">
  <div class="page-no">${product.folio}</div><div class="product-number">N°${product.number}</div>
  <div class="product-copy"><p class="eyebrow">${product.eyebrow}</p><h2>${product.name.replace('\n', '<br>')}</h2><p class="description">${product.description}</p>
    <div class="ingredients"><span>Composition</span><strong>${product.ingredients}</strong></div>
    <div class="price"><span>Prix</span><strong>${product.price}</strong><small>FCFA</small></div>
  </div>
  <div class="visual-wrap">${productVisual(product.kind, product.image)}<span class="deco deco-a">${product.kind === 'strawberry' ? '🍓' : '🍫'}</span><span class="deco deco-b">${product.kind === 'banana' ? '🍌' : '✦'}</span></div>
  <div class="page-quote">“ ${product.quote} ”</div>
</section>`

app.innerHTML = `<main class="book"><div class="book-pages">
  <nav class="topbar"><a class="brand" href="#cover" aria-label="Retour à la couverture"><img src="/logo/logo crèpière (2).png" alt="La Crêpière Enagnon"></a><div class="topbar-meta"><span>Cotonou · Bénin</span><button class="order-btn" data-target="closing">Commander <span>↗</span></button></div></nav>
  <section class="page cover-page" id="cover" data-page="01"><div class="cover-wash wash-one"></div><div class="cover-wash wash-two"></div><div class="cover-top"><span>Collection 2026</span><span>Product book</span></div><div class="cover-main"><p class="eyebrow">La Crêpière <span>Enagnon</span></p><h1>Nos créations,<br><i>une à une.</i></h1><div class="cover-illustration">${productVisual('banana', '/images/product2.jpeg')}</div><div class="cover-offer"><span class="offer-kicker">Bien plus qu'une crêpe</span><strong>Le goût qui rassemble<br><i>vos événements.</i></strong><span class="offer-detail">Anniversaire · mariage · chill · rencontres professionnelles</span></div></div><div class="cover-bottom"><p>Le mot « crêpe » vient du latin <i>crispus</i>,<br>qui signifie « ondulé ».</p></div></section>
  <section class="page contents-page" id="sommaire" data-page="02"><div class="page-no">02</div><div class="section-heading"><p class="eyebrow">À feuilleter doucement</p><h2>Sommaire</h2></div><div class="contents-list">${contents.map(([num, label, page]) => `<a href="#${page === '03' ? 'story' : page === '08' ? 'steps' : page === '09' ? 'engagements' : page === '10' ? 'closing' : products.find(p => p.folio === page)?.key || 'cover'}"><span>${num}</span><strong>${label}</strong><b>${page}</b></a>`).join('')}</div><p class="contents-quote">“ Un product book, comme un vrai livre :<br>on le feuillette, on ne le scrolle pas. ”</p></section>
  <section class="page story-page" id="story" data-page="03"><div class="page-no">03</div><div class="story-intro"><p class="eyebrow">À propos de nous</p><h2>Une crêpe<br><i>à votre rythme.</i></h2></div><div class="story-body"><p>Née à Cotonou, <strong>La Crêpière Enagnon</strong> est un atelier 100% en ligne, pensé pour un seul objectif : servir une crêpe aussi belle que gourmande, préparée à la commande, jamais à l'avance.</p><p>Pas de boutique physique — seulement des crêpes fraîches, cuisinées avec soin et livrées où que vous soyez, encore tièdes.</p></div><div class="story-event"><span>Pour vos moments</span><strong>On s'invite<br>à vos <i>événements.</i></strong><p>Une animation gourmande pensée pour vos anniversaires, mariages, moments chill et rencontres professionnelles.</p></div><div class="story-stats"><div><span>⌖</span><strong>Cotonou<br>· Bénin</strong></div><div><span>♨</span><strong>Préparées<br>à la commande</strong></div><div><span>⌁</span><strong>Livrées où<br>que vous soyez</strong></div></div><p class="page-quote">“ Cotonou, Bénin — une crêpière, un four,<br>et beaucoup d'amour du détail. ”</p></section>
  ${products.map(renderProduct).join('')}
  <section class="page steps-page" id="steps" data-page="08"><div class="page-no">08</div><div class="section-heading"><p class="eyebrow">Simple comme bonjour</p><h2>Comment<br><i>commander</i></h2></div><div class="steps-list"><div><span>01</span><h3>Choisissez<br>votre crêpe</h3><p>Parcourez nos créations et laissez-vous tenter.</p></div><div><span>02</span><h3>Commandez<br>en un clic</h3><p>Via le site ou notre lien en bio, en quelques secondes.</p></div><div><span>03</span><h3>Dégustez,<br>encore tiède</h3><p>Livrée où que vous soyez, préparée à la minute.</p></div></div><div class="steps-rule">${dots}</div><p class="page-quote">“ Trois étapes, zéro complication : c'est tout l'esprit La Crêpière. ”</p></section>
  <section class="page engagements-page" id="engagements" data-page="09"><div class="page-no">09</div><div class="section-heading"><p class="eyebrow">Ce qui compte pour nous</p><h2>Nos<br><i>engagements</i></h2></div><div class="engagement-grid"><div><span>✺</span><h3>Fraîcheur</h3><p>Des ingrédients frais, choisis avec soin, chaque jour.</p></div><div><span>◷</span><h3>Préparé à la minute</h3><p>Jamais à l'avance — votre crêpe est cuisinée à la commande.</p></div><div><span>♥</span><h3>Gourmandise avant tout</h3><p>Chaque recette est pensée pour le plaisir, sans compromis.</p></div></div><p class="page-quote">“ Chez La Crêpière, chaque commande est préparée à la minute, jamais à l'avance. ”</p></section>
  <section class="page closing-page" id="closing" data-page="10"><div class="closing-ornament">${productVisual('strawberry', '/images/product2.jpeg')}</div><div class="closing-content"><p class="eyebrow">La suite vous appartient</p><h2>Envie d'y<br><i>goûter ?</i></h2><p>Commandez en un clic,<br>livrées où que vous soyez —<br>encore tièdes.</p><a class="closing-cta" href="https://www.instagram.com/lacrepiereenagnon/" target="_blank" rel="noreferrer">@lacrepiereenagnon <span>↗</span></a></div><div class="closing-footer"><span>lacrepiere.store</span><span>Cotonou · Bénin</span><span>10</span></div><p class="closing-quote">“ Une crêpe réussie doit pouvoir se retourner<br>d'un seul geste du poignet. ”</p></section>
</div><div class="book-controls"><button class="book-nav previous" aria-label="Page précédente">←</button><span class="book-hint">Feuilletez le livre</span><button class="book-nav next" aria-label="Page suivante">→</button></div><div class="page-indicator"><span class="current-page">01</span><span class="indicator-line"></span><span>10</span></div></main>`

const pages = [...document.querySelectorAll('.page')]
const pageIndicator = document.querySelector('.current-page')
const previousButton = document.querySelector('.previous')
const nextButton = document.querySelector('.next')
let currentPage = 0
let isTurning = false

const showPage = (pageIndex, direction = 'next') => {
  if (isTurning || pageIndex < 0 || pageIndex >= pages.length || pageIndex === currentPage) return
  isTurning = true
  const previousPage = pages[currentPage]
  const nextPage = pages[pageIndex]
  previousPage.classList.remove('active')
  previousPage.classList.add(direction === 'next' ? 'turn-away-left' : 'turn-away-right')
  nextPage.classList.add(direction === 'next' ? 'turn-in-right' : 'turn-in-left')
  requestAnimationFrame(() => nextPage.classList.add('active'))
  window.setTimeout(() => {
    previousPage.classList.remove('turn-away-left', 'turn-away-right')
    nextPage.classList.remove('turn-in-right', 'turn-in-left')
    currentPage = pageIndex
    pageIndicator.textContent = nextPage.dataset.page
    previousButton.disabled = currentPage === 0
    nextButton.disabled = currentPage === pages.length - 1
    history.replaceState(null, '', `#${nextPage.id}`)
    isTurning = false
  }, 560)
}

pages[0].classList.add('active')
previousButton.disabled = true
nextButton.addEventListener('click', () => showPage(currentPage + 1, 'next'))
previousButton.addEventListener('click', () => showPage(currentPage - 1, 'previous'))
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ') showPage(currentPage + 1, 'next')
  if (event.key === 'ArrowLeft') showPage(currentPage - 1, 'previous')
})
document.querySelectorAll('.contents-list a, .brand').forEach(link => link.addEventListener('click', (event) => {
  event.preventDefault()
  const targetId = link.getAttribute('href').slice(1)
  const targetIndex = pages.findIndex(page => page.id === targetId)
  showPage(targetIndex, targetIndex > currentPage ? 'next' : 'previous')
}))
document.querySelectorAll('[data-target]').forEach(button => button.addEventListener('click', () => {
  const targetIndex = pages.findIndex(page => page.id === button.dataset.target)
  showPage(targetIndex, targetIndex > currentPage ? 'next' : 'previous')
}))
