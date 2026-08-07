export const GATE_PASSWORD = "motzy";

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
  { src: "/foto.jpeg", alt: "Recuerdo juntos", span: "tall" as const },
  { src: "/foto2.jpeg", alt: "Momento especial", span: "normal" as const },
  { src: "/foto4.jpeg", alt: "Sonrisas", span: "normal" as const },
  { src: "/avocat.jpeg", alt: "Avocat — tu pintura", span: "wide" as const, featured: true },
  { src: "/foto5.jpeg", alt: "Aventura", span: "tall" as const },
  { src: "/foto6.jpeg", alt: "Cariño", span: "normal" as const },
  { src: "/foto7.jpeg", alt: "Día soleado", span: "normal" as const },
  { src: "/foto8.jpeg", alt: "Juntos", span: "tall" as const },
  { src: "/foto9.jpeg", alt: "Mirada", span: "normal" as const },
  { src: "/foto10.jpeg", alt: "Paz", span: "normal" as const },
  { src: "/foto11.jpeg", alt: "Recuerdo", span: "wide" as const },
  { src: "/foto12.jpeg", alt: "Risa", span: "normal" as const },
  { src: "/foto13.jpeg", alt: "Cercanía", span: "tall" as const },
  { src: "/foto15.jpeg", alt: "Historia", span: "normal" as const },
  { src: "/foto16.jpeg", alt: "Nosotros", span: "normal" as const },
];

export const PLACES = [
  {
    id: "nuevo-arenal",
    name: "Nuevo Arenal",
    description: "Aire fresco, vistas que se quedan y la sensación de estar exactamente donde debíamos.",
    image: "/foto7.jpeg",
    position: [10.5333, -84.8833] as [number, number],
  },
  {
    id: "oxigeno",
    name: "Oxígeno",
    description: "Un respiro juntos. Conversaciones, ambiente y un recuerdo que brilla suave.",
    image: "/foto8.jpeg",
    position: [9.976, -84.146] as [number, number],
  },
  {
    id: "paseo",
    name: "Paseo de las Flores",
    description: "Caminar sin prisa, mirarnos entre vitrinas y convertir lo cotidiano en cita.",
    image: "/foto9.jpeg",
    position: [9.998, -84.123] as [number, number],
  },
  {
    id: "fortuna",
    name: "La Fortuna",
    description: "Volcán, aventura y esa energía que solo aparece cuando estamos juntos.",
    image: "/foto10.jpeg",
    position: [10.471, -84.645] as [number, number],
  },
  {
    id: "jaco",
    name: "Jacó",
    description: "Arena, sol y el sonido del mar como banda sonora de nosotros.",
    image: "/foto11.jpeg",
    position: [9.614, -84.629] as [number, number],
  },
  {
    id: "hermosa",
    name: "Hermosa",
    description: "Como su nombre: un rincón hermoso que se siente aún más contigo.",
    image: "/foto12.jpeg",
    position: [9.556, -84.591] as [number, number],
  },
  {
    id: "riu",
    name: "RIU Guanacaste",
    description: "Atardeceres dorados, risas largas y días que se quedaron guardados.",
    image: "/foto13.jpeg",
    position: [10.58, -85.68] as [number, number],
  },
  {
    id: "pedregal",
    name: "Pedregal",
    description: "Un pedacito más del mapa que ahora tiene tu nombre escrito encima.",
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
] as const;

export type EasterEggId = (typeof EASTER_EGG_IDS)[number];
