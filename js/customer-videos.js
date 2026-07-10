/* Pause other testimonial videos when one starts playing */
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.customer-video-card video');
  videos.forEach(video => {
    video.addEventListener('play', () => {
      videos.forEach(other => {
        if (other !== video && !other.paused) other.pause();
      });
    });
  });
});
