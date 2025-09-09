'use client'

interface YouTubeBackgroundProps {
  videoId: string
}

export function YouTubeBackground({ videoId }: YouTubeBackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <iframe
        className="absolute inset-0 w-full h-full object-cover filter blur-sm pointer-events-none"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&fs=0&modestbranding=1`}
        title="Background Video"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
      {/* Overlay pentru blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
    </div>
  )
}
