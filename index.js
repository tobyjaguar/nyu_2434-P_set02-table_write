const fs = require('fs');
//const randPerm = require('random-permutation');
const Chance = require('chance');

let chance = new Chance();

const stream = fs.createWriteStream('./non-normal-student.csv', {falgs:'a'});

function genStudent(maxStudents, maxCourses, saveSize) {
  let content = '';
  let id = 0;
  let name = '';
  let major = '';
  let department = '';
  let advisor = '';
  let gpa = 0;
  let courseId = 0;
  let courseName = '';
  let grade = 0;

  let majors = ['mscs', 'msis'];
  let departments = ['science'];
  let advisors = ['mcphearson', 'george'];
  let courseIds = [101,102,103,201,202,203,301,302,303]
  let courseNames = [
    'cs-intro',
    'math-intro',
    'it-intro',
    'cs-intrm',
    'math-intrm',
    'it-intrm',
    'cs-adv',
    'math-adv',
    'it-adv'
  ]
  let courseSelect = 0;

  for (let i = 1; i <= maxStudents; i++) {
    id = i;
    name = chance.first();
    major = chance.pickone(majors);
    department = chance.pickone(departments);
    advisor = major==='mscs' ? 'mcphearson' : 'george';

    for (let j = 0; j < maxCourses; j++) {
      //let stock = symbols[chance.integer({min:0, max: symbols.length - 1})];
      let courseIdx = chance.integer({min: 0, max: (courseIds.length - 1)});
      courseId = courseIds[courseIdx];
      courseName = courseNames[courseIdx];
      grade = chance.floating({min:2, max:4, fixed:2})
      // prepare the record
      content = content.concat(
        '',
        `${id},${name},${major},${department},${advisor},${gpa},${courseId},${courseName},${grade}\n`
      );

      // write content string and reset it
      if (i % saveSize === 0) {
        stream.write(content);
        content = '';
      }
    } // end record

  } // end student
} // end gen

genStudent(100, 6, 20);
stream.end();

console.log('task complete.');
