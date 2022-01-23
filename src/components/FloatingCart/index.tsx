import React, { useMemo } from 'react'

import { useNavigation } from '@react-navigation/native'

import FeatherIcon from 'react-native-vector-icons/Feather'
import formatValue from '../../utils/formatValue'
import { useCart } from '../../hooks/cart'
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles'

const FloatingCart: React.FC = () => {
  const { products } = useCart()

  const navigation = useNavigation()

  const cartTotal = useMemo(() => {
    const value = products.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    )

    return formatValue(value)
  }, [products])

  const totalItensInCart = useMemo(() => {
    const value = products.reduce((acc, curr) => acc + curr.quantity, 0)

    return value
  }, [products])

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  )
}

export default FloatingCart
