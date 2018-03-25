module.exports = function () {
  return hook => {
    let shopService = hook.app.service('shop')

    return shopService.find()
      .then(shop => {
        let total = 0

        shop.data.forEach((shopItem) => {
          hook.data.cartItems.forEach((cartItem) => {
            if (cartItem.itemId === String(shopItem._id)) {
              total += (cartItem.quantity * shopItem.price)
            }
          })
        })

        hook.params.total = total
        return hook
      })
  }
}
