"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Cpu, Gamepad2, Trophy } from "lucide-react"

const features = [
  {
    id: 1,
    icon: <Gamepad2 className="w-12 h-12" />,
    title: "All-in-One Platform",
    description:
      "Access app and card features, including a gaming marketplace and expense tracking tool, for a unified gaming and fintech experience.",
    highlight: "Unified Experience",
    color: "from-purple-400 to-pink-500",
  },
  {
    id: 2,
    icon: <Shield className="w-12 h-12" />,
    title: "Transparent Payments",
    description:
      "No hidden charges; choose between free and paid card options for extra advantages; enjoy 0% interest on select benefits.",
    highlight: "0% Interest",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: 3,
    icon: <Zap className="w-12 h-12" />,
    title: "Rewards & Perks",
    description:
      "Earn points, cashback, and exclusive offers tailored for gamers. Get rewarded for every purchase and gaming activity.",
    highlight: "Gamer Rewards",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 4,
    icon: <Trophy className="w-12 h-12" />,
    title: "Exclusive Events & Progression",
    description:
      "Participate in exclusive events, track your XP progress, and compete on leaderboards to unlock special perks and achievements.",
    highlight: "XP & Leaderboards",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: 5,
    icon: <Cpu className="w-12 h-12" />,
    title: "AI Features",
    description:
      "Utilize advanced AI tools for personalized recommendations and smart assistance tailored to your gaming preferences and spending habits.",
    highlight: "Smart AI",
    color: "from-cyan-400 to-blue-500",
  },
]

export default function Component() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isScrollingFeatures, setIsScrollingFeatures] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !featuresRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerHeight = containerRect.height
      const windowHeight = window.innerHeight

      // Check if the features section is in view
      if (containerTop <= 0 && containerTop > -containerHeight) {
        setIsScrollingFeatures(true)

        // Calculate which feature should be active based on scroll position
        const scrollProgress = Math.abs(containerTop) / (containerHeight - windowHeight)
        const featureIndex = Math.min(Math.floor(scrollProgress * features.length), features.length - 1)
        setActiveFeature(featureIndex)
      } else {
        setIsScrollingFeatures(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="bg-black">
      {/* Features Section */}
      <div ref={containerRef} className="h-[500vh] relative">
        <div ref={featuresRef} className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-gray-300 text-lg"></p>
            </div>

            {/* Features Container */}
            <div className="relative h-96">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                    index === activeFeature
                      ? "translate-x-0 opacity-100 scale-100 z-10"
                      : index < activeFeature
                        ? "-translate-x-full opacity-0 scale-95 z-0"
                        : "translate-x-full opacity-0 scale-95 z-0"
                  } bg-[#1A1A1A] border-[#333333] hover:bg-[#222222] hover:border-[#FF8C00] hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer group`}
                >
                  <div className="p-8 h-full flex items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
                      <div className="text-center md:text-left space-y-6">
                        <div
                          className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <div className="text-white">{feature.icon}</div>
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                            {feature.highlight}
                          </Badge>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-base sm:text-lg leading-relaxed text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                      {/* Right-side visual, hidden on small screens, shown on medium and larger */}
                      <div className="hidden md:block relative">
                        {index === 0 ? (
                          <div className="w-80 h-80 mx-auto rounded-3xl bg-gradient-to-br from-purple-900 to-slate-800 p-6 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                                <Gamepad2 className="w-6 h-6 text-purple-400" />
                                <span className="text-white text-sm">Gaming Marketplace</span>
                              </div>
                              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                                <Shield className="w-6 h-6 text-green-400" />
                                <span className="text-white text-sm">Expense Tracker</span>
                              </div>
                              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                                <Zap className="w-6 h-6 text-yellow-400" />
                                <span className="text-white text-sm">Card Management</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">All-in-One</div>
                              <div className="text-purple-300 text-sm">Platform</div>
                            </div>
                          </div>
                        ) : index === 1 ? (
                          <div className="w-80 h-80 mx-auto rounded-3xl bg-gradient-to-br from-green-900 to-slate-800 p-6 flex flex-col justify-center items-center">
                            <div className="bg-white/10 rounded-2xl p-6 w-full">
                              <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-green-400">0%</div>
                                <div className="text-white text-sm">Interest Rate</div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-300">Transaction Fee</span>
                                  <span className="text-green-400">$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-300">Hidden Charges</span>
                                  <span className="text-green-400">$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-300">Monthly Fee</span>
                                  <span className="text-green-400">$0.00</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : index === 2 ? (
                          <div className="w-80 h-80 mx-auto rounded-3xl bg-gradient-to-br from-yellow-900 to-slate-800 p-6 flex flex-col justify-center">
                            <div className="text-center mb-6">
                              <div className="text-4xl font-bold text-yellow-400">1,250</div>
                              <div className="text-white text-sm">Reward Points</div>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                                <span className="text-white text-sm">Cashback</span>
                                <span className="text-yellow-400 font-bold">5%</span>
                              </div>
                              <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                                <span className="text-white text-sm">Gaming Bonus</span>
                                <span className="text-yellow-400 font-bold">10%</span>
                              </div>
                              <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                                <span className="text-white text-sm">Exclusive Offers</span>
                                <span className="text-yellow-400 font-bold">∞</span>
                              </div>
                            </div>
                          </div>
                        ) : index === 3 ? (
                          <div className="w-80 h-80 mx-auto rounded-3xl bg-gradient-to-br from-blue-900 to-slate-800 p-6 flex flex-col justify-center">
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Level 47</span>
                                <span className="text-cyan-400 text-sm">2,840 XP</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-blue-400 to-cyan-400 h-3 rounded-full"
                                  style={{ width: "75%" }}
                                ></div>
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">#1 Player_Pro</span>
                                <span className="text-cyan-400">15,420 XP</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">#2 GamerX</span>
                                <span className="text-cyan-400">12,890 XP</span>
                              </div>
                              <div className="flex items-center justify-between text-sm bg-white/10 rounded p-2">
                                <span className="text-white">#3 You</span>
                                <span className="text-cyan-400">8,940 XP</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                              <div className="text-cyan-400 text-sm">Leaderboard</div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-80 h-80 mx-auto rounded-3xl bg-gradient-to-br from-cyan-900 to-slate-800 p-6 flex flex-col justify-center items-center">
                            <div className="relative mb-6">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center mb-4 mx-auto">
                                <Cpu className="w-10 h-10 text-white" />
                              </div>
                              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                              <div className="absolute top-1/2 -right-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="space-y-2 w-full">
                              <div className="bg-white/10 rounded-lg p-2 text-center">
                                <div className="text-cyan-400 text-xs">AI Recommendation</div>
                                <div className="text-white text-sm">"Try this new game!"</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-2 text-center">
                                <div className="text-cyan-400 text-xs">Smart Analysis</div>
                                <div className="text-white text-sm">"Budget optimized"</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center mt-12 space-x-3">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === activeFeature
                      ? "w-12 bg-white"
                      : index < activeFeature
                        ? "w-8 bg-white/60"
                        : "w-6 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
