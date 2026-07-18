import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./SettingsForm.css";

// Small local translation dictionary. Only a couple of strings need to
// change to demonstrate the language switch — add more keys as needed.
const translations = {
  en: {
    title: "Settings",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    notifications: "Notification preference",
    darkMode: "Dark mode",
    language: "Language",
    submit: "Save settings",
    success: "Settings saved successfully!",
  },
  es: {
    title: "Configuración",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    notifications: "Preferencia de notificaciones",
    darkMode: "Modo oscuro",
    language: "Idioma",
    submit: "Guardar configuración",
    success: "¡Configuración guardada correctamente!",
  },
};

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z
    .string()
    .min(1, "Invalid email address")
    .email("Invalid email address"),
  notification: z.enum(["All", "Important only", "None"]),
});

const THEME_STORAGE_KEY = "settings-form-theme";

export default function SettingsForm() {
  const [language, setLanguage] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = translations[language];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      notification: "All",
    },
  });

  // Restore theme preference from localStorage on mount.
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const dark = stored === "dark";
    setIsDarkMode(dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, []);

  const handleThemeToggle = (event) => {
    const dark = event.target.checked;
    setIsDarkMode(dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  };

  const onSubmit = (data) => {
    console.log(data);
    setSubmitted(true);
  };

  return (
    <div className="settings-form-container">
      <h1>{t.title}</h1>

      <div className="settings-form-field settings-form-language">
        <label htmlFor="language-select">{t.language}</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="settings-form-field">
          <label htmlFor="firstName">{t.firstName}</label>
          <input id="firstName" type="text" {...register("firstName")} />
          {errors.firstName && (
            <span className="settings-form-error" role="alert">
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div className="settings-form-field">
          <label htmlFor="lastName">{t.lastName}</label>
          <input id="lastName" type="text" {...register("lastName")} />
          {errors.lastName && (
            <span className="settings-form-error" role="alert">
              {errors.lastName.message}
            </span>
          )}
        </div>

        <div className="settings-form-field">
          <label htmlFor="email">{t.email}</label>
          <input id="email" type="text" {...register("email")} />
          {errors.email && (
            <span className="settings-form-error" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        <fieldset className="settings-form-field">
          <legend>{t.notifications}</legend>

          <div className="settings-form-radio-option">
            <input
              id="notification-all"
              type="radio"
              value="All"
              {...register("notification")}
            />
            <label htmlFor="notification-all">All</label>
          </div>

          <div className="settings-form-radio-option">
            <input
              id="notification-important"
              type="radio"
              value="Important only"
              {...register("notification")}
            />
            <label htmlFor="notification-important">Important only</label>
          </div>

          <div className="settings-form-radio-option">
            <input
              id="notification-none"
              type="radio"
              value="None"
              {...register("notification")}
            />
            <label htmlFor="notification-none">None</label>
          </div>

          {errors.notification && (
            <span className="settings-form-error" role="alert">
              {errors.notification.message}
            </span>
          )}
        </fieldset>

        <div className="settings-form-field settings-form-toggle">
          <label htmlFor="dark-mode-toggle">{t.darkMode}</label>
          <input
            id="dark-mode-toggle"
            type="checkbox"
            checked={isDarkMode}
            onChange={handleThemeToggle}
          />
        </div>

        <button type="submit">{t.submit}</button>

        {submitted && (
          <p className="settings-form-success" role="status">
            {t.success}
          </p>
        )}
      </form>
    </div>
  );
}
