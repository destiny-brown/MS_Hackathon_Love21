export type Locale = "en" | "es";

const dictionaries = {
  en: {
    appName: "Love 21",
    dashboard: "Dashboard",
    login: "Log in",
    register: "Register",
    logout: "Log out",
    items: "Items",
    createItem: "Create item",
    title: "Title",
    description: "Description",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    cancel: "Cancel",
    signedInAs: "Signed in as",
    language: "Language",
  },
  es: {
    appName: "Love 21",
    dashboard: "Panel",
    login: "Entrar",
    register: "Registro",
    logout: "Salir",
    items: "Elementos",
    createItem: "Crear elemento",
    title: "Título",
    description: "Descripción",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    cancel: "Cancelar",
    signedInAs: "Sesión como",
    language: "Idioma",
  },
} satisfies Record<Locale, Record<string, string>>;

export function t(locale: Locale, key: keyof typeof dictionaries.en): string {
  return dictionaries[locale][key] ?? dictionaries.en[key];
}
