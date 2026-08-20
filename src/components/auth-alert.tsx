'use client'

type AuthAlertVariant = 'error' | 'success'

type AuthAlertProps = {
  variant: AuthAlertVariant
  title: string
  message: string
  onClose?: () => void
}

export default function AuthAlert({ variant, title, message, onClose }: AuthAlertProps) {
  const isSuccess = variant === 'success'

  return (
    <div
      className={isSuccess ? 'auth-alert auth-alert-success' : 'auth-alert auth-alert-error'}
      role="alert"
      aria-live="polite"
    >
      <div className="auth-alert-content">
        <p className="auth-alert-title">{title}</p>
        <p className="auth-alert-message">{message}</p>
      </div>
      {onClose && (
        <button type="button" className="auth-alert-close" onClick={onClose} aria-label="Close alert">
          &times;
        </button>
      )}
    </div>
  )
}
