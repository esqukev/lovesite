export type VisitorRole = "guest" | "owner";

/** motzy = ella (ve la invitación). kevin = tú (sin invitación). */
export const GATE_PASSWORDS: Record<string, VisitorRole> = {
  motzy: "guest",
  kevin: "owner",
};

/** sessionStorage key for the gate password (used to authorize photo uploads) */
export const GATE_KEY_STORAGE = "motzy-gate-key";

export const INVITE_ACCEPTED_KEY = "motzy-date-invite-accepted";
/** Kevin: la invitación de prueba solo una vez por navegador */
export const OWNER_INVITE_SEEN_KEY = "motzy-owner-invite-seen";
export const VISITOR_ROLE_KEY = "motzy-visitor-role";

/** Domingo 16 de agosto 2026 — Costa Rica */
export const DATE_INVITE = {
  label: "Domingo 16",
  title: "Nuestra cita ❤️",
  /** Apple Calendar file in /public/cita.ics */
  icsPath: "/cita.ics",
} as const;

/** Motzy — destino real cuando entra con contraseña motzy */
export const MOTZY_WHATSAPP_NUMBER = "50663060175";

/** Kevin — para probar la invitación con contraseña kevin */
export const KEVIN_WHATSAPP_NUMBER = "50661371097";

/**
 * URL pública del sitio (para que el link del .ics funcione en su celular).
 * Si está vacío, usa el dominio actual (debe probarse en el deploy, no en localhost).
 */
export const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

/** Full https URL to the .ics (Apple Calendar opens this on iPhone) */
export function getDateCalendarUrl(origin?: string) {
  const base =
    origin ||
    PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${DATE_INVITE.icsPath}`;
}

function whatsappNumberForRole(role?: VisitorRole | null) {
  // kevin = pruebas a tu número; motzy/guest = número de ella
  if (role === "owner") return KEVIN_WHATSAPP_NUMBER;
  return MOTZY_WHATSAPP_NUMBER;
}

/**
 * WhatsApp con el link de Apple Calendar.
 * motzy → su número · kevin → tu número (pruebas)
 */
export function getDateWhatsAppUrl(
  origin?: string,
  role?: VisitorRole | null,
) {
  const calendarUrl = getDateCalendarUrl(origin);
  const text = [
    "Confirmé nuestra cita del domingo 16 ❤️",
    "",
    "Abre tu celular y confirma este link:",
    calendarUrl,
  ].join("\n");

  const encoded = encodeURIComponent(text);
  const phone = whatsappNumberForRole(role).replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encoded}`;
}

export const WELCOME_LETTER = `Si estás viendo esto, es porque encontraste la llave de nuestro pequeño universo.

Quería hacerte algo que pudiera quedarse para siempre; un lugar donde nuestros recuerdos no se pierdan.

Aquí quiero guardar pedacitos de nosotros, porque contigo hasta los momentos más simples terminan siendo extraordinarios.

Ojalá este rincón siga creciendo con cada aventura, cada abrazo y cada risa que nos espera.

Bienvenida, Motzy. ❤️`;

export const MEMORIES = [
  {
    id: "birthday",
    title: "Mi cumpleaños",
    date: "26 Febrero",
    description:
      "El regalito de cumpleaños fue algo que jamás esperaba y me sentí tan enamorado y la foto que me hizo fue algo especial.",
    image: "/foto.jpeg",
  },
  {
    id: "te-amo",
    title: "El primer te amo",
    date: "Por ahí de Febrero",
    description:
      "Recuerdo la primera vez que me dijo te amo, estaba casi dormida pero yo sentí como si se me hubiera salido el corazón. Era algo que ya venía sintiendo hace tiempo y para mi fue como un alivio saber que también sentía lo mismo.",
    image: "/foto2.jpeg",
  },
  {
    id: "citas",
    title: "Las primeras citas",
    date: "Por ahí de Diciembre-Enero",
    description:
      "No sabía que estaba pasando al inicio pero esas salidas me hacían sentir lindo. Sentía que teniamos quimica y que algo bonito podía pasar entre nosotros.",
    image: "/foto4.jpeg",
  },
  {
    id: "visita",
    title: "Primera visita",
    date: "Enero-Febrero",
    description:
      "Recuerdo cuando me dijo que debía ir a pedir la mano, pero recuerdo más cuando me tocaba, estaba tan pero tan nervioso. Una vez que lo hice me sentí tan bien, sentía que ya estabamos teniendo algo único.",
    image: "/foto5.jpeg",
  },
  {
    id: "baile",
    title: "Mi primer baile",
    date: "Febrero-Marzo",
    description:
      "Mi primer baile fue tan divertido, usted enseñandome a bailar por primera vez, llevandome al rancho y yo sin ninguna verguenza haciendo todo por mi amor y pasandola bomba.",
    image: "/foto6.jpeg",
  },
  {
    id: "avocat",
    title: "Avocat",
    date: "Tu pintura",
    description:
      "La pintura que me hiciste. Un pedazo de tu arte y de tu corazón que ahora vive aquí, con nosotros.",
    image: "/avocat.jpeg",
  },
] as const;

export const GALLERY_IMAGES = [
  { src: "/foto.jpeg", alt: "Marina de Flamingo.", span: "tall" as const },
  { src: "/foto2.jpeg", alt: "Diciembre juntos sin bigote.", span: "normal" as const },
  { src: "/foto4.jpeg", alt: "Salida a Fortuna con Negro Crazy", span: "normal" as const },
  { src: "/foto5.jpeg", alt: "Vacilando en el gym como de costumbre.", span: "tall" as const },
  { src: "/foto6.jpeg", alt: "Su primer día con pelo negro.", span: "normal" as const },
  { src: "/foto7.jpeg", alt: "Saliendo de la iglesia.", span: "normal" as const },
  { src: "/foto8.jpeg", alt: "Cita en la expo.", span: "tall" as const },
  { src: "/foto9.jpeg", alt: "En las buena y en las malas.", span: "normal" as const },
  { src: "/foto10.jpeg", alt: "Nuestro primer San Valentin.", span: "normal" as const },
  { src: "/avocat.jpeg", alt: "AVOCAT.", span: "wide" as const, featured: true },
  { src: "/foto11.jpeg", alt: "Primera foto que subió juntos.", span: "wide" as const },
  { src: "/foto12.jpeg", alt: "Donde sea.", span: "normal" as const },
  { src: "/foto13.jpeg", alt: "Me encanta verte sonreír.", span: "tall" as const },
  { src: "/foto15.jpeg", alt: "Enamorado.", span: "normal" as const },
  { src: "/foto16.jpeg", alt: "Me encanta entrenar con mi motzy.", span: "normal" as const },
];

export const PLACES = [
  {
    id: "nuevo-arenal",
    name: "Nuevo Arenal",
    description: "BBQ en la laguna con las chiquillas.",
    image: "/foto7.jpeg",
    position: [10.5333, -84.8833] as [number, number],
  },
  {
    id: "oxigeno",
    name: "Oxígeno",
    description: "El mall más feo que hemos visitado.",
    image: "/foto8.jpeg",
    position: [9.976, -84.146] as [number, number],
  },
  {
    id: "paseo",
    name: "Paseo de las Flores",
    description: "El segundo mall más feo que hemos visitado.",
    image: "/foto9.jpeg",
    position: [9.998, -84.123] as [number, number],
  },
  {
    id: "fortuna",
    name: "La Fortuna",
    description: "Montones de actividades que hemos hecho.",
    image: "/foto10.jpeg",
    position: [10.471, -84.645] as [number, number],
  },
  {
    id: "jaco",
    name: "Jacó",
    description: "Un paseito en familia.",
    image: "/foto11.jpeg",
    position: [9.614, -84.629] as [number, number],
  },
  {
    id: "hermosa",
    name: "Hermosa",
    description: "Nuestra primera ida a la playa.",
    image: "/foto12.jpeg",
    position: [9.556, -84.591] as [number, number],
  },
  {
    id: "riu",
    name: "RIU Guanacaste",
    description: "Lo planeamos mucho y lo logramos.",
    image: "/foto13.jpeg",
    position: [10.58, -85.68] as [number, number],
  },
  {
    id: "pedregal",
    name: "Pedregal",
    description: "Expo Auto para ir a motivarnos.",
    image: "/foto15.jpeg",
    position: [9.93, -84.12] as [number, number],
  },
];

export const REASONS = [
  "Cada momento contigo es único.",
  "Me haces sumamente feliz.",
  "Siempre la pasamos increíble.",
  "Nuestra intimidad siempre es increíble.",
  "Eres mi mejor amiga.",
  "Siempre me das amor y cariño.",
  "Nuestra conexión no tiene comparación.",
  "Eres el amor de mi vida.",
  "Eres la mujer más hermosa.",
  "Eres la persona más divertida que existe.",
];

export const WISHLIST = [
  { id: "viajar", label: "Viajar" },
  { id: "picnic", label: "Picnic" },
  { id: "cerro", label: "Cerro Pelado" },
  { id: "playa", label: "Ir a la playa" },
  { id: "acampar", label: "Acampar" },
  { id: "fotos", label: "Tomarnos más fotos" },
  { id: "fit", label: "Ser más fit juntos" },
  { id: "lugares", label: "Conocer más lugares" },
];

export const HIDDEN_PHRASES = [
  "Hasta las cosas más sencillas las volvemos especiales.",
  "Gracias por existir.",
  "Eres mi lugar favorito.",
  "Qué suerte tengo de coincidir contigo.",
  "Siempre volvería a elegirte.",
  "Hogar también puede ser una persona.",
  "El mejor plan siempre termina siendo contigo.",
];

export const STAR_PHRASES = [
  "Te elijo en cada versión del universo.",
  "Contigo el tiempo se vuelve suave.",
  "Mi lugar seguro tiene tu nombre.",
  "Hasta el silencio contigo suena bonito.",
  "Eres magia disfrazada de cotidianidad.",
  "Si el amor tuviera dirección, sería hacia ti.",
];

export const EASTER_EGG_IDS = [
  "heart-float",
  "photo-particles",
  "title-hold",
  "footer-secret",
  "star-phrase",
  "slow-particles",
  "word-react",
  "all-reasons",
  "cat-meow",
  "phrase-orb",
] as const;

export type EasterEggId = (typeof EASTER_EGG_IDS)[number];
