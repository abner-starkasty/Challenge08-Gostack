import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import AsyncStorage from '@react-native-community/async-storage'

interface Product {
  id: string
  title: string
  image_url: string
  price: number
  quantity: number
}

interface CartContext {
  products: Product[]
  addToCart(item: Omit<Product, 'quantity'>): void
  increment(id: string): void
  decrement(id: string): void
}

const CartContext = createContext<CartContext | null>(null)

const KEY_STORAGE_APP = '@GoMarketplace'
const KEY_STORAGE_CART_PRODUCTS = 'cartProducts'

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const cartProductsStored = await AsyncStorage.getItem(
        `${KEY_STORAGE_APP}:${KEY_STORAGE_CART_PRODUCTS}`,
      )

      if (cartProductsStored) {
        setProducts(JSON.parse(cartProductsStored))
      }
    }

    loadProducts()
  }, [])

  const addOnAsyncStorage = useCallback(async (productsToAS: Product[]) => {
    await AsyncStorage.setItem(
      `${KEY_STORAGE_APP}:${KEY_STORAGE_CART_PRODUCTS}`,
      JSON.stringify(productsToAS),
    )
  }, [])

  const increment = useCallback(
    async id => {
      const newState = products.map(product => {
        if (product.id !== id) return product

        return {
          ...product,
          quantity: product.quantity + 1,
        }
      })

      setProducts(newState)
      addOnAsyncStorage(newState)
    },
    [addOnAsyncStorage, products],
  )

  const decrement = useCallback(
    async id => {
      const newState = products.map(product => {
        if (product.id !== id) return product

        if (product.quantity <= 1) return product

        return {
          ...product,
          quantity: product.quantity - 1,
        }
      })

      setProducts(newState)
      addOnAsyncStorage(newState)
    },
    [addOnAsyncStorage, products],
  )

  const addToCart = useCallback(
    async (product: Product) => {
      const currState = products

      const isProductAlreadyInserted = currState.find(
        productState => productState.id === product.id,
      )

      if (isProductAlreadyInserted) {
        increment(product.id)
        return
      }

      const newState = [
        ...currState,
        {
          ...product,
          quantity: 1,
        },
      ]

      setProducts(newState)
      addOnAsyncStorage(newState)
    },
    [addOnAsyncStorage, increment, products],
  )

  const value = useMemo(
    () => ({
      addToCart,
      increment,
      decrement,
      products,
    }),
    [products, addToCart, increment, decrement],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function useCart(): CartContext {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`)
  }

  return context
}

export { CartProvider, useCart }
