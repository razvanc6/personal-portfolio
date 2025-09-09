export function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with Next.js, featuring user authentication, payment integration, and admin dashboard.",
      image: "/api/placeholder/600/400",
      technologies: ["Next.js", "TypeScript", "Stripe", "MongoDB"],
      link: "#"
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "/api/placeholder/600/400",
      technologies: ["React", "Node.js", "Socket.io", "PostgreSQL"],
      link: "#"
    },
    {
      title: "Weather Dashboard",
      description: "A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
      image: "/api/placeholder/600/400",
      technologies: ["Vue.js", "Chart.js", "OpenWeather API"],
      link: "#"
    }
  ]

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and passion for development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">Project Image</p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <a 
                    href={project.link}
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-semibold"
                  >
                    View Project →
                  </a>
                  <a 
                    href={project.link}
                    className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
