module.exports = function () {
  return hook => {
    let shopService = hook.app.service('shop')
    const currency = hook.app.get('currency')

    return shopService.find()
      .then(shop => {
        let total = 0
        let itemsArr = []

        shop.data.forEach((shopItem) => {
          hook.data.cartItems.forEach((cartItem) => {
            if (cartItem.itemId === String(shopItem._id)) {
              total += (cartItem.quantity * shopItem.price)
              itemsArr.push({
                name: shopItem.product,
                sku: shopItem.sku || 'none',
                price: shopItem.price,
                currency: currency,
                quantity: cartItem.quantity
              })
            }
          })
        })

        hook.params.total = parseFloat(total.toFixed(2))
        hook.params.payPalList = itemsArr

        return hook
      })
  }
}
