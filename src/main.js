import homeTemplate from './views/Home.html?raw'
import './style.css'

const products = [
  { key: 'banana', number: '01', eyebrow: 'La douceur généreuse', name: 'Crêpe Banana<br>Lover', description: "Une crêpe dorée à la minute, drapée d'un voile de chocolat fondant et couronnée de fines rondelles de banane fraîche. Le duo banane-chocolat dans sa version la plus pure — gourmande, réconfortante, évidente.", ingredients: 'Crêpe maison · Chocolat fondu · Banane fraîche', price: '2 000', image: '/images/product2.jpeg', folio: '04', quote: "Chocolat et banane : l'un des accords les plus anciens de la pâtisserie de rue." },
  { key: 'mini', number: '02', eyebrow: 'Le format signature', name: 'Choco Fondant<br>Mini', description: 'Des rubans de crêpe effilés, empilés avec espièglerie et noyés sous un chocolat chaud qui coule encore. Le format idéal pour une pause gourmande en solo.', ingredients: 'Crêpe effilée · Chocolat chaud', price: '2 000', image: '/images/product14.jpeg', folio: '05', quote: 'Une bonne pâte à crêpe repose au moins 30 minutes avant la cuisson, pour plus de moelleux.' },
  { key: 'medium', number: '03', eyebrow: 'Pour les grandes faims', name: 'Choco Fondant<br>Moyenne', description: 'La même générosité chocolatée, en format XL. Des rubans de crêpe empilés, noyés de chocolat fondant — parfaite à partager, ou pas.', ingredients: 'Crêpe effilée · Chocolat chaud · Format généreux', price: '4 000', image: '/images/product11.jpeg', folio: '06', quote: 'Plus généreuse, pour les grandes faims ou les grands partages.' },
  { key: 'strawberry', number: '04', eyebrow: 'La star de la saison', name: 'Crêpe Fraise<br>Délice', description: "Une crêpe pliée avec soin, généreusement garnie de fraises fraîches tranchées et nappée d'un filet de chocolat. Fraîche, légère, irrésistiblement gourmande — la préférée du mois.", ingredients: 'Crêpe maison · Fraises fraîches · Nappage chocolat', price: '4 000', image: '/images/product9.jpeg', folio: '07', quote: 'La fraise atteint son pic de douceur en fin de saison chaude — d’où sa place de star du mois.' }
]

const contents = [['01', 'Notre histoire', '03', 'story'], ['02', 'Nos créations gourmandes', '04', 'catalog'], ['03', 'Nos formules événements', '05', 'events'], ['04', 'Crêpe Banana Lover', '06', 'banana'], ['05', 'Choco Fondant Mini', '07', 'mini'], ['06', 'Choco Fondant Moyenne', '08', 'medium'], ['07', 'Crêpe Fraise Délice', '09', 'strawberry'], ['08', 'Comment commander', '10', 'steps'], ['09', 'Nos engagements', '11', 'engagements'], ['10', 'Nous commander', '12', 'closing']]
const eventImages = ['event01.jpeg', 'event02.jpeg', 'event03.jpeg', 'event04.jpeg', 'event05.jpeg', 'event06.jpeg', 'event07.jpeg']
const productGalleryImages = Array.from({ length: 14 }, (_, index) => `product${index + 1}.jpeg`)
const visual = image => `<div class="food-scene"><img class="food-photo" src="${image}" alt="Création gourmande La Crêpière Enagnon"><span class="food-spark spark-one">✦</span><span class="food-spark spark-two">✧</span></div>`
const productMarkup = product => `<section class="page product-page ${product.key} bg-[#fbf8f1]" id="${product.key}" data-page="${product.folio}"><div class="page-no">${product.folio}</div><div class="product-number">N°${product.number}</div><div class="product-copy"><p class="eyebrow">${product.eyebrow}</p><h2>${product.name}</h2><p class="description">${product.description}</p><div class="ingredients"><span>Composition</span><strong>${product.ingredients}</strong></div><div class="price"><span>Prix</span><strong>${product.price}</strong><small>FCFA</small></div></div><div class="visual-wrap">${visual(product.image)}<span class="deco deco-a">🍫</span><span class="deco deco-b">✦</span></div><div class="page-quote">“ ${product.quote} ”</div></section>`
const productCatalogMarkup = productGalleryImages.map((image, index) => `<figure><img src="/images/${image}" alt="Création produit ${index + 1} La Crêpière Enagnon"><figcaption>${String(index + 1).padStart(2, '0')}</figcaption></figure>`).join('')
const contentsMarkup = contents.map(([num, label, page, id]) => `<a href="#${id}"><span>${num}</span><strong>${label}</strong><b>${page}</b></a>`).join('')
const stepsMarkup = [['01', 'Choisissez<br>votre crêpe', 'Parcourez nos créations et laissez-vous tenter.'], ['02', 'Commandez<br>en un clic', 'Via le site ou notre lien en bio, en quelques secondes.'], ['03', 'Dégustez,<br>encore tiède', 'Livrée où que vous soyez, préparée à la minute.']].map(([num, title, text]) => `<div><span>${num}</span><h3>${title}</h3><p>${text}</p></div>`).join('')
const engagementsMarkup = [['✺', 'Fraîcheur', 'Des ingrédients frais, choisis avec soin, chaque jour.'], ['◷', 'Préparé à la minute', "Jamais à l'avance — votre crêpe est cuisinée à la commande."], ['♥', 'Gourmandise avant tout', 'Chaque recette est pensée pour le plaisir, sans compromis.']].map(([icon, title, text]) => `<div><span>${icon}</span><h3>${title}</h3><p>${text}</p></div>`).join('')
const eventsMarkup = eventImages.map((image, index) => `<figure><img src="/images/${image}" alt="Suggestion événementielle ${index + 1} La Crêpière Enagnon"><figcaption>${String(index + 1).padStart(2, '0')}</figcaption></figure>`).join('')

const app = document.querySelector('#app')
app.innerHTML = homeTemplate.replace('{{COVER_VISUAL}}', visual('/images/product2.jpeg')).replace('{{CONTENTS}}', contentsMarkup).replace('{{PRODUCT_CATALOG}}', productCatalogMarkup).replace('{{PRODUCTS}}', products.map((product, index) => productMarkup({ ...product, folio: String(index + 6).padStart(2, '0') })).join('')).replace('{{STEPS}}', stepsMarkup).replace('{{ENGAGEMENTS}}', engagementsMarkup).replace('{{EVENTS}}', eventsMarkup).replace('{{CLOSING_VISUAL}}', visual('/images/product2.jpeg'))

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

const initialPage = pages.findIndex(page => page.id === window.location.hash.slice(1))
currentPage = initialPage >= 0 ? initialPage : 0
pages[currentPage].classList.add('active')
previousButton.disabled = currentPage === 0
nextButton.disabled = currentPage === pages.length - 1
pageIndicator.textContent = pages[currentPage].dataset.page
nextButton.addEventListener('click', () => showPage(currentPage + 1))
previousButton.addEventListener('click', () => showPage(currentPage - 1, 'previous'))
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === ' ') showPage(currentPage + 1)
  if (event.key === 'ArrowLeft') showPage(currentPage - 1, 'previous')
})
document.querySelectorAll('.contents-list a, .brand').forEach(link => link.addEventListener('click', event => {
  event.preventDefault()
  const targetIndex = pages.findIndex(page => page.id === link.getAttribute('href').slice(1))
  showPage(targetIndex, targetIndex > currentPage ? 'next' : 'previous')
}))
document.querySelectorAll('[data-target]').forEach(button => button.addEventListener('click', () => {
  const targetIndex = pages.findIndex(page => page.id === button.dataset.target)
  showPage(targetIndex, targetIndex > currentPage ? 'next' : 'previous')
}))
