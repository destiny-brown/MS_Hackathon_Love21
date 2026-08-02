import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAdmin from "@/locales/en/admin.json";
import enAuth from "@/locales/en/auth.json";
import enCommon from "@/locales/en/common.json";
import enDashboard from "@/locales/en/dashboard.json";
import enDonate from "@/locales/en/donate.json";
import enForms from "@/locales/en/forms.json";
import enGetInvolved from "@/locales/en/getInvolved.json";
import enGovernance from "@/locales/en/governance.json";
import enHome from "@/locales/en/home.json";
import enImpact from "@/locales/en/impact.json";
import enLearn from "@/locales/en/learn.json";
import enMedia from "@/locales/en/media.json";
import enPages from "@/locales/en/pages.json";
import enVolunteer from "@/locales/en/volunteer.json";
import yueAdmin from "@/locales/yue/admin.json";
import yueAuth from "@/locales/yue/auth.json";
import yueCommon from "@/locales/yue/common.json";
import yueDashboard from "@/locales/yue/dashboard.json";
import yueDonate from "@/locales/yue/donate.json";
import yueForms from "@/locales/yue/forms.json";
import yueGetInvolved from "@/locales/yue/getInvolved.json";
import yueGovernance from "@/locales/yue/governance.json";
import yueHome from "@/locales/yue/home.json";
import yueImpact from "@/locales/yue/impact.json";
import yueLearn from "@/locales/yue/learn.json";
import yueMedia from "@/locales/yue/media.json";
import yuePages from "@/locales/yue/pages.json";
import yueVolunteer from "@/locales/yue/volunteer.json";
import zhAdmin from "@/locales/zh/admin.json";
import zhAuth from "@/locales/zh/auth.json";
import zhCommon from "@/locales/zh/common.json";
import zhDashboard from "@/locales/zh/dashboard.json";
import zhDonate from "@/locales/zh/donate.json";
import zhForms from "@/locales/zh/forms.json";
import zhGetInvolved from "@/locales/zh/getInvolved.json";
import zhGovernance from "@/locales/zh/governance.json";
import zhHome from "@/locales/zh/home.json";
import zhImpact from "@/locales/zh/impact.json";
import zhLearn from "@/locales/zh/learn.json";
import zhMedia from "@/locales/zh/media.json";
import zhPages from "@/locales/zh/pages.json";
import zhVolunteer from "@/locales/zh/volunteer.json";
import { i18nNamespaces } from "@/lib/i18n/locales";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    pages: enPages,
    forms: enForms,
    auth: enAuth,
    governance: enGovernance,
    donate: enDonate,
    media: enMedia,
    impact: enImpact,
    learn: enLearn,
    volunteer: enVolunteer,
    getInvolved: enGetInvolved,
    dashboard: enDashboard,
    admin: enAdmin,
  },
  yue: {
    common: yueCommon,
    home: yueHome,
    pages: yuePages,
    forms: yueForms,
    auth: yueAuth,
    governance: yueGovernance,
    donate: yueDonate,
    media: yueMedia,
    impact: yueImpact,
    learn: yueLearn,
    volunteer: yueVolunteer,
    getInvolved: yueGetInvolved,
    dashboard: yueDashboard,
    admin: yueAdmin,
  },
  zh: {
    common: zhCommon,
    home: zhHome,
    pages: zhPages,
    forms: zhForms,
    auth: zhAuth,
    governance: zhGovernance,
    donate: zhDonate,
    media: zhMedia,
    impact: zhImpact,
    learn: zhLearn,
    volunteer: zhVolunteer,
    getInvolved: zhGetInvolved,
    dashboard: zhDashboard,
    admin: zhAdmin,
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: [...i18nNamespaces],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
