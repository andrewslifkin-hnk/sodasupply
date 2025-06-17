"use client"

import type React from "react"

import Link from "next/link"
import { useFilter } from "@/context/filter-context"
import { useRouter } from "next/navigation"
import { useI18n } from "@/context/i18n-context"
import { LanguageSelector } from "./language-selector"

export default function Footer() {
  const { clearAllFilters } = useFilter()
  const router = useRouter()
  const { t } = useI18n()

  // Handle "All Products" link click to clear all filters
  const handleAllProductsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    clearAllFilters()
    router.push("/")
  }

  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="max-w-site">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 tracking-[-2px]">{t('footer.company_name')}</h3>
              <p className="text-white/70 text-sm">
                {t('footer.company_description')}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">{t('footer.shop')}</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="/" className="hover:text-white transition-colors" onClick={handleAllProductsClick}>
                    {t('footer.all_products')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.featured')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.new_arrivals')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.deals_discounts')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.about_us')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.contact')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.careers')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.press')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.help_center')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.shipping_info')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.returns')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t('footer.privacy_policy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm text-center sm:text-left">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/70 text-sm">{t('footer.language_selector')}:</span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
