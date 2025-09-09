export function About() {
  return (
    <section id="about" className="py-20 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Passionate about creating digital experiences that make a difference
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              I&apos;m a passionate full-stack developer with over 3 years of experience in creating 
              digital solutions that combine beautiful design with powerful functionality. 
              I love turning complex problems into simple, elegant solutions.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              When I&apos;m not coding, you can find me exploring new technologies, 
              contributing to open source projects, or sharing knowledge with the developer community.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm">
                React
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm">
                TypeScript
              </span>
              <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
                Node.js
              </span>
              <span className="bg-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-sm">
                Next.js
              </span>
              <span className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm">
                JavaScript
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Skills & Technologies</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-purple-300 font-semibold">Frontend</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• React & Next.js</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                      <li>• Framer Motion</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-pink-300 font-semibold">Backend</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Node.js</li>
                      <li>• Express</li>
                      <li>• MongoDB</li>
                      <li>• PostgreSQL</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
