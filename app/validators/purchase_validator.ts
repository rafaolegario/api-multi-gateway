import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)

export const purchaseValidator = vine.create({
  email: email(),
  name: vine.string().minLength(2).maxLength(100),
  cardNumber: vine.string().regex(/^\d{16}$/),
  cvv: vine.string().regex(/^\d{3}$/),
  products: vine
    .array(
      vine.object({
        id: vine.string().uuid(),
        quantity: vine.number().min(1),
      })
    )
    .minLength(1),
})
