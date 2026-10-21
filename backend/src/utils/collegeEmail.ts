export interface CollegeEmailInfo {
  isValid: boolean;
  rawEmail: string;
  name?: string;
  degree?: string; // 'UG'
  batchCode?: string; // '23' | '24' | '25' | '26'
  year?: number; // 1 | 2 | 3 | 4
  yearLabel?: string; // '3rd Year'
  departmentCode?: string;
  departmentName?: string;
  batch?: string; // '2024-2028'
  error?: string;
}

export const ALL_COLLEGE_DEPARTMENTS: string[] = [
  'Artificial Intelligence and Data Science',
  'Biomedical Engineering',
  'Biotechnology',
  'Civil Engineering',
  'Computer Science and Business Systems',
  'Computer Science and Engineering',
  'Electrical and Electronics Engineering',
  'Electronics and Communication Engineering',
  'Information Technology',
  'Mechanical Engineering'
];

export const DEPARTMENT_MAP: Record<string, string> = {
  // Information Technology
  it: 'Information Technology',

  // Computer Science & Engineering
  cs: 'Computer Science and Engineering',
  cse: 'Computer Science and Engineering',

  // Artificial Intelligence and Data Science
  ad: 'Artificial Intelligence and Data Science',
  aids: 'Artificial Intelligence and Data Science',
  ai: 'Artificial Intelligence and Data Science',

  // Computer Science and Business Systems
  cb: 'Computer Science and Business Systems',
  csbs: 'Computer Science and Business Systems',

  // Mechanical Engineering
  me: 'Mechanical Engineering',
  mech: 'Mechanical Engineering',

  // Civil Engineering
  cv: 'Civil Engineering',
  civil: 'Civil Engineering',
  ce: 'Civil Engineering',

  // Electronics and Communication Engineering
  ec: 'Electronics and Communication Engineering',
  ece: 'Electronics and Communication Engineering',

  // Electrical and Electronics Engineering
  ee: 'Electrical and Electronics Engineering',
  eee: 'Electrical and Electronics Engineering',

  // Biotechnology
  bt: 'Biotechnology',
  biotech: 'Biotechnology',

  // Biomedical Engineering
  bme: 'Biomedical Engineering'
};

export const YEAR_MAP: Record<string, { year: number; label: string; batch: string }> = {
  '26': { year: 1, label: '1st Year', batch: '2026-2030' },
  '25': { year: 2, label: '2nd Year', batch: '2025-2029' },
  '24': { year: 3, label: '3rd Year', batch: '2024-2028' },
  '23': { year: 4, label: '4th Year', batch: '2023-2027' }
};

/**
 * Validates and extracts student details from Francis Xavier institutional college email.
 * Pattern: <name>.ug.<year>.<dept>@francisxavier.ac.in
 * Example: sangaras.ug.24.it@francisxavier.ac.in
 *
 * All Supported Departments:
 * - it: Information Technology
 * - cs / cse: Computer Science and Engineering
 * - ad / aids: Artificial Intelligence and Data Science
 * - cb / csbs: Computer Science and Business Systems
 * - me / mech: Mechanical Engineering
 * - cv / civil: Civil Engineering
 * - ec / ece: Electronics and Communication Engineering
 * - ee / eee: Electrical and Electronics Engineering
 * - bt / biotech: Biotechnology
 * - bme: Biomedical Engineering
 */
export function parseCollegeEmail(email: string): CollegeEmailInfo {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      rawEmail: '',
      error: 'College email is required.'
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Pattern: <name>.ug.<batch_year>.<dept>@francisxavier.ac.in
  const regex = /^([a-z0-9._-]+)\.ug\.(2[3-6])\.([a-z0-9]{2,7})@francisxavier\.ac\.in$/i;
  const match = cleanEmail.match(regex);

  if (!match) {
    return {
      isValid: false,
      rawEmail: cleanEmail,
      error:
        "Email does not match institutional student pattern '<name>.ug.<year>.<dept>@francisxavier.ac.in'. " +
        "Valid batch years: 26 (1st Yr), 25 (2nd Yr), 24 (3rd Yr), 23 (4th Yr). " +
        "Valid departments: it (IT), cs/cse, ad/aids, cb/csbs, me/mech, cv/civil, ec/ece, ee/eee, bt, bme. " +
        "Example: sangaras.ug.24.it@francisxavier.ac.in"
    };
  }

  const [, namePart, batchCode, deptCode] = match;
  const normalizedDept = deptCode.toLowerCase();
  const departmentName = DEPARTMENT_MAP[normalizedDept];

  if (!departmentName) {
    return {
      isValid: false,
      rawEmail: cleanEmail,
      error:
        `Unrecognized department code '${deptCode}'. Supported department codes: ` +
        `it (IT), cs/cse, ad/aids, cb/csbs, me/mech, cv/civil, ec/ece, ee/eee, bt, bme.`
    };
  }

  const yearInfo = YEAR_MAP[batchCode] || { year: 1, label: '1st Year', batch: '2026-2030' };

  return {
    isValid: true,
    rawEmail: cleanEmail,
    name: namePart,
    degree: 'UG',
    batchCode,
    year: yearInfo.year,
    yearLabel: yearInfo.label,
    departmentCode: normalizedDept,
    departmentName,
    batch: yearInfo.batch
  };
}
