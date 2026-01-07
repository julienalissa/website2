// Système de traduction multilingue - Le Savoré

export type Language = "fr" | "en" | "de";

export interface Translations {
  // Navigation
  nav: {
    home: string;
    about: string;
    menu: string;
    drinks: string;
    events: string;
    gallery: string;
    contact: string;
    reserveTable: string;
  };
  
  // Hero
  hero: {
    tagline: string;
    description: string;
    viewMenu: string;
    reserveTable: string;
  };
  
  // Home Page
  home: {
    seasonalExcellence: string;
    seasonalDescription: string;
    swissCraftsmanship: string;
    craftsmanshipDescription: string;
    readyToDiscover: string;
    reserveDescription: string;
    makeReservation: string;
    viewFullMenu: string;
  };
  
  // About Page
  about: {
    title: string;
    legacy: string;
    legacyText1: string;
    legacyText2: string;
    legacyText3: string;
    philosophy: string;
    swissQuality: string;
    swissQualityText: string;
    seasonalCuisine: string;
    seasonalCuisineText: string;
    culinaryCraftsmanship: string;
    culinaryCraftsmanshipText: string;
    warmHospitality: string;
    warmHospitalityText: string;
  };
  
  // Menu Page
  menu: {
    title: string;
  };
  
  // Drinks Page
  drinks: {
    title: string;
    cocktails: string;
    nonAlcoholic: string;
    wine: string;
    beer: string;
  };
  
  // Events Page
  events: {
    title: string;
    subtitle: string;
    planEvent: string;
    eventTypes: string;
    eventTypesDescription: string;
    smallWedding: string;
    smallWeddingDescription: string;
    baptismBirthday: string;
    baptismBirthdayDescription: string;
    corporateMeal: string;
    corporateMealDescription: string;
    afterCeremonyMeal: string;
    afterCeremonyMealDescription: string;
    experience: string;
    customMenus: string;
    customMenusDescription: string;
    dedicatedService: string;
    dedicatedServiceDescription: string;
    elegantAtmosphere: string;
    elegantAtmosphereDescription: string;
    swissQuality: string;
    swissQualityDescription: string;
    requestInfo: string;
    requestInfoDescription: string;
    eventInquiry: string;
    inquiryReceived: string;
    inquiryReceivedText: string;
    name: string;
    email: string;
    phone: string;
    eventType: string;
    selectEventType: string;
    preferredDate: string;
    numberOfGuests: string;
    message: string;
    messagePlaceholder: string;
    submitInquiry: string;
    cancel: string;
  };
  
  // Gallery Page
  gallery: {
    title: string;
    experience: string;
    experienceDescription: string;
  };
  
  // Contact Page
  contact: {
    title: string;
    getInTouch: string;
    getInTouchDescription: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    sendMessage: string;
    thankYou: string;
    thankYouText: string;
    name: string;
    subject: string;
    message: string;
    send: string;
  };
  
  // Reservation Modal
  reservation: {
    title: string;
    description: string;
    fullName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: string;
    specialRequests: string;
    specialRequestsPlaceholder: string;
    submit: string;
    cancel: string;
    received: string;
    receivedText: string;
    needHelp: string;
    needHelpText: string;
    callUs: string;
  };
  
  // Footer
  footer: {
    discover: string;
    hours: string;
    allRightsReserved: string;
  };
  
  // Common
  common: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    closed: string;
    required: string;
  };
  
  // Hours
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  
  // Opening Status
  openingStatus: {
    nowOpen: string;
    closed: string;
    opensAt: string;
    closedToday: string;
    opensAtLunch: string;
    opensAtDinner: string;
    opensIn30Min: string;
  };
  
  // Opening Experience
  opening: {
    openingFebruary1st: string;
    weAreNowOpen: string;
    welcomeBookTable: string;
    reserveForOpening: string;
    reserveForOpeningNight: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    officialOpening: string;
    officialOpeningSubtext: string;
    reserveTable: string;
    doNotShowAgain: string;
  };
  
  // Reservation Errors
  reservationErrors: {
    closedOnTuesdays: string;
    closedOnThisDay: string;
    noAvailability: string;
    timeSlotsAvailable: string;
    selectTime: string;
    thisTimeNotAvailable: string;
    selectValidTime: string;
  };
  
  // Intro Overlay
  intro: {
    skip: string;
  };
  
  // Legal Info (Menu)
  legal: {
    originsTitle: string;
    beef: string;
    veal: string;
    chicken: string;
    fish: string;
    allergensNote: string;
  };
}

const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      home: "Accueil",
      about: "Notre Histoire",
      menu: "Menu",
      drinks: "Boissons",
      events: "Événements",
      gallery: "Galerie",
      contact: "Contact",
      reserveTable: "Réserver une Table"
    },
    hero: {
      tagline: "Fine Dining en Suisse",
      description: "Découvrez une cuisine méditerranéenne de saison, élaborée avec la qualité suisse et le souci du détail dans une atmosphère élégante et accueillante.",
      viewMenu: "Voir le Menu",
      reserveTable: "Réserver une Table"
    },
    home: {
      seasonalExcellence: "Excellence de Saison",
      seasonalDescription: "Chez Le Savoré, nous célébrons une cuisine méditerranéenne de saison avec la précision et la qualité suisses. Chaque plat reflète notre engagement envers l'approvisionnement local, l'artisanat culinaire et une expérience de restauration élégante et accessible.",
      swissCraftsmanship: "Artisanat Suisse",
      craftsmanshipDescription: "Notre menu met en valeur des ingrédients de saison provenant de producteurs suisses locaux. Des préparations méditerranéennes classiques aux interprétations contemporaines, chaque plat reflète notre dévouement à la qualité, la simplicité et l'excellence culinaire.",
      readyToDiscover: "Prêt à Découvrir le Fine Dining en Suisse ?",
      reserveDescription: "Réservez votre table dès aujourd'hui et rejoignez-nous pour une expérience culinaire inoubliable",
      makeReservation: "Faire une Réservation",
      viewFullMenu: "Voir le Menu Complet"
    },
    about: {
      title: "Notre Histoire",
      legacy: "Excellence Culinaire Suisse",
      legacyText1: "Le Savoré a été fondé avec un engagement envers la qualité suisse et l'excellence culinaire méditerranéenne. Nous croyons en la puissance des ingrédients de saison, l'approvisionnement local, et l'élégance simple d'une cuisine bien travaillée.",
      legacyText2: "Notre approche s'enracine dans la précision suisse et les traditions culinaires méditerranéennes. Nous travaillons en étroite collaboration avec des producteurs locaux pour nous approvisionner en ingrédients de saison de la plus haute qualité, garantissant que chaque plat reflète la qualité et le soin qui définissent l'hospitalité suisse.",
      legacyText3: "Nos chefs apportent des années d'expérience en fine dining méditerranéen, combinant des techniques classiques avec des sensibilités contemporaines. Chaque assiette est préparée avec attention aux détails, respect des ingrédients et dévouement à créer des expériences de restauration mémorables.",
      philosophy: "Notre Philosophie",
      swissQuality: "Qualité Suisse",
      swissQualityText: "Nous nous approvisionnons en ingrédients de la plus haute qualité auprès de producteurs suisses locaux, garantissant la fraîcheur et soutenant l'agriculture régionale.",
      seasonalCuisine: "Cuisine de Saison",
      seasonalCuisineText: "Notre menu évolue avec les saisons, célébrant le meilleur de ce que la Suisse et la Méditerranée ont à offrir tout au long de l'année.",
      culinaryCraftsmanship: "Artisanat Culinaire",
      culinaryCraftsmanshipText: "Chaque plat est préparé avec précision et soin, reflétant notre engagement envers les traditions culinaires méditerranéennes et l'excellence contemporaine.",
      warmHospitality: "Hospitalité Chaleureuse",
      warmHospitalityText: "Nous croyons que la restauration doit être à la fois élégante et accessible—un endroit où la qualité rencontre le confort, et où chaque invité se sent le bienvenu."
    },
    menu: {
      title: "Notre Menu"
    },
    drinks: {
      title: "Vins & Boissons",
      cocktails: "Cocktails",
      nonAlcoholic: "Boissons Non Alcoolisées",
      wine: "Sélection de Vins",
      beer: "Sélection de Bières"
    },
    events: {
      title: "Événements Privés & Célébrations",
      subtitle: "Mariages, événements d'entreprise et expériences de restauration privées élaborées avec la qualité suisse et l'élégance méditerranéenne. Chaque événement reflète notre engagement envers une cuisine exceptionnelle et un service attentif.",
      planEvent: "Planifier votre Événement",
      eventTypes: "Types d'Événements",
      eventTypesDescription: "Nous offrons une gamme de services pour événements privés, chacun adapté pour créer une expérience inoubliable pour vous et vos invités.",
      smallWedding: "Mariage en petit comité",
      smallWeddingDescription: "Célébrez votre union dans une atmosphère intime et chaleureuse. Nous créons des expériences de restauration mémorables adaptées à votre célébration, avec une cuisine méditerranéenne élégante et l'hospitalité suisse.",
      baptismBirthday: "Baptême & Anniversaire",
      baptismBirthdayDescription: "Rendez ces moments importants inoubliables avec nos expériences de restauration privées. Menus de saison personnalisés et service dédié garantissent une célébration vraiment spéciale pour vous et vos proches.",
      corporateMeal: "Repas d'entreprise",
      corporateMealDescription: "Impressionnez clients et collègues avec nos services de restauration professionnels. Parfait pour les dîners d'affaires, célébrations d'équipe et rassemblements d'entreprise dans un cadre élégant et raffiné.",
      afterCeremonyMeal: "Repas d'après cérémonie (enterrement)",
      afterCeremonyMealDescription: "Accueillons vos proches dans un cadre respectueux et apaisant après la cérémonie. Nous offrons un service discret et attentionné, avec des menus adaptés pour accompagner ce moment important.",
      experience: "Expérience & Services",
      customMenus: "Menus Personnalisés",
      customMenusDescription: "Travaillez avec nos chefs pour créer un menu de saison qui correspond parfaitement à votre événement. Des préparations méditerranéennes classiques aux interprétations contemporaines, nous adaptons chaque plat à vos préférences.",
      dedicatedService: "Service Dédié",
      dedicatedServiceDescription: "Notre équipe de service professionnelle veille à ce que chaque détail soit pris en compte. De la mise en place au nettoyage, nous gérons tout avec la précision suisse pour que vous puissiez vous concentrer sur la célébration.",
      elegantAtmosphere: "Atmosphère Élégante",
      elegantAtmosphereDescription: "Notre restaurant offre un cadre chaleureux et raffiné pour votre événement. Que ce soit dans notre salle principale ou notre espace privé, l'ambiance rehausse chaque moment avec l'élégance méditerranéenne.",
      swissQuality: "Qualité Suisse & Artisanat",
      swissQualityDescription: "Découvrez le même engagement envers la qualité et l'excellence culinaire qui définit notre restaurant. Chaque plat reflète notre dévouement aux ingrédients de saison et à l'artisanat suisse.",
      requestInfo: "Demander des Informations",
      requestInfoDescription: "Laissez-nous vous aider à planifier votre événement parfait. Remplissez le formulaire ci-dessous et notre équipe vous recontactera avec les détails, disponibilités et options personnalisées.",
      eventInquiry: "Demande d'Événement",
      inquiryReceived: "Demande Reçue !",
      inquiryReceivedText: "Nous vous contacterons sous peu pour discuter des détails de votre événement.",
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      eventType: "Type d'Événement",
      selectEventType: "Sélectionner le type d'événement",
      preferredDate: "Date Souhaitée",
      numberOfGuests: "Nombre d'Invitations",
      message: "Message",
      messagePlaceholder: "Parlez-nous de votre événement, exigences alimentaires ou demandes spéciales...",
      submitInquiry: "Envoyer la Demande",
      cancel: "Annuler"
    },
    gallery: {
      title: "Galerie",
      experience: "Découvrez Notre Ambiance",
      experienceDescription: "Faites un voyage visuel à travers Le Savoré, des intérieurs élégants à la cuisine méditerranéenne de saison magnifiquement présentée"
    },
    contact: {
      title: "Nous Contacter",
      getInTouch: "Contactez-nous",
      getInTouchDescription: "Nous serions ravis d'avoir de vos nouvelles. Que vous ayez une question sur notre menu de saison, souhaitiez faire une réservation ou soyez intéressé par des événements privés, nous sommes là pour vous aider.",
      address: "Adresse",
      phone: "Téléphone",
      email: "Email",
      hours: "Horaires",
      sendMessage: "Envoyez-nous un Message",
      thankYou: "Merci !",
      thankYouText: "Nous vous recontacterons bientôt.",
      name: "Nom",
      subject: "Sujet",
      message: "Message",
      send: "Envoyer le Message"
    },
    reservation: {
      title: "Réserver votre Table",
      description: "Veuillez remplir le formulaire ci-dessous et nous vous recontacterons pour confirmer votre réservation.",
      fullName: "Nom Complet",
      email: "Email",
      phone: "Numéro de Téléphone",
      date: "Date",
      time: "Heure",
      guests: "Nombre de Personnes",
      specialRequests: "Demandes Spéciales ou Notes",
      specialRequestsPlaceholder: "Restrictions alimentaires, occasions spéciales, etc.",
      submit: "Envoyer la Demande",
      cancel: "Annuler",
      received: "Demande de Réservation Reçue !",
      receivedText: "Nous vous contacterons sous peu pour confirmer votre réservation.",
      needHelp: "Besoin d'Aide Immédiate ?",
      needHelpText: "Notre équipe se fera un plaisir de vous aider à faire une réservation par téléphone.",
      callUs: "Appelez-nous au"
    },
    footer: {
      discover: "Découvrir",
      hours: "Horaires",
      allRightsReserved: "Tous droits réservés."
    },
    common: {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
      closed: "Fermé",
      required: "*"
    },
    hours: {
      monday: "10h30 – 14h30 / 18h30 – 23h00",
      tuesday: "Fermé",
      wednesday: "10h30 – 14h30 / 18h30 – 23h00",
      thursday: "10h30 – 14h30 / 18h30 – 23h00",
      friday: "10h30 – 14h30 / 18h30 – 23h00",
      saturday: "10h30 – 14h30 / 18h30 – 23h00",
      sunday: "10h30 – 14h30 / 18h30 – 23h00"
    },
    openingStatus: {
      nowOpen: "Maintenant Ouvert",
      closed: "Fermé",
      opensAt: "Ouvre à",
      closedToday: "Fermé aujourd'hui",
      opensAtLunch: "Ouvre à 10h30",
      opensAtDinner: "Ouvre à 18h30",
      opensIn30Min: "Ouvre dans 30 min"
    },
    opening: {
      openingFebruary1st: "Ouverture le 1er février",
      weAreNowOpen: "Nous sommes maintenant ouverts",
      welcomeBookTable: "Bienvenue — Réservez votre table",
      reserveForOpening: "Réserver pour l'ouverture",
      reserveForOpeningNight: "Réserver pour la soirée d'ouverture",
      days: "Jours",
      hours: "Heures",
      minutes: "Minutes",
      seconds: "Secondes",
      officialOpening: "Ouverture officielle le 1er février !",
      officialOpeningSubtext: "Réservez dès maintenant",
      reserveTable: "Réserver une table",
      doNotShowAgain: "Ne plus afficher"
    },
    reservationErrors: {
      closedOnTuesdays: "Fermé le mardi. Veuillez sélectionner un autre jour.",
      closedOnThisDay: "Fermé ce jour-là",
      noAvailability: "Aucune disponibilité",
      timeSlotsAvailable: "créneaux horaires disponibles",
      selectTime: "Sélectionner une heure",
      thisTimeNotAvailable: "Cette heure n'est pas disponible. Veuillez sélectionner une heure pendant les heures d'ouverture.",
      selectValidTime: "Veuillez sélectionner une heure valide."
    },
    intro: {
      skip: "Passer"
    },
    legal: {
      originsTitle: "Origines des viandes & poissons",
      beef: "Bœuf — Suisse / Brésil / Union Européenne",
      veal: "Veau — Suisse / Union Européenne",
      chicken: "Poulet — Hongrie / Pologne / Suisse / Union Européenne",
      fish: "Poissons — Union Européenne",
      allergensNote: "« Les informations détaillées d'allergènes sont disponibles auprès de notre personnel. »"
    }
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      menu: "Menu",
      drinks: "Drinks",
      events: "Events",
      gallery: "Gallery",
      contact: "Contact",
      reserveTable: "Reserve a Table"
    },
    hero: {
      tagline: "Fine Dining in Switzerland",
      description: "Discover seasonal Mediterranean cuisine, crafted with Swiss quality and attention to detail in an elegant and welcoming atmosphere.",
      viewMenu: "View Menu",
      reserveTable: "Reserve a Table"
    },
    home: {
      seasonalExcellence: "Seasonal Excellence",
      seasonalDescription: "At Le Savoré, we celebrate seasonal Mediterranean cuisine with Swiss precision and quality. Every dish reflects our commitment to local sourcing, culinary craftsmanship, and an elegant yet approachable dining experience.",
      swissCraftsmanship: "Swiss Craftsmanship",
      craftsmanshipDescription: "Our menu showcases seasonal ingredients sourced from local Swiss producers. From classic Mediterranean preparations to contemporary interpretations, each dish reflects our dedication to quality, simplicity, and culinary excellence.",
      readyToDiscover: "Ready to Discover Swiss Fine Dining?",
      reserveDescription: "Reserve your table today and join us for an unforgettable culinary experience",
      makeReservation: "Make a Reservation",
      viewFullMenu: "View Full Menu"
    },
    about: {
      title: "Our Story",
      legacy: "Swiss Culinary Excellence",
      legacyText1: "Le Savoré was founded with a commitment to Swiss quality and Mediterranean culinary excellence. We believe in the power of seasonal ingredients, local sourcing, and the simple elegance of well-crafted cuisine.",
      legacyText2: "Our approach is rooted in Swiss precision and Mediterranean culinary traditions. We work closely with local producers to source the finest seasonal ingredients, ensuring that every dish reflects the quality and care that define Swiss hospitality.",
      legacyText3: "Our chefs bring years of experience in Mediterranean fine dining, combining classic techniques with contemporary sensibilities. Every plate is prepared with attention to detail, respect for ingredients, and dedication to creating memorable dining experiences.",
      philosophy: "Our Philosophy",
      swissQuality: "Swiss Quality",
      swissQualityText: "We source the finest ingredients from local Swiss producers, ensuring freshness and supporting regional agriculture.",
      seasonalCuisine: "Seasonal Cuisine",
      seasonalCuisineText: "Our menu evolves with the seasons, celebrating the best of what Switzerland and the Mediterranean have to offer throughout the year.",
      culinaryCraftsmanship: "Culinary Craftsmanship",
      culinaryCraftsmanshipText: "Every dish is prepared with precision and care, reflecting our commitment to Mediterranean culinary traditions and contemporary excellence.",
      warmHospitality: "Warm Hospitality",
      warmHospitalityText: "We believe dining should be both elegant and approachable—a place where quality meets comfort, and every guest feels welcome."
    },
    menu: {
      title: "Our Menu"
    },
    drinks: {
      title: "Wine & Beverages",
      cocktails: "Cocktails",
      nonAlcoholic: "Non-Alcoholic Beverages",
      wine: "Wine Selection",
      beer: "Beer Selection"
    },
    events: {
      title: "Private Events & Celebrations",
      subtitle: "Weddings, corporate gatherings, and private dining experiences crafted with Swiss quality and Mediterranean elegance. Every event reflects our commitment to exceptional cuisine and attentive service.",
      planEvent: "Plan Your Event",
      eventTypes: "Event Types",
      eventTypesDescription: "We offer a range of private event services, each tailored to create an unforgettable experience for you and your guests.",
      smallWedding: "Intimate Wedding",
      smallWeddingDescription: "Celebrate your union in an intimate and warm atmosphere. We create memorable dining experiences tailored to your celebration, with elegant Mediterranean cuisine and Swiss hospitality.",
      baptismBirthday: "Baptism & Birthday",
      baptismBirthdayDescription: "Make these important moments unforgettable with our private dining experiences. Customized seasonal menus and dedicated service ensure a truly special celebration for you and your loved ones.",
      corporateMeal: "Corporate Meal",
      corporateMealDescription: "Impress clients and colleagues with our professional dining services. Perfect for business dinners, team celebrations, and corporate gatherings in an elegant and refined setting.",
      afterCeremonyMeal: "After Ceremony Meal (Funeral)",
      afterCeremonyMealDescription: "Welcome your loved ones in a respectful and soothing setting after the ceremony. We offer discreet and attentive service, with menus adapted to accompany this important moment.",
      experience: "Experience & Services",
      customMenus: "Custom Menus",
      customMenusDescription: "Work with our chefs to create a seasonal menu that perfectly matches your event. From classic Mediterranean preparations to contemporary interpretations, we tailor every dish to your preferences.",
      dedicatedService: "Dedicated Service",
      dedicatedServiceDescription: "Our professional service team ensures every detail is attended to. From setup to cleanup, we handle everything with Swiss precision so you can focus on enjoying your celebration.",
      elegantAtmosphere: "Elegant Atmosphere",
      elegantAtmosphereDescription: "Our restaurant provides a warm, refined setting for your event. Whether in our main dining room or private space, the ambiance enhances every moment with Mediterranean elegance.",
      swissQuality: "Swiss Quality & Craftsmanship",
      swissQualityDescription: "Experience the same commitment to quality and culinary excellence that defines our restaurant. Every dish reflects our dedication to seasonal ingredients and Swiss craftsmanship.",
      requestInfo: "Request Event Information",
      requestInfoDescription: "Let us help you plan your perfect event. Fill out the form below and our team will get back to you with details, availability, and customized options.",
      eventInquiry: "Event Inquiry",
      inquiryReceived: "Inquiry Received!",
      inquiryReceivedText: "We'll contact you shortly to discuss your event details.",
      name: "Name",
      email: "Email",
      phone: "Phone",
      eventType: "Event Type",
      selectEventType: "Select event type",
      preferredDate: "Preferred Date",
      numberOfGuests: "Number of Guests",
      message: "Message",
      messagePlaceholder: "Tell us about your event, dietary requirements or special requests...",
      submitInquiry: "Submit Inquiry",
      cancel: "Cancel"
    },
    gallery: {
      title: "Gallery",
      experience: "Experience Our Ambiance",
      experienceDescription: "Take a visual journey through Le Savoré, from elegant interiors to beautifully presented seasonal Mediterranean cuisine"
    },
    contact: {
      title: "Contact Us",
      getInTouch: "Get in Touch",
      getInTouchDescription: "We'd love to hear from you. Whether you have a question about our seasonal menu, want to make a reservation, or are interested in private events, we're here to help.",
      address: "Address",
      phone: "Phone",
      email: "Email",
      hours: "Hours",
      sendMessage: "Send us a Message",
      thankYou: "Thank you!",
      thankYouText: "We'll get back to you soon.",
      name: "Name",
      subject: "Subject",
      message: "Message",
      send: "Send Message"
    },
    reservation: {
      title: "Reserve Your Table",
      description: "Please fill out the form below and we'll get back to you to confirm your reservation.",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      date: "Date",
      time: "Time",
      guests: "Number of Guests",
      specialRequests: "Special Requests or Notes",
      specialRequestsPlaceholder: "Dietary restrictions, special occasions, etc.",
      submit: "Submit Reservation Request",
      cancel: "Cancel",
      received: "Reservation Request Received!",
      receivedText: "We'll contact you shortly to confirm your reservation.",
      needHelp: "Need Immediate Assistance?",
      needHelpText: "Our team is happy to help you make a reservation over the phone.",
      callUs: "Call us at"
    },
    footer: {
      discover: "Discover",
      hours: "Hours",
      allRightsReserved: "All rights reserved."
    },
    common: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
      closed: "Closed",
      required: "*"
    },
    hours: {
      monday: "10:30 – 14:30 / 18:30 – 23:00",
      tuesday: "Closed",
      wednesday: "10:30 – 14:30 / 18:30 – 23:00",
      thursday: "10:30 – 14:30 / 18:30 – 23:00",
      friday: "10:30 – 14:30 / 18:30 – 23:00",
      saturday: "10:30 – 14:30 / 18:30 – 23:00",
      sunday: "10:30 – 14:30 / 18:30 – 23:00"
    },
    openingStatus: {
      nowOpen: "Now Open",
      closed: "Closed",
      opensAt: "Opens at",
      closedToday: "Closed today",
      opensAtLunch: "Opens at 10:30",
      opensAtDinner: "Opens at 18:30",
      opensIn30Min: "Opens in 30 min"
    },
    opening: {
      openingFebruary1st: "Opening February 1st",
      weAreNowOpen: "We are now open",
      welcomeBookTable: "Welcome — Book your table",
      reserveForOpening: "Reserve for Opening",
      reserveForOpeningNight: "Reserve for Opening Night",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      officialOpening: "Official Opening on February 1st!",
      officialOpeningSubtext: "Reserve now",
      reserveTable: "Reserve a table",
      doNotShowAgain: "Don't show again"
    },
    reservationErrors: {
      closedOnTuesdays: "Closed on Tuesdays. Please select another day.",
      closedOnThisDay: "Closed on this day",
      noAvailability: "No availability",
      timeSlotsAvailable: "time slots available",
      selectTime: "Select a time",
      thisTimeNotAvailable: "This time is not available. Please select a time during opening hours.",
      selectValidTime: "Please select a valid time."
    },
    intro: {
      skip: "Skip"
    },
    legal: {
      originsTitle: "Origins of meats & fish",
      beef: "Beef — Switzerland / Brazil / European Union",
      veal: "Veal — Switzerland / European Union",
      chicken: "Chicken — Hungary / Poland / Switzerland / European Union",
      fish: "Fish — European Union",
      allergensNote: "\"Detailed allergen information is available from our staff.\""
    }
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      menu: "Menü",
      drinks: "Getränke",
      events: "Veranstaltungen",
      gallery: "Galerie",
      contact: "Kontakt",
      reserveTable: "Tisch reservieren"
    },
    hero: {
      tagline: "Fine Dining in der Schweiz",
      description: "Entdecken Sie saisonale mediterrane Küche, mit Schweizer Qualität und Liebe zum Detail in einer eleganten und einladenden Atmosphäre zubereitet.",
      viewMenu: "Menü ansehen",
      reserveTable: "Tisch reservieren"
    },
    home: {
      seasonalExcellence: "Saisonale Exzellenz",
      seasonalDescription: "Bei Le Savoré feiern wir saisonale mediterrane Küche mit Schweizer Präzision und Qualität. Jedes Gericht spiegelt unser Engagement für lokale Beschaffung, kulinarisches Handwerk und ein elegantes, aber zugängliches Speiseerlebnis wider.",
      swissCraftsmanship: "Schweizer Handwerk",
      craftsmanshipDescription: "Unser Menü präsentiert saisonale Zutaten von lokalen Schweizer Produzenten. Von klassischen mediterranen Zubereitungen bis hin zu zeitgenössischen Interpretationen spiegelt jedes Gericht unsere Hingabe an Qualität, Einfachheit und kulinarische Exzellenz wider.",
      readyToDiscover: "Bereit, Schweizer Fine Dining zu entdecken?",
      reserveDescription: "Reservieren Sie noch heute Ihren Tisch und erleben Sie mit uns ein unvergessliches kulinarisches Erlebnis",
      makeReservation: "Reservierung vornehmen",
      viewFullMenu: "Vollständiges Menü ansehen"
    },
    about: {
      title: "Unsere Geschichte",
      legacy: "Schweizer kulinarische Exzellenz",
      legacyText1: "Le Savoré wurde mit einem Engagement für Schweizer Qualität und mediterrane kulinarische Exzellenz gegründet. Wir glauben an die Kraft saisonaler Zutaten, lokaler Beschaffung und der einfachen Eleganz gut zubereiteter Küche.",
      legacyText2: "Unser Ansatz wurzelt in Schweizer Präzision und mediterranen kulinarischen Traditionen. Wir arbeiten eng mit lokalen Produzenten zusammen, um die besten saisonalen Zutaten zu beschaffen und sicherzustellen, dass jedes Gericht die Qualität und Sorgfalt widerspiegelt, die Schweizer Gastfreundschaft auszeichnen.",
      legacyText3: "Unsere Köche bringen jahrelange Erfahrung im mediterranen Fine Dining mit und kombinieren klassische Techniken mit zeitgenössischen Sensibilitäten. Jeder Teller wird mit Aufmerksamkeit für Details, Respekt vor den Zutaten und Hingabe zur Schaffung unvergesslicher Speiseerlebnisse zubereitet.",
      philosophy: "Unsere Philosophie",
      swissQuality: "Schweizer Qualität",
      swissQualityText: "Wir beziehen die besten Zutaten von lokalen Schweizer Produzenten und gewährleisten Frische und Unterstützung der regionalen Landwirtschaft.",
      seasonalCuisine: "Saisonale Küche",
      seasonalCuisineText: "Unser Menü entwickelt sich mit den Jahreszeiten und feiert das Beste, was die Schweiz und das Mittelmeer das ganze Jahr über zu bieten haben.",
      culinaryCraftsmanship: "Kulinarisches Handwerk",
      culinaryCraftsmanshipText: "Jedes Gericht wird mit Präzision und Sorgfalt zubereitet und spiegelt unser Engagement für mediterrane kulinarische Traditionen und zeitgenössische Exzellenz wider.",
      warmHospitality: "Warme Gastfreundschaft",
      warmHospitalityText: "Wir glauben, dass das Speisen sowohl elegant als auch zugänglich sein sollte—ein Ort, an dem Qualität auf Komfort trifft und sich jeder Gast willkommen fühlt."
    },
    menu: {
      title: "Unser Menü"
    },
    drinks: {
      title: "Wein & Getränke",
      cocktails: "Cocktails",
      nonAlcoholic: "Alkoholfreie Getränke",
      wine: "Weinauswahl",
      beer: "Bierauswahl"
    },
    events: {
      title: "Private Veranstaltungen & Feiern",
      subtitle: "Hochzeiten, Firmenveranstaltungen und private Speiseerlebnisse, die mit Schweizer Qualität und mediterraner Eleganz gestaltet wurden. Jede Veranstaltung spiegelt unser Engagement für außergewöhnliche Küche und aufmerksamen Service wider.",
      planEvent: "Ihre Veranstaltung planen",
      eventTypes: "Veranstaltungstypen",
      eventTypesDescription: "Wir bieten eine Reihe von Dienstleistungen für private Veranstaltungen, die jeweils darauf ausgelegt sind, ein unvergessliches Erlebnis für Sie und Ihre Gäste zu schaffen.",
      smallWedding: "Intime Hochzeit",
      smallWeddingDescription: "Feiern Sie Ihre Verbindung in einer intimen und warmen Atmosphäre. Wir schaffen unvergessliche Speiseerlebnisse, die auf Ihre Feier zugeschnitten sind, mit eleganter mediterraner Küche und Schweizer Gastfreundschaft.",
      baptismBirthday: "Taufe & Geburtstag",
      baptismBirthdayDescription: "Machen Sie diese wichtigen Momente unvergesslich mit unseren privaten Speiseerlebnissen. Individuelle saisonale Menüs und engagierter Service sorgen für eine wirklich besondere Feier für Sie und Ihre Lieben.",
      corporateMeal: "Firmenessen",
      corporateMealDescription: "Beeindrucken Sie Kunden und Kollegen mit unseren professionellen Speiseservices. Perfekt für Geschäftsessen, Teamfeiern und Firmenveranstaltungen in einem eleganten und raffinierten Rahmen.",
      afterCeremonyMeal: "Mahlzeit nach Zeremonie (Beerdigung)",
      afterCeremonyMealDescription: "Begrüßen Sie Ihre Lieben in einer respektvollen und beruhigenden Umgebung nach der Zeremonie. Wir bieten diskreten und aufmerksamen Service mit Menüs, die an diesen wichtigen Moment angepasst sind.",
      experience: "Erlebnis & Services",
      customMenus: "Individuelle Menüs",
      customMenusDescription: "Arbeiten Sie mit unseren Köchen zusammen, um ein saisonales Menü zu erstellen, das perfekt zu Ihrer Veranstaltung passt. Von klassischen mediterranen Zubereitungen bis hin zu zeitgenössischen Interpretationen passen wir jedes Gericht an Ihre Vorlieben an.",
      dedicatedService: "Engagierter Service",
      dedicatedServiceDescription: "Unser professionelles Serviceteam sorgt dafür, dass jedes Detail beachtet wird. Von der Einrichtung bis zur Reinigung erledigen wir alles mit Schweizer Präzision, damit Sie sich auf Ihre Feier konzentrieren können.",
      elegantAtmosphere: "Elegante Atmosphäre",
      elegantAtmosphereDescription: "Unser Restaurant bietet eine warme, raffinierte Umgebung für Ihre Veranstaltung. Ob in unserem Hauptspeiseraum oder in unserem privaten Raum, die Atmosphäre unterstreicht jeden Moment mit mediterraner Eleganz.",
      swissQuality: "Schweizer Qualität & Handwerk",
      swissQualityDescription: "Erleben Sie das gleiche Engagement für Qualität und kulinarische Exzellenz, das unser Restaurant auszeichnet. Jedes Gericht spiegelt unsere Hingabe an saisonale Zutaten und Schweizer Handwerk wider.",
      requestInfo: "Veranstaltungsinformationen anfordern",
      requestInfoDescription: "Lassen Sie uns Ihnen helfen, Ihre perfekte Veranstaltung zu planen. Füllen Sie das untenstehende Formular aus und unser Team wird sich mit Details, Verfügbarkeit und individuellen Optionen bei Ihnen melden.",
      eventInquiry: "Veranstaltungsanfrage",
      inquiryReceived: "Anfrage erhalten!",
      inquiryReceivedText: "Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um die Details Ihrer Veranstaltung zu besprechen.",
      name: "Name",
      email: "Email",
      phone: "Telefon",
      eventType: "Veranstaltungstyp",
      selectEventType: "Veranstaltungstyp auswählen",
      preferredDate: "Bevorzugtes Datum",
      numberOfGuests: "Anzahl der Gäste",
      message: "Nachricht",
      messagePlaceholder: "Erzählen Sie uns von Ihrer Veranstaltung, diätetischen Anforderungen oder besonderen Wünschen...",
      submitInquiry: "Anfrage senden",
      cancel: "Abbrechen"
    },
    gallery: {
      title: "Galerie",
      experience: "Erleben Sie unsere Atmosphäre",
      experienceDescription: "Machen Sie eine visuelle Reise durch Le Savoré, von eleganten Innenräumen bis hin zu wunderschön präsentierter saisonaler mediterraner Küche"
    },
    contact: {
      title: "Kontaktieren Sie uns",
      getInTouch: "Kontakt aufnehmen",
      getInTouchDescription: "Wir würden gerne von Ihnen hören. Ob Sie eine Frage zu unserem saisonalen Menü haben, eine Reservierung vornehmen möchten oder an privaten Veranstaltungen interessiert sind, wir sind hier, um zu helfen.",
      address: "Adresse",
      phone: "Telefon",
      email: "Email",
      hours: "Öffnungszeiten",
      sendMessage: "Senden Sie uns eine Nachricht",
      thankYou: "Vielen Dank!",
      thankYouText: "Wir werden uns bald bei Ihnen melden.",
      name: "Name",
      subject: "Betreff",
      message: "Nachricht",
      send: "Nachricht senden"
    },
    reservation: {
      title: "Ihren Tisch reservieren",
      description: "Bitte füllen Sie das untenstehende Formular aus und wir werden uns bei Ihnen melden, um Ihre Reservierung zu bestätigen.",
      fullName: "Vollständiger Name",
      email: "Email",
      phone: "Telefonnummer",
      date: "Datum",
      time: "Uhrzeit",
      guests: "Anzahl der Gäste",
      specialRequests: "Besondere Wünsche oder Notizen",
      specialRequestsPlaceholder: "Diätetische Einschränkungen, besondere Anlässe usw.",
      submit: "Reservierungsanfrage senden",
      cancel: "Abbrechen",
      received: "Reservierungsanfrage erhalten!",
      receivedText: "Wir werden uns in Kürze bei Ihnen melden, um Ihre Reservierung zu bestätigen.",
      needHelp: "Sofortige Hilfe benötigt?",
      needHelpText: "Unser Team hilft Ihnen gerne telefonisch bei der Reservierung.",
      callUs: "Rufen Sie uns an unter"
    },
    footer: {
      discover: "Entdecken",
      hours: "Öffnungszeiten",
      allRightsReserved: "Alle Rechte vorbehalten."
    },
    common: {
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
      sunday: "Sonntag",
      closed: "Geschlossen",
      required: "*"
    },
    hours: {
      monday: "10:30 – 14:30 / 18:30 – 23:00",
      tuesday: "Geschlossen",
      wednesday: "10:30 – 14:30 / 18:30 – 23:00",
      thursday: "10:30 – 14:30 / 18:30 – 23:00",
      friday: "10:30 – 14:30 / 18:30 – 23:00",
      saturday: "10:30 – 14:30 / 18:30 – 23:00",
      sunday: "10:30 – 14:30 / 18:30 – 23:00"
    },
    openingStatus: {
      nowOpen: "Jetzt geöffnet",
      closed: "Geschlossen",
      opensAt: "Öffnet um",
      closedToday: "Heute geschlossen",
      opensAtLunch: "Öffnet um 10:30",
      opensAtDinner: "Öffnet um 18:30",
      opensIn30Min: "Öffnet in 30 Min"
    },
    opening: {
      openingFebruary1st: "Eröffnung am 1. Februar",
      weAreNowOpen: "Wir sind jetzt geöffnet",
      welcomeBookTable: "Willkommen — Reservieren Sie Ihren Tisch",
      reserveForOpening: "Für die Eröffnung reservieren",
      reserveForOpeningNight: "Für die Eröffnungsnacht reservieren",
      days: "Tage",
      hours: "Stunden",
      minutes: "Minuten",
      seconds: "Sekunden",
      officialOpening: "Offizielle Eröffnung am 1. Februar!",
      officialOpeningSubtext: "Jetzt reservieren",
      reserveTable: "Tisch reservieren",
      doNotShowAgain: "Nicht mehr anzeigen"
    },
    reservationErrors: {
      closedOnTuesdays: "Dienstags geschlossen. Bitte wählen Sie einen anderen Tag.",
      closedOnThisDay: "An diesem Tag geschlossen",
      noAvailability: "Keine Verfügbarkeit",
      timeSlotsAvailable: "Zeitslots verfügbar",
      selectTime: "Zeit auswählen",
      thisTimeNotAvailable: "Diese Zeit ist nicht verfügbar. Bitte wählen Sie eine Zeit während der Öffnungszeiten.",
      selectValidTime: "Bitte wählen Sie eine gültige Zeit."
    },
    intro: {
      skip: "Überspringen"
    },
    legal: {
      originsTitle: "Herkunft von Fleisch & Fisch",
      beef: "Rindfleisch — Schweiz / Brasilien / Europäische Union",
      veal: "Kalbfleisch — Schweiz / Europäische Union",
      chicken: "Huhn — Ungarn / Polen / Schweiz / Europäische Union",
      fish: "Fisch — Europäische Union",
      allergensNote: "\"Detaillierte Allergeninformationen sind bei unserem Personal erhältlich.\""
    }
  }
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function getLanguageFromStorage(): Language {
  if (typeof window === "undefined") return "fr";
  const stored = localStorage.getItem("le-savore-language");
  if (stored && (stored === "fr" || stored === "en" || stored === "de")) {
    return stored as Language;
  }
  return "fr";
}

export function setLanguageInStorage(lang: Language): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("le-savore-language", lang);
  }
}
