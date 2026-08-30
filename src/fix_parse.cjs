// Safe comprehensive fix for all JSON.parse in useState initializers
// This script wraps every unsafe JSON.parse with try-catch
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// This replaces the ENTIRE users useState block cleanly
const usersOld = `  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('s_users');
    let list = saved ? JSON.parse(saved) : DEFAULT_USERS;`;

const usersNew = `  const [users, setUsers] = useState(() => {
    try {
    const saved = localStorage.getItem('s_users');
    let list = saved ? JSON.parse(saved) : DEFAULT_USERS;
    if (!Array.isArray(list)) list = DEFAULT_USERS;`;

if (code.includes(usersOld)) {
  code = code.replace(usersOld, usersNew);
  console.log('Fixed: users useState (start)');
} else {
  console.log('WARNING: users useState (start) not found');
}

// Close the users try block
const usersClose = `    localStorage.setItem('s_users', JSON.stringify(list));
    return list;
  });`;
const usersCloseNew = `    localStorage.setItem('s_users', JSON.stringify(list));
    return list;
    } catch (e) { localStorage.removeItem('s_users'); return DEFAULT_USERS; }
  });`;

if (code.includes(usersClose)) {
  code = code.replace(usersClose, usersCloseNew);
  console.log('Fixed: users useState (end)');
} else {
  console.log('WARNING: users useState (end) not found');
}

// Fix currentUser
const cuOld = `  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('s_current_user');
    return saved ? JSON.parse(saved) : null;
  });`;
const cuNew = `  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('s_current_user');
      if (!saved) return null;
      const p = JSON.parse(saved);
      if (!p || typeof p !== 'object') return null;
      return p;
    } catch (e) { localStorage.removeItem('s_current_user'); return null; }
  });`;

if (code.includes(cuOld)) {
  code = code.replace(cuOld, cuNew);
  console.log('Fixed: currentUser useState');
} else {
  console.log('WARNING: currentUser useState not found');
}

// Fix students
const stOld = `  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('s_students');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
    return parsed.map(s => ({
      ...s,
      grades: normalizeStudentGrades(s.grades)
    }));
  });`;
const stNew = `  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('s_students');
      const parsed = saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
      return (Array.isArray(parsed) ? parsed : DEFAULT_STUDENTS).map(s => ({
        ...s,
        grades: normalizeStudentGrades(s.grades)
      }));
    } catch (e) { localStorage.removeItem('s_students'); return DEFAULT_STUDENTS.map(s => ({ ...s, grades: normalizeStudentGrades(s.grades) })); }
  });`;

if (code.includes(stOld)) {
  code = code.replace(stOld, stNew);
  console.log('Fixed: students useState');
} else {
  console.log('WARNING: students useState not found');
}

// Fix all remaining simple 2-line patterns NOT already in try blocks
// Pattern: "    const saved = localStorage.getItem('KEY');\r\n    return saved ? JSON.parse(saved) : DEFAULT;\r\n  });"
// We need to check the 2 preceding lines for 'try {'
const lines = code.split('\n');
const result = [];
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
  
  // Check: is this a "const saved = localStorage.getItem" line?
  if (/^    const saved = localStorage\.getItem\('/.test(line)) {
    // Is the next line a simple "return saved ? JSON.parse(saved) : DEFAULT;"?
    if (/^    return saved \? JSON\.parse\(saved\) :/.test(nextLine)) {
      // Check if the line BEFORE has try { already
      const prevLine = i > 0 ? lines[i - 1] : '';
      const prev2Line = i > 1 ? lines[i - 2] : '';
      if (!prevLine.includes('try {') && !prev2Line.includes('try {') && !prevLine.includes('try{')) {
        const keyMatch = line.match(/localStorage\.getItem\('([^']+)'\)/);
        const key = keyMatch ? keyMatch[1] : 'unknown';
        const defaultMatch = nextLine.match(/JSON\.parse\(saved\) : (.+);/);
        const def = defaultMatch ? defaultMatch[1] : '{}';
        
        result.push('    try {');
        result.push(line);
        result.push(nextLine);
        result.push(`    } catch (e) { localStorage.removeItem('${key}'); return ${def}; }`);
        i += 2;
        continue;
      }
    }
  }
  
  result.push(line);
  i++;
}
const newCode = result.join('\n');

// Compare lengths
const countOld = (code.match(/JSON\.parse\(/g) || []).length;
const countNew = (newCode.match(/JSON\.parse\(/g) || []).length;
const tryCatches = (newCode.match(/try \{/g) || []).length;
console.log('JSON.parse count before additional fix:', countOld, '-> after:', countNew);
console.log('Total try-catch blocks:', tryCatches);

fs.writeFileSync('src/App.jsx', newCode, 'utf8');
console.log('Done. Saved.');
