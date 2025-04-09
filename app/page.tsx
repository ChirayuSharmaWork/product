import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gray-950 text-white">
      <div className="max-w-3xl space-y-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="mt-4 text-xl text-gray-400">Streamline your inventory with our powerful management system</p>
        </div>

        <div className="space-y-6 bg-gray-900 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-100">Key Features</h2>
          <ul className="grid gap-3 text-left text-gray-300">
            <li className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 text-blue-400 flex-shrink-0"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Complete product lifecycle management</span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 text-blue-400 flex-shrink-0"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Advanced filtering and search capabilities</span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 text-blue-400 flex-shrink-0"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Secure user authentication and authorization</span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 text-blue-400 flex-shrink-0"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Comprehensive analytics dashboard</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-8"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-8">© 2023 Product Management. All rights reserved.</p>
      </div>
    </div>
  )
}
