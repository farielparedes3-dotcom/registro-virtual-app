export const PERIODS = [
  { id: 1, label: '1ra Hora', time: '8:00 - 8:45' },
  { id: 2, label: '2da Hora', time: '8:45 - 9:30' },
  { id: 3, label: '3ra Hora', time: '9:30 - 10:15' },
  { id: 4, label: '4ta Hora', time: '10:30 - 11:15' },
  { id: 5, label: '5ta Hora', time: '11:15 - 12:00' },
  { id: 6, label: '6ta Hora', time: '1:00 - 1:40' },
  { id: 7, label: '7ma Hora', time: '1:40 - 2:20' },
  { id: 8, label: '8va Hora', time: '2:20 - 3:00' }
];

export const SPECIAL_ROLE_TEACHER_IDS = [
  'mario_paredes',     // Coordinador Pedagógico
  'emiliana_espinal',  // Encargada de Alimentación Escolar
  'francina_minaya',   // Orientadora
  'nathaly_stevez'     // Orientadora
];

export const TEACHERS_SCHEDULE_DATA = [
  {
    id: 'diomedes_nunez',
    name: 'Diomedes Nuñez',
    schedule: {
      Lu: [
        { type: 'class', grade: '4AH', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2A', subject: 'LE' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2B', subject: 'LE' },
        { type: 'class', grade: '3B', subject: 'C' },
        { type: 'class', grade: '2A', subject: 'TGO' },
        { type: 'class', grade: '4AH', subject: 'APL' }
      ],
      Ma: [
        { type: 'class', grade: '4AH', subject: 'LE' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2A', subject: 'LE' },
        { type: 'class', grade: '2B', subject: 'LE' },
        { type: 'class', grade: '2B', subject: 'LE' },
        { type: 'class', grade: '1A', subject: 'C' },
        { type: 'class', grade: '4AH', subject: 'APL' },
        { type: 'class', grade: '2A', subject: 'TGO' }
      ],
      Mi: [
        { type: 'class', grade: '2B', subject: 'LE' },
        { type: 'class', grade: '4AH', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4AH', subject: 'LE' },
        { type: 'class', grade: '2A', subject: 'LE' },
        { type: 'class', grade: '2A', subject: 'TGO' },
        { type: 'class', grade: '2B', subject: 'TGO' },
        { type: 'class', grade: '4BH', subject: 'APL' }
      ],
      Ju: [
        { type: 'class', grade: '4AH', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2A', subject: 'LE' },
        { type: 'class', grade: '2A', subject: 'LE' },
        { type: 'class', grade: '2B', subject: 'LE' },
        { type: 'class', grade: '4BH', subject: 'APL' },
        { type: 'class', grade: '6A-H/M', subject: 'APT' },
        { type: 'class', grade: '2B', subject: 'TGO' }
      ],
      Vi: [
        { type: 'class', grade: '4AH', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'planning', label: 'Planificación' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2B', subject: 'LE' },
        { type: 'class', grade: '2A', subject: 'LE' },
        { type: 'class', grade: '6A-H/M', subject: 'APT' },
        { type: 'class', grade: '2B', subject: 'TGO' }
      ]
    }
  },
  {
    id: 'jose_king',
    name: 'José King',
    schedule: {
      Lu: [
        { type: 'class', grade: '3C', subject: 'LE' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '3A', subject: 'LE' },
        { type: 'class', grade: '3B', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3A', subject: 'TGO' },
        { type: 'class', grade: '3C', subject: 'TGO' },
        { type: 'class', grade: '1A', subject: 'LE' }
      ],
      Ma: [
        { type: 'class', grade: '3C', subject: 'LE' },
        { type: 'class', grade: '3A', subject: 'LE' },
        { type: 'class', grade: '3B', subject: 'LE' },
        { type: 'class', grade: '3B', subject: 'LE' },
        { type: 'class', grade: '3C', subject: 'LE' },
        { type: 'class', grade: '1A', subject: 'TGO' },
        { type: 'class', grade: '1A', subject: 'LE' },
        { type: 'class', grade: '1A', subject: 'TGO' }
      ],
      Mi: [
        { type: 'planning', label: 'Planificación' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '1A', subject: 'LE' },
        { type: 'class', grade: '3A', subject: 'LE' },
        { type: 'class', grade: '3B', subject: 'TGO' },
        { type: 'class', grade: '3C', subject: 'LE' },
        { type: 'class', grade: '1A', subject: 'TGO' },
        { type: 'class', grade: '1A', subject: 'TGO' }
      ],
      Ju: [
        { type: 'class', grade: '3A', subject: 'LE' },
        { type: 'class', grade: '3B', subject: 'LE' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '3C', subject: 'LE' },
        { type: 'class', grade: '1A', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3A', subject: 'TGO' },
        { type: 'class', grade: '3B', subject: 'TGO' }
      ],
      Vi: [
        { type: 'class', grade: '3B', subject: 'LE' },
        { type: 'class', grade: '3A', subject: 'LE' },
        { type: 'class', grade: '3A', subject: 'LE' },
        { type: 'class', grade: '1A', subject: 'LE' },
        { type: 'class', grade: '3C', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '1A', subject: 'LE' },
        { type: 'class', grade: '3C', subject: 'TGO' }
      ]
    }
  },
  {
    id: 'maria_de_jesus',
    name: 'María De Jesús',
    schedule: {
      Lu: [
        { type: 'class', grade: '4M', subject: 'LE' },
        { type: 'class', grade: '4M', subject: 'LE' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-M', subject: 'LE' },
        { type: 'class', grade: '5A-M', subject: 'LE' },
        { type: 'class', grade: '6A-H/M', subject: 'LE' },
        { type: 'class', grade: '6A-H/M', subject: 'LE' },
        { type: 'class', grade: '4BH', subject: 'LE' }
      ],
      Ma: [
        { type: 'class', grade: '5A-N', subject: 'LE' },
        { type: 'class', grade: '5A-N', subject: 'LE' },
        { type: 'class', grade: '4M', subject: 'LE' },
        { type: 'planning', label: 'Planificación' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '6A-H/M', subject: 'LE' },
        { type: 'class', grade: '6A-H/M', subject: 'LE' },
        { type: 'class', grade: '4BH', subject: 'LE' }
      ],
      Mi: [
        { type: 'class', grade: '5A-N', subject: 'LE' },
        { type: 'class', grade: '5A-N', subject: 'LE' },
        { type: 'class', grade: '4BH', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '6A-H/M', subject: 'LE' },
        { type: 'class', grade: '6A-H/M', subject: 'LE' },
        { type: 'class', grade: '4M', subject: 'LE' }
      ],
      Ju: [
        { type: 'class', grade: '5A-M', subject: 'LE' },
        { type: 'class', grade: '5A-M', subject: 'LE' },
        { type: 'class', grade: '4M', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '5A-N', subject: 'LE' },
        { type: 'class', grade: '5A-N', subject: 'LE' },
        { type: 'class', grade: '4BH', subject: 'LE' }
      ],
      Vi: [
        { type: 'class', grade: '4BH', subject: 'LE' },
        { type: 'class', grade: '4BH', subject: 'LE' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '5A-M', subject: 'LE' },
        { type: 'class', grade: '5A-M', subject: 'LE' },
        { type: 'class', grade: '4M', subject: 'LE' },
        { type: 'class', grade: '4M', subject: 'LE' },
        { type: 'class', grade: '4BH', subject: 'LE' }
      ]
    }
  },
  {
    id: 'matias_benavide',
    name: 'Matías Benavide',
    schedule: {
      Lu: [
        { type: 'class', grade: '5A-M', subject: 'CS' },
        { type: 'class', grade: '5A-N', subject: 'CS' },
        { type: 'class', grade: '6A-M/H', subject: 'CS' },
        { type: 'class', grade: '4M', subject: 'MyC' },
        { type: 'class', grade: '4BH', subject: 'CS' },
        { type: 'class', grade: '4M', subject: 'CS' },
        { type: 'class', grade: '4AH', subject: 'CS' },
        { type: 'class', grade: '6A-M/H', subject: 'CDP' }
      ],
      Ma: [
        { type: 'class', grade: '5A-M', subject: 'CS' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4BH', subject: 'MyC' },
        { type: 'class', grade: '4AH', subject: 'CS' },
        { type: 'planning', label: 'Planificación' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4BH', subject: 'CS' },
        { type: 'class', grade: '4AH', subject: 'FSyPD' }
      ],
      Mi: [
        { type: 'class', grade: '6A-M/H', subject: 'CS' },
        { type: 'class', grade: '4BH', subject: 'CS' },
        { type: 'class', grade: '6A-M/H', subject: 'MyC' },
        { type: 'class', grade: '4M', subject: 'CS' },
        { type: 'class', grade: '4AH', subject: 'CS' },
        { type: 'class', grade: '5A-N', subject: 'CS' },
        { type: 'class', grade: '5A-M', subject: 'CS' },
        { type: 'class', grade: '6A-M/H', subject: 'CDP' }
      ],
      Ju: [
        { type: 'class', grade: '4M', subject: 'CS' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-M', subject: 'MyC' },
        { type: 'class', grade: '5A-N', subject: 'CS' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4AH', subject: 'MyC' },
        { type: 'class', grade: '4AH', subject: 'FSyPD' },
        { type: 'class', grade: '6A-M/H', subject: 'CS' }
      ],
      Vi: [
        { type: 'class', grade: '5A-N', subject: 'MyC' },
        { type: 'class', grade: '5A-M', subject: 'CS' },
        { type: 'class', grade: '4M', subject: 'CS' },
        { type: 'class', grade: '4BH', subject: 'CS' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-N', subject: 'CS' },
        { type: 'class', grade: '4AH', subject: 'CS' },
        { type: 'class', grade: '6A-M/H', subject: 'CS' }
      ]
    }
  },
  {
    id: 'santa_hilario',
    name: 'Santa Hilario',
    schedule: {
      Lu: [
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2B', subject: 'CS' },
        { type: 'class', grade: '2B', subject: 'MyC' },
        { type: 'class', grade: '3C', subject: 'CS' },
        { type: 'class', grade: '3A', subject: 'CS' },
        { type: 'class', grade: '1A', subject: 'MyC' },
        { type: 'class', grade: '1A', subject: 'CS' },
        { type: 'class', grade: '2A', subject: 'CS' }
      ],
      Ma: [
        { type: 'class', grade: '2B', subject: 'CS' },
        { type: 'class', grade: '1A', subject: 'CS' },
        { type: 'class', grade: '3C', subject: 'CS' },
        { type: 'class', grade: '2A', subject: 'CS' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '3A', subject: 'CS' },
        { type: 'class', grade: '3A', subject: 'MyC' },
        { type: 'class', grade: '3B', subject: 'CS' }
      ],
      Mi: [
        { type: 'class', grade: '3C', subject: 'CS' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '3A', subject: 'CS' },
        { type: 'register', label: 'Registro' },
        { type: 'planning', label: 'Planificación' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2A', subject: 'CS' },
        { type: 'class', grade: '3B', subject: 'CS' }
      ],
      Ju: [
        { type: 'class', grade: '3C', subject: 'CS' },
        { type: 'class', grade: '2A', subject: 'CS' },
        { type: 'class', grade: '3B', subject: 'CS' },
        { type: 'class', grade: '2B', subject: 'CS' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2A', subject: 'MyC' },
        { type: 'class', grade: '4BH', subject: 'FSyPD' },
        { type: 'class', grade: '1A', subject: 'CS' }
      ],
      Vi: [
        { type: 'class', grade: '1A', subject: 'CS' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3C', subject: 'MyC' },
        { type: 'class', grade: '3B', subject: 'MyC' },
        { type: 'class', grade: '3A', subject: 'CS' },
        { type: 'class', grade: '4BH', subject: 'FSyPD' },
        { type: 'class', grade: '2B', subject: 'CS' },
        { type: 'class', grade: '3B', subject: 'CS' }
      ]
    }
  },
  {
    id: 'mario_paredes',
    name: 'Mario Paredes',
    schedule: {
      Lu: Array(8).fill({ type: 'free', label: 'Libre (Coordinación)' }),
      Ma: Array(8).fill({ type: 'free', label: 'Libre (Coordinación)' }),
      Mi: [
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'class', grade: '5A-N', subject: 'ByC' },
        { type: 'class', grade: '5A-N', subject: 'ByC' }
      ],
      Ju: [
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'free', label: 'Libre (Coordinación)' },
        { type: 'class', grade: '5A-N', subject: 'ByC' },
        { type: 'class', grade: '5A-N', subject: 'ByC' }
      ],
      Vi: Array(8).fill({ type: 'free', label: 'Libre (Coordinación)' })
    }
  },
  {
    id: 'emiliana_espinal',
    name: 'Emiliana Espinal',
    schedule: {
      Lu: [
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '1A', subject: 'CN' },
        { type: 'class', grade: '1A', subject: 'CN' },
        { type: 'class', grade: '4BH', subject: 'CN' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Ma: [
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '1A', subject: 'CN' },
        { type: 'class', grade: '4BH', subject: 'CN' },
        { type: 'class', grade: '4BH', subject: 'CN' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Mi: [
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '4BH', subject: 'CN' },
        { type: 'class', grade: '4BH', subject: 'CN' },
        { type: 'class', grade: '1A', subject: 'CN' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Ju: [
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '1A', subject: 'CN' },
        { type: 'class', grade: '4BH', subject: 'CN' },
        { type: 'class', grade: '1A', subject: 'CN' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Vi: Array(8).fill({ type: 'free', label: 'Libre' })
    }
  },
  {
    id: 'miguel_brito',
    name: 'Miguel Brito',
    schedule: {
      Lu: [
        { type: 'class', grade: '6A-M/H', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '5A-N', subject: 'CN' },
        { type: 'class', grade: '5A-N', subject: 'CN' },
        { type: 'planning', label: 'Planificación' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '5A-M', subject: 'CN' },
        { type: 'class', grade: '5A-M', subject: 'CN' }
      ],
      Ma: [
        { type: 'class', grade: '6A-M/H', subject: 'CN' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '4M', subject: 'CN' },
        { type: 'class', grade: '4M', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '5A-N', subject: 'CN' },
        { type: 'class', grade: '5A-N', subject: 'CN' }
      ],
      Mi: [
        { type: 'class', grade: '4M', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '5A-M', subject: 'CN' },
        { type: 'class', grade: '5A-M', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4AH', subject: 'CN' },
        { type: 'class', grade: '4AH', subject: 'CN' },
        { type: 'free', label: 'Libre' }
      ],
      Ju: [
        { type: 'class', grade: '5A-N', subject: 'CN' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '4AH', subject: 'CN' },
        { type: 'class', grade: '4AH', subject: 'CN' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '4M', subject: 'CN' },
        { type: 'class', grade: '4M', subject: 'CN' },
        { type: 'free', label: 'Libre' }
      ],
      Vi: [
        { type: 'class', grade: '6A-M/H', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4AH', subject: 'CN' },
        { type: 'class', grade: '4AH', subject: 'CN' },
        { type: 'planning', label: 'Planificación' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '5A-M', subject: 'CN' },
        { type: 'class', grade: '5A-M', subject: 'CN' }
      ]
    }
  },
  {
    id: 'lohany_mateo',
    name: 'Lohany Mateo',
    schedule: {
      Lu: [
        { type: 'class', grade: '2B', subject: 'CN' },
        { type: 'class', grade: '3C', subject: 'CN' },
        { type: 'class', grade: '3C', subject: 'CN' },
        { type: 'class', grade: '2A', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2B', subject: 'CN' },
        { type: 'class', grade: '3B', subject: 'CN' },
        { type: 'class', grade: '3B', subject: 'CN' }
      ],
      Ma: [
        { type: 'class', grade: '3A', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3C', subject: 'CN' },
        { type: 'class', grade: '3C', subject: 'CN' },
        { type: 'class', grade: '2A', subject: 'CN' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2B', subject: 'CN' },
        { type: 'class', grade: '2B', subject: 'CN' }
      ],
      Mi: [
        { type: 'class', grade: '3B', subject: 'CN' },
        { type: 'class', grade: '3B', subject: 'CN' },
        { type: 'class', grade: '2A', subject: 'CN' },
        { type: 'class', grade: '2A', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3A', subject: 'CN' },
        { type: 'class', grade: '2B', subject: 'CN' }
      ],
      Ju: [
        { type: 'class', grade: '3C', subject: 'CN' },
        { type: 'class', grade: '3C', subject: 'CN' },
        { type: 'class', grade: '2A', subject: 'CN' },
        { type: 'class', grade: '3B', subject: 'CN' },
        { type: 'class', grade: '2B', subject: 'CN' },
        { type: 'planning', label: 'Planificación' },
        { type: 'planning', label: 'Planificación' },
        { type: 'free', label: 'Libre' }
      ],
      Vi: [
        { type: 'class', grade: '2B', subject: 'CN' },
        { type: 'class', grade: '2B', subject: 'CN' },
        { type: 'class', grade: '2A', subject: 'CN' },
        { type: 'register', label: 'Registro' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '3A', subject: 'CN' },
        { type: 'class', grade: '2A', subject: 'CN' },
        { type: 'class', grade: '2A', subject: 'CN' }
      ]
    }
  },
  {
    id: 'teresita_mercedes',
    name: 'Teresita Mercedes',
    schedule: {
      Lu: [
        { type: 'class', grade: '3A', subject: 'M' },
        { type: 'class', grade: '4M', subject: 'M' },
        { type: 'class', grade: '3B', subject: 'M' },
        { type: 'class', grade: '3B', subject: 'M' },
        { type: 'class', grade: '3A', subject: 'M' },
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3C', subject: 'M' }
      ],
      Ma: [
        { type: 'class', grade: '4M', subject: 'M' },
        { type: 'class', grade: '3C', subject: 'M' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3A', subject: 'M' },
        { type: 'class', grade: '3B', subject: 'M' },
        { type: 'class', grade: '3B', subject: 'M' },
        { type: 'class', grade: '3C', subject: 'M' },
        { type: 'planning', label: 'Planificación' }
      ],
      Mi: [
        { type: 'planning', label: 'Planificación' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '4M', subject: 'M' },
        { type: 'class', grade: '3B', subject: 'M' },
        { type: 'class', grade: '3A', subject: 'M' },
        { type: 'class', grade: '3C', subject: 'M' },
        { type: 'planning', label: 'Planificación' },
        { type: 'register', label: 'Registro' }
      ],
      Ju: [
        { type: 'class', grade: '3B', subject: 'M' },
        { type: 'class', grade: '4M', subject: 'M' },
        { type: 'class', grade: '3A', subject: 'M' },
        { type: 'class', grade: '4M', subject: 'M' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '3C', subject: 'M' },
        { type: 'free', label: 'Libre' },
        { type: 'register', label: 'Registro' }
      ],
      Vi: [
        { type: 'class', grade: '3A', subject: 'M' },
        { type: 'class', grade: '3A', subject: 'M' },
        { type: 'class', grade: '3B', subject: 'M' },
        { type: 'class', grade: '3B', subject: 'M' },
        { type: 'class', grade: '4M', subject: 'M' },
        { type: 'class', grade: '3C', subject: 'M' },
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' }
      ]
    }
  },
  {
    id: 'maria_eduardo',
    name: 'María Eduardo',
    schedule: {
      Lu: [
        { type: 'class', grade: '5A-N', subject: 'M' },
        { type: 'class', grade: '4BH', subject: 'M' },
        { type: 'class', grade: '6A-H/M', subject: 'M' },
        { type: 'class', grade: '6A-H/M', subject: 'M' },
        { type: 'class', grade: '4AH', subject: 'M' },
        { type: 'class', grade: '4BH', subject: 'M' },
        { type: 'register', label: 'Registro' },
        { type: 'free', label: 'Libre' }
      ],
      Ma: [
        { type: 'class', grade: '5A-M', subject: 'M' },
        { type: 'class', grade: '5A-M', subject: 'M' },
        { type: 'class', grade: '5A-N', subject: 'M' },
        { type: 'class', grade: '4BH', subject: 'M' },
        { type: 'class', grade: '4AH', subject: 'M' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '6A-H/M', subject: 'M' },
        { type: 'free', label: 'Libre' }
      ],
      Mi: [
        { type: 'class', grade: '4BH', subject: 'M' },
        { type: 'class', grade: '5A-N', subject: 'M' },
        { type: 'class', grade: '6A-H/M', subject: 'M' },
        { type: 'class', grade: '5A-M', subject: 'M' },
        { type: 'class', grade: '4AH', subject: 'M' },
        { type: 'class', grade: '4BH', subject: 'M' },
        { type: 'register', label: 'Registro' },
        { type: 'free', label: 'Libre' }
      ],
      Ju: [
        { type: 'class', grade: '5A-N', subject: 'M' },
        { type: 'class', grade: '4AH', subject: 'M' },
        { type: 'class', grade: '4AH', subject: 'M' },
        { type: 'class', grade: '5A-N', subject: 'M' },
        { type: 'class', grade: '5A-M', subject: 'M' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-N', subject: 'M' },
        { type: 'free', label: 'Libre' }
      ],
      Vi: [
        { type: 'class', grade: '5A-M', subject: 'M' },
        { type: 'class', grade: '5A-N', subject: 'M' },
        { type: 'class', grade: '6A-H/M', subject: 'M' },
        { type: 'class', grade: '4AH', subject: 'M' },
        { type: 'class', grade: '4BH', subject: 'M' },
        { type: 'register', label: 'Registro' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ]
    }
  },
  {
    id: 'kareem_moreno',
    name: 'Kareem Moreno',
    schedule: {
      Lu: [
        { type: 'class', grade: '2A', subject: 'M' },
        { type: 'class', grade: '1A', subject: 'M' },
        { type: 'class', grade: '2A', subject: 'M' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '5A-M', subject: 'EPYT' },
        { type: 'class', grade: '2B', subject: 'M' },
        { type: 'class', grade: '6A-M/H', subject: 'CDP' },
        { type: 'class', grade: '6A-M/H', subject: 'MFyT' }
      ],
      Ma: [
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2A', subject: 'M' },
        { type: 'class', grade: '2B', subject: 'M' },
        { type: 'planning', label: 'Planificación' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '5A-M', subject: 'EPYT' },
        { type: 'class', grade: '2B', subject: 'M' },
        { type: 'class', grade: '4M', subject: 'MFyT' }
      ],
      Mi: [
        { type: 'class', grade: '2B', subject: 'M' },
        { type: 'class', grade: '1A', subject: 'M' },
        { type: 'class', grade: '2A', subject: 'M' },
        { type: 'class', grade: '2B', subject: 'M' },
        { type: 'class', grade: '5A-M', subject: 'EPYT' },
        { type: 'class', grade: '4M', subject: 'MFyT' },
        { type: 'class', grade: '6A-H/M', subject: 'APT' },
        { type: 'class', grade: '6A-H/M', subject: 'APT' }
      ],
      Ju: [
        { type: 'class', grade: '2A', subject: 'M' },
        { type: 'class', grade: '1A', subject: 'M' },
        { type: 'planning', label: 'Planificación' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2A', subject: 'M' },
        { type: 'class', grade: '4M', subject: 'MFyT' },
        { type: 'class', grade: '6A-M/H', subject: 'CDP' },
        { type: 'class', grade: '5A-M', subject: 'EPYT' }
      ],
      Vi: [
        { type: 'class', grade: '2A', subject: 'M' },
        { type: 'class', grade: '1A', subject: 'M' },
        { type: 'class', grade: '2B', subject: 'M' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2A', subject: 'M' },
        { type: 'class', grade: '2B', subject: 'M' },
        { type: 'class', grade: '6A-H/M', subject: 'MFyT' },
        { type: 'class', grade: '4M', subject: 'MFyT' }
      ]
    }
  },
  {
    id: 'jose_luis_robles',
    name: 'José Luis Robles',
    schedule: {
      Lu: [
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4BH', subject: 'LE-I' },
        { type: 'class', grade: '4AH', subject: 'LE-I' },
        { type: 'class', grade: '4AH', subject: 'LE-F' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-N', subject: 'LE-F' },
        { type: 'class', grade: '4M', subject: 'LE-F' },
        { type: 'class', grade: '3A', subject: 'LE-F' }
      ],
      Ma: [
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '4BH', subject: 'LE-F' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '6A-M/H', subject: 'LE-I' },
        { type: 'class', grade: '6A-M/H', subject: 'LI' },
        { type: 'class', grade: '4M', subject: 'LE-F' },
        { type: 'class', grade: '3B', subject: 'LE-F' },
        { type: 'class', grade: '3A', subject: 'LE-F' }
      ],
      Mi: [
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'planning', label: 'Planificación' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-M', subject: 'LE-F' }
      ],
      Ju: [
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '4BH', subject: 'LE-I' },
        { type: 'class', grade: '5A-N', subject: 'LE-F' },
        { type: 'class', grade: '6A-M/H', subject: 'LE-F' },
        { type: 'class', grade: '5A-M', subject: 'LE-F' },
        { type: 'class', grade: '3C', subject: 'LE-F' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Vi: [
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4AH', subject: 'LE-I' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4BH', subject: 'LE-F' },
        { type: 'class', grade: '3C', subject: 'LE-F' },
        { type: 'class', grade: '6A-M/H', subject: 'LE-F' },
        { type: 'class', grade: '3B', subject: 'LE-F' },
        { type: 'class', grade: '4AH', subject: 'LE-F' }
      ]
    }
  },
  {
    id: 'smarlin_hernandez',
    name: 'Smarlin Hernández',
    schedule: {
      Lu: [
        { type: 'class', grade: '3B', subject: 'LE-I' },
        { type: 'register', label: 'Registro' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2B', subject: 'LE-I' },
        { type: 'class', grade: '3C', subject: 'LE-I' },
        { type: 'class', grade: '2A', subject: 'LE-I' },
        { type: 'class', grade: '3A', subject: 'LE-I' },
        { type: 'class', grade: '2B', subject: 'LE-F' }
      ],
      Ma: [
        { type: 'class', grade: '1A', subject: 'LE-F' },
        { type: 'class', grade: '3B', subject: 'LE-I' },
        { type: 'free', label: 'Libre' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '1A', subject: 'LE-I' },
        { type: 'class', grade: '2B', subject: 'LE-I' },
        { type: 'class', grade: '2A', subject: 'LE-F' },
        { type: 'class', grade: '3C', subject: 'LE-I' }
      ],
      Mi: [
        { type: 'class', grade: '3A', subject: 'LE-I' },
        { type: 'class', grade: '1A', subject: 'LE-I' },
        { type: 'class', grade: '3C', subject: 'LE-I' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '2B', subject: 'LE-F' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2A', subject: 'LE-I' },
        { type: 'free', label: 'Libre' }
      ],
      Ju: [
        { type: 'class', grade: '1A', subject: 'LE-I' },
        { type: 'planning', label: 'Planificación' },
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2B', subject: 'LE-I' },
        { type: 'class', grade: '2A', subject: 'LE-I' },
        { type: 'class', grade: '3A', subject: 'LE-I' }
      ],
      Vi: [
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2B', subject: 'LE-I' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2A', subject: 'LE-F' },
        { type: 'class', grade: '3B', subject: 'LE-I' },
        { type: 'class', grade: '1A', subject: 'LE-F' },
        { type: 'class', grade: '2A', subject: 'LE-I' },
        { type: 'class', grade: '1A', subject: 'LE-I' }
      ]
    }
  },
  {
    id: 'ricardo_frias',
    name: 'Ricardo Frías',
    schedule: {
      Lu: [
        { type: 'class', grade: '1A', subject: 'EA' },
        { type: 'class', grade: '2A', subject: 'EA' },
        { type: 'class', grade: '4M', subject: 'LE-I' },
        { type: 'planning', label: 'Planificación' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: 'TdB', subject: 'TdB' },
        { type: 'class', grade: '5A-N', subject: 'LE-I' },
        { type: 'free', label: 'Libre' }
      ],
      Ma: [
        { type: 'class', grade: '2A', subject: 'EA' },
        { type: 'class', grade: '4M', subject: 'EA' },
        { type: 'class', grade: '1A', subject: 'LE-I' },
        { type: 'class', grade: '5A-N', subject: 'LE-I' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: 'TP', subject: 'TP' },
        { type: 'class', grade: 'TdB', subject: 'TdB' },
        { type: 'class', grade: 'TdB', subject: 'TdB' }
      ],
      Mi: [
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-M', subject: 'LE-I' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '2B', subject: 'EA' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: 'TP', subject: 'TP' },
        { type: 'class', grade: 'TP', subject: 'TP' },
        { type: 'class', grade: 'TP', subject: 'TP' }
      ],
      Ju: [
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '5A-M', subject: 'LE-I' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: 'TP', subject: 'TP' },
        { type: 'class', grade: 'TdB', subject: 'TdB' },
        { type: 'class', grade: 'TP', subject: 'TP' }
      ],
      Vi: [
        { type: 'class', grade: '4M', subject: 'LE-I' },
        { type: 'free', label: 'Libre' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2B', subject: 'EA' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: 'TP', subject: 'TP' },
        { type: 'class', grade: 'TdB', subject: 'TdB' },
        { type: 'class', grade: 'TdB', subject: 'TdB' }
      ]
    }
  },
  {
    id: 'hiranya_acosta',
    name: 'Hiranya Acosta',
    schedule: {
      Lu: [
        { type: 'class', grade: '4BH', subject: 'EA' },
        { type: 'class', grade: '4AH', subject: 'FIHYR' },
        { type: 'class', grade: '4AH', subject: 'EA' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '4M', subject: 'FIHYR' },
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '4M', subject: 'EA' }
      ],
      Ma: [
        { type: 'class', grade: '6A-M/H', subject: 'FIHYR' },
        { type: 'class', grade: '5A-M', subject: 'EA' },
        { type: 'class', grade: '4BH', subject: 'FIHYR' },
        { type: 'class', grade: '4AH', subject: 'FIHYR' },
        { type: 'class', grade: '5A-N', subject: 'FIHYR' },
        { type: 'class', grade: '4M', subject: 'EA' },
        { type: 'class', grade: '5A-M', subject: 'FIHYR' },
        { type: 'free', label: 'Libre' }
      ],
      Mi: [
        { type: 'class', grade: '5A-N', subject: 'FIHYR' },
        { type: 'class', grade: 'TdM', subject: 'TdM' },
        { type: 'free', label: 'Libre' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '4M', subject: 'FIHYR' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3B', subject: 'EA' },
        { type: 'class', grade: '3C', subject: 'EA' }
      ],
      Ju: [
        { type: 'class', grade: '6A-M/H', subject: 'EA' },
        { type: 'planning', label: 'Planificación' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '4BH', subject: 'EA' },
        { type: 'class', grade: '3A', subject: 'EA' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3B', subject: 'EA' },
        { type: 'class', grade: '4AH', subject: 'EA' }
      ],
      Vi: [
        { type: 'class', grade: '4BH', subject: 'FIHYR' },
        { type: 'class', grade: '6A-M/H', subject: 'FIHYR' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-N', subject: 'EA' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '5A-M', subject: 'FIHYR' },
        { type: 'class', grade: '3C', subject: 'EA' },
        { type: 'class', grade: '3A', subject: 'EA' }
      ]
    }
  },
  {
    id: 'luis_bencosme',
    name: 'Luis Bencosme',
    schedule: {
      Lu: Array(8).fill({ type: 'free', label: 'Libre' }),
      Ma: Array(8).fill({ type: 'free', label: 'Libre' }),
      Mi: [
        { type: 'class', grade: '2A', subject: 'FIHYR' },
        { type: 'class', grade: '2B', subject: 'FIHYR' },
        { type: 'class', grade: '3C', subject: 'FIHYR' },
        { type: 'class', grade: '3B', subject: 'FIHYR' },
        { type: 'register', label: 'Registro' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '1A', subject: 'FIHYR' },
        { type: 'class', grade: '3A', subject: 'FIHYR' }
      ],
      Ju: [
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '2B', subject: 'FIHYR' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '3A', subject: 'FIHYR' },
        { type: 'class', grade: '3C', subject: 'FIHYR' },
        { type: 'class', grade: '3B', subject: 'FIHYR' },
        { type: 'class', grade: '1A', subject: 'FIHYR' },
        { type: 'class', grade: '2A', subject: 'FIHYR' }
      ],
      Vi: Array(8).fill({ type: 'free', label: 'Libre' })
    }
  },
  {
    id: 'juan_ramon_lopez',
    name: 'Juan Ramón López',
    schedule: {
      Lu: [
        { type: 'planning', label: 'Planificación' },
        { type: 'planning', label: 'Planificación' },
        { type: 'class', grade: '5A-N', subject: 'EF' },
        { type: 'class', grade: '6A-M/H', subject: 'EF' },
        { type: 'class', grade: '4AH', subject: 'EF' },
        { type: 'class', grade: '3C', subject: 'EF' },
        { type: 'class', grade: 'CdB', subject: 'CdB' },
        { type: 'class', grade: 'CdB', subject: 'CdB' }
      ],
      Ma: [
        { type: 'class', grade: '3B', subject: 'EF' },
        { type: 'class', grade: '2B', subject: 'EF' },
        { type: 'planning', label: 'Planificación' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '2A', subject: 'EF' },
        { type: 'class', grade: '4M', subject: 'EF' },
        { type: 'class', grade: '5A-M', subject: 'EF' },
        { type: 'class', grade: 'CdB', subject: 'CdB' }
      ],
      Mi: [
        { type: 'class', grade: '4AH', subject: 'EF' },
        { type: 'class', grade: '2A', subject: 'EF' },
        { type: 'class', grade: '2B', subject: 'EF' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '1A', subject: 'EF' },
        { type: 'class', grade: '4BH', subject: 'EF' },
        { type: 'class', grade: 'CdV', subject: 'CdV' },
        { type: 'class', grade: 'CdB', subject: 'CdB' }
      ],
      Ju: [
        { type: 'class', grade: '5A-N', subject: 'EF' },
        { type: 'class', grade: '3A', subject: 'EF' },
        { type: 'class', grade: '6A-M/H', subject: 'EF' },
        { type: 'class', grade: '4M', subject: 'EF' },
        { type: 'register', label: 'Registro' },
        { type: 'class', grade: '3A', subject: 'EF' },
        { type: 'class', grade: 'CdV', subject: 'CdV' },
        { type: 'class', grade: 'CdB', subject: 'CdB' }
      ],
      Vi: [
        { type: 'class', grade: '3C', subject: 'EF' },
        { type: 'class', grade: '4BH', subject: 'EF' },
        { type: 'class', grade: '5A-M', subject: 'EF' },
        { type: 'class', grade: '3A', subject: 'EF' },
        { type: 'class', grade: '1A', subject: 'EF' },
        { type: 'class', grade: '3B', subject: 'EF' },
        { type: 'class', grade: 'CdB', subject: 'CdB' },
        { type: 'class', grade: 'CdV', subject: 'CdV' }
      ]
    }
  },
  {
    id: 'francina_minaya',
    name: 'Francina Minaya',
    schedule: {
      Lu: [
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '3B', subject: 'OyP' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Ma: Array(8).fill({ type: 'free', label: 'Libre' }),
      Mi: [
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '3C', subject: 'OyP' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Ju: Array(8).fill({ type: 'free', label: 'Libre' }),
      Vi: [
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '3C', subject: 'OyP' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ]
    }
  },
  {
    id: 'nathaly_stevez',
    name: 'Nathaly Estévez',
    schedule: {
      Lu: [
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '3A', subject: 'OyP' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Ma: Array(8).fill({ type: 'free', label: 'Libre' }),
      Mi: Array(8).fill({ type: 'free', label: 'Libre' }),
      Ju: [
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '2B', subject: 'OyP' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ],
      Vi: [
        { type: 'free', label: 'Libre' },
        { type: 'class', grade: '2A', subject: 'OyP' },
        { type: 'class', grade: '1A', subject: 'OyP' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' },
        { type: 'free', label: 'Libre' }
      ]
    }
  }
];
