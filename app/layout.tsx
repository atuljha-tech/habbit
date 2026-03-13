import "./globals.css"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F5F5]">
        {/* Main container - flex column for entire page */}
        <div className="flex flex-col min-h-screen">
          {/* Top row with sidebar and content */}
          <div className="flex flex-1">
            {/* Sidebar - full height in its own column */}
            <Sidebar />
            
            {/* Main content area - takes remaining width */}
            <div className="flex-1 flex flex-col">
              {/* Navbar - sticky at top */}
              <Navbar />
              
              {/* Page content - grows to fill space */}
              <main className="flex-1 p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>
          
          {/* Footer - full width below both sidebar and content */}
          <Footer />
        </div>

        {/* Decorative background elements */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#FF7AC6] opacity-5 border-4 border-black rounded-full animate-float-slow" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#8C6CFF] opacity-5 border-4 border-black rotate-12" />
        </div>

        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
        `}</style>
      </body>
    </html>
  )
}