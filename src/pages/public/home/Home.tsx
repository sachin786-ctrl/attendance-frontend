import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-200 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="text-center px-6 py-16 md:py-24">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Build Modern Web Apps 
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Create fast, scalable and beautiful applications using React and Tailwind CSS.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
            Get Started
          </Link>
          <Link to="/login" className="px-6 py-3 border rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {["Fast", "Responsive", "Modern"].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl shadow hover:shadow-lg bg-white dark:bg-slate-800">
            <h3 className="text-xl font-semibold mb-2">{item}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white text-center h-100 flex flex-col justify-center items-center ">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="mb-6">Join us and build something amazing today.</p>
        <Link to="/signup" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold">
          Create Account
        </Link>
      </section>
    </div>
  );
}
