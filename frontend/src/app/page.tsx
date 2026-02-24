import PredictionForm from "@/components/PredictionForm";

export default function Home() {
  return (
    <main className="flex-1 relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Navi Mumbai House Price Predictor
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get instant, AI-powered property valuations based on real historical data. Select your node, enter the details, and discover the true value of your property.
          </p>
        </div>

        <PredictionForm />

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Built with FastAPI, Next.js, and specialized ML models.</p>
        </div>
      </div>
    </main>
  );
}
