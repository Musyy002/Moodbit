import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"


import logo from "../assets/moodbitlogo.png"
import cat from "../assets/cat.png"
import smart from "../assets/donate.gif"
import ai from "../assets/digitalization.gif"
import moodbitIcon from "../assets/magnifying-glass.gif"
import charts from "../assets/growth.gif"
import { Link } from "react-router-dom"

export default function Landing() {


  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-white">
      
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-10 py-6 shadow-sm bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <img src={logo} alt="MoodBit Logo" className="h-29" />

      <Link to='/login'>
        <Button className="bg-blue-700 hover:bg-black cursor-pointer text-white px-8 py-5 text-lg rounded-xl shadow-md">
          Get Started
        </Button>
      </Link>
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 mt-20 gap-14">

        {/* LEFT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2"
        >
          <h1 className="text-7xl font-extrabold leading-tight">
            BUDGETING.<br />
            BUT MAKE IT{" "}
            <span className="text-blue-800 drop-shadow-2xl">FUN.</span>
          </h1>

          <p className="mt-6 text-gray-600 text-2xl leading-relaxed">
            Make smarter financial decisions with predictions, insights, 
            and your evolving <span className="text-blue-700 font-bold">MoodBit companion.</span>
          </p>

          <Link to='/login'>
          <Button className="mt-10 bg-blue-700 hover:bg-black cursor-pointer text-white px-12 py-7 text-2xl rounded-xl shadow-lg transition">
            Start Your Journey
          </Button>
          </Link>
        </motion.div>

        {/* CAT IMAGE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <img 
            src={cat} 
            alt="MoodBit Cat" 
            className="h-[28rem] drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-28 px-10 pb-24"
      >
        {[
          { icon: smart, title: "Smart Tracking", text: "Log expenses easily and see instant insights." },
          { icon: ai, title: "AI Predictions", text: "Get accurate future spending trends." },
          { icon: moodbitIcon, title: "Your MoodBit", text: "A cute companion that evolves with you." },
          { icon: charts, title: "Visual Insights", text: "Understand your financial health instantly." },
        ].map((feature, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="shadow-xl border-0 rounded-3xl bg-white/80 backdrop-blur-md hover:shadow-2xl h-48">
              <CardHeader className="flex flex-row items-center gap-3 pb-0">
                <img src={feature.icon} className="h-14 w-14" />
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-lg mt-2">
                {feature.text}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* FOOTER */}
      <footer className="w-full py-10 text-center bg-white/60 backdrop-blur-md border-t">
        <p className="text-gray-600 text-lg">© 2025 MoodBit Budget — All Rights Reserved</p>
      </footer>

    </div>
  )
}
