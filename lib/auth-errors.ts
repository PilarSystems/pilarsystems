/**
 * Maps Supabase auth error messages to German user-friendly messages
 */
export function getAuthErrorMessage(error: any): string {
  const message = error?.message || ''
  
  if (message.includes('User already registered')) {
    return 'Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an oder verwenden Sie eine andere E-Mail.'
  }
  if (message.includes('Password should be at least')) {
    return 'Das Passwort muss mindestens 8 Zeichen lang sein.'
  }
  if (message.includes('Signup requires a valid password')) {
    return 'Bitte geben Sie ein gültiges Passwort ein.'
  }
  if (message.includes('Unable to validate email address')) {
    return 'Die E-Mail-Adresse ist ungültig. Bitte überprüfen Sie Ihre Eingabe.'
  }
  
  if (message.includes('Invalid login credentials')) {
    return 'E-Mail oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Prüfen Sie Ihr Postfach.'
  }
  if (message.includes('Invalid email')) {
    return 'Die E-Mail-Adresse ist ungültig.'
  }
  
  if (message.includes('Email rate limit exceeded')) {
    return 'Zu viele Anfragen. Bitte warten Sie einige Minuten und versuchen Sie es erneut.'
  }
  if (message.includes('Too many requests')) {
    return 'Zu viele Versuche. Bitte warten Sie einige Minuten.'
  }
  
  if (message.includes('Unable to send email')) {
    return 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.'
  }
  if (message.includes('For security purposes')) {
    return 'Aus Sicherheitsgründen können Sie das Passwort erst nach einiger Zeit erneut zurücksetzen.'
  }
  
  if (message.includes('Failed to fetch') || message.includes('Network')) {
    return 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.'
  }
  
  return 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Mindestens 8 Zeichen erforderlich' }
  }
  if (password.length > 72) {
    return { valid: false, message: 'Maximal 72 Zeichen erlaubt' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Mindestens ein Großbuchstabe erforderlich' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Mindestens ein Kleinbuchstabe erforderlich' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Mindestens eine Zahl erforderlich' }
  }
  return { valid: true }
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
