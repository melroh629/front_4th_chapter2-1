const FLASH_SALE_RATE = 0.8
const RECOMMEND_SALE_RATE = 0.95
var sel, addBtn, cartItemList, sum, stockInfo
let lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0
const productList = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
]
const createElement = (tag, { id, className, textContent }) => {
  const element = document.createElement(tag)
  if (id) element.id = id
  if (className) element.className = className
  if (textContent) element.textContent = textContent
  return element
}
const getRandomIndex = (array) => {
  return Math.floor(Math.random() * array.length)
}
const getDiscountedPrice = (price, rate) => {
  return Math.fround(price * rate)
}
function main() {
  const root = createElement('div', { id: 'app' })
  const cont = createElement('div', { className: 'bg-gray-100 p-8' })
  const wrap = createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  })
  const hTxt = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  })
  cartItemList = createElement('div', { id: 'cart-items' })
  sum = createElement('div', { id: 'cart-total' })
  sel = createElement('select', { id: 'product-select' })
  addBtn = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  })
  stockInfo = createElement('div', { id: 'stock-status' })
  updateSelOpts()
  wrap.appendChild(hTxt)
  wrap.appendChild(cartItemList)
  wrap.appendChild(sum)
  wrap.appendChild(sel)
  wrap.appendChild(addBtn)
  wrap.appendChild(stockInfo)
  cont.appendChild(wrap)
  root.appendChild(cont)
  document.body.appendChild(root)
  calcCart()
  // setTimeout(() => {
  //   setInterval(() => {
  //     const luckyItem = productList[getRandomIndex(productList)]
  //     if (Math.random() < 0.3 && luckyItem.q > 0) {
  //       // ?? 왜 0.3이지? 0.3은 어디서 나온거지?
  //       luckyItem.val = Math.round(luckyItem.val * FLASH_SALE_RATE)
  //       alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
  //       updateSelOpts()
  //     }
  //   }, 30000)
  // }, Math.random() * 10000)
  // setTimeout(() => {
  //   setInterval(() => {
  //     if (lastSel) {
  //       var suggest = productList.find(function (item) {
  //         return item.id !== lastSel && item.q > 0
  //       })
  //       if (suggest) {
  //         alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
  //         suggest.val = Math.round(suggest.val * 0.95)
  //         updateSelOpts()
  //       }
  //     }
  //   }, 60000)
  // }, Math.random() * 20000)
}
function updateSelOpts() {
  sel.innerHTML = ''
  productList.forEach(function (item) {
    var opt = document.createElement('option')
    opt.value = item.id
    opt.textContent = item.name + ' - ' + item.val + '원'
    if (item.q === 0) opt.disabled = true
    sel.appendChild(opt)
  })
}
function calcCart() {
  totalAmt = 0
  itemCnt = 0
  var cartItems = cartItemList.children
  var subTot = 0
  for (var i = 0; i < cartItems.length; i++) {
    ;(function () {
      var curItem
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j]
          break
        }
      }
      var q = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
      )
      var itemTot = curItem.val * q
      var disc = 0
      itemCnt += q
      subTot += itemTot
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1
        else if (curItem.id === 'p2') disc = 0.15
        else if (curItem.id === 'p3') disc = 0.2
        else if (curItem.id === 'p4') disc = 0.05
        else if (curItem.id === 'p5') disc = 0.25
      }
      totalAmt += itemTot * (1 - disc)
    })()
  }
  let discRate = 0
  if (itemCnt >= 30) {
    var bulkDisc = totalAmt * 0.25
    var itemDisc = subTot - totalAmt
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25)
      discRate = 0.25
    } else {
      discRate = (subTot - totalAmt) / subTot
    }
  } else {
    discRate = (subTot - totalAmt) / subTot
  }
  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1
    discRate = Math.max(discRate, 0.1)
  }
  sum.textContent = '총액: ' + Math.round(totalAmt) + '원'
  if (discRate > 0) {
    var span = document.createElement('span')
    span.className = 'text-green-500 ml-2'
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)'
    sum.appendChild(span)
  }
  updateStockInfo()
  renderBonusPts()
}
const renderBonusPts = () => {
  bonusPts = Math.floor(totalAmt / 1000)
  var ptsTag = document.getElementById('loyalty-points')
  if (!ptsTag) {
    ptsTag = document.createElement('span')
    ptsTag.id = 'loyalty-points'
    ptsTag.className = 'text-blue-500 ml-2'
    sum.appendChild(ptsTag)
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')'
}
function updateStockInfo() {
  var infoMsg = ''
  productList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') +
        '\n'
    }
  })
  stockInfo.textContent = infoMsg
}
main()
addBtn.addEventListener('click', function () {
  var selItem = sel.value
  var itemToAdd = productList.find(function (p) {
    return p.id === selItem
  })
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id)
    if (item) {
      var newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty
        itemToAdd.q--
      } else {
        alert(`재고가 부족합니다.`)
      }
    } else {
      var newItem = document.createElement('div')
      newItem.id = itemToAdd.id
      newItem.className = 'flex justify-between items-center mb-2'
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>'
      cartItemList.appendChild(newItem)
      itemToAdd.q--
    }
    calcCart()
    lastSel = selItem
  }
})
cartItemList.addEventListener('click', function (event) {
  var tgt = event.target
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    var prodId = tgt.dataset.productId
    var itemElem = document.getElementById(prodId)
    var prod = productList.find(function (p) {
      return p.id === prodId
    })
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change)
      var newQty =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
        qtyChange
      if (
        newQty > 0 &&
        newQty <=
          prod.q +
            parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty
        prod.q -= qtyChange
      } else if (newQty <= 0) {
        itemElem.remove()
        prod.q -= qtyChange
      } else {
        alert('재고가 부족합니다.')
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1]
      )
      prod.q += remQty
      itemElem.remove()
    }
    calcCart()
  }
})
