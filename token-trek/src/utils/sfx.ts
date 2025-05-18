const tokenSound = new Audio('/audio/token.mp3')
const collisionSound = new Audio('/audio/collision.mp3')
const powerupSound = new Audio('/audio/powerup.mp3')

function play(sound: HTMLAudioElement) {
  sound.currentTime = 0
  sound.play().catch(() => {})
}

export function playToken() {
  play(tokenSound)
}

export function playCollision() {
  play(collisionSound)
}

export function playPowerup() {
  play(powerupSound)
}
