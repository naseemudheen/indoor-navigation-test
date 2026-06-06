import { Link } from "react-router-dom"
import { MapPin, RefreshCcw, HelpCircle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md">
        <div>
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full">
            <MapPin className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-center">Navigation Error</h2>
        </div>
        <div>
          <p className="text-center text-gray-600">We're having trouble finding a path to your destination.</p>
          <div className="mt-6 space-y-4 text-sm text-center">
            <p className="font-semibold">This could be due to:</p>
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li>Temporary obstruction in the building</li>
              <li>Recent changes in the indoor layout</li>
              <li>Incomplete or outdated map data</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col mt-6 space-y-4">
          {/* <button className="flex justify-center w-full py-2 border" onClick={() => window.location.reload()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </button> */}
          <Link to="/home" className="w-full">
            <button  className="w-full bg-[#29AB87] border border-[#fff] text-white py-2 rounded-lg ">
              Return to Main Map
            </button>
          </Link>
          {/* <Link
            href="/support"
            className="inline-flex items-center justify-center text-sm text-blue-600 hover:underline"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Link> */}
        </div>
      </div>
    </div>
  )
}

