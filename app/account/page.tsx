"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { User, ShoppingBag, MapPin, CreditCard, Settings, HelpCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useI18n } from "@/context/i18n-context"

export default function AccountPage() {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('account.hi_there')}</h1>
            <p className="text-gray-600">Andrew</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/account/settings')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('account.account_settings')}</h3>
                    <p className="text-sm text-gray-500">Personal information</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/orders')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('account.order_history')}</h3>
                    <p className="text-sm text-gray-500">Track and manage orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/account/addresses')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('account.addresses')}</h3>
                    <p className="text-sm text-gray-500">Delivery addresses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/account/payment')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('account.payment_methods')}</h3>
                    <p className="text-sm text-gray-500">Cards and billing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/account/preferences')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('account.preferences')}</h3>
                    <p className="text-sm text-gray-500">App settings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="font-medium mb-1">{t('account.need_help')}</h2>
              <p className="text-gray-500 text-sm mb-3">{t('account.need_help_description')}</p>
              <Button
                onClick={() => router.push('/support')}
                className="bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-md px-4 py-2 h-auto"
              >
                {t('account.get_support')}
              </Button>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 