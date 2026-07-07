import bcrypt from 'bcrypt';

const staffAccounts = [
  { email: 'sumc@strathmore.edu', password: 'sumc123', role: 'sumc_counsellor', name: 'SUMC Counsellor' },
  { email: 'peer@strathmore.edu', password: 'peer123', role: 'peer_counsellor', name: 'Peer Counsellor' },
  { email: 'dean@strathmore.edu', password: 'dean123', role: 'dean', name: 'Dr. Dean' }
];

const saltRounds = 10;

async function generateHashes() {
  console.log('SET FOREIGN_KEY_CHECKS = 0;\n');
  console.log('DELETE FROM staff_accounts;\n');
  
  for (const staff of staffAccounts) {
    const hash = await bcrypt.hash(staff.password, saltRounds);
    const assignedGroup = staff.role === 'sumc_counsellor' ? 'SUMC'
                         : staff.role === 'peer_counsellor' ? 'Peer Support'
                         : 'Dean of Students';
    const department = staff.role === 'sumc_counsellor' ? 'Student Wellness'
                      : 'Student Affairs';
    
    console.log(`INSERT INTO staff_accounts (email, password_hash, name, role, assigned_group, department, is_active) VALUES (`);
    console.log(`  '${staff.email}',`);
    console.log(`  '${hash}',`);
    console.log(`  '${staff.name}',`);
    console.log(`  '${staff.role}',`);
    console.log(`  '${assignedGroup}',`);
    console.log(`  '${department}',`);
    console.log(`  1`);
    console.log(`);\n`);
  }
  
  console.log('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('\n-- Test Credentials:');
  staffAccounts.forEach(s => {
    console.log(`${s.email} / ${s.password}`);
  });
}

generateHashes();