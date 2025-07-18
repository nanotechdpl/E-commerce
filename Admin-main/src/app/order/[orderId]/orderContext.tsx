'use client'
// import { usePathname } from 'next/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { OrdersData as ordersData } from '@/constants/orderData'
import { OrderData } from '@/types/orderData'

interface OrderContextProps {
  orderData: any // Replace `any` with the type of your order data
  loading: boolean
  error: any
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined)

export const OrderProvider: React.FC<{
  children: React.ReactNode
  orderId: string
}> = ({ children, orderId }) => {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading] = useState(true)
  const [error] = useState<any>(null)

  useEffect(() => {
    if (!orderId) return

    const fetchOrderData = async () => {
      const order = ordersData.filter((od) => od.id === Number(orderId))
      setOrderData(order[0])
      //   setLoading(true)
      //   try {
      //     const response = await fetch(`/api/orders/${orderId}`) // Replace with your actual API endpoint
      //     const data = await response.json()
      //     setOrderData(data)
      //   } catch (err) {
      //     setError(err)
      //   } finally {
      //     setLoading(false)
      //   }
    }

    fetchOrderData()
  }, [orderId])

  return (
    <OrderContext.Provider value={{ orderData, loading, error }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
