import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import './SettingsForm.css'

const DEFAULTS = {
  displayName: 'Alex Morgan',
  email: 'alex@example.com',
  bio: 'Product designer based in Berlin.',
  theme: 'system',
  language: 'en',
  timezone: 'Europe/Berlin',
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
  marketingEmails: false,
  profilePublic: true,
  showActivity: false,
  twoFactor: true,
}

const settingsSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Enter a valid email address'),
  bio: z.string().max(280, 'Bio must be 280 characters or fewer'),
  theme: z.enum(['system', 'light', 'dark']),
  language: z.enum(['en', 'de', 'fr', 'es']),
  timezone: z.string().min(1, 'Select a timezone'),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  marketingEmails: z.boolean(),
  profilePublic: z.boolean(),
  showActivity: z.boolean(),
  twoFactor: z.boolean(),
})

function Field({ label, hint, error, children }) {
  return (
    <div className="settings-form__field">
      <label>{label}</label>
      {hint ? <span className="settings-form__hint">{hint}</span> : null}
      {children}
      {error ? <p className="settings-form__error">{error}</p> : null}
    </div>
  )
}

function ToggleRow({ label, description, name, register }) {
  return (
    <div className="settings-form__row">
      <div className="settings-form__row-label">
        <span>{label}</span>
        {description ? <small>{description}</small> : null}
      </div>
      <label className="settings-form__toggle">
        <input type="checkbox" {...register(name)} />
        <span className="settings-form__toggle-slider" />
      </label>
    </div>
  )
}

export default function SettingsForm() {
  const [savedAt, setSavedAt] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: DEFAULTS,
  })

  function onSubmit() {
    setSavedAt(new Date().toLocaleTimeString())
  }

  function handleReset() {
    reset(DEFAULTS)
    setSavedAt(null)
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p className="settings-form__subtitle">
          Manage your profile, preferences, and notification settings.
        </p>
      </header>

      {savedAt ? (
        <div className="settings-form__banner" role="status">
          Settings saved at {savedAt}.
        </div>
      ) : null}

      <details className="settings-form__section" open>
        <summary>Profile</summary>
        <div className="settings-form__section-body">
          <Field
            label="Display name"
            hint="Shown on your profile and comments."
            error={errors.displayName?.message}
          >
            <input
              className="settings-form__input"
              type="text"
              placeholder="Your name"
              {...register('displayName')}
            />
          </Field>
          <Field
            label="Email"
            hint="Used for login and account recovery."
            error={errors.email?.message}
          >
            <input
              className="settings-form__input"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
          </Field>
          <Field
            label="Bio"
            hint="A short description for your public profile."
            error={errors.bio?.message}
          >
            <textarea
              className="settings-form__textarea"
              placeholder="Tell people a little about yourself…"
              rows={3}
              {...register('bio')}
            />
          </Field>
        </div>
      </details>

      <details className="settings-form__section" open>
        <summary>Appearance &amp; region</summary>
        <div className="settings-form__section-body">
          <Field label="Theme" error={errors.theme?.message}>
            <select className="settings-form__select" {...register('theme')}>
              <option value="system">System default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Field>
          <Field label="Language" error={errors.language?.message}>
            <select className="settings-form__select" {...register('language')}>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </Field>
          <Field label="Timezone" error={errors.timezone?.message}>
            <select className="settings-form__select" {...register('timezone')}>
              <option value="America/New_York">Eastern Time (US)</option>
              <option value="America/Los_Angeles">Pacific Time (US)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Berlin">Berlin</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </Field>
        </div>
      </details>

      <details className="settings-form__section">
        <summary>Notifications</summary>
        <div className="settings-form__section-body">
          <ToggleRow
            label="Email notifications"
            description="Receive updates about activity on your account."
            name="emailNotifications"
            register={register}
          />
          <ToggleRow
            label="Push notifications"
            description="Alerts delivered to your browser or device."
            name="pushNotifications"
            register={register}
          />
          <ToggleRow
            label="Weekly digest"
            description="A summary of activity sent every Monday."
            name="weeklyDigest"
            register={register}
          />
          <ToggleRow
            label="Product updates"
            description="News about new features and improvements."
            name="marketingEmails"
            register={register}
          />
        </div>
      </details>

      <details className="settings-form__section">
        <summary>Privacy &amp; security</summary>
        <div className="settings-form__section-body">
          <h3 className="settings-form__subheading">Visibility</h3>
          <label className="settings-form__checkbox">
            <input type="checkbox" {...register('profilePublic')} />
            Make my profile public
          </label>
          <label className="settings-form__checkbox">
            <input type="checkbox" {...register('showActivity')} />
            Show my activity status to others
          </label>
          <hr className="settings-form__divider" />
          <h3 className="settings-form__subheading">Security</h3>
          <label className="settings-form__checkbox">
            <input type="checkbox" {...register('twoFactor')} />
            Enable two-factor authentication
          </label>
        </div>
      </details>

      <div className="settings-form__actions">
        <button type="submit" className="settings-form__button settings-form__button--primary">
          Save changes
        </button>
        <button
          type="button"
          className="settings-form__button settings-form__button--ghost"
          onClick={handleReset}
          disabled={!isDirty && !savedAt}
        >
          Reset to defaults
        </button>
        {isDirty && !savedAt ? (
          <span className="settings-form__status">Unsaved changes</span>
        ) : null}
      </div>
    </form>
  )
}
