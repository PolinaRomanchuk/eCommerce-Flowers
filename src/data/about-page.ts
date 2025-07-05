type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  github: string;
  contributions: string;
};
type Question = {
  question: string;
  answer: string[];
};

type Work = {
  id: number;
  name: string;
};

export const TeamMembers: TeamMember[] = [
  {
    name: 'Dzmitryj Saldacenka',
    role: 'Team Lead/Frontend Developer',
    bio: `I'm 23. A logistician by degree, a programmer by passion.I love music, fishing, and football. And I love making people laugh and lifting their mood.`,
    photo: '../assets/photos/dima.jpg',
    github: 'https://github.com/Dimonchik2525',
    contributions: `Set up the repository, catalog page, main page.`,
  },
  {
    name: 'Polina Romanchuk',
    role: 'Frontend Developer/CommerceTools',
    bio: `I'm 25. I used to work as a lawyer, but over time I realized that programming 
      feels much closer to me. I love discovering new things, laughing, cats, nature, mountains, seas, and traveling.`,
    photo: '../assets/photos/polina.jpg',
    github: 'https://github.com/PolinaRomanchuk',
    contributions: `Set up the CommerceTools, authentication, authorization, detailed product page, cart.`,
  },
  {
    name: 'Artsiom Luksha',
    role: 'Frontend Developer/Scrum Master',
    bio: `I’m 31. I hold a bachelor’s in economics and law from Yanka Kupala State University.  
    Outside of coding, I train at the gym, cycle, explore museums, and read or watch films.`,
    photo: '../assets/photos/artem.jpg',
    github: 'https://github.com/AirDrop94',
    contributions: `Registration page, user profile page, about us page.`,
  },
];

export const Questions: Question[] = [
  {
    question: 'What We Did?',
    answer: [
      `This was the final project of the Rolling Scopes School course — a team-based development of 
      a single-page eCommerce application built on top of the commercetools platform. 
      Our goal was to build a modern, user-friendly, and stable web application with full eCommerce 
      functionality, using the commercetools API and best practices of team collaboration.`,
      `The initial concept was a clothing store, but after the course ended, I decided to continue 
      the development independently and completely changed the direction.Today, the project has evolved 
      into FloralMuse — a modern online store for flowers and plants.`,
    ],
  },
  {
    question: 'How We Worked?',
    answer: [
      `•	Team of 3 developers`,
      `•	Followed the Git flow: each feature was developed in a separate branch with pull requests and code reviews`,
      `•	Used Jira for task management and sprint planning`,
      `•	Communication through Discord, with regular meetings at least twice a week`,
      `•	Tasks were organized into 2-week sprints`,
    ],
  },
  {
    question: `Key Objectives`,
    answer: [
      `•	Integration with commercetools (headless eCommerce platform)`,
      `•	Development of a fully functional SPA using React, TypeScript, and Webpack`,
      `•	Implementation of key features:`,
      `o	Product catalog with filtering, sorting, and category pages`,
      `o	Product detail page with full info and "add to cart" functionality`,
      `o	Shopping cart with price calculation, promo codes, quantity editing, and item removal`,
      `o	Authorization: login and registration`,
      `o	User profile with editable personal data, delivery addresses, and password management`,
      `o	"About the Team" page to showcase collaboration`,
      `•	Working with external data (products, categories) via REST API`,
      `•	Responsive design, UI animations, and improved UX details`,
    ],
  },
  {
    question: 'Technologies Used',
    answer: [
      `•	React, TypeScript`,
      `•	Scss for styling`,
      `•	Formik and Yup for forms and validation`,
      `•	Swiper for animations and sliders`,
      `•	Jest for testing`,
      `•	Husky, ESLint, Prettier for code quality and consistency`,
    ],
  },
  {
    question: `Final Result`,
    answer: [
      `•	A fully working SPA with a clean and intuitive UI, mobile responsiveness, and scalable architecture`,
      `•	Clean and well-structured codebase, partially covered by unit tests`,
      `•	Automated checks for pull requests and consistent code quality across the team`,
    ],
  },
];

export const OwnWork: Work[] = [
  {
    id: 1,
    name: 'Full redesign: new layout, colors, UI inspired by open-source templates',
  },
  {
    id: 2,
    name: 'Rebranded the app into FloralMuse — flower & plant eCommerce',
  },
  {
    id: 3,
    name: 'Added new categories and enhanced filters (by color, type, etc.)',
  },
  {
    id: 4,
    name: 'Rewrote styling with Sass, improved mobile responsiveness',
  },
  {
    id: 5,
    name: 'Refactored codebase for readability, scalability & UX',
  },
];

export const TeamWork: Work[] = [
  {
    id: 1,
    name: 'Authorization: login, registration, anonymous & authenticated access',
  },
  {
    id: 2,
    name: 'Cart system: global add-to-cart functionality on all pages',
  },
  {
    id: 3,
    name: 'Product detail page: full product info & actions',
  },
  {
    id: 4,
    name: 'Helped resolve bugs & integration issues',
  },
];
