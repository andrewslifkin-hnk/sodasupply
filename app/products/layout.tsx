import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 max-w-site mx-auto py-6 w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
} 